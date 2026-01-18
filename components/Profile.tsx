import React, { useState } from 'react';

interface ProfileProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, onLogout }) => {
  const user = JSON.parse(localStorage.getItem('luxe-user') || '{}');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { icon: 'person', label: '个人信息', view: 'personal-info' },
    { icon: 'location_on', label: '地址管理', view: 'address-management' },
    { icon: 'receipt_long', label: '我的订单', view: 'orders' },
    { icon: 'confirmation_number', label: '优惠券', view: 'coupons' },
    { icon: 'stars', label: '积分商城', view: 'points-mall' },
    { icon: 'account_balance_wallet', label: '我的钱包', view: 'wallet' },
    { icon: 'card_giftcard', label: '邀请返现', view: 'invite-reward' },
    { icon: 'shield', label: '账号安全', view: 'account-security' },
  ];

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('luxe-token');
    localStorage.removeItem('luxe-user');
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans pb-20">
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-center gap-5 mb-8">
          <img 
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-xl" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw" 
            alt="Avatar"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{user.nickname || user.phone || 'LUXE用户'}</h2>
            <p className="text-sm text-white/60 font-sans">{user.phone || '未绑定手机号'}</p>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">0</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">订单</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">0</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">优惠券</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">0</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">积分</div>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onNavigate(item.view)}
            className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-50 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <span className="text-[15px] font-medium">{item.label}</span>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-black transition-colors">chevron_right</span>
          </button>
        ))}

        {/* 退出登录按钮 */}
        <button
          onClick={handleLogoutClick}
          className="w-full bg-white rounded-2xl p-5 flex items-center justify-center gap-2 shadow-sm border border-gray-50 active:scale-[0.98] transition-all text-red-500 hover:bg-red-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-[15px] font-medium">退出登录</span>
        </button>
      </div>

      {/* 退出登录确认弹窗 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white w-full rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-center mb-2">确认退出</h3>
            <p className="text-[13px] text-gray-500 text-center mb-8">确定要退出登录吗？</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-xl text-[14px] font-bold"
              >
                取消
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-4 bg-black text-white rounded-xl text-[14px] font-bold shadow-lg shadow-black/10"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
