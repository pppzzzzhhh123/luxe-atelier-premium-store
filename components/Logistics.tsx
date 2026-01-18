
import React from 'react';

interface LogisticsProps {
  onBack: () => void;
  orderId: string;
}

const Logistics: React.FC<LogisticsProps> = ({ onBack, orderId }) => {
  const steps = [
    { time: '2026-01-18 10:30', status: '派送中', desc: '【北京市】顺丰速运派送员 王师傅 正在为您派送（联系电话：13800138000）', active: true },
    { time: '2026-01-18 04:15', status: '运输中', desc: '快件到达 【北京顺义集散中心】', active: false },
    { time: '2026-01-17 21:00', status: '运输中', desc: '快件离开 【上海集散中心】 已发车', active: false },
    { time: '2026-01-17 14:20', status: '已揽收', desc: '顺丰速运 已取件', active: false },
    { time: '2026-01-16 18:00', status: '已发货', desc: '包裹正在等待快递员揽收', active: false },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-50 px-4 h-14 flex items-center justify-between">
        <button onClick={onBack} className="material-symbols-outlined text-[24px]">chevron_left</button>
        <h1 className="text-[15px] font-bold tracking-widest uppercase">物流追踪</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-6">
        {/* 快递信息卡片 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400">local_shipping</span>
            </div>
            <div>
              <p className="text-[14px] font-bold">顺丰速运</p>
              <p className="text-[12px] text-gray-400 font-sans">单号：SF168820260117</p>
            </div>
          </div>
          <div className="h-px bg-gray-50 mb-4" />
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-gray-500">官方电话：95338</span>
            <button className="text-[12px] font-bold text-primary">复制单号</button>
          </div>
        </div>

        {/* 时间轴 */}
        <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className={`absolute -left-[23px] top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm ${step.active ? 'bg-black' : 'bg-gray-300'}`} />
              <div className="space-y-1">
                <p className={`text-[13px] font-bold ${step.active ? 'text-black' : 'text-gray-400'}`}>{step.status}</p>
                <p className="text-[12px] text-gray-500 leading-relaxed font-sans">{step.desc}</p>
                <p className="text-[10px] text-gray-300 font-sans">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Logistics;