import React, { useState } from 'react';

// 注意：评论功能需要后端新增接口
// 目前暂时保留模拟逻辑，等待后端接口完善

interface Comment {
  id: number;
  author: string;
  authorImg: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
}

interface CommentSectionProps {
  postId: number;
  onClose: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: '时尚达人小美',
      authorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: '这件衣服真的太好看了！质感超级棒，穿上很显气质 ✨',
      time: '2小时前',
      likes: 128,
      liked: false,
    },
    {
      id: 2,
      author: 'Lily Chen',
      authorImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      content: '已经入手了，实物比图片还要好看！强烈推荐 👍',
      time: '5小时前',
      likes: 89,
      liked: false,
    },
    {
      id: 3,
      author: '优雅女士',
      authorImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      content: '搭配建议：可以配一条简约的项链，会更加精致哦~',
      time: '1天前',
      likes: 56,
      liked: false,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = (commentId: number) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 调用后端 API 创建评论
      // 注意：后端需要新增评论接口
      // const response = await commentAPI.createComment({ postId, content: newComment });
      
      console.log('📤 提交评论请求:', { postId, content: newComment });

      // 模拟提交评论（等待后端接口）
      setTimeout(() => {
        const comment: Comment = {
          id: Date.now(),
          author: 'LUXE用户',
          authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          content: newComment,
          time: '刚刚',
          likes: 0,
          liked: false,
        };

        setComments(prev => [comment, ...prev]);
        setNewComment('');
        setIsSubmitting(false);
        alert('评论成功！');
      }, 500);
    } catch (error: any) {
      console.error('❌ 评论提交失败:', error);
      setIsSubmitting(false);
      alert(error || '评论失败，请稍后重试');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span className="text-[14px] font-bold">评论 {comments.length}</span>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 评论列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img 
                  src={comment.authorImg} 
                  alt={comment.author} 
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{comment.author}</span>
                    <span className="text-xs text-gray-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{comment.content}</p>
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 active:scale-95 transition-transform"
                  >
                    <span 
                      className={`material-symbols-outlined text-base ${comment.liked ? 'text-red-500' : ''}`}
                      style={{ fontVariationSettings: comment.liked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                    <span className={comment.liked ? 'text-red-500' : ''}>{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">chat_bubble</span>
            <p className="text-sm">暂无评论，快来抢沙发吧~</p>
          </div>
        )}
      </div>

      {/* 评论输入框 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="说点什么..."
              rows={1}
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/10 max-h-24"
              style={{ minHeight: '44px' }}
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-400">
              {newComment.length}/500
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !newComment.trim()}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              isSubmitting || !newComment.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white active:scale-95'
            }`}
          >
            {isSubmitting ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
