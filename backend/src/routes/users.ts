import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/users/me
 * 获取当前用户信息
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 不返回密码
    const { password_hash, ...userInfo } = user;

    res.json({ 
      success: true,
      data: userInfo 
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * PUT /api/users/me
 * 更新当前用户信息
 */
router.put('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { nickname, name, avatar, email, gender, birthday, height, weight, size } = req.body;

    const updateData: any = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (email !== undefined) updateData.email = email;
    if (gender !== undefined) updateData.gender = gender;
    if (birthday !== undefined) updateData.birthday = birthday;
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (size !== undefined) updateData.size = size;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('更新用户信息失败:', error);
      return res.status(500).json({ message: '更新用户信息失败' });
    }

    const { password_hash, ...userInfo } = user;

    res.json({
      success: true,
      message: '更新成功',
      data: userInfo,
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * GET /api/users/profile
 * 获取用户个人信息（兼容旧接口）
 */
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 不返回密码
    const { password_hash, ...userInfo } = user;

    res.json({ user: userInfo });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * PUT /api/users/profile
 * 更新用户个人信息（兼容旧接口）
 */
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, avatar, email, gender, birthday } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (email) updateData.email = email;
    if (gender) updateData.gender = gender;
    if (birthday) updateData.birthday = birthday;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('更新用户信息失败:', error);
      return res.status(500).json({ message: '更新用户信息失败' });
    }

    const { password_hash, ...userInfo } = user;

    res.json({
      message: '更新成功',
      user: userInfo,
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * GET /api/users/stats
 * 获取用户统计数据
 */
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // 订单统计
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', '待付款');

    const { count: shippingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['待发货', '待收货']);

    // 优惠券统计
    const { count: availableCoupons } = await supabase
      .from('user_coupons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'unused')
      .gte('expires_at', new Date().toISOString());

    // 收藏统计（如果有收藏功能）
    // const { count: favorites } = await supabase
    //   .from('favorites')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('user_id', userId);

    res.json({
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      shippingOrders: shippingOrders || 0,
      availableCoupons: availableCoupons || 0,
    });
  } catch (error) {
    console.error('获取用户统计错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
