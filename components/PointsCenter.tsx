
import React, { useState, useMemo } from 'react';
import { NavigateHandler } from '../types';

interface PointsCenterProps {
  points: number;
  onBack: () => void;
  onNavigate: NavigateHandler;
}

const PointsCenter: React.FC<PointsCenterProps> = ({ points, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const [showRules, setShowRules] = useState(false);
  const tabs = ['全部', '我能兑换', '券/码', '商品', '权益卡'];

  // 模拟所有可兑换数据源
  const allItems = useMemo(() => [
    {
      id: 'c1',
      title: '50元无门槛现金券',
      points: '1000',
      type: 'coupon',
      desc: '全场通用，除部分特价商品',
      expiry: '兑换后30天有效',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgV5lrRQLTwzIr7YBv-zjeJs67D5xENFrwwTTDhmUolGRhGxvSR0ExL1U45oEX1q8lrY8XfYnjeyMOKYmtMGtrNjgqyqP1d2D2Wz3FT7hcUfWUFQz-YDBB4WF5ggzOX7IrSS7IeT5RyP2rh_PAwXyEGLHOKQZdWRh653L6eT4Km1lsvcagRup6X1qc766MNVldHZuE6VOpF9gzNoUEHLH4wTxXHibMs0CG69Tq3aLO2_xlE75BOAPwXTnbjQ005IdyHRdS9bOJmLD3'
    },
    {
      id: 'c2',
      title: '顺丰免邮服务券',
      points: '500',
      type: 'coupon',
      desc: '单笔订单免除基础运费',
      expiry: '兑换后90天有效',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0'
    },
    {
      id: 'p1',
      title: 'LUOJIAWANG璐珈VIP毛毡托特包',
      points: '1888',
      cash: '9.9',
      type: 'product',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9'
    },
    {
      id: 'p2',
      title: '【乌木玫瑰】复古牛皮单肩包',
      points: '5000',
      cash: '111',
      type: 'product',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0'
    },
    {
      id: 'm1',
      title: 'LUXE年度至尊黑金会员卡',
      points: '8000',
      type: 'membership',
      desc: '尊享全场88折及新品优先试穿权',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgV5lrRQLTwzIr7YBv-zjeJs67D5xENFrwwTTDhmUolGRhGxvSR0ExL1U45oEX1q8lrY8XfYnjeyMOKYmtMGtrNjgqyqP1d2D2Wz3FT7hcUfWUFQz-YDBB4WF5ggzOX7IrSS7IeT5RyP2rh_PAwXyEGLHOKQZdWRh653L6eT4Km1lsvcagRup6X1qc766MNVldHZuE6VOpF9gzNoUEHLH4wTxXHibMs0CG69Tq3aLO2_xlE75BOAPwXTnbjQ005IdyHRdS9bOJmLD3'
    }
  ], []);

  // 根据当前 Tab 进行过滤
  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case '我能兑换':
        return allItems.filter(item => points >= parseInt(item.points));
      case '券/码':
        return allItems.filter(item => item.type === 'coupon');
      case '商品':
        return allItems.filter(item => item.type === 'product');
      case '权益卡':
        return allItems.filter(item => item.type === 'membership');
      default:
        return allItems;
    }
  }, [activeTab, points, allItems]);

  const handleProductClick = (item: any) => {
    if (item.type === 'product') {
      // 跳转到积分商品详情页
      onNavigate('pointsProduct', item);
    } else {
      // 券/码类型直接兑换
      handleExchange(item);
    }
  };

  const handleExchange = (item: any) => {
    // 跳转到积分结算页面
    onNavigate('pointsCheckout', item);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a] pb-20 overflow-y-auto no-scrollbar">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px] active:scale-90 transition-transform">chevron_left</button>
        <div className="flex-1 text-center font-bold tracking-widest text-[14px]">积分商城</div>
        <button onClick={() => setShowRules(true)} className="material-symbols-outlined text-[24px] active:scale-90 transition-transform">info</button>
      </header>

      <main className="px-6">
        <section className="mb-8 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[12px] text-gray-400 font-medium tracking-wide">MY POINTS</p>
            <h1 className="text-4xl font-sans font-black tracking-tighter">{points.toLocaleString()}</h1>
          </div>
          <div className="flex gap-6 pb-1">
            <PointAction icon="description" label="明细" onClick={() => onNavigate('pointsDetail')} />
            <PointAction icon="confirmation_number" label="兑换记录" onClick={() => onNavigate('pointsRecords')} />
          </div>
        </section>

        <nav className="sticky top-14 bg-white z-40 flex justify-between border-b border-gray-50 -mx-6 px-6 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-3 text-[13px] relative transition-all whitespace-nowrap ${activeTab === tab ? 'text-black font-bold scale-105' : 'text-gray-400 font-medium'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-full mx-2 animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>
          ))}
        </nav>

        {/* 渲染过滤后的列表 */}
        <div className="space-y-10">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredItems.map(item => {
                if (item.type === 'coupon' || item.type === 'membership') {
                  return (
                    <div key={item.id} className="relative bg-zinc-900 text-white rounded-2xl p-6 flex items-center justify-between overflow-hidden shadow-xl shadow-black/5 active:scale-[0.98] transition-all animate-in fade-in slide-in-from-bottom-4">
                      <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                      <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                      
                      <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                          <span className={`material-symbols-outlined !text-[32px] ${item.type === 'membership' ? 'text-brand-gold' : 'text-primary'}`}>
                            {item.type === 'membership' ? 'card_membership' : 'confirmation_number'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold tracking-tight">{item.title}</h3>
                          <p className="text-[10px] text-white/50 mt-1 font-medium">{item.desc}</p>
                          {item.expiry && <p className="text-[9px] text-brand-gold mt-1.5 font-bold uppercase tracking-widest">{item.expiry}</p>}
                        </div>
                      </div>

                      <div className="text-right shrink-0 relative z-10">
                        <div className="flex items-baseline justify-end gap-0.5 mb-2">
                          <span className="text-xl font-black font-sans">{item.points}</span>
                          <span className="text-[9px] font-bold opacity-60">PTS</span>
                        </div>
                        <button 
                          onClick={() => handleExchange(item)}
                          className="bg-white text-black text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest hover:bg-brand-gold transition-colors"
                        >
                          兑换
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={item.id} className="flex gap-5 bg-[#fbfbfb] p-4 rounded-2xl border border-gray-50 transition-all animate-in fade-in slide-in-from-bottom-4 group">
                      <div 
                        className="w-24 h-24 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm cursor-pointer active:opacity-80"
                        onClick={() => handleProductClick(item)}
                      >
                        <img src={item.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.title} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div onClick={() => handleProductClick(item)} className="cursor-pointer">
                          <h3 className="text-[13px] font-bold leading-relaxed line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-[18px] font-black font-sans">{item.points}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">积分</span>
                            {item.cash && (
                              <span className="text-[13px] text-gray-400 font-medium ml-1">+ ¥{item.cash}</span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleExchange(item)}
                          className="w-fit px-6 py-1.5 rounded-full bg-black text-white text-[11px] font-bold tracking-widest uppercase active:scale-95 transition-transform"
                        >
                          立即兑换
                        </button>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">inventory_2</span>
              <p className="text-[13px] font-bold tracking-widest">暂无满足条件的兑换项</p>
              {activeTab === '我能兑换' && <p className="text-[10px] mt-2 opacity-60">加油攒积分，更多好礼等着你</p>}
            </div>
          )}
        </div>
      </main>

      <footer className="py-20 flex flex-col items-center">
        <div className="w-12 h-[1px] bg-gray-100 mb-6" />
        <p className="text-[10px] text-gray-300 tracking-[0.4em] uppercase font-bold italic">Member Exclusive Center</p>
      </footer>

      {/* 规则说明弹窗 */}
      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRules(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowRules(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400">close</span>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">积分规则</h2>
              <p className="text-sm text-gray-500">了解如何获取和使用积分</p>
            </div>

            <div className="space-y-6 text-sm text-gray-600">
              <div>
                <h3 className="font-bold text-black mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-green-500">add_circle</span>
                  如何获得积分
                </h3>
                <ul className="space-y-2 ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>每日签到：+10 积分</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>连续签到 7 天：额外 +50 积分</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>购物消费：每消费 1 元 = 1 积分</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>完成评价：+20 积分/次</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>邀请好友：+100 积分/人</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-black mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-blue-500">redeem</span>
                  如何使用积分
                </h3>
                <ul className="space-y-2 ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>兑换优惠券和权益卡</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>积分 + 现金兑换商品</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>参与积分抽奖活动</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-black mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-orange-500">schedule</span>
                  积分有效期
                </h3>
                <ul className="space-y-2 ml-7">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>积分有效期为获得后 1 年</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>过期积分将自动清零</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>会员升级可延长有效期</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <span className="font-bold">温馨提示：</span>
                  积分不可转让、不可兑换现金。最终解释权归 LUÒJIAWANG 所有。
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full mt-6 h-12 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PointAction: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 active:opacity-60 transition-opacity">
    <div className="w-6 h-6 flex items-center justify-center">
      <span className="material-symbols-outlined !text-[20px] text-gray-800">{icon}</span>
    </div>
    <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap tracking-tighter">{label}</span>
  </button>
);

export default PointsCenter;
