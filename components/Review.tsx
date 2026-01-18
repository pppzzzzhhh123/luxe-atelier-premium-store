import React, { useState } from 'react';
import { Order } from '../types';
import { reviewAPI } from '../src/api';

interface ReviewProps {
  onBack: () => void;
  order: Order | null;
  showFeedback: (msg: string) => void;
}

const Review: React.FC<ReviewProps> = ({ onBack, order, showFeedback }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <span className="material-symbols-outlined text-gray-200 text-6xl mb-4">rate_review</span>
        <p className="text-gray-400 text-sm">订单信息不存在</p>
        <button onClick={onBack} className="mt-6 px-8 py-2 border border-black text-xs font-bold uppercase tracking-widest">返回</button>
      </div>
    );
  }

  const handleImageUpload = () => {
    // 模拟图片上传
    const mockImages = [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80',
    ];
    if (images.length < 9) {
      setImages([...images, mockImages[images.length % 2]]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      showFeedback('请填写评价内容');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 准备评价数据
      // 注意：后端需要 orderId, productId, rating
      // 从订单中获取第一个商品的 ID
      const productId = order.items && order.items.length > 0 ? order.items[0].id : null;
      
      if (!productId) {
        showFeedback('商品信息不完整');
        setIsSubmitting(false);
        return;
      }

      const reviewData = {
        orderId: order.id,
        productId: productId, // 后端必需字段
        rating: rating,
        content: content.trim(),
        images: images,
        isAnonymous: isAnonymous
      };

      console.log('📤 提交评价请求:', reviewData);

      // 调用后端 API 创建评价
      const response: any = await reviewAPI.createReview(reviewData);

      console.log('✅ 评价提交成功:', response);

      setIsSubmitting(false);
      showFeedback('评价成功');
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error: any) {
      console.error('❌ 评价提交失败:', error);
      setIsSubmitting(false);
      showFeedback(error || '评价失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span className="text-[14px] font-bold">评价晒单</span>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* 商品信息 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-sm font-medium line-clamp-2 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.spec}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 评分 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">商品评分</h3>
          <div className="flex items-center justify-center gap-4 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="active:scale-90 transition-transform"
              >
                <span 
                  className={`material-symbols-outlined text-4xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500">
            {rating === 5 && '非常满意'}
            {rating === 4 && '满意'}
            {rating === 3 && '一般'}
            {rating === 2 && '不满意'}
            {rating === 1 && '非常不满意'}
          </p>
        </div>

        {/* 评价内容 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">评价内容</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享您的购物体验，帮助其他买家做出更好的选择..."
            className="w-full h-32 p-4 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">最多500字</span>
            <span className="text-xs text-gray-400">{content.length}/500</span>
          </div>
        </div>

        {/* 上传图片 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">上传图片（选填）</h3>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <img src={img} alt={`review-${index}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
            {images.length < 9 && (
              <button
                onClick={handleImageUpload}
                className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-1 active:bg-gray-100 transition-colors border-2 border-dashed border-gray-200"
              >
                <span className="material-symbols-outlined text-2xl text-gray-400">add_photo_alternate</span>
                <span className="text-xs text-gray-400">{images.length}/9</span>
              </button>
            )}
          </div>
        </div>

        {/* 匿名评价 */}
        <div className="mb-6">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer active:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-600">visibility_off</span>
              <div>
                <p className="text-sm font-medium">匿名评价</p>
                <p className="text-xs text-gray-400 mt-0.5">评价将不显示您的用户名</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
          </label>
        </div>

        {/* 评价标签（快捷选择） */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">快捷标签</h3>
          <div className="flex flex-wrap gap-2">
            {['质量很好', '物流快', '包装精美', '性价比高', '款式好看', '面料舒适', '尺码标准', '值得购买'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (content.includes(tag)) {
                    setContent(content.replace(tag, '').trim());
                  } else {
                    setContent(content ? `${content} ${tag}` : tag);
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  content.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* 底部提交按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[480px] mx-auto">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className={`w-full h-12 rounded-full text-sm font-bold transition-all ${
            isSubmitting || !content.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white active:scale-95 shadow-lg'
          }`}
        >
          {isSubmitting ? '提交中...' : '发布评价'}
        </button>
      </div>
    </div>
  );
};

export default Review;
