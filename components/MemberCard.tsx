import React, { useState, useEffect } from 'react';

interface MemberCardProps {
  onClose: () => void;
  userPoints: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ onClose, userPoints }) => {
  const [brightness, setBrightness] = useState(0.5);
  const [memberCode, setMemberCode] = useState('');

  useEffect(() => {
    // 生成会员码（实际应该从后端获取）
    const code = `LUXE${Date.now().toString(36).toUpperCase()}`;
    setMemberCode(code);

    // 动态调整亮度
    const interval = setInterval(() => {
      setBrightness(prev => (prev === 0.5 ? 1 : 0.5));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(memberCode);
      alert('会员码已复制');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // 计算会员等级
  const getMemberLevel = (points: number) => {
    if (points >= 10000) return { level: 'VIP', color: 'from-purple-600 to-pink-600', discount: '9折' };
    if (points >= 5000) return { level: '金卡', color: 'from-yellow-500 to-orange-500', discount: '9.2折' };
    if (points >= 1000) return { level: '银卡', color: 'from-gray-400 to-gray-600', discount: '9.5折' };
    return { level: '普通', color: 'from-blue-400 to-blue-600', discount: '无折扣' };
  };

  const memberInfo = getMemberLevel(userPoints);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm animate-in zoom-in duration-300">
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* 会员卡 */}
        <div 
          className={`relative bg-gradient-to-br ${memberInfo.color} rounded-3xl p-8 shadow-2xl overflow-hidden transition-all duration-1000`}
          style={{ filter: `brightness(${brightness})` }}
        >
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24"></div>

          {/* 卡片内容 */}
          <div className="relative z-10">
            {/* 顶部 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white text-2xl font-bold tracking-wider">LUÒJIAWANG</h3>
                <p className="text-white/80 text-xs mt-1">会员专属</p>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
            </div>

            {/* 二维码区域 */}
            <div className="bg-white rounded-2xl p-6 mb-6 flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                {/* 模拟二维码 */}
                <div className="grid grid-cols-8 gap-1 p-4">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">会员码</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono font-bold text-gray-800">{memberCode}</p>
                <button 
                  onClick={handleCopy}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-600 text-sm">content_copy</span>
                </button>
              </div>
            </div>

            {/* 会员信息 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm opacity-80">会员等级</span>
                <span className="text-lg font-bold">{memberInfo.level}会员</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="text-sm opacity-80">当前积分</span>
                <span className="text-lg font-bold">{userPoints.toLocaleString()} PTS</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="text-sm opacity-80">专属折扣</span>
                <span className="text-lg font-bold">{memberInfo.discount}</span>
              </div>
            </div>

            {/* 底部提示 */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white/60 text-xs text-center">
                出示此码可在门店享受会员专属优惠
              </p>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <div className="flex items-start gap-3 text-white">
            <span className="material-symbols-outlined text-xl">info</span>
            <div className="flex-1 text-xs space-y-1 opacity-80">
              <p>• 线上购物自动享受会员折扣</p>
              <p>• 线下门店出示会员码即可使用</p>
              <p>• 积分可用于兑换商品和优惠券</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
