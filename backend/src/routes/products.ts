import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/products
 * 获取商品列表（支持分页、筛选、搜索）
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      isHot,
      isNew,
      minPrice,
      maxPrice,
      search,
      sort = 'created_at',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // 构建查询
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // 分类筛选
    if (category) {
      query = query.eq('category_id', category);
    }

    // 热门商品
    if (isHot === 'true') {
      query = query.eq('is_hot', true);
    }

    // 新品
    if (isNew === 'true') {
      query = query.eq('is_new', true);
    }

    // 价格范围
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice as string));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice as string));
    }

    // 搜索
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 排序
    query = query.order(sort as string, { ascending: order === 'asc' });

    // 分页
    query = query.range(offset, offset + limitNum - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('获取商品列表失败:', error);
      return res.status(500).json({ message: '获取商品列表失败' });
    }

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error('获取商品列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * GET /api/products/:id
 * 获取商品详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({ message: '商品不存在' });
    }

    // 获取商品评价统计
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', id);

    let avgRating = 0;
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = sum / reviews.length;
    }

    res.json({
      ...product,
      avgRating: avgRating.toFixed(1),
      reviewCount: reviews?.length || 0,
    });
  } catch (error) {
    console.error('获取商品详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/products
 * 创建商品（管理员）
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      categoryId,
      images,
      specs,
      stock,
      isHot,
      isNew,
      tags,
    } = req.body;

    // 验证必填字段
    if (!title || !price || !categoryId) {
      return res.status(400).json({ message: '商品标题、价格和分类不能为空' });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        title,
        description,
        price,
        original_price: originalPrice,
        category_id: categoryId,
        images: images || [],
        specs: specs || {},
        stock: stock || 0,
        is_hot: isHot || false,
        is_new: isNew || false,
        tags: tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error('创建商品失败:', error);
      return res.status(500).json({ message: '创建商品失败' });
    }

    res.status(201).json({
      message: '商品创建成功',
      product,
    });
  } catch (error) {
    console.error('创建商品错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * PUT /api/products/:id
 * 更新商品（管理员）
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新商品失败:', error);
      return res.status(500).json({ message: '更新商品失败' });
    }

    res.json({
      message: '商品更新成功',
      product,
    });
  } catch (error) {
    console.error('更新商品错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * DELETE /api/products/:id
 * 删除商品（软删除，管理员）
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('删除商品失败:', error);
      return res.status(500).json({ message: '删除商品失败' });
    }

    res.json({ message: '商品删除成功' });
  } catch (error) {
    console.error('删除商品错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
