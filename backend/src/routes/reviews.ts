import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/reviews/product/:productId
 * 获取商品评价列表
 */
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = '1', limit = '20', rating } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:users(id, name, avatar)
      `, { count: 'exact' })
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (rating) {
      query = query.eq('rating', parseInt(rating as string));
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('获取评价列表失败:', error);
      return res.status(500).json({ message: '获取评价列表失败' });
    }

    res.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error('获取评价列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/reviews
 * 发布商品评价
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { orderId, productId, rating, content, images, isAnonymous } = req.body;

    // 验证必填字段
    if (!orderId || !productId || !rating) {
      return res.status(400).json({ message: '订单ID、商品ID和评分不能为空' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: '评分必须在1-5之间' });
    }

    // 检查订单是否存在且已完成
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    if (order.status !== '已完成') {
      return res.status(400).json({ message: '只能评价已完成的订单' });
    }

    // 检查是否已评价
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('order_id', orderId)
      .eq('product_id', productId)
      .single();

    if (existingReview) {
      return res.status(400).json({ message: '该商品已评价' });
    }

    // 创建评价
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        order_id: orderId,
        user_id: userId,
        product_id: productId,
        rating,
        content,
        images: images || [],
        is_anonymous: isAnonymous || false,
      })
      .select()
      .single();

    if (error) {
      console.error('发布评价失败:', error);
      return res.status(500).json({ message: '发布评价失败' });
    }

    // 评价后赠送积分
    const bonusPoints = 10;
    
    const { data: currentUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    
    await supabase
      .from('users')
      .update({
        points: (currentUser?.points || 0) + bonusPoints,
      })
      .eq('id', userId);

    await supabase.from('points_records').insert({
      user_id: userId,
      type: 'review',
      points: bonusPoints,
      description: '评价商品获得积分',
      related_id: review.id,
    });

    res.status(201).json({
      message: '评价成功',
      review,
      bonusPoints,
    });
  } catch (error) {
    console.error('发布评价错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * GET /api/reviews/my
 * 获取我的评价列表
 */
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const { data: reviews, error, count } = await supabase
      .from('reviews')
      .select(`
        *,
        product:products(id, title, images)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('获取我的评价失败:', error);
      return res.status(500).json({ message: '获取我的评价失败' });
    }

    res.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error('获取我的评价错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
