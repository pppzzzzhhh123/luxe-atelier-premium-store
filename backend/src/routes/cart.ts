import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/cart
 * 获取购物车列表
 */
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取购物车失败:', error);
      return res.status(500).json({ message: '获取购物车失败' });
    }

    res.json({ cartItems });
  } catch (error) {
    console.error('获取购物车错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/cart
 * 添加商品到购物车
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { productId, spec, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: '商品ID不能为空' });
    }

    // 检查商品是否存在
    const { data: product } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }

    // 检查库存
    if (product.stock < quantity) {
      return res.status(400).json({ message: '库存不足' });
    }

    // 检查是否已在购物车
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('spec', spec || '')
      .single();

    if (existingItem) {
      // 更新数量
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: '库存不足' });
      }

      const { data: updatedItem, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        console.error('更新购物车失败:', error);
        return res.status(500).json({ message: '更新购物车失败' });
      }

      return res.json({
        message: '购物车更新成功',
        cartItem: updatedItem,
      });
    }

    // 添加新商品
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        spec: spec || null,
        quantity,
      })
      .select()
      .single();

    if (error) {
      console.error('添加购物车失败:', error);
      return res.status(500).json({ message: '添加购物车失败' });
    }

    res.status(201).json({
      message: '添加购物车成功',
      cartItem,
    });
  } catch (error) {
    console.error('添加购物车错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * PUT /api/cart/:id
 * 更新购物车商品数量
 */
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: '数量必须大于0' });
    }

    // 检查购物车项是否存在
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('*, product:products(stock)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!cartItem) {
      return res.status(404).json({ message: '购物车项不存在' });
    }

    // 检查库存
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ message: '库存不足' });
    }

    // 更新数量
    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新购物车失败:', error);
      return res.status(500).json({ message: '更新购物车失败' });
    }

    res.json({
      message: '购物车更新成功',
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error('更新购物车错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * DELETE /api/cart/:id
 * 删除购物车商品
 */
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('删除购物车失败:', error);
      return res.status(500).json({ message: '删除购物车失败' });
    }

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除购物车错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * DELETE /api/cart
 * 清空购物车
 */
router.delete('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('清空购物车失败:', error);
      return res.status(500).json({ message: '清空购物车失败' });
    }

    res.json({ message: '购物车已清空' });
  } catch (error) {
    console.error('清空购物车错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
