
import React, { useState, useMemo } from 'react';
import PointsProductDetail from './components/PointsProductDetail';
import ProductDetail from './components/ProductDetail';
import Review from './components/Review';
import AfterSales from './components/AfterSales';
import MembershipApplication from './components/MembershipApplication';
import Home from './components/Home';
import Discovery from './components/Discovery';
import PostEditor from './components/PostEditor';
import PostDetail from './components/PostDetail';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Category from './components/Category';
import CategoryDetail from './components/CategoryDetail';
import ProductList from './components/ProductList';
import Checkout from './components/Checkout';
import AddressManagement from './components/AddressManagement';
import AddAddress from './components/AddAddress';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import PersonalInfo from './components/PersonalInfo';
import AccountSecurity from './components/AccountSecurity';
import Wallet from './components/Wallet';
import Coupons from './components/Coupons';
import Cards from './components/Cards';
import RefundList from './components/RefundList';
import PointsCenter from './components/PointsCenter';
import PointsCheckout from './components/PointsCheckout';
import PointsDetail from './components/PointsDetail';
import PointsRecords from './components/PointsRecords';
import CheckIn from './components/CheckIn';
import MemberCard from './components/MemberCard';
import Search from './components/Search';
import Menu from './components/Menu';
import Auth from './components/Auth';
import InviteReward from './components/InviteReward';
import { Product, Order, Address, CartItem, View, NavigateHandler } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewHistory, setViewHistory] = useState<View[]>(['home']);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPointsProduct, setSelectedPointsProduct] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [afterSalesOrder, setAfterSalesOrder] = useState<Order | null>(null);
  const [selectedPointsItem, setSelectedPointsItem] = useState<any>(null);
  const [checkoutProducts, setCheckoutProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<{ categoryName: string; categoryId: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  const [userPoints, setUserPoints] = useState(2480);
  const [balance, setBalance] = useState(1280.50);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('游客');
  
  // 兑换记录和优惠券状态
  const [exchangeRecords, setExchangeRecords] = useState<any[]>([]);
  const [userCoupons, setUserCoupons] = useState<any[]>([
    { id: 1, amount: '50', title: '无门槛代金券', sub: '全场商品通用', expiry: '2026.02.28 到期', status: 'unused' },
    { id: 2, amount: '200', title: '满1000减200', sub: '仅限成衣系列可用', expiry: '2026.03.15 到期', status: 'unused' },
    { id: 3, amount: '免运费', title: '顺丰速运券', sub: '单笔订单最高抵扣20元', expiry: '永久有效', status: 'unused' },
  ]);
  
  // 新增状态
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showMemberCard, setShowMemberCard] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [orderListTab, setOrderListTab] = useState(0);
  
  // 从 localStorage 加载购物车数据
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('luxe-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 保存购物车数据到 localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('luxe-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }, [cartItems]);
  
  // Dynamic Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'E20260117001',
      shop: 'LUOJIAWANG璐珈女装',
      status: '待收货',
      statusText: '商家已发货',
      items: [
        {
          title: '雕塑感剪裁大衣 意大利羊毛面料',
          spec: '经典黑; M',
          price: 5850.00,
          count: 1,
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9'
        }
      ],
      total: 5850.00,
      actions: ['查看物流', '确认收货', '联系客服']
    },
    {
      id: 'E20260116004',
      shop: 'LUOJIAWANG璐珈女装',
      status: '待评价',
      statusText: '交易成功',
      items: [
        {
          title: '廓形羊绒针织衫 意大利进口原料 亲肤软糯',
          spec: '奶白色; S',
          price: 2325.00,
          count: 1,
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQIv_L4pQkIHnjKOrIO7GxaQm8NB0_2l1MsAZ4LqF7wxJPhCJ1Jy0VhGa_7TkEARqkPHWF3vQRAr0Kg741FhS9bo23IbcSqZ_Mjt2Ilkra9lox2owV1bfEqwadc181BnJG6fXKu9-7x_ZpbQX__5J6C4cDm1erT75JDhdPWUUV55qHB-flD3O8SRwl3FWDZL6Cy8ufNIafHZxq11A5WKnOkSpb7FmQ85ATxyAIxrwiisdfSa5A5KGLjSq-yJNL679W6Tu_4xW0oj4w'
        }
      ],
      total: 2325.00,
      actions: ['申请售后', '再次购买', '评价']
    }
  ]);

  // 计算各状态订单数量
  const orderCounts = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === '待付款').length,
      toShip: orders.filter(o => o.status === '待发货').length,
      shipping: orders.filter(o => o.status === '待收货').length,
      toReview: orders.filter(o => o.status === '待评价').length,
    };
  }, [orders]);

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, name: '王先生', phone: '138****8888', province: '北京市', city: '朝阳区', detail: '建国路 SOHO现代城 C座 1801', isDefault: true, tag: '家' },
  ]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const cartTotalCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.count, 0), [cartItems]);
  const showGlobalNav = ['home', 'category', 'discovery', 'profile'].includes(currentView);

  const showFeedback = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(prevView);
    } else {
      handleNavigate('home');
    }
  };

  const handleNavigate: NavigateHandler = (v: View, data?: any) => {
    if (v === 'product' && data) setSelectedProduct(data as Product);
    if (v === 'pointsProduct' && data) setSelectedPointsProduct(data);
    if (v === 'postDetail' && data) setSelectedPost(data);
    if (v === 'orderDetail' && data) setSelectedOrder(data as Order);
    if (v === 'review' && data) setReviewOrder(data as Order);
    if (v === 'afterSales' && data) setAfterSalesOrder(data as Order);
    if (v === 'pointsCheckout' && data) setSelectedPointsItem(data);
    if (v === 'checkout' && data) {
      setCheckoutProducts(Array.isArray(data) ? data : [data]);
    }
    if (v === 'categoryDetail' && data) {
      setCategoryData(data);
    }
    
    const mainViews: View[] = ['home', 'category', 'discovery', 'profile'];
    if (mainViews.includes(v)) {
      setViewHistory([v]);
    } else {
      if (currentView !== v) {
        setViewHistory(prev => [...prev, v]);
      }
    }
    setCurrentView(v);
  };

  const handleAddToCart = (product: Product, spec: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.title === product.title && item.spec === spec);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], count: next[existingIndex].count + quantity };
        return next;
      }
      return [...prev, { 
        id: Date.now(),
        title: product.title,
        spec, 
        count: quantity,
        price: product.price,
        img: product.img,
        tags: [],
      }];
    });
    showFeedback('已加入购物袋');
  };

  const handleCreateOrder = (orderData: { products: Product[]; total: number; address?: Address; paid: boolean }) => {
    const orderId = `E${Date.now()}`;
    const newOrder = {
      id: orderId,
      shop: 'LUOJIAWANG璐珈女装',
      status: orderData.paid ? '待发货' as const : '待付款' as const,
      statusText: orderData.paid ? '买家已付款，等待发货' : '等待买家付款',
      items: orderData.products.map((p) => ({
        title: p.title,
        spec: p.spec || '',
        price: p.price,
        count: p.count || 1,
        img: p.img
      })),
      total: orderData.total,
      actions: orderData.paid ? ['修改地址', '提醒发货'] : ['立即付款', '取消订单'],
      createdAt: Date.now(),
      paymentDeadline: orderData.paid ? undefined : Date.now() + 60 * 60 * 1000 // 1小时后
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    if (orderData.paid) {
      // 支付成功，清空购物车
      const checkoutIds = new Set(orderData.products.map((p) => p.id));
      setCartItems(prev => prev.filter(item => !checkoutIds.has(item.id)));
      showFeedback('支付成功');
      handleNavigate('orderList');
    } else {
      // 支付失败/取消，跳转到待付款tab
      setOrderListTab(1);
      handleNavigate('orderList');
      showFeedback('订单已提交，请在1小时内完成支付');
    }
  };

  // 签到处理
  const handleCheckIn = (points: number) => {
    setUserPoints(prev => prev + points);
    showFeedback(`签到成功，获得 ${points} 积分`);
    setShowCheckIn(false);
  };

  // 登录成功处理
  const handleAuthSuccess = (user: any) => {
    setIsLoggedIn(true);
    setUserName(user.name || 'LUXE用户');
    setShowAuth(false);
    
    // 检查是否使用了邀请码
    const inviteCodeUsed = localStorage.getItem('luxe-invite-code-used');
    if (inviteCodeUsed) {
      // 发放2张10元优惠券
      const newCoupons = [
        {
          id: Date.now(),
          amount: '10',
          title: '新人专享券',
          sub: '满200可用',
          expiry: '30天后到期',
          status: 'unused',
          source: 'invite'
        },
        {
          id: Date.now() + 1,
          amount: '10',
          title: '新人专享券',
          sub: '满200可用',
          expiry: '30天后到期',
          status: 'unused',
          source: 'invite'
        }
      ];
      setUserCoupons([...newCoupons, ...userCoupons]);
    }
    
    showFeedback('登录成功');
    
    // 不刷新页面，直接更新状态
    // 如果在个人中心页面，强制重新渲染
    if (currentView === 'profile') {
      const tempView = currentView;
      setCurrentView('home');
      setTimeout(() => setCurrentView(tempView), 0);
    }
  };

  // 退出登录处理
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('游客');
    showFeedback('已退出登录');
    // 强制刷新 Profile 组件
    if (currentView === 'profile') {
      setCurrentView('home');
      setTimeout(() => setCurrentView('profile'), 0);
    }
  };

  // 更新订单
  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
  };

  // 积分兑换完成
  const handleExchangeComplete = (pointsUsed: number, item: any) => {
    setUserPoints(prev => prev - pointsUsed);
    
    // 添加兑换记录
    const newRecord = {
      id: Date.now(),
      title: item.title,
      points: item.points,
      img: item.img,
      time: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      status: item.type === 'coupon' ? '已发放' : '待发货',
      type: item.type,
    };
    setExchangeRecords(prev => [newRecord, ...prev]);
    
    // 如果是优惠券，添加到用户优惠券列表
    if (item.type === 'coupon') {
      const newCoupon = {
        id: Date.now(),
        amount: item.title.includes('50元') ? '50' : item.title.includes('免邮') ? '免运费' : '100',
        title: item.title,
        sub: item.desc || '积分兑换所得',
        expiry: item.expiry || '兑换后30天有效',
        status: 'unused',
        source: 'points',
      };
      setUserCoupons(prev => [newCoupon, ...prev]);
    }
    
    showFeedback(`成功兑换，消耗 ${pointsUsed} 积分`);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onNavigate={handleNavigate} onSearch={() => setShowSearch(true)} onMenu={() => setShowMenu(true)} />;
      case 'category': return <Category onNavigate={handleNavigate} />;
      case 'categoryDetail': return categoryData ? <CategoryDetail onBack={goBack} onNavigate={handleNavigate} categoryName={categoryData.categoryName} categoryId={categoryData.categoryId} /> : <Category onNavigate={handleNavigate} />;
      case 'discovery': return <Discovery onNavigate={handleNavigate} />;
      case 'discoveryEditor': return <PostEditor onBack={goBack} showFeedback={showFeedback} />;
      case 'postDetail': return selectedPost ? <PostDetail onBack={goBack} onNavigate={handleNavigate} post={selectedPost} /> : <Discovery onNavigate={handleNavigate} />;
      case 'productList': return <ProductList onBack={goBack} onNavigate={handleNavigate} />;
      case 'product': return <ProductDetail product={selectedProduct} onBack={goBack} onNavigate={handleNavigate} onAddToCart={handleAddToCart} cartCount={cartTotalCount} showFeedback={showFeedback} />;
      case 'pointsProduct': return <PointsProductDetail product={selectedPointsProduct} onBack={goBack} onNavigate={handleNavigate} userPoints={userPoints} showFeedback={showFeedback} />;
      case 'cart': return <Cart items={cartItems} setItems={setCartItems} onBack={goBack} onNavigate={handleNavigate} />;
      case 'profile': return <Profile onNavigate={handleNavigate} userPoints={userPoints} balance={balance} couponCount={3} cardCount={1} onNavigateToOrders={(tabIndex) => { setOrderListTab(tabIndex); handleNavigate('orderList'); }} onNavigateToRefunds={() => handleNavigate('refundList')} cartCount={cartTotalCount} onCheckIn={() => setShowCheckIn(true)} onShowMemberCard={() => setShowMemberCard(true)} onLogout={handleLogout} onShowAuth={() => setShowAuth(true)} orderCounts={orderCounts} />;
      case 'checkout': return <Checkout onBack={goBack} onNavigate={handleNavigate} selectedProducts={checkoutProducts} addresses={addresses} onPaymentComplete={handleCreateOrder} />;
      case 'orderList': return <OrderList onBack={goBack} onNavigate={handleNavigate} initialOrders={orders} setOrders={setOrders} initialTab={orderListTab} />;
      case 'orderDetail': return selectedOrder ? <OrderDetail onBack={goBack} onNavigate={handleNavigate} order={selectedOrder} onUpdateOrder={handleUpdateOrder} showFeedback={showFeedback} /> : <OrderList onBack={goBack} onNavigate={handleNavigate} initialOrders={orders} setOrders={setOrders} initialTab={orderListTab} />;
      case 'review': return <Review onBack={goBack} order={reviewOrder} showFeedback={showFeedback} />;
      case 'afterSales': return afterSalesOrder ? <AfterSales onBack={goBack} order={afterSalesOrder} showFeedback={showFeedback} /> : <OrderList onBack={goBack} onNavigate={handleNavigate} initialOrders={orders} setOrders={setOrders} initialTab={orderListTab} />;
      case 'membershipApplication': return <MembershipApplication onBack={goBack} showFeedback={showFeedback} />;
      case 'wallet': return <Wallet balance={balance} onBack={goBack} showFeedback={showFeedback} onBalanceChange={setBalance} />;
      case 'addressManagement': return <AddressManagement onBack={goBack} addresses={addresses} setAddresses={setAddresses} onEdit={(addr) => { setEditingAddress(addr); handleNavigate('addAddress'); }} onAdd={() => { setEditingAddress(null); handleNavigate('addAddress'); }} />;
      case 'addAddress': return <AddAddress onBack={goBack} initialData={editingAddress} onSave={(addr) => { setAddresses(prev => addr.id ? prev.map(a => a.id === addr.id ? addr : a) : [...prev, { ...addr, id: Date.now() }]); goBack(); }} showFeedback={showFeedback} />;
      case 'pointsCenter': return <PointsCenter points={userPoints} onBack={goBack} onNavigate={handleNavigate} />;
      case 'pointsCheckout': return selectedPointsItem ? <PointsCheckout onBack={goBack} onNavigate={handleNavigate} item={selectedPointsItem} userPoints={userPoints} addresses={addresses} onExchangeComplete={handleExchangeComplete} showFeedback={showFeedback} /> : <PointsCenter points={userPoints} onBack={goBack} onNavigate={handleNavigate} />;
      case 'refundList': return <RefundList onBack={goBack} onNavigate={handleNavigate} showFeedback={showFeedback} />;
      case 'personalInfo': return <PersonalInfo onBack={goBack} />;
      case 'accountSecurity': return <AccountSecurity onBack={goBack} />;
      case 'cards': return <Cards onBack={goBack} />;
      case 'coupons': return <Coupons onBack={goBack} onNavigate={handleNavigate} showFeedback={showFeedback} coupons={userCoupons} setCoupons={setUserCoupons} />;
      case 'pointsDetail': return <PointsDetail onBack={goBack} details={[]} />;
      case 'pointsRecords': return <PointsRecords onBack={goBack} records={exchangeRecords} />;
      case 'inviteReward': return <InviteReward 
        onBack={goBack} 
        showFeedback={showFeedback} 
        onAddCoupon={(coupon) => {
          setUserCoupons([coupon, ...userCoupons]);
          showFeedback('优惠券已添加到账户');
        }} 
        onUpdateBalance={(amount) => {
          setBalance(prev => prev + amount);
        }}
        onAddTransaction={(transaction) => {
          // 交易记录会在 Wallet 组件中自动添加，这里不需要额外处理
          // 因为 Wallet 组件会在下次打开时从 App 的 balance 同步
        }}
      />;
      default: return <Home onNavigate={handleNavigate} onSearch={() => setShowSearch(true)} onMenu={() => setShowMenu(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto shadow-2xl overflow-hidden relative font-sans">
      {renderView()}
      
      {/* Toast 提示 */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-black/80 backdrop-blur-md text-white px-8 py-3 rounded-full text-[12px] font-bold tracking-widest animate-in fade-in zoom-in duration-300">
          {toast}
        </div>
      )}
      
      {/* 全局导航 */}
      {showGlobalNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/95 backdrop-blur-xl border-t border-gray-100 flex justify-around py-3 z-[60]">
          <NavItem active={currentView === 'home'} icon="home" label="首页" onClick={() => handleNavigate('home')} />
          <NavItem active={currentView === 'category'} icon="grid_view" label="分类" onClick={() => handleNavigate('category')} />
          <NavItem active={currentView === 'discovery'} icon="explore" label="发现" onClick={() => handleNavigate('discovery')} />
          <NavItem active={currentView === 'profile'} icon="person" label="我的" onClick={() => handleNavigate('profile')} />
        </nav>
      )}
      
      {/* 弹窗组件 */}
      {showCheckIn && <CheckIn onClose={() => setShowCheckIn(false)} onCheckIn={handleCheckIn} />}
      {showMemberCard && <MemberCard onClose={() => setShowMemberCard(false)} userPoints={userPoints} />}
      {showSearch && <Search onClose={() => setShowSearch(false)} onNavigate={handleNavigate} />}
      {showMenu && <Menu onClose={() => setShowMenu(false)} onNavigate={handleNavigate} />}
      {showAuth && <Auth onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; icon: string; label: string; onClick: () => void; badge?: number }> = ({ active, icon, label, onClick, badge }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all active:scale-90 relative ${active ? 'text-primary' : 'text-gray-400'}`}>
    <div className="relative">
      <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "" }}>{icon}</span>
      {badge !== undefined && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold min-w-[12px] h-[12px] flex items-center justify-center rounded-full border border-white">{badge}</span>}
    </div>
    <span className="text-[10px] font-bold uppercase">{label}</span>
  </button>
);

export default App;
