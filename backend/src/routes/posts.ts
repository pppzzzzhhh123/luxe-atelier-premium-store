import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/posts
 * 获取社区帖子列表
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', featured } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('posts')
      .select(`
        *,
        user:users(id, name, avatar)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('获取帖子列表失败:', error);
      return res.status(500).json({ message: '获取帖子列表失败' });
    }

    res.json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error('获取帖子列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * GET /api/posts/:id
 * 获取帖子详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(id, name, avatar),
        comments:post_comments(
          *,
          user:users(id, name, avatar)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    res.json({ post });
  } catch (error) {
    console.error('获取帖子详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/posts
 * 发布帖子
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { content, images } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: '内容不能为空' });
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        images: images || [],
      })
      .select()
      .single();

    if (error) {
      console.error('发布帖子失败:', error);
      return res.status(500).json({ message: '发布帖子失败' });
    }

    res.status(201).json({
      message: '发布成功',
      post,
    });
  } catch (error) {
    console.error('发布帖子错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/posts/:id/like
 * 点赞帖子
 */
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: post } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', id)
      .single();

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    const { error } = await supabase
      .from('posts')
      .update({ likes_count: post.likes_count + 1 })
      .eq('id', id);

    if (error) {
      console.error('点赞失败:', error);
      return res.status(500).json({ message: '点赞失败' });
    }

    res.json({ message: '点赞成功' });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * POST /api/posts/:id/comment
 * 评论帖子
 */
router.post('/:id/comment', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { content, parentId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    const { data: comment, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: id,
        user_id: userId,
        content,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('评论失败:', error);
      return res.status(500).json({ message: '评论失败' });
    }

    // 更新帖子评论数
    const { data: post } = await supabase
      .from('posts')
      .select('comments_count')
      .eq('id', id)
      .single();

    await supabase
      .from('posts')
      .update({ comments_count: (post?.comments_count || 0) + 1 })
      .eq('id', id);

    res.status(201).json({
      message: '评论成功',
      comment,
    });
  } catch (error) {
    console.error('评论错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * DELETE /api/posts/:id
 * 删除帖子
 */
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('删除帖子失败:', error);
      return res.status(500).json({ message: '删除帖子失败' });
    }

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除帖子错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
