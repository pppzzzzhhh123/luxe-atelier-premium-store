import React, { useState, useMemo } from 'react';
import Logistics from './Logistics';
import PaymentDetails from './PaymentDetails';
import { Order, NavigateHandler } from '../types';

interface OrderListProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  initialOrders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  initialTab?: number;
}

const OrderList: React.FC<OrderListProps> = ({ onBack, onNavigate, initialOrders, setOrders, initialTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showLogistics, setShowLogistics] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [showRemindDialog, setShowRemindDialog] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);

  // 更新当前时间，用于倒计时
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 自动取消超时订单
  React.useEffect(() => {
    const checkExpiredOrders = () => {
      setOrders(prev => prev.map(order => {
        if (order.status === '待付款' && order.paymentDeadline && Date.now() > order.paymentDeadline) {
          return {
            ...order,
            status: '已取消',
            statusText: '订单已超时自动取消',
            actions: []
          };
        }
        return order;
      }));
    };
    
    const timer = setInterval(checkExpiredOrders, 1000);
    return () => clearInterval(timer);
  }, [setOrders]);

  // 计算剩余时间
  const getTimeRemaining = (deadline: number) => {
    const remaining = deadline - currentTime;
    if (remaining <= 0) return '已超时';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const tabs: (Order['status'] | '全部')[] = ['全部', '待付款', '待发货', '待收货', '待评价'];

  const filteredOrders = useMemo(() => {
    if (activeTab === 0) return initialOrders;
    const targetStatus = tabs[activeTab] as Order['status'];
    return initialOrders.filter(order => order.status === targetStatus);
  }, [activeTab, initialOrders]);

  const handleActionClick = (action: string, order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (action === '查看物流') {
      setCurrentOrderId(order.id);
      setShowLogistics(true);
    } else if (action === '确认收货') {
      if (window.confirm('确认已收到商品吗？')) {
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: '待评价', statusText: '交易成功', actions: ['评价', '申请售后', '再次购买'] } : o));
      }
    } else if (action === '立即付款') {
      setPaymentOrder(order);
      setShowPayment(true);
    } else if (action === '取消订单') {
      setCancelOrder(order);
      setShowCancelDialog(true);
    } else if (action === '修改地址') {
      onNavigate('addressManagement');
    } else if (action === '提醒发货') {
      setShowRemindDialog(true);
    } else if (action === '评价') {
      onNavigate('review', order);
    } else if (action === '申请售后') {
      if (order.hasAfterSales) {
        onNavigate('refundList');
      } else {
        onNavigate('afterSales', order);
      }
    } else if (action === '再次购买') {
      if (order.items && order.items.length > 0) {
        const firstItem = order.items[0];
        const product = {
          id: Date.now(),
          title: firstItem.title,
          price: firstItem.price,
          img: firstItem.img,
          spec: firstItem.spec,
        };
        onNavigate('product', product);
      }
    } else if (action === '联系客服') {
      setShowCustomerService(true);
    }
  };

  const handlePaymentConfirm = () => {
    if (paymentOrder) {
      setOrders(prev => prev.map(o => 
        o.id === paymentOrder.id 
          ? { ...o, status: '待发货', statusText: '买家已付款，等待发货', actions: ['修改地址', '提醒发货'] } 
          : o
      ));
      setShowPayment(false);
      setPaymentOrder(null);
      alert('支付成功！');
    }
  };

  const handleOrderClick = (order: Order) => {
    onNavigate('orderDetail', order);
  };

  if (showLogistics) return <Logistics onBack={() => setShowLogistics(false)} orderId={currentOrderId} />;

  return (
    <div className="bg-[#f7f7f7] min-h-screen text-[#1a1a1a] pb-10 relative font-sans">
      <header className="bg-white sticky top-0 z-50">
        <div className="h-12 flex items-center justify-between px-4">
          <button onClick={onBack} className="material-symbols-outlined">chevron_left</button>
          <span className="text-[14px] font-bold">我的订单</span>
          <div className="w-6"></div>
        </div>
        <div className="flex justify-around border-b border-gray-50 overflow-x-auto no-scrollbar">
          {tabs.map((tab, idx) => (
            <button key={tab} onClick={() => setActiveTab(idx)} className={`py-3 px-4 text-[13px] relative ${activeTab === idx ? 'font-bold' : 'text-gray-400'}`}>
              {tab}
              {activeTab === idx && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          ))}
        </div>
      </header>

      <main className="px-3 py-3 space-y-3">
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer active:bg-gray-50 transition-colors"
            onClick={() => handleOrderClick(order)}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[14px] font-bold">{order.shop}</span>
              <div className="flex flex-col items-end">
                <span className="text-[13px] text-orange-500">{order.statusText}</span>
                {order.status === '待付款' && order.paymentDeadline && (
                  <span className="text-[11px] text-red-500 mt-1">
                    剩余 {getTimeRemaining(order.paymentDeadline)}
                  </span>
                )}
              </div>
            </div>
            {order.items.map((item, i: number) => (
              <div key={i} className="flex gap-3 mb-4">
                <img src={item.img} className="w-20 h-20 object-cover rounded-lg" alt="item" />
                <div className="flex-1">
                  <h3 className="text-[13px] font-medium line-clamp-2">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[14px] font-bold">¥{item.price.toLocaleString()}</span>
                    <span className="text-[11px] text-gray-400">x{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              {order.status === '待收货' ? (
                <>
                  <button 
                    onClick={(e) => handleActionClick('联系客服', order, e)} 
                    className="px-4 py-1.5 rounded-full text-[12px] border border-gray-200 text-gray-700 hover:border-gray-300 transition-all active:scale-95"
                  >
                    联系客服
                  </button>
                  <button 
                    onClick={(e) => handleActionClick('查看物流', order, e)} 
                    className="px-4 py-1.5 rounded-full text-[12px] border border-gray-200 text-gray-700 hover:border-gray-300 transition-all active:scale-95"
                  >
                    查看物流
                  </button>
                  <button 
                    onClick={(e) => handleActionClick('确认收货', order, e)} 
                    className="px-4 py-1.5 rounded-full text-[12px] bg-black text-white border-black transition-all active:scale-95"
                  >
                    确认收货
                  </button>
                </>
              ) : (
                order.actions.map((action: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={(e) => handleActionClick(action, order, e)} 
                    className={`px-4 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 ${
                      action === '确认收货' || action === '立即付款' || action === '评价'
                        ? 'bg-black text-white border-black' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {action}
                  </button>
                ))
              )}
            </div>
          </div>
        ))}
      </main>

      {showPayment && paymentOrder && (
        <PaymentDetails 
          amount={paymentOrder.total.toLocaleString()} 
          onClose={() => {
            setShowPayment(false);
            setPaymentOrder(null);
          }} 
          onConfirm={handlePaymentConfirm} 
        />
      )}

      {showCancelDialog && cancelOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelDialog(false)}></div>
          
          <div className="relative w-[85%] max-w-sm bg-white rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-orange-500 text-3xl">warning</span>
                </div>
                <h2 className="text-xl font-bold mb-2">确认取消订单？</h2>
                <p className="text-sm text-gray-500">订单取消后将无法恢复</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <img src={cancelOrder.items[0].img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{cancelOrder.items[0].title}</p>
                    <p className="text-xs text-gray-400 mt-1">订单号: {cancelOrder.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setOrders(prev => prev.map(o => 
                      o.id === cancelOrder.id 
                        ? { ...o, status: '已取消', statusText: '订单已取消', actions: [] } 
                        : o
                    ));
                    setShowCancelDialog(false);
                    setCancelOrder(null);
                  }}
                  className="w-full h-12 bg-black text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
                >
                  确认取消
                </button>
                <button
                  onClick={() => {
                    setShowCancelDialog(false);
                    setCancelOrder(null);
                  }}
                  className="w-full h-12 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                >
                  我再想想
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRemindDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRemindDialog(false)}></div>
          
          <div className="relative w-[85%] max-w-sm bg-white rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">notifications_active</span>
                </div>
                <h2 className="text-xl font-bold mb-2">提醒商家发货</h2>
                <p className="text-sm text-gray-500">我们将通知商家尽快为您发货</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="material-symbols-outlined text-blue-500">info</span>
                  <p>商家将在24小时内处理您的提醒</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowRemindDialog(false);
                    alert('已成功提醒商家发货');
                  }}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-bold active:scale-95 transition-transform shadow-lg"
                >
                  确认提醒
                </button>
                <button
                  onClick={() => setShowRemindDialog(false)}
                  className="w-full h-12 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCustomerService && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomerService(false)}></div>
          
          <div className="relative w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 p-6">
            <button 
              onClick={() => setShowCustomerService(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400">close</span>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl">support_agent</span>
              </div>
              <h2 className="text-xl font-bold mb-2">联系客服</h2>
              <p className="text-sm text-gray-500">我们随时为您服务</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => alert('正在连接在线客服...')}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
              >
                <span className="material-symbols-outlined text-2xl">chat</span>
                <span className="font-bold">在线客服</span>
              </button>

              <button 
                onClick={() => alert('客服电话：400-888-8888')}
                className="w-full h-14 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl text-gray-700">call</span>
                <span className="font-bold text-gray-700">电话客服</span>
              </button>

              <button 
                onClick={() => alert('微信客服：LUXE-Service')}
                className="w-full h-14 bg-green-500 text-white rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
              >
                <span className="text-2xl font-bold">微</span>
                <span className="font-bold">微信客服</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                <span className="font-bold">服务时间：</span>
                周一至周日 9:00-21:00
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
