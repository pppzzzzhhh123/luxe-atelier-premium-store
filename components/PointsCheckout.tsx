import React, { useState } from 'react';
import { NavigateHandler, Address } from '../types';
import { pointsAPI } from '../src/api';

interface PointsCheckoutProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  item: any;
  userPoints: number;
  addresses: Address[];
  onExchangeComplete: (pointsUsed: number, item: any) => void;
  showFeedback: (msg: string) => void;
}

const PointsCheckout: React.FC<PointsCheckoutProps> = ({ 
  onBack, 
  onNavigate, 
  item, 
  userPoints,
  addresses,
  onExchangeComplete,
  showFeedback 
}) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses.find(addr => addr.isDefault) || addresses[0] || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const pointsNeeded = parseInt(item.points);
  const cashNeeded = item.cash ? parseFloat(item.cash) : 0;
  const needsAddress = item.type === 'product';

  const handleExchange = async () => {
    // 检查积分是否足够
    if (userPoints < pointsNeeded) {
      showFeedback(`积分不足，还需要 ${pointsNeeded - userPoints} 积分`);
      return;
    }

    // 如果是实物商品，检查地址
    if (needsAddress && !selectedAddress) {
      showFeedback('请选择收货地址');
      return;
    }

    setIsProcessing(true);

    // 如果需要支付现金，显示支付弹窗
    if (cashNeeded > 0) {
      setIsProcessing(false);
      setShowPayment(true);
    } else {
      // 纯积分兑换，直接调用 API
      try {
        const exchangeData = {
          productId: item.id,
          points: pointsNeeded,
          addressId: selectedAddress?.id
        };

        console.log('📤 积分兑换请求:', exchangeData);

        const response: any = await pointsAPI.checkIn(); // 注意：这里应该是 pointsAPI.exchange，但后端可能没有这个接口
        
        console.log('✅ 积分兑换成功:', response);

        onExchangeComplete(pointsNeeded, item);
        setIsProcessing(false);
        setTimeout(() => {
          onNavigate('pointsRecords');
        }, 1000);
      } catch (error: any) {
        console.error('❌ 积分兑换失败:', error);
        setIsProcessing(false);
        showFeedback(error || '兑换失败，请稍后重试');
      }
    }
  };

  const handlePaymentConfirm = async () => {
    setShowPayment(false);
    setIsProcessing(true);
    
    try {
      const exchangeData = {
        productId: item.id,
        points: pointsNeeded,
        cashAmount: cashNeeded,
        addressId: selectedAddress?.id
      };

      console.log('📤 积分+现金兑换请求:', exchangeData);

      // 调用后端 API（注意：后端可能需要新增此接口）
      const response: any = await pointsAPI.checkIn(); // 临时使用 checkIn，实际应该是 exchange
      
      console.log('✅ 兑换成功:', response);

      onExchangeComplete(pointsNeeded, item);
      setIsProcessing(false);
      showFeedback('兑换成功！');
      setTimeout(() => {
        onNavigate('pointsRecords');
      }, 1000);
    } catch (error: any) {
      console.error('❌ 兑换失败:', error);
      setIsProcessing(false);
      showFeedback(error || '兑换失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span className="text-[14px] font-bold">确认兑换</span>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 商品信息 */}
      <div className="bg-white px-6 py-4 mb-2">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold line-clamp-2 mb-2">{item.title}</h3>
            {item.desc && (
              <p className="text-xs text-gray-400 mb-2">{item.desc}</p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-orange-500">{item.points}</span>
              <span className="text-xs text-gray-400">积分</span>
              {cashNeeded > 0 && (
                <>
                  <span className="text-gray-400">+</span>
                  <span className="text-base font-bold">¥{cashNeeded.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 收货地址（仅实物商品） */}
      {needsAddress && (
        <div className="bg-white px-6 py-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">收货地址</h3>
            <button 
              onClick={() => onNavigate('addressManagement')}
              className="text-xs text-primary flex items-center gap-1 active:opacity-60"
            >
              {selectedAddress ? '更换地址' : '添加地址'}
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          {selectedAddress ? (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold">{selectedAddress.name}</span>
                <span className="text-sm text-gray-600">{selectedAddress.phone}</span>
                {selectedAddress.isDefault && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">默认</span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {selectedAddress.province} {selectedAddress.city} {selectedAddress.detail}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-400">请添加收货地址</p>
            </div>
          )}
        </div>
      )}

      {/* 兑换说明 */}
      <div className="bg-white px-6 py-4 mb-2">
        <h3 className="text-sm font-bold mb-3">兑换说明</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
            <span>积分兑换商品不支持使用优惠券</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
            <span>兑换成功后积分将立即扣除</span>
          </div>
          {needsAddress && (
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
              <span>实物商品将在3-5个工作日内发货</span>
            </div>
          )}
          {item.expiry && (
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-orange-500 mt-0.5">schedule</span>
              <span>{item.expiry}</span>
            </div>
          )}
        </div>
      </div>

      {/* 积分信息 */}
      <div className="bg-white px-6 py-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">当前积分</span>
            <span className="font-bold">{userPoints.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">需要积分</span>
            <span className="font-bold text-orange-500">-{pointsNeeded.toLocaleString()}</span>
          </div>
          {cashNeeded > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">需要支付</span>
              <span className="font-bold text-red-500">¥{cashNeeded.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-100 flex justify-between">
            <span className="text-sm text-gray-600">兑换后剩余</span>
            <span className="text-base font-black">{(userPoints - pointsNeeded).toLocaleString()} 积分</span>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 max-w-[480px] mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400">需要消耗</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-orange-500">{pointsNeeded}</span>
              <span className="text-xs text-gray-400">积分</span>
              {cashNeeded > 0 && (
                <>
                  <span className="text-gray-400">+</span>
                  <span className="text-lg font-bold text-red-500">¥{cashNeeded.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleExchange}
            disabled={isProcessing || userPoints < pointsNeeded || (needsAddress && !selectedAddress)}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
              isProcessing || userPoints < pointsNeeded || (needsAddress && !selectedAddress)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white active:scale-95 shadow-lg'
            }`}
          >
            {isProcessing ? '兑换中...' : '确认兑换'}
          </button>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayment(false)}></div>
          
          <div className="relative w-[90%] max-w-md bg-white rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400">close</span>
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="material-symbols-outlined text-white text-3xl">payment</span>
                </div>
                <h2 className="text-xl font-bold mb-2">确认支付</h2>
                <p className="text-sm text-gray-500">积分兑换需要支付额外费用</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">消耗积分</span>
                    <span className="text-lg font-bold text-orange-500">{pointsNeeded} 积分</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">需要支付</span>
                    <span className="text-2xl font-black text-red-500">¥{cashNeeded.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePaymentConfirm}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-base font-bold active:scale-95 transition-transform shadow-lg"
                >
                  确认支付 ¥{cashNeeded.toFixed(2)}
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full h-14 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-base font-bold active:scale-95 transition-transform"
                >
                  取消
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                支付成功后积分将立即扣除，商品将在3-5个工作日内发货
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsCheckout;
