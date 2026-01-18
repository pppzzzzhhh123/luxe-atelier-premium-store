import React from 'react';
import { NavigateHandler } from '../types';

interface MenuProps {
  onClose: () => void;
  onNavigate: NavigateHandler;
}

const Menu: React.FC<MenuProps> = ({ onClose, onNavigate }) => {
  const menuItems = [
    { icon: 'home', label: '首页', view: 'home' as const },
    { icon: 'grid_view', label: '分类', view: 'category' as const },
    { icon: 'explore', label: '发现', view: 'discovery' as const },
    { icon: 'shopping_bag', label: '购物袋', view: 'cart' as const },
    { icon: 'receipt_long', label: '我的订单', view: 'orderList' as const },
    { icon: 'location_on', label: '收货地址', view: 'addressManagement' as const },
    { icon: 'account_balance_wallet', label: '我的钱包', view: 'wallet' as const },
    { icon: 'confirmation_number', label: '优惠券', view: 'coupons' as const },
    { icon: 'stars', label: '积分中心', view: 'pointsCenter' as const },
    { icon: 'person', label: '个人中心', view: 'profile' as const },
  ];

  const handleItemClick = (view: any) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* 遮罩层 */}
      <div 
        className="flex-1 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* 菜单面板 */}
      <div className="w-80 bg-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-wider">LUÒJIAWANG</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">person</span>
            </div>
            <div>
              <p className="text-lg font-bold mb-1">LUXE用户</p>
              <p className="text-xs text-white/60">普通会员</p>
            </div>
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.view)}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <span className="flex-1 text-left text-sm font-medium text-gray-700 group-hover:text-black">
                  {item.label}
                </span>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-black transition-colors">
                  chevron_right
                </span>
              </button>
            ))}
          </div>

          {/* 分割线 */}
          <div className="my-6 border-t border-gray-100"></div>

          {/* 其他功能 */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">settings</span>
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-700 group-hover:text-black">
                设置
              </span>
            </button>

            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">help</span>
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-700 group-hover:text-black">
                帮助与反馈
              </span>
            </button>

            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">info</span>
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-700 group-hover:text-black">
                关于我们
              </span>
            </button>
          </div>

          {/* 底部信息 */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-400">版本 1.0.0</p>
              <p className="text-xs text-gray-400">© 2026 LUÒJIAWANG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
