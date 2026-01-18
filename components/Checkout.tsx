
import React, { useState, useMemo } from 'react';
import PaymentDetails from './PaymentDetails';
import { Product, Address, NavigateHandler } from '../types';
import { orderAPI } from '../src/api';

interface CheckoutProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  selectedProducts?: Product[];
  addresses?: Address[];
  onPaymentComplete?: (orderData: { products: Product[]; total: number; address?: Address; paid: boolean }) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onNavigate, selectedProducts = [], addresses = [], onPaymentComplete }) => {
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCoupons = [
    { id: 101, title: '新人专享礼券', amount: 50, desc: '无门槛使用' },
    { id: 102, title: '满1000减100', amount: 100, desc: '实付满1000可用' },
  ];

  const defaultAddress = useMemo(() => {
    if (!addresses || addresses.length === 0) return null;
    return addresses.find(addr => addr.isDefault) || addresses[0];
  }, [addresses]);

  const finance = useMemo(() => {
    if (!selectedProducts || selectedProducts.length === 0) {
      return { rawSubtotal: 0, volumeSavings: 0, final: 0, discountedSubtotal: 0 };
    }
    const rawSubtotal = selectedProducts.reduce((acc, p) => {
      return acc + (p.price * (p.count || 1));
    }, 0);

    const totalItems = selectedProducts.reduce((acc, p) => acc + (p.count || 1), 0);
    let volumeDiscountFactor = totalItems >= 3 ? 0.90 : (totalItems >= 2 ? 0.92 : 1);
    
    const discountedSubtotal = rawSubtotal * volumeDiscountFactor;
    const activeCoupon = availableCoupons.find(c => c.id === selectedCouponId);
    const final = Math.max(0, discountedSubtotal - (activeCoupon ? activeCoupon.amount : 0));

    return { rawSubtotal, volumeSavings: rawSubtotal - discountedSubtotal, final, discountedSubtotal };
  }, [selectedProducts, selectedCouponId]);

  // 计算可用优惠券
  const usableCoupons = useMemo(() => {
    return availableCoupons.filter(c => {
      if (c.id === 102) {
        // 满1000减100需要检查折扣后金额是否满1000
        return finance.discountedSubtotal >= 1000;
      }
      return true;
    });
  }, [finance.discountedSubtotal, availableCoupons]);

  const handleFinalPayment = () => {
    if (!defaultAddress) {
      onNavigate('addressManagement');
      return;
    }
    if (!selectedProducts || selectedProducts.length === 0) {
      return;
    }
    // 弹出支付窗口
    setIsPaymentOpen(true);
  };

  const handlePaymentConfirm = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 注意：后端期望从购物车创建订单，需要 cartItemIds
      // 如果商品没有 cartItemId，我们需要先添加到购物车或修改后端接口
      
      // 临时方案：使用商品的 id 作为 cartItemIds（需要确保这些商品在购物车中）
      const cartItemIds = selectedProducts
        .map(p => p.cartItemId || p.id)
        .filter(id => id);

      if (cartItemIds.length === 0) {
        alert('请先将商品添加到购物车');
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        addressId: defaultAddress?.id,
        cartItemIds: cartItemIds, // 后端期望的字段名
        couponId: selectedCouponId,
        remark: '', // 可选备注
        shippingFee: 0, // 运费
      };

      console.log('📤 创建订单请求:', orderData);

      // 调用后端 API 创建订单
      const response: any = await orderAPI.createOrder(orderData);

      console.log('✅ 订单创建成功:', response);

      setIsSubmitting(false);
      setIsPaymentOpen(false);

      // 支付成功，通知父组件
      if (onPaymentComplete) {
        onPaymentComplete({
          products: selectedProducts,
          total: finance.final,
          address: defaultAddress,
          paid: true
        });
      }
    } catch (error: any) {
      console.error('❌ 订单创建失败:', error);
      setIsSubmitting(false);
      alert(error || '订单创建失败，请稍后重试');
    }
  };

  const handlePaymentCancel = () => {
    // 支付取消/失败，创建待付款订单
    setIsPaymentOpen(false);
    if (onPaymentComplete) {
      onPaymentComplete({
        products: selectedProducts,
        total: finance.final,
        address: defaultAddress,
        paid: false
      });
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a1a1a] pb-32">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 h-14 flex items-center justify-between px-4 border-b border-gray-50">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <h1 className="text-[15px] font-bold tracking-widest uppercase">确认订单</h1>
        <div className="w-10"></div>
      </header>

      <div onClick={() => onNavigate('addressManagement')} className="px-6 py-8 border-b border-[#f2f2f2] flex items-center justify-between cursor-pointer active:bg-gray-50">
        <div className="flex items-start gap-4">
           <span className="material-symbols-outlined text-black">location_on</span>
           {defaultAddress ? (
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[15px] font-bold">{defaultAddress.name}</span>
                 <span className="text-[14px] text-gray-400">{defaultAddress.phone}</span>
               </div>
               <p className="text-[13px] text-gray-600">{defaultAddress.province} {defaultAddress.city} {defaultAddress.detail}</p>
             </div>
           ) : <p className="text-[14px] font-bold">请选择收货地址</p>}
        </div>
        <span className="material-symbols-outlined text-gray-300">chevron_right</span>
      </div>

      <div className="px-6 py-4 divide-y divide-gray-50">
        {selectedProducts.map((p, i) => (
          <div key={i} className="py-6 flex gap-4">
            <img className="w-[70px] aspect-[3/4] object-cover rounded-sm" src={p.img} alt={p.title} />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[12px] font-medium">{p.title}</h2>
                <p className="text-[10px] text-gray-400">{p.spec || ''}</p>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-bold">¥ {p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className="text-[11px] text-gray-400">x{p.count || 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 折扣和优惠券区域 */}
      <div className="px-6 py-4 space-y-3 border-t border-gray-50">
        {/* 满减折扣提示 */}
        {finance.volumeSavings > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">local_offer</span>
                <div>
                  <p className="text-[12px] font-bold text-primary">LUXE会员满减优惠</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {selectedProducts.reduce((acc, p) => acc + (p.count || 1), 0) >= 3 
                      ? '满3件享9折' 
                      : '满2件享9.2折'}
                  </p>
                </div>
              </div>
              <span className="text-[14px] font-bold text-primary">-¥{finance.volumeSavings.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* 优惠券选择 */}
        {usableCoupons.length > 0 ? (
          <div 
            onClick={() => {
              // 切换优惠券
              if (selectedCouponId === null) {
                setSelectedCouponId(usableCoupons[0].id);
              } else {
                const currentIndex = usableCoupons.findIndex(c => c.id === selectedCouponId);
                if (currentIndex < usableCoupons.length - 1) {
                  setSelectedCouponId(usableCoupons[currentIndex + 1].id);
                } else {
                  setSelectedCouponId(null);
                }
              }
            }}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">confirmation_number</span>
              <div>
                <p className="text-[13px] font-medium text-gray-800">
                  {selectedCouponId 
                    ? availableCoupons.find(c => c.id === selectedCouponId)?.title || '优惠券'
                    : `有${usableCoupons.length}张优惠券可用`}
                </p>
                {selectedCouponId && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {availableCoupons.find(c => c.id === selectedCouponId)?.desc}
                  </p>
                )}
                {!selectedCouponId && (
                  <p className="text-[10px] text-gray-400 mt-0.5">点击选择</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedCouponId && (
                <span className="text-[13px] font-bold text-primary">
                  -¥{availableCoupons.find(c => c.id === selectedCouponId)?.amount || 0}
                </span>
              )}
              <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-300">confirmation_number</span>
              <div>
                <p className="text-[13px] font-medium text-gray-500">暂无可用优惠券</p>
                <p className="text-[10px] text-gray-400 mt-0.5">暂无可用的优惠券</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 价格明细 */}
      <div className="px-6 py-4 space-y-2 border-t border-gray-50">
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-gray-500">商品小计</span>
          <span className="text-gray-700">¥{finance.rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        {finance.volumeSavings > 0 && (
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-gray-500">满减优惠</span>
            <span className="text-primary font-bold">-¥{finance.volumeSavings.toFixed(2)}</span>
          </div>
        )}
        {selectedCouponId && (
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-gray-500">优惠券</span>
            <span className="text-primary font-bold">
              -¥{availableCoupons.find(c => c.id === selectedCouponId)?.amount || 0}
            </span>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between z-[70] shadow-xl">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">最终应付</span>
          <span className="text-xl font-black">¥ {finance.final.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <button onClick={handleFinalPayment} className="bg-black text-white px-12 py-4 text-[13px] font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-transform">
          提交订单
        </button>
      </footer>

      {isPaymentOpen && (
        <PaymentDetails 
          amount={finance.final.toLocaleString()} 
          onClose={handlePaymentCancel} 
          onConfirm={handlePaymentConfirm} 
        />
      )}
    </div>
  );
};

export default Checkout;
