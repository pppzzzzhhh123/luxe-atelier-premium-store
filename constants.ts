// 应用配置
export const APP_CONFIG = {
  name: 'LUÒJIAWANG璐珈女装',
  version: '1.0.0',
  description: '高端时尚女装品牌',
  maxCartItems: 99,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  defaultPageSize: 20,
};

// API 配置
export const API_CONFIG = {
  baseURL: process.env.VITE_API_BASE_URL || 'https://api.luxe-atelier.com',
  timeout: 30000,
  retryTimes: 3,
};

// 本地存储键名
export const STORAGE_KEYS = {
  cart: 'luxe-cart',
  user: 'luxe-user',
  token: 'luxe-token',
  addresses: 'luxe-addresses',
  recentViews: 'luxe-recent-views',
  searchHistory: 'luxe-search-history',
};

// 路由配置
export const ROUTES = {
  home: 'home',
  category: 'category',
  discovery: 'discovery',
  cart: 'cart',
  profile: 'profile',
  product: 'product',
  checkout: 'checkout',
  orderList: 'orderList',
  addressManagement: 'addressManagement',
} as const;

// 订单状态
export const ORDER_STATUS = {
  PENDING_PAYMENT: '待付款',
  PENDING_SHIPMENT: '待发货',
  PENDING_RECEIPT: '待收货',
  PENDING_REVIEW: '待评价',
  COMPLETED: '交易成功',
  CANCELLED: '已取消',
} as const;

// 支付方式
export const PAYMENT_METHODS = [
  { id: 'wechat', name: '微信支付', icon: 'wechat' },
  { id: 'alipay', name: '支付宝', icon: 'alipay' },
  { id: 'unionpay', name: '银联支付', icon: 'credit_card' },
  { id: 'balance', name: '余额支付', icon: 'account_balance_wallet' },
];

// 商品分类
export const PRODUCT_CATEGORIES = [
  { id: 'tops', name: '上装', nameEn: 'Tops' },
  { id: 'bottoms', name: '下装', nameEn: 'Bottoms' },
  { id: 'dresses', name: '连衣裙', nameEn: 'Dresses' },
  { id: 'accessories', name: '配饰', nameEn: 'Accessories' },
];

// 尺码表
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// 颜色选项
export const COLORS = [
  { id: 'black', name: '经典黑', hex: '#000000' },
  { id: 'white', name: '纯白色', hex: '#FFFFFF' },
  { id: 'beige', name: '米咖色', hex: '#D4B87D' },
  { id: 'gray', name: '高级灰', hex: '#808080' },
  { id: 'navy', name: '藏青色', hex: '#000080' },
];

// 会员等级
export const MEMBER_LEVELS = [
  { level: 1, name: '普通会员', discount: 1.0, minPoints: 0 },
  { level: 2, name: '银卡会员', discount: 0.95, minPoints: 1000 },
  { level: 3, name: '金卡会员', discount: 0.92, minPoints: 5000 },
  { level: 4, name: 'VIP会员', discount: 0.90, minPoints: 10000 },
];

// 物流公司
export const LOGISTICS_COMPANIES = [
  { id: 'sf', name: '顺丰速运' },
  { id: 'sto', name: '申通快递' },
  { id: 'yt', name: '圆通速递' },
  { id: 'yd', name: '韵达快递' },
  { id: 'ems', name: 'EMS' },
];

// 退款原因
export const REFUND_REASONS = [
  '不想要了',
  '尺码不合适',
  '颜色不喜欢',
  '质量问题',
  '发错货',
  '物流太慢',
  '其他原因',
];

// 评价标签
export const REVIEW_TAGS = [
  '质量很好',
  '面料舒适',
  '做工精致',
  '版型好看',
  '颜色正',
  '物流快',
  '包装精美',
  '性价比高',
];

// 正则表达式
export const REGEX = {
  phone: /^1[3-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  url: /^https?:\/\/.+/,
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器错误，请稍后重试',
  NOT_FOUND: '请求的资源不存在',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '没有权限访问',
  VALIDATION_ERROR: '数据验证失败',
  UNKNOWN_ERROR: '未知错误，请联系客服',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  ADD_TO_CART: '已加入购物袋',
  REMOVE_FROM_CART: '已从购物袋移除',
  ORDER_CREATED: '订单创建成功',
  PAYMENT_SUCCESS: '支付成功',
  ADDRESS_SAVED: '地址保存成功',
  REVIEW_SUBMITTED: '评价提交成功',
  COPY_SUCCESS: '复制成功',
};

// 动画配置
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// 断点配置
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// 主题色
export const THEME_COLORS = {
  primary: '#1a1a1a',
  primaryLight: '#2d2d2d',
  accent: '#C5A059',
  accentLight: '#D4B87D',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};
