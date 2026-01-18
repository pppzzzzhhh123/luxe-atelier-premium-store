
import React from 'react';

const Cards: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px]">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px] tracking-widest uppercase">我的卡包</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-6 space-y-6">
        {/* Membership Card */}
        <div className="relative aspect-[1.6/1] bg-gradient-to-br from-[#c5a059] to-[#8a6e3c] rounded-3xl p-8 text-white shadow-xl overflow-hidden group active:scale-95 transition-transform">
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-lg font-bold tracking-widest">LUXE VIP CARD</h2>
                    <p className="text-[10px] opacity-60 uppercase font-sans mt-1">Premium Membership</p>
                 </div>
                 <span className="material-symbols-outlined text-3xl opacity-40">workspace_premium</span>
              </div>
              
              <div>
                 <p className="text-[11px] opacity-40 mb-1">Card Holder</p>
                 <p className="text-[14px] font-bold tracking-[0.2em] font-sans">LUXE USER **** 8820</p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
           <h3 className="text-[13px] font-bold text-gray-800 mb-6">卡片权益</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                 <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                 <p className="text-[12px] font-bold">全年免运费</p>
                 <p className="text-[9px] text-gray-400">无限次顺丰包邮</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                 <span className="material-symbols-outlined text-brand-gold text-xl">loyalty</span>
                 <p className="text-[12px] font-bold">消费92折</p>
                 <p className="text-[9px] text-gray-400">全场正价商品适用</p>
              </div>
           </div>
        </div>

        <button className="w-full py-5 bg-black text-white rounded-2xl text-[14px] font-bold tracking-widest uppercase shadow-xl active:bg-zinc-800 transition-all">
          添加新卡
        </button>
      </main>
    </div>
  );
};

export default Cards;
