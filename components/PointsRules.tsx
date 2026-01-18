
import React from 'react';

const PointsRules: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px]">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px]">积分规则</h1>
        <div className="w-6"></div>
      </header>
      <main className="p-8 space-y-8">
        <section>
          <h2 className="text-[16px] font-bold mb-4 border-l-4 border-black pl-3">积分如何获取？</h2>
          <ul className="space-y-3 text-[13px] text-gray-600 leading-relaxed">
            <li>1. 购物返积分：每实付 1 元获得 1 积分（不含运费）。</li>
            <li>2. 签到奖励：连续签到可获得递增积分奖励。</li>
            <li>3. 活动获取：参与特定节日活动或新品首发活动获取。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-[16px] font-bold mb-4 border-l-4 border-black pl-3">积分有何用途？</h2>
          <ul className="space-y-3 text-[13px] text-gray-600 leading-relaxed">
            <li>1. 兑换好礼：积分商城提供限量周边及热门单品。</li>
            <li>2. 抵扣现金：下单时可按比例抵扣订单金额（部分商品适用）。</li>
            <li>3. 升级会员：积分达到一定数值可自动升级会员等级，享受更高折扣。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-[16px] font-bold mb-4 border-l-4 border-black pl-3">注意事项</h2>
          <ul className="space-y-3 text-[13px] text-gray-600 leading-relaxed italic">
            <li>* 积分有效期为获得之日起的一个自然年，逾期自动清零。</li>
            <li>* 若发生退货，该笔订单获得的积分将同步扣除。</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default PointsRules;
