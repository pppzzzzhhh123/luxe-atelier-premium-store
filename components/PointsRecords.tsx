
import React from 'react';

interface PointsRecordsProps {
  onBack: () => void;
  records: any[];
}

const PointsRecords: React.FC<PointsRecordsProps> = ({ onBack, records }) => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px]">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px]">兑换记录</h1>
        <div className="w-6"></div>
      </header>
      <main className="p-4 space-y-4">
        {records.length > 0 ? records.map(record => (
          <div key={record.id} className="bg-white p-4 rounded-xl flex gap-4 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
               <img src={record.img} className="w-full h-full object-cover" alt="item" />
            </div>
            <div className="flex-1 py-1">
              <h3 className="text-[13px] font-bold line-clamp-1">{record.title}</h3>
              <p className="text-[11px] text-gray-400 mt-2">兑换时间: {record.time}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[11px] text-primary font-bold">{record.status}</p>
                <p className="text-[11px] font-sans font-bold">{record.points} 积分</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">redeem</span>
            <p className="text-[13px] font-medium">暂无兑换记录</p>
            <button 
              onClick={onBack}
              className="mt-6 text-[12px] text-primary font-bold border-b border-primary pb-0.5"
            >
              去看看有什么好礼
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PointsRecords;
