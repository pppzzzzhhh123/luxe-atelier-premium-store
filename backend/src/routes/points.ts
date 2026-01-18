import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/points
 * 获取积分余额和记录
 */
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // 获取用户积分余额
    const { data: user } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    // 获取积分记录
    const { data: records, error, count } = await supabase
      .from('points_records')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('获取积分记录失败:', error);
      return res.status(500).json({ message: '获取积分记录失败' });
    }

    res.json({
      points: user?.points || 0,
      records,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error('获取积分错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/points/checkin
 * 每日签到
 */
router.post('/checkin', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    // 检查今天是否已签到
    const { data: todayCheckin } = await supabase
      .from('checkin_records')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .single();

    if (todayCheckin) {
      return res.status(400).json({ message: '今天已经签到过了' });
    }

    // 获取昨天的签到记录
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    const { data: yesterdayCheckin } = await supabase
      .from('checkin_records')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', yesterdayDate)
      .single();

    // 计算连续签到天数和积分
    let continuousDays = 1;
    if (yesterdayCheckin) {
      continuousDays = yesterdayCheckin.continuous_days + 1;
    }

    // 积分规则：基础10分，连续签到每天+2分，最多+20分
    const basePoints = 10;
    const bonusPoints = Math.min((continuousDays - 1) * 2, 20);
    const totalPoints = basePoints + bonusPoints;

    // 创建签到记录
    const { data: checkinRecord, error: checkinError } = await supabase
      .from('checkin_records')
      .insert({
        user_id: userId,
        points: totalPoints,
        continuous_days: continuousDays,
        checkin_date: today,
      })
      .select()
      .single();

    if (checkinError) {
      console.error('签到失败:', checkinError);
      return res.status(500).json({ message: '签到失败' });
    }

    // 更新用户积分
    const { data: currentUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    
    await supabase
      .from('users')
      .update({
        points: (currentUser?.points || 0) + totalPoints,
      })
      .eq('id', userId);

    // 创建积分记录
    await supabase.from('points_records').insert({
      user_id: userId,
      type: 'checkin',
      points: totalPoints,
      description: `签到获得积分（连续${continuousDays}天）`,
      related_id: checkinRecord.id,
    });

    res.json({
      message: '签到成功',
      points: totalPoints,
      continuousDays,
    });
  } catch (error) {
    console.error('签到错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * GET /api/points/checkin/status
 * 获取签到状态
 */
router.get('/checkin/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    // 检查今天是否已签到
    const { data: todayCheckin } = await supabase
      .from('checkin_records')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .single();

    // 获取最近的签到记录
    const { data: latestCheckin } = await supabase
      .from('checkin_records')
      .select('*')
      .eq('user_id', userId)
      .order('checkin_date', { ascending: false })
      .limit(1)
      .single();

    res.json({
      hasCheckedIn: !!todayCheckin,
      continuousDays: latestCheckin?.continuous_days || 0,
      lastCheckinDate: latestCheckin?.checkin_date || null,
    });
  } catch (error) {
    console.error('获取签到状态错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
