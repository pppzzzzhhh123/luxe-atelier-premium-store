import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/addresses
 * 获取收货地址列表
 */
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取地址列表失败:', error);
      return res.status(500).json({ message: '获取地址列表失败' });
    }

    res.json({ addresses });
  } catch (error) {
    console.error('获取地址列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * GET /api/addresses/:id
 * 获取地址详情
 */
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const { data: address, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !address) {
      return res.status(404).json({ message: '地址不存在' });
    }

    res.json({ address });
  } catch (error) {
    console.error('获取地址详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/addresses
 * 添加收货地址
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const {
      name,
      phone,
      province,
      city,
      district,
      detail,
      tag,
      isDefault = false,
    } = req.body;

    // 验证必填字段
    if (!name || !phone || !province || !city || !detail) {
      return res.status(400).json({ message: '请填写完整的地址信息' });
    }

    // 如果设置为默认地址，取消其他默认地址
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        name,
        phone,
        province,
        city,
        district,
        detail,
        tag,
        is_default: isDefault,
      })
      .select()
      .single();

    if (error) {
      console.error('添加地址失败:', error);
      return res.status(500).json({ message: '添加地址失败' });
    }

    res.status(201).json({
      message: '地址添加成功',
      address,
    });
  } catch (error) {
    console.error('添加地址错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * PUT /api/addresses/:id
 * 更新收货地址
 */
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updateData = req.body;

    // 检查地址是否存在
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existingAddress) {
      return res.status(404).json({ message: '地址不存在' });
    }

    // 如果设置为默认地址，取消其他默认地址
    if (updateData.isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .neq('id', id);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .update({
        name: updateData.name,
        phone: updateData.phone,
        province: updateData.province,
        city: updateData.city,
        district: updateData.district,
        detail: updateData.detail,
        tag: updateData.tag,
        is_default: updateData.isDefault,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新地址失败:', error);
      return res.status(500).json({ message: '更新地址失败' });
    }

    res.json({
      message: '地址更新成功',
      address,
    });
  } catch (error) {
    console.error('更新地址错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * DELETE /api/addresses/:id
 * 删除收货地址
 */
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('删除地址失败:', error);
      return res.status(500).json({ message: '删除地址失败' });
    }

    res.json({ message: '地址删除成功' });
  } catch (error) {
    console.error('删除地址错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/addresses/:id/default
 * 设置默认地址
 */
router.post('/:id/default', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // 取消其他默认地址
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    // 设置当前地址为默认
    const { data: address, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('设置默认地址失败:', error);
      return res.status(500).json({ message: '设置默认地址失败' });
    }

    res.json({
      message: '默认地址设置成功',
      address,
    });
  } catch (error) {
    console.error('设置默认地址错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
