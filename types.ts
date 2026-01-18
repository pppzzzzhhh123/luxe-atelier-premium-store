// 类型定义文件

export interface Product {
  id: number | string;
  title: string;
  price: number;
  originalPrice?: number;
  img: string;
  spec?: string;
  count?: number;
  category?: string;
  description?: string;
}

export interface OrderItem {
  title: string;
  spec: string;
  price: number;
  count: number;
  img: string;
}

export interface Order {
  id: string;
  shop: string;
  status: '待付款' | '待发货' | '待收货' | '待评价' | '交易成功' | '已取消';
  statusText: string;
  items: OrderItem[];
  total: number;
  actions: string[];
  createdAt?: number;
  paymentDeadline?: number;
  hasAfterSales?: boolean;
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  detail: string;
  isDefault: boolean;
  tag: string;
}

export interface CartItem {
  id: number;
  title: string;
  spec: string;
  price: number;
  expectedPrice?: number;
  tags: string[];
  statusText?: string;
  img: string;
  count: number;
}

export interface Coupon {
  id: number;
  title: string;
  amount: number;
  desc: string;
}

export type View = 
  | 'home' 
  | 'product' 
  | 'pointsProduct'
  | 'discovery' 
  | 'discoveryEditor' 
  | 'postDetail'
  | 'cart' 
  | 'profile' 
  | 'category' 
  | 'categoryDetail'
  | 'productList' 
  | 'checkout' 
  | 'addressManagement' 
  | 'addAddress' 
  | 'orderList'
  | 'orderDetail'
  | 'review'
  | 'afterSales'
  | 'membershipApplication'
  | 'personalInfo' 
  | 'accountSecurity' 
  | 'wallet' 
  | 'coupons' 
  | 'cards' 
  | 'refundList' 
  | 'pointsCenter' 
  | 'pointsCheckout'
  | 'pointsDetail' 
  | 'pointsRecords'
  | 'inviteReward';

export type NavigateHandler = (view: View, data?: any) => void;

