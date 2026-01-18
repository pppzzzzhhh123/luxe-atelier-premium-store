import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/wallet
 * 获取钱包余额和交易记录
 */
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // 获取用户余额
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    // 获取交易记录
    const { data: transactions, error, count } = await supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('获取交易记录失败:', error);
      return res.status(500).json({ message: '获取交易记录失败' });
    }

    res.json({
      balance: user?.balance || 0,
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error('获取钱包信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/wallet/recharge
 * 充值（测试环境）
 */
router.post('/recharge', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: '充值金额必须大于0' });
    }

    // 获取当前余额
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    const newBalance = parseFloat(user?.balance || '0') + parseFloat(amount);

    // 更新余额
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('充值失败:', updateError);
      return res.status(500).json({ message: '充值失败' });
    }

    // 创建交易记录
    await supabase.from('wallet_transactions').insert({
      user_id: userId,
      type: 'recharge',
      amount: parseFloat(amount),
      balance_after: newBalance,
      description: '余额充值',
      status: 'completed',
    });

    res.json({
      message: '充值成功',
      balance: newBalance,
    });
  } catch (error) {
    console.error('充值错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/wallet/withdraw
 * 提现
 */
router.post('/withdraw', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { amount, bankCardId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: '提现金额必须大于0' });
    }

    // 获取当前余额
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    const currentBalance = parseFloat(user?.balance || '0');

    if (currentBalance < amount) {
      return res.status(400).json({ message: '余额不足' });
    }

    const newBalance = currentBalance - parseFloat(amount);

    // 更新余额
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('提现失败:', updateError);
      return res.status(500).json({ message: '提现失败' });
    }

    // 创建交易记录
    await supabase.from('wallet_transactions').insert({
      user_id: userId,
      type: 'withdraw',
      amount: -parseFloat(amount),
      balance_after: newBalance,
      description: '余额提现',
      status: 'pending', // 提现需要审核
    });

    res.json({
      message: '提现申请已提交',
      balance: newBalance,
    });
  } catch (error) {
    console.error('提现错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
