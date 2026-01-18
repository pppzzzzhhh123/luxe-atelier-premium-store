import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

/**
 * 生成随机邀请码
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * 生成 JWT Token
 */
function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

/**
 * POST /api/auth/register
 * 用户注册
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone, password, name, inviteCode } = req.body;

    // 验证必填字段
    if (!phone || !password) {
      return res.status(400).json({ message: '手机号和密码不能为空' });
    }

    // 检查手机号是否已注册
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: '该手机号已注册' });
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 生成唯一邀请码
    let userInviteCode = generateInviteCode();
    let codeExists = true;
    while (codeExists) {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('invite_code', userInviteCode)
        .single();
      if (!data) codeExists = false;
      else userInviteCode = generateInviteCode();
    }

    // 验证邀请码（如果提供）
    let inviterId = null;
    if (inviteCode) {
      const { data: inviter } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (inviter) {
        inviterId = inviter.id;
      }
    }

    // 创建用户
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        phone,
        password_hash: passwordHash,
        name: name || '用户',
        invite_code: userInviteCode,
        invited_by: inviterId,
      })
      .select()
      .single();

    if (userError) {
      console.error('创建用户失败:', userError);
      return res.status(500).json({ message: '注册失败，请稍后重试' });
    }

    // 如果有邀请人，创建邀请记录
    if (inviterId) {
      await supabaseAdmin.from('invite_records').insert({
        inviter_id: inviterId,
        invitee_id: newUser.id,
        invite_code: inviteCode.toUpperCase(),
      });

      // 发放注册优惠券（2张 ¥10 优惠券，满 ¥200 可用）
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30天有效期

      await supabaseAdmin.from('user_coupons').insert([
        {
          user_id: newUser.id,
          title: '新人专享券',
          amount: 10,
          min_amount: 200,
          status: 'unused',
          source: 'invite_register',
          expires_at: expiresAt.toISOString(),
        },
        {
          user_id: newUser.id,
          title: '新人专享券',
          amount: 10,
          min_amount: 200,
          status: 'unused',
          source: 'invite_register',
          expires_at: expiresAt.toISOString(),
        },
      ]);
    }

    // 生成 Token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        name: newUser.name,
        avatar: newUser.avatar,
        inviteCode: newUser.invite_code,
        points: newUser.points,
        balance: newUser.balance,
      },
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    // 验证必填字段
    if (!phone || !password) {
      return res.status(400).json({ message: '手机号和密码不能为空' });
    }

    // 查找用户
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: '手机号或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: '手机号或密码错误' });
    }

    // 更新最后登录时间
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // 生成 Token
    const token = generateToken(user.id);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        inviteCode: user.invite_code,
        points: user.points,
        balance: user.balance,
        isMember: user.is_member,
        memberExpiresAt: user.member_expires_at,
      },
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/auth/send-code
 * 发送验证码（测试环境返回固定验证码）
 */
router.post('/send-code', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: '手机号不能为空' });
    }

    // 测试环境返回固定验证码
    if (process.env.NODE_ENV !== 'production') {
      return res.json({
        message: '验证码已发送',
        code: '123456', // 测试环境返回固定验证码
      });
    }

    // 生产环境：调用短信服务发送验证码
    // TODO: 集成阿里云/腾讯云短信服务
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    res.json({
      message: '验证码已发送',
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/auth/validate-invite
 * 验证邀请码是否有效
 */
router.post('/validate-invite', async (req: Request, res: Response) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: '邀请码不能为空' });
    }

    const { data: inviter } = await supabaseAdmin
      .from('users')
      .select('id, name, phone')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (!inviter) {
      return res.status(404).json({ message: '邀请码无效' });
    }

    res.json({
      valid: true,
      inviter: {
        name: inviter.name,
        phone: inviter.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      },
    });
  } catch (error) {
    console.error('验证邀请码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
