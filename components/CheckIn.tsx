import React, { useState, useEffect } from 'react';

interface CheckInProps {
  onClose: () => void;
  onCheckIn: (points: number) => void;
}

const CheckIn: React.FC<CheckInProps> = ({ onClose, onCheckIn }) => {
  const [checkInDays, setCheckInDays] = useState<boolean[]>([]);
  const [todayChecked, setTodayChecked] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  useEffect(() => {
    // 从 localStorage 加载签到记录
    try {
      const saved = localStorage.getItem('luxe-checkin');
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        setCheckInDays(data.days || []);
        setTodayChecked(data.lastCheckIn === today);
        setConsecutiveDays(data.consecutive || 0);
      }
    } catch (error) {
      console.error('Failed to load check-in data:', error);
    }
  }, []);

  const handleCheckIn = () => {
    if (todayChecked) return;

    const today = new Date().toDateString();
    const newConsecutive = consecutiveDays + 1;
    const basePoints = 10;
    const bonusPoints = newConsecutive >= 7 ? 50 : 0;
    const totalPoints = basePoints + bonusPoints;

    // 更新签到记录
    const newCheckInDays = [...checkInDays];
    const currentDayIndex = new Date().getDay();
    newCheckInDays[currentDayIndex] = true;

    setCheckInDays(newCheckInDays);
    setTodayChecked(true);
    setConsecutiveDays(newConsecutive);

    // 保存到 localStorage
    try {
      localStorage.setItem('luxe-checkin', JSON.stringify({
        days: newCheckInDays,
        lastCheckIn: today,
        consecutive: newConsecutive,
      }));
    } catch (error) {
      console.error('Failed to save check-in data:', error);
    }

    // 通知父组件
    onCheckIn(totalPoints);
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const rewards = [
    { day: 1, points: 10 },
    { day: 2, points: 10 },
    { day: 3, points: 10 },
    { day: 4, points: 10 },
    { day: 5, points: 10 },
    { day: 6, points: 10 },
    { day: 7, points: 60 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-400">close</span>
        </button>

        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">每日签到</h2>
          <p className="text-sm text-gray-500">连续签到 {consecutiveDays} 天</p>
        </div>

        {/* 签到日历 */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day, index) => {
            const isChecked = checkInDays[index];
            const isToday = new Date().getDay() === index;
            const reward = rewards[index];

            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-2">周{day}</div>
                <div 
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    isChecked 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-105' 
                      : isToday
                      ? 'bg-gray-100 border-2 border-orange-500 text-orange-500'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  {isChecked ? (
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  ) : (
                    <>
                      <span className="text-[10px]">+{reward.points}</span>
                      <span className="text-[8px]">积分</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 签到规则 */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-orange-500 text-xl">info</span>
            <div className="flex-1 text-xs text-gray-600 space-y-1">
              <p>• 每日签到可获得 10 积分</p>
              <p>• 连续签到 7 天额外奖励 50 积分</p>
              <p>• 积分可用于兑换商品和优惠券</p>
            </div>
          </div>
        </div>

        {/* 签到按钮 */}
        <button
          onClick={handleCheckIn}
          disabled={todayChecked}
          className={`w-full h-14 rounded-2xl text-base font-bold tracking-wider uppercase transition-all ${
            todayChecked
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl active:scale-95'
          }`}
        >
          {todayChecked ? '今日已签到' : '立即签到'}
        </button>

        {todayChecked && (
          <p className="text-center text-xs text-gray-400 mt-4">
            明天再来签到吧 ~
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
