import React from 'react';
import { Order, NavigateHandler } from '../types';

interface OrderDetailProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  order: Order;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  showFeedback: (msg: string) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ onBack, onNavigate, order, onUpdateOrder, showFeedback }) => {
  const handleAction = (action: string) => {
    switch (action) {
      case '立即付款':
        showFeedback('跳转支付页面...');
        // 这里应该跳转到支付页面
        break;
      
      case '取消订单':
        if (window.confirm('确定要取消订单吗？')) {
          onUpdateOrder(order.id, {
            status: '已取消',
            statusText: '订单已取消',
            actions: []
          });
          showFeedback('订单已取消');
          onBack();
        }
        break;
      
      case '修改地址':
        showFeedback('跳转地址管理...');
        onNavigate('addressManagement');
        break;
      
      case '提醒发货':
        showFeedback('已提醒商家发货');
        break;
      
      case '查看物流':
        showFeedback('查看物流信息...');
        // 这里应该跳转到物流页面
        break;
      
      case '确认收货':
        if (window.confirm('确认已收到商品吗？')) {
          onUpdateOrder(order.id, {
            status: '待评价',
            statusText: '交易成功',
            actions: ['评价', '申请售后', '再次购买']
          });
          showFeedback('确认收货成功');
        }
        break;
      
      case '评价':
        showFeedback('跳转评价页面...');
        // 这里应该跳转到评价页面
        break;
      
      case '申请售后':
        showFeedback('跳转售后申请页面...');
        onNavigate('refundList');
        break;
      
      case '再次购买':
        // 将订单商品加入购物车
        showFeedback('商品已加入购物车');
        break;
      
      case '删除订单':
        if (window.confirm('确定要删除订单吗？')) {
          showFeedback('订单已删除');
          onBack();
        }
        break;
      
      default:
        showFeedback(`执行操作: ${action}`);
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case '待付款':
        return 'text-orange-500';
      case '待发货':
        return 'text-blue-500';
      case '待收货':
        return 'text-green-500';
      case '待评价':
        return 'text-purple-500';
      case '已取消':
        return 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span className="text-[14px] font-bold">订单详情</span>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 订单状态 */}
      <div className="bg-white px-6 py-6 mb-2">
        <div className="flex items-center gap-3 mb-2">
          <span className={`material-symbols-outlined text-3xl ${getStatusColor()}`}>
            {order.status === '待付款' ? 'payments' : 
             order.status === '待发货' ? 'package_2' :
             order.status === '待收货' ? 'local_shipping' :
             order.status === '待评价' ? 'chat_bubble' : 'check_circle'}
          </span>
          <div>
            <h2 className={`text-lg font-bold ${getStatusColor()}`}>{order.statusText}</h2>
            <p className="text-xs text-gray-400 mt-1">订单号: {order.id}</p>
          </div>
        </div>
      </div>

      {/* 商品信息 */}
      <div className="bg-white px-6 py-4 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">{order.shop}</h3>
          <span className="material-symbols-outlined text-gray-400">chevron_right</span>
        </div>
        
        {order.items.map((item, index) => (
          <div key={index} className="flex gap-3 py-3 border-t border-gray-50">
            <img src={item.img} className="w-20 h-20 object-cover rounded-lg" alt={item.title} />
            <div className="flex-1">
              <h4 className="text-sm font-medium line-clamp-2 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-400 mb-2">{item.spec}</p>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold">¥{item.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400">x{item.count}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">商品总价</span>
            <span>¥{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">运费</span>
            <span>¥0.00</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
            <span>实付款</span>
            <span className="text-red-500">¥{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 收货信息 */}
      <div className="bg-white px-6 py-4 mb-2">
        <h3 className="text-sm font-bold mb-3">收货信息</h3>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-600 w-20">收货人</span>
            <span>王先生</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-20">联系电话</span>
            <span>138****8888</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-20">收货地址</span>
            <span className="flex-1">北京市 朝阳区 建国路 SOHO现代城 C座 1801</span>
          </div>
        </div>
      </div>

      {/* 订单信息 */}
      <div className="bg-white px-6 py-4">
        <h3 className="text-sm font-bold mb-3">订单信息</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">订单编号</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">下单时间</span>
            <span>2026-01-16 14:30:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">支付方式</span>
            <span>微信支付</span>
          </div>
        </div>
      </div>

      {/* 底部操作按钮 */}
      {order.actions && order.actions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 max-w-[480px] mx-auto">
          {order.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
                action === '立即付款' || action === '确认收货' || action === '评价'
                  ? 'bg-black text-white'
                  : 'border-2 border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
