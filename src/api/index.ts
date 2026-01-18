// API 客户端配置
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luxe-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // 401 未授权 - 清除 token 并跳转登录
      if (status === 401) {
        localStorage.removeItem('luxe-token');
        localStorage.removeItem('luxe-user');
        window.location.href = '/';
      }
      
      // 返回错误信息
      return Promise.reject(data.message || '请求失败');
    }
    
    return Promise.reject('网络错误，请稍后重试');
  }
);

// ============================================
// 认证相关 API
// ============================================

export const authAPI = {
  // 发送验证码
  sendCode: (phone: string) => {
    return apiClient.post('/auth/send-code', { phone });
  },

  // 注册
  register: (data: { phone: string; code: string; password: string; inviteCode?: string }) => {
    return apiClient.post('/auth/register', data);
  },

  // 登录
  login: (data: { phone: string; password?: string; code?: string; loginMethod: 'code' | 'password' }) => {
    return apiClient.post('/auth/login', data);
  },

  // 验证邀请码
  validateInviteCode: (inviteCode: string) => {
    return apiClient.post('/auth/validate-invite-code', { inviteCode });
  }
};

// ============================================
// 用户相关 API
// ============================================

export const userAPI = {
  // 获取用户信息
  getProfile: () => {
    return apiClient.get('/users/me');
  },

  // 更新用户信息
  updateProfile: (data: any) => {
    return apiClient.put('/users/me', data);
  },

  // 修改密码
  changePassword: (oldPassword: string, newPassword: string) => {
    return apiClient.post('/users/change-password', { oldPassword, newPassword });
  }
};

// ============================================
// 商品相关 API
// ============================================

export const productAPI = {
  // 获取商品列表
  getProducts: (params?: any) => {
    return apiClient.get('/products', { params });
  },

  // 获取商品详情
  getProductDetail: (id: string) => {
    return apiClient.get(`/products/${id}`);
  },

  // 获取分类列表
  getCategories: () => {
    return apiClient.get('/products/categories/list');
  }
};

// ============================================
// 购物车相关 API
// ============================================

export const cartAPI = {
  // 获取购物车
  getCart: () => {
    return apiClient.get('/cart');
  },

  // 添加到购物车
  addToCart: (data: { productId: string; spec?: string; quantity: number }) => {
    return apiClient.post('/cart', data);
  },

  // 更新购物车商品数量
  updateCartItem: (id: string, quantity: number) => {
    return apiClient.put(`/cart/${id}`, { quantity });
  },

  // 删除购物车商品
  deleteCartItem: (id: string) => {
    return apiClient.delete(`/cart/${id}`);
  },

  // 清空购物车
  clearCart: () => {
    return apiClient.delete('/cart');
  }
};

// ============================================
// 地址相关 API
// ============================================

export const addressAPI = {
  // 获取地址列表
  getAddresses: () => {
    return apiClient.get('/addresses');
  },

  // 添加地址
  addAddress: (data: any) => {
    return apiClient.post('/addresses', data);
  },

  // 创建地址（别名，兼容性）
  createAddress: (data: any) => {
    return apiClient.post('/addresses', data);
  },

  // 更新地址
  updateAddress: (id: number, data: any) => {
    return apiClient.put(`/addresses/${id}`, data);
  },

  // 删除地址
  deleteAddress: (id: number) => {
    return apiClient.delete(`/addresses/${id}`);
  },

  // 设置默认地址
  setDefaultAddress: (id: number) => {
    return apiClient.post(`/addresses/${id}/default`);
  },

  // 设置默认地址（别名，兼容性）
  setDefault: (id: number) => {
    return apiClient.post(`/addresses/${id}/default`);
  }
};

// ============================================
// 订单相关 API
// ============================================

export const orderAPI = {
  // 创建订单
  createOrder: (data: any) => {
    return apiClient.post('/orders', data);
  },

  // 获取订单列表
  getOrders: (params?: any) => {
    return apiClient.get('/orders', { params });
  },

  // 获取订单详情
  getOrderDetail: (id: string) => {
    return apiClient.get(`/orders/${id}`);
  },

  // 取消订单
  cancelOrder: (id: string) => {
    return apiClient.post(`/orders/${id}/cancel`);
  },

  // 确认收货
  confirmOrder: (id: string) => {
    return apiClient.post(`/orders/${id}/confirm`);
  }
};

// ============================================
// 优惠券相关 API
// ============================================

export const couponAPI = {
  // 获取优惠券列表
  getCoupons: (status?: string) => {
    return apiClient.get('/coupons', { params: { status } });
  },

  // 兑换优惠券
  redeemCoupon: (code: string) => {
    return apiClient.post('/coupons/redeem', { code });
  }
};

// ============================================
// 积分相关 API
// ============================================

export const pointsAPI = {
  // 获取积分信息
  getPoints: () => {
    return apiClient.get('/points');
  },

  // 获取积分记录
  getPointsRecords: (params?: any) => {
    return apiClient.get('/points/records', { params });
  },

  // 签到
  checkIn: () => {
    return apiClient.post('/points/checkin');
  }
};

// ============================================
// 邀请返现相关 API
// ============================================

export const inviteAPI = {
  // 获取邀请信息
  getInviteInfo: () => {
    return apiClient.get('/invite/info');
  },

  // 获取邀请好友列表
  getInviteFriends: () => {
    return apiClient.get('/invite/friends');
  },

  // 获取返现记录
  getRewardRecords: () => {
    return apiClient.get('/invite/records');
  },

  // 提现到余额
  withdraw: (amount: number) => {
    return apiClient.post('/invite/withdraw', { amount });
  }
};

// ============================================
// 钱包相关 API
// ============================================

export const walletAPI = {
  // 获取钱包信息
  getWallet: () => {
    return apiClient.get('/wallet');
  },

  // 获取交易记录
  getTransactions: (params?: any) => {
    return apiClient.get('/wallet/transactions', { params });
  },

  // 充值
  recharge: (amount: number, paymentMethod: string) => {
    return apiClient.post('/wallet/recharge', { amount, paymentMethod });
  },

  // 提现
  withdraw: (amount: number, bankCardId: string) => {
    return apiClient.post('/wallet/withdraw', { amount, bankCardId });
  }
};

// ============================================
// 社区帖子相关 API
// ============================================

export const postAPI = {
  // 获取帖子列表
  getPosts: (params?: any) => {
    return apiClient.get('/posts', { params });
  },

  // 创建帖子
  createPost: (data: { content: string; images?: string[] }) => {
    return apiClient.post('/posts', data);
  }
};

// ============================================
// 评价相关 API
// ============================================

export const reviewAPI = {
  // 创建评价
  createReview: (data: any) => {
    return apiClient.post('/reviews', data);
  }
};

export default apiClient;
