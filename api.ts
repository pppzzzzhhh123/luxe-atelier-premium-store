// API 服务层 - 统一管理所有 API 请求

import { Product, Order, Address, CartItem } from './types';

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.luxe-atelier.com';
const API_TIMEOUT = 30000;

// 请求拦截器
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('luxe-token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时');
        }
        throw error;
      }
      throw new Error('未知错误');
    }
  }

  // GET 请求
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiService(API_BASE_URL, API_TIMEOUT);

// ==================== 用户相关 API ====================

export const authAPI = {
  // 发送验证码
  sendCode: async (phone: string) => {
    // 模拟 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: '验证码已发送' });
      }, 1000);
    });
  },

  // 登录
  login: async (phone: string, code: string) => {
    // 模拟 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: `user_${Date.now()}`,
            name: 'LUXE用户',
            phone,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw',
            token: `token_${Date.now()}`,
          },
        });
      }, 1500);
    });
  },

  // 注册
  register: async (phone: string, code: string, password: string) => {
    // 模拟 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: `user_${Date.now()}`,
            name: 'LUXE用户',
            phone,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw',
            token: `token_${Date.now()}`,
          },
        });
      }, 1500);
    });
  },

  // 获取用户信息
  getUserInfo: async () => {
    // 实际项目中应该调用真实 API
    // return api.get('/user/info');
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('luxe-user');
        resolve(saved ? JSON.parse(saved) : null);
      }, 500);
    });
  },

  // 退出登录
  logout: async () => {
    localStorage.removeItem('luxe-user');
    localStorage.removeItem('luxe-token');
    return { success: true };
  },
};

// ==================== 商品相关 API ====================

export const productAPI = {
  // 获取商品列表
  getProducts: async (params?: {
    category?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
  }) => {
    // 实际项目中应该调用真实 API
    // return api.get(`/products?${new URLSearchParams(params)}`);
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, title: '100%绵羊毛费尔岛提花针织衫', price: 350.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9' },
          { id: 2, title: '100%山羊绒圆领针织衫', price: 850.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV' },
        ]);
      }, 500);
    });
  },

  // 获取商品详情
  getProductDetail: async (id: string | number) => {
    // 实际项目中应该调用真实 API
    // return api.get(`/products/${id}`);
    return new Promise<Product>((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          title: '100%绵羊毛费尔岛提花针织衫',
          price: 350.00,
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9',
          description: '这款单品选用意大利进口优质羊绒面料，触感如云朵般细腻柔软。',
        });
      }, 500);
    });
  },

  // 搜索商品
  searchProducts: async (keyword: string) => {
    // 实际项目中应该调用真实 API
    // return api.get(`/products/search?keyword=${keyword}`);
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  },
};

// ==================== 订单相关 API ====================

export const orderAPI = {
  // 创建订单
  createOrder: async (orderData: {
    products: Product[];
    addressId: number;
    total: number;
  }) => {
    // 实际项目中应该调用真实 API
    // return api.post('/orders', orderData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            orderId: `E${Date.now()}`,
            orderNo: `ORDER${Date.now()}`,
          },
        });
      }, 1000);
    });
  },

  // 获取订单列表
  getOrders: async (status?: string) => {
    // 实际项目中应该调用真实 API
    // return api.get(`/orders?status=${status}`);
    return new Promise<Order[]>((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  },

  // 获取订单详情
  getOrderDetail: async (orderId: string) => {
    // 实际项目中应该调用真实 API
    // return api.get(`/orders/${orderId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, 500);
    });
  },

  // 取消订单
  cancelOrder: async (orderId: string) => {
    // 实际项目中应该调用真实 API
    // return api.post(`/orders/${orderId}/cancel`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
};

// ==================== 地址相关 API ====================

export const addressAPI = {
  // 获取地址列表
  getAddresses: async () => {
    // 实际项目中应该调用真实 API
    // return api.get('/addresses');
    return new Promise<Address[]>((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('luxe-addresses');
        resolve(saved ? JSON.parse(saved) : []);
      }, 500);
    });
  },

  // 添加地址
  addAddress: async (address: Omit<Address, 'id'>) => {
    // 实际项目中应该调用真实 API
    // return api.post('/addresses', address);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: { id: Date.now() } });
      }, 500);
    });
  },

  // 更新地址
  updateAddress: async (id: number, address: Partial<Address>) => {
    // 实际项目中应该调用真实 API
    // return api.put(`/addresses/${id}`, address);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },

  // 删除地址
  deleteAddress: async (id: number) => {
    // 实际项目中应该调用真实 API
    // return api.delete(`/addresses/${id}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
};

// ==================== 签到相关 API ====================

export const checkInAPI = {
  // 签到
  checkIn: async () => {
    // 实际项目中应该调用真实 API
    // return api.post('/checkin');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            points: 10,
            consecutiveDays: 1,
          },
        });
      }, 500);
    });
  },

  // 获取签到记录
  getCheckInRecords: async () => {
    // 实际项目中应该调用真实 API
    // return api.get('/checkin/records');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [],
        });
      }, 500);
    });
  },
};

export default api;
