
import React, { useState, useEffect } from 'react';

interface PointsDetailProps {
  onBack: () => void;
  details: any[];
}

const PointsDetail: React.FC<PointsDetailProps> = ({ onBack, details: propDetails }) => {
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    // 从 localStorage 加载签到记录和其他积分记录
    const loadDetails = () => {
      const allDetails: any[] = [];
      
      // 加载签到记录
      try {
        const checkInData = localStorage.getItem('luxe-checkin');
        if (checkInData) {
          const data = JSON.parse(checkInData);
          if (data.lastCheckIn) {
            allDetails.push({
              id: `checkin_${data.lastCheckIn}`,
              title: '每日签到',
              time: new Date(data.lastCheckIn).toLocaleString('zh-CN'),
              amount: data.consecutive >= 7 ? '+60' : '+10',
              type: 'earn',
              source: 'checkin'
            });
          }
        }
      } catch (error) {
        console.error('Failed to load check-in records:', error);
      }

      // 添加示例记录
      allDetails.push(
        {
          id: 'purchase_1',
          title: '购物消费获得积分',
          time: '2026-01-15 14:30:25',
          amount: '+2325',
          type: 'earn',
          source: 'purchase'
        },
        {
          id: 'review_1',
          title: '完成商品评价',
          time: '2026-01-14 10:20:15',
          amount: '+20',
          type: 'earn',
          source: 'review'
        },
        {
          id: 'exchange_1',
          title: '兑换50元优惠券',
          time: '2026-01-13 16:45:30',
          amount: '-1000',
          type: 'spend',
          source: 'exchange'
        }
      );

      // 按时间排序
      allDetails.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      
      setDetails(allDetails);
    };

    loadDetails();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px]">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px]">积分明细</h1>
        <div className="w-6"></div>
      </header>
      <main className="p-4 space-y-3">
        {details.length > 0 ? details.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm animate-in fade-in duration-300">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] font-bold text-gray-800">{item.title}</p>
                {item.source === 'checkin' && (
                  <span className="text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">签到</span>
                )}
                {item.source === 'purchase' && (
                  <span className="text-[8px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">购物</span>
                )}
                {item.source === 'review' && (
                  <span className="text-[8px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">评价</span>
                )}
                {item.source === 'exchange' && (
                  <span className="text-[8px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">兑换</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-sans">{item.time}</p>
            </div>
            <span className={`text-[16px] font-black font-sans shrink-0 ${item.type === 'earn' ? 'text-green-500' : 'text-red-500'}`}>
              {item.amount}
            </span>
          </div>
        )) : (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-gray-200 text-6xl mb-4">receipt_long</span>
            <p className="text-gray-400 text-sm">暂无明细记录</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PointsDetail;
