
import React, { useState } from 'react';
import { NavigateHandler } from '../types';
import { couponAPI } from '../src/api';

interface CouponsProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  showFeedback?: (message: string) => void;
  coupons: any[];
  setCoupons: (coupons: any[]) => void;
}

const Coupons: React.FC<CouponsProps> = ({ onBack, onNavigate, showFeedback, coupons, setCoupons }) => {
  const [activeTab, setActiveTab] = useState('未使用');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const tabs = ['未使用', '已使用', '已过期'];

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    setRedeeming(true);
    
    try {
      // 调用后端 API 兑换优惠券
      const response: any = await couponAPI.redeemCoupon(redeemCode.toUpperCase());
      
      console.log('✅ 优惠券兑换成功:', response);
      
      // 添加新优惠券到列表
      const newCoupon = {
        id: response.coupon.id,
        amount: response.coupon.amount,
        title: response.coupon.title,
        sub: response.coupon.description || `满${response.coupon.minAmount}可用`,
        expiry: `有效期至 ${new Date(response.coupon.expiresAt).toLocaleDateString()}`,
        status: 'unused'
      };
      
      setCoupons([newCoupon, ...coupons]);
      
      if (showFeedback) {
        showFeedback('兑换成功！');
      } else {
        alert('兑换成功！');
      }
      
      setRedeemCode('');
      setRedeeming(false);
    } catch (error: any) {
      console.error('❌ 优惠券兑换失败:', error);
      
      if (showFeedback) {
        showFeedback(error || '无效的兑换码');
      } else {
        alert(error || '无效的兑换码');
      }
      
      setRedeeming(false);
    }
  };

  // 根据状态筛选优惠券
  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === '未使用') return coupon.status === 'unused';
    if (activeTab === '已使用') return coupon.status === 'used';
    if (activeTab === '已过期') return coupon.status === 'expired';
    return true;
  });

  const handleUseCoupon = (coupon: any) => {
    if (coupon.status !== 'unused') {
      if (showFeedback) {
        showFeedback('该优惠券不可用');
      }
      return;
    }

    // 跳转到商品列表页面，并提示用户选择商品
    if (showFeedback) {
      showFeedback('请选择商品后在结算页面使用优惠券');
    }
    onNavigate('productList');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-24">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px]">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px] tracking-widest uppercase">我的优惠券</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-6 space-y-6">
        {/* Redeem Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">兑换优惠券 / 礼品码</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              placeholder="请输入兑换码 (如: LUXE888)"
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-[13px] focus:ring-1 focus:ring-primary placeholder:text-gray-300"
            />
            <button 
              onClick={handleRedeem}
              disabled={redeeming}
              className="bg-black text-white px-6 rounded-xl text-[12px] font-bold uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50"
            >
              {redeeming ? '处理中' : '兑换'}
            </button>
          </div>
        </div>

        <nav className="flex justify-around bg-white rounded-2xl p-1 shadow-sm border border-gray-50">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[12px] font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-black text-white shadow-lg' : 'text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          {filteredCoupons.length > 0 ? filteredCoupons.map(coupon => (
            <div key={coupon.id} className="bg-white rounded-2xl flex overflow-hidden shadow-sm relative border border-gray-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-2 bg-black shrink-0" />
              <div className="p-6 flex-1 flex items-center gap-6">
                <div className="text-center shrink-0 min-w-[70px]">
                  <div className="flex items-baseline justify-center text-black">
                    {coupon.amount !== '免运费' && <span className="text-xs font-bold">¥</span>}
                    <span className="text-2xl font-black font-sans">{coupon.amount}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Value</p>
                </div>
                <div className="h-10 w-px border-l border-gray-100 border-dashed" />
                <div className="flex-1">
                  <h3 className="text-[13px] font-bold text-gray-800">{coupon.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-1">{coupon.sub}</p>
                  <p className="text-[9px] text-primary font-bold mt-2 uppercase tracking-widest">{coupon.expiry}</p>
                  {coupon.source === 'points' && (
                    <p className="text-[9px] text-orange-500 font-bold mt-1">积分兑换</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleUseCoupon(coupon)}
                className={`px-4 flex items-center text-[10px] font-bold uppercase tracking-widest vertical-text border-l border-gray-100 transition-colors ${
                  coupon.status === 'unused' 
                    ? 'bg-gray-50 text-black active:bg-gray-100' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={coupon.status !== 'unused'}
              >
                立即使用
              </button>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">confirmation_number</span>
              <p className="text-[13px] font-medium">暂无{activeTab}的优惠券</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Coupons;
