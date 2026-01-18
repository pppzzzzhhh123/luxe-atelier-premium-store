
import React, { useState } from 'react';
import { Order } from '../types';
import { reviewAPI } from '../src/api';

interface ReviewEditorProps {
  order: Order | null;
  onBack: () => void;
  showFeedback?: (message: string) => void;
}

const ReviewEditor: React.FC<ReviewEditorProps> = ({ order, onBack, showFeedback }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleAddPhoto = () => {
    if (images.length >= 5) {
      if (showFeedback) {
        showFeedback('最多上传5张图片');
      } else {
        alert('最多上传5张图片');
      }
      return;
    }
    // Mock image pool for visual variety
    const mockPool = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0'
    ];
    setImages([...images, mockPool[images.length % 2]]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (comment.length < 5) {
      if (showFeedback) {
        showFeedback('请至少输入5个字的评价内容');
      } else {
        alert('请至少输入5个字的评价内容');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 准备评价数据
      // 注意：后端需要 orderId, productId, rating
      const productId = order.items && order.items.length > 0 ? order.items[0].id : null;
      
      if (!productId) {
        if (showFeedback) {
          showFeedback('商品信息不完整');
        } else {
          alert('商品信息不完整');
        }
        setIsSubmitting(false);
        return;
      }

      const reviewData = {
        orderId: order.id,
        productId: productId, // 后端必需字段
        rating: rating,
        content: comment.trim(),
        images: images,
        isAnonymous: isAnonymous
      };

      console.log('📤 提交评价请求:', reviewData);

      // 调用后端 API 创建评价
      const response: any = await reviewAPI.createReview(reviewData);

      console.log('✅ 评价提交成功:', response);

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => onBack(), 2000);
    } catch (error: any) {
      console.error('❌ 评价提交失败:', error);
      setIsSubmitting(false);
      if (showFeedback) {
        showFeedback(error || '评价失败，请稍后重试');
      } else {
        alert(error || '评价失败，请稍后重试');
      }
    }
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#1a1a1a] pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px] text-gray-400 active:scale-90 transition-transform">close</button>
        <h1 className="text-[15px] font-bold tracking-widest uppercase">发布评价</h1>
        <button 
          onClick={handlePublish}
          disabled={isSubmitting}
          className={`text-[14px] font-bold ${isSubmitting ? 'text-gray-300' : 'text-primary active:opacity-60 transition-all'}`}
        >
          {isSubmitting ? '发布中...' : '发布'}
        </button>
      </header>

      <main className="p-4 space-y-4">
        {/* Product Summary */}
        <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
          <img src={order.items[0].img} className="w-16 h-16 rounded-lg object-cover" alt="product" />
          <div className="flex-1">
            <h3 className="text-[13px] font-medium line-clamp-1 mb-2">{order.items[0].title}</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-gray-400">评分</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className="material-symbols-outlined text-[20px] active:scale-125 transition-transform"
                    style={{ 
                      fontVariationSettings: rating >= s ? "'FILL' 1" : "'FILL' 0",
                      color: rating >= s ? '#FF4D4F' : '#E5E7EB'
                    }}
                  >
                    star
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-gray-300 ml-1">
                {['极差', '失望', '一般', '满意', '非常棒'][rating - 1]}
              </span>
            </div>
          </div>
        </div>

        {/* Text Input & Images */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="写下您的真实使用体验，帮助更多 LUXE 玩家..."
            className="w-full h-44 text-[14px] leading-relaxed border-none focus:ring-0 p-0 resize-none placeholder:text-gray-300"
          />
          
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square">
                <img src={img} className="w-full h-full object-cover rounded-xl" alt="upload" />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <button 
                onClick={handleAddPhoto}
                className="aspect-square border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300 active:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                <span className="text-[9px] mt-1 font-bold">添加图片</span>
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-300">支持 JPG/PNG 格式，单张最大 10MB</p>
        </div>

        {/* Anonymous Settings */}
        <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAnonymous ? 'bg-gray-50 text-primary' : 'bg-gray-50 text-gray-300'}`}>
              <span className="material-symbols-outlined text-[20px]">visibility_off</span>
            </div>
            <div>
              <p className="text-[14px] font-medium">匿名评价</p>
              <p className="text-[10px] text-gray-400">勾选后将隐藏您的头像与昵称</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isAnonymous ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${isAnonymous ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </main>

      {/* Success Feedback Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="bg-black/80 backdrop-blur-xl text-white px-10 py-8 rounded-[2rem] flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-3xl">sentiment_satisfied</span>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold tracking-widest">评价成功</p>
              <p className="text-[12px] opacity-60 mt-1">感谢您的分享，获得 20 积分奖励</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[90] bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ReviewEditor;
