import React, { useState } from 'react';
import { Order } from '../types';

// 注意：售后功能需要后端新增接口
// 目前暂时保留模拟逻辑，等待后端接口完善

interface AfterSalesProps {
  onBack: () => void;
  order: Order;
  showFeedback: (msg: string) => void;
}

const AfterSales: React.FC<AfterSalesProps> = ({ onBack, order, showFeedback }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [refundAmount, setRefundAmount] = useState(order.total.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    '商品质量问题',
    '商品与描述不符',
    '收到商品破损',
    '尺码/颜色不合适',
    '发错货',
    '不想要了',
    '其他原因'
  ];

  const handleImageUpload = () => {
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
    if (!selectedReason) {
      showFeedback('请选择退款原因');
      return;
    }
    if (!description.trim()) {
      showFeedback('请填写问题描述');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: 调用后端 API 创建售后申请
      // 注意：后端需要新增售后接口
      const afterSalesData = {
        orderId: order.id,
        reason: selectedReason,
        description: description.trim(),
        refundAmount: parseFloat(refundAmount),
        images: images
      };

      console.log('📤 提交售后申请:', afterSalesData);

      // 模拟提交（等待后端接口）
      setTimeout(() => {
        setIsSubmitting(false);
        showFeedback('售后申请已提交');
        setTimeout(() => {
          onBack();
        }, 1000);
      }, 1500);
    } catch (error: any) {
      console.error('❌ 售后申请失败:', error);
      setIsSubmitting(false);
      showFeedback(error || '提交失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span className="text-[14px] font-bold">申请售后</span>
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
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold">¥{item.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">x{item.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 退款金额 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">退款金额</h3>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">退款金额</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">¥</span>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-24 text-right text-lg font-bold bg-transparent focus:outline-none"
                max={order.total}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">最多可退 ¥{order.total.toFixed(2)}</p>
        </div>

        {/* 退款原因 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">退款原因</h3>
          <div className="grid grid-cols-2 gap-3">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedReason === reason
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-600 active:bg-gray-100'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        {/* 问题描述 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">问题描述</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请详细描述您遇到的问题，以便我们更好地为您处理..."
            className="w-full h-32 p-4 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">详细描述有助于快速处理</span>
            <span className="text-xs text-gray-400">{description.length}/500</span>
          </div>
        </div>

        {/* 上传凭证 */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3">上传凭证（选填）</h3>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <img src={img} alt={`evidence-${index}`} className="w-full h-full object-cover rounded-lg" />
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

        {/* 温馨提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-900 mb-2">温馨提示</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 提交后客服将在24小时内处理</li>
                <li>• 请保持手机畅通，方便客服联系</li>
                <li>• 退款将原路返回，3-7个工作日到账</li>
                <li>• 如需退货，请保持商品完好</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 底部提交按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[480px] mx-auto">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedReason || !description.trim()}
          className={`w-full h-12 rounded-full text-sm font-bold transition-all ${
            isSubmitting || !selectedReason || !description.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white active:scale-95 shadow-lg'
          }`}
        >
          {isSubmitting ? '提交中...' : '提交申请'}
        </button>
      </div>
    </div>
  );
};

export default AfterSales;
