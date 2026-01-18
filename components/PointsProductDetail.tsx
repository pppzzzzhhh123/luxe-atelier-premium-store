import React, { useState, useEffect } from 'react';
import { NavigateHandler } from '../types';

interface PointsProductDetailProps {
  product: any;
  onBack: () => void;
  onNavigate: NavigateHandler;
  userPoints: number;
  showFeedback?: (message: string) => void;
}

const PointsProductDetail: React.FC<PointsProductDetailProps> = ({ 
  product, 
  onBack, 
  onNavigate, 
  userPoints,
  showFeedback 
}) => {
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (product && product.img) {
      setMainImage(product.img);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <span className="material-symbols-outlined text-gray-200 text-6xl mb-4">inventory_2</span>
        <p className="text-gray-400 text-sm">未找到商品信息</p>
        <button onClick={onBack} className="mt-6 px-8 py-2 border border-black text-xs font-bold uppercase tracking-widest">返回</button>
      </div>
    );
  }

  const thumbs = [
    product.img,
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
  ];

  const pointsNeeded = parseInt(product.points);
  const cashNeeded = product.cash ? parseFloat(product.cash) : 0;
  const canExchange = userPoints >= pointsNeeded;

  const handleExchange = () => {
    if (!canExchange) {
      if (showFeedback) {
        showFeedback(`积分不足，还需要 ${pointsNeeded - userPoints} 积分`);
      }
      return;
    }
    onNavigate('pointsCheckout', product);
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 flex items-center justify-between px-4 py-4 max-w-[480px] pointer-events-none">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md pointer-events-auto shadow-sm active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md pointer-events-auto shadow-sm active:scale-90 transition-transform">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </header>

      <main>
        <section className="relative w-full">
          <div className="h-[60vh] w-full overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
            <img alt="Product" className="w-full h-full object-cover transition-opacity duration-500" src={mainImage || product.img} />
            {/* 积分商品标识 */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              积分兑换
            </div>
          </div>
          <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar bg-white">
            {thumbs.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`w-14 h-14 flex-shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${mainImage === img ? 'border-orange-500' : 'border-gray-100'}`}
              >
                <img className="w-full h-full object-cover" src={img} alt={`thumb-${idx}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pt-4 pb-6 bg-gradient-to-b from-orange-50/30 to-white">
          {/* 积分价格显示 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-orange-500 font-sans">{product.points}</span>
                <span className="text-sm text-gray-400 font-bold">积分</span>
              </div>
              {cashNeeded > 0 && (
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-400 text-lg">+</span>
                  <span className="text-2xl font-bold text-red-500">¥{cashNeeded.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">当前积分:</span>
              <span className="font-bold text-gray-700">{userPoints.toLocaleString()}</span>
              {canExchange ? (
                <span className="text-green-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  可兑换
                </span>
              ) : (
                <span className="text-orange-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  还需 {pointsNeeded - userPoints} 积分
                </span>
              )}
            </div>
          </div>

          <h1 className="font-serif text-xl font-medium leading-tight text-slate-900 mb-2">{product.title}</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-sans mb-4">Points Mall Exclusive</p>
          
          <div className="flex gap-2">
            <span className="text-[10px] px-3 py-1.5 bg-orange-100 text-orange-600 border border-orange-200 rounded-full font-bold">积分专享</span>
            <span className="text-[10px] px-3 py-1.5 bg-red-100 text-red-600 border border-red-200 rounded-full font-bold">限量兑换</span>
            <span className="text-[10px] px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-full">顺丰包邮</span>
          </div>
        </section>

        <div className="h-2 bg-slate-50"></div>

        <section className="px-5 py-6">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">info</span>
            兑换说明
          </h4>
          <div className="space-y-3 text-xs text-slate-600 bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
              <span>此商品为积分兑换专属商品，不支持使用优惠券</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
              <span>兑换成功后积分将立即扣除，不可退还</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
              <span>商品将在3-5个工作日内发货，顺丰包邮</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
              <span>支持7天无理由退换（积分将原路返还）</span>
            </div>
            {product.expiry && (
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-orange-500 mt-0.5">schedule</span>
                <span className="text-orange-600 font-bold">{product.expiry}</span>
              </div>
            )}
          </div>
        </section>

        <div className="h-2 bg-slate-50"></div>

        <section className="px-5 py-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">商品介绍</h4>
          <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
            <p>这是一款积分商城专属兑换商品，精选优质材料，匠心打造。会员专享福利，用积分即可轻松拥有。</p>
            <img src={thumbs[1]} className="w-full rounded-xl" alt="detail-1" />
            <p>每一件商品都经过严格的质量把控，确保为您提供最优质的兑换体验。</p>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[80] w-full max-w-[480px] bg-white border-t border-orange-100 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 mb-1">需要消耗</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-orange-500">{product.points}</span>
              <span className="text-[10px] text-gray-400">积分</span>
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
            disabled={!canExchange}
            className={`px-8 h-12 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${
              canExchange 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canExchange ? '立即兑换' : '积分不足'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PointsProductDetail;
