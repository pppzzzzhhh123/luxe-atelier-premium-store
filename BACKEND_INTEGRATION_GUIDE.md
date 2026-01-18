# 后端对接指南

## 📋 目录
1. [API 服务层创建](#api-服务层创建)
2. [数据模型定义](#数据模型定义)
3. [接口对接步骤](#接口对接步骤)
4. [错误处理](#错误处理)
5. [测试建议](#测试建议)

---

## 1. API 服务层创建

### 创建 `services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.api.interceptors.request.use(
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

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Token 过期或无效
              localStorage.removeItem('luxe-token');
              localStorage.removeItem('luxe-user');
              window.location.href = '/';
              break;
            case 403:
              console.error('没有权限访问');
              break;
            case 404:
              console.error('请求的资源不存在');
              break;
            case 500:
              console.error('服务器错误');
              break;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.api.request(config);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(url, config);
  }
}

export default new ApiService();
```

### 创建具体业务 API `services/`

#### `services/authService.ts`
```typescript
import api from './api';
import { UserInfo } from '../types';

export const authService = {
  // 发送验证码
  sendCode: (phone: string) => {
    return api.post('/auth/send-code', { phone });
  },

  // 登录
  login: (phone: string, code: string) => {
    return api.post<{ data: UserInfo }>('/auth/login', { phone, code });
  },

  // 注册
  register: (phone: string, code: string, password: string) => {
    return api.post<{ data: UserInfo }>('/auth/register', { phone, code, password });
  },

  // 退出登录
  logout: () => {
    return api.post('/auth/logout');
  },
};
```

#### `services/productService.ts`
```typescript
import api from './api';
import { Product } from '../types';

export const productService = {
  // 获取商品列表
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    priceMin?: number;
    priceMax?: number;
  }) => {
    return api.get<{ data: { products: Product[]; total: number } }>('/products', { params });
  },

  // 获取商品详情
  getProductById: (id: number | string) => {
    return api.get<{ data: Product }>(`/products/${id}`);
  },

  // 搜索商品
  searchProducts: (keyword: string) => {
    return api.get<{ data: Product[] }>('/products/search', { params: { keyword } });
  },
};
```

#### `services/cartService.ts`
```typescript
import api from './api';
import { CartItem } from '../types';

export const cartService = {
  // 获取购物车
  getCart: () => {
    return api.get<{ data: CartItem[] }>('/cart');
  },

  // 添加到购物车
  addToCart: (productId: number, spec: string, quantity: number) => {
    return api.post('/cart/add', { productId, spec, quantity });
  },

  // 更新购物车
  updateCart: (itemId: number, quantity: number) => {
    return api.put('/cart/update', { itemId, quantity });
  },

  // 删除购物车商品
  removeFromCart: (itemId: number) => {
    return api.delete(`/cart/remove/${itemId}`);
  },

  // 清空购物车
  clearCart: () => {
    return api.delete('/cart/clear');
  },
};
```

#### `services/orderService.ts`
```typescript
import api from './api';
import { Order } from '../types';

export const orderService = {
  // 获取订单列表
  getOrders: (params?: { status?: string; page?: number }) => {
    return api.get<{ data: { orders: Order[]; total: number } }>('/orders', { params });
  },

  // 获取订单详情
  getOrderById: (id: string) => {
    return api.get<{ data: Order }>(`/orders/${id}`);
  },

  // 创建订单
  createOrder: (data: {
    products: { productId: number; spec: string; quantity: number }[];
    addressId: number;
    total: number;
  }) => {
    return api.post<{ data: { orderId: string } }>('/orders/create', data);
  },

  // 支付订单
  payOrder: (orderId: string) => {
    return api.post<{ data: { paymentUrl: string } }>(`/orders/${orderId}/pay`);
  },

  // 取消订单
  cancelOrder: (orderId: string) => {
    return api.post(`/orders/${orderId}/cancel`);
  },

  // 确认收货
  confirmOrder: (orderId: string) => {
    return api.post(`/orders/${orderId}/confirm`);
  },
};
```

#### `services/userService.ts`
```typescript
import api from './api';
import { Address } from '../types';

export const userService = {
  // 获取用户信息
  getProfile: () => {
    return api.get('/user/profile');
  },

  // 更新用户信息
  updateProfile: (data: { name?: string; avatar?: string }) => {
    return api.put('/user/profile', data);
  },

  // 获取地址列表
  getAddresses: () => {
    return api.get<{ data: Address[] }>('/user/addresses');
  },

  // 添加地址
  addAddress: (address: Omit<Address, 'id'>) => {
    return api.post<{ data: { id: number } }>('/user/addresses', address);
  },

  // 更新地址
  updateAddress: (id: number, address: Partial<Address>) => {
    return api.put(`/user/addresses/${id}`, address);
  },

  // 删除地址
  deleteAddress: (id: number) => {
    return api.delete(`/user/addresses/${id}`);
  },

  // 设置默认地址
  setDefaultAddress: (id: number) => {
    return api.post(`/user/addresses/${id}/default`);
  },
};
```

---

## 2. 数据模型定义

### 更新 `types.ts` 添加 API 响应类型

```typescript
// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 用户信息
export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  token: string;
  balance?: number;
  points?: number;
}

// 商品详情（扩展）
export interface ProductDetail extends Product {
  description: string;
  specs: string[];
  stock: number;
  sales: number;
  images: string[];
  details: string;
}
```

---

## 3. 接口对接步骤

### Step 1: 安装依赖
```bash
npm install axios
npm install --save-dev @types/axios
```

### Step 2: 配置环境变量
创建 `.env.development`:
```
REACT_APP_API_URL=http://localhost:3000/api
```

创建 `.env.production`:
```
REACT_APP_API_URL=https://api.luxe.com/api
```

### Step 3: 替换组件中的模拟数据

#### 示例：Auth.tsx
```typescript
// 修改前
const handleLogin = async () => {
  setTimeout(() => {
    const user = { id: '1', name: 'LUXE用户', ... };
    onSuccess(user);
  }, 1500);
};

// 修改后
import { authService } from '../services/authService';

const handleLogin = async () => {
  try {
    setLoading(true);
    const response = await authService.login(phone, code);
    
    // 保存用户信息
    localStorage.setItem('luxe-user', JSON.stringify(response.data));
    localStorage.setItem('luxe-token', response.data.token);
    
    onSuccess(response.data);
  } catch (error) {
    setError('登录失败，请重试');
  } finally {
    setLoading(false);
  }
};
```

#### 示例：Home.tsx
```typescript
// 修改前
const products = [
  { id: 1, title: '商品1', ... },
  // ...
];

// 修改后
import { productService } from '../services/productService';

const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ limit: 10 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  loadProducts();
}, []);
```

---

## 4. 错误处理

### 创建 `utils/errorHandler.ts`

```typescript
export const handleApiError = (error: any): string => {
  if (error.response) {
    // 服务器返回错误
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || '请求参数错误';
      case 401:
        return '请先登录';
      case 403:
        return '没有权限访问';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return data.message || '请求失败';
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return '网络连接失败，请检查网络';
  } else {
    // 其他错误
    return error.message || '未知错误';
  }
};
```

### 使用示例

```typescript
try {
  await authService.login(phone, code);
} catch (error) {
  const errorMessage = handleApiError(error);
  setError(errorMessage);
}
```

---

## 5. 测试建议

### 单元测试示例

```typescript
// services/__tests__/authService.test.ts
import { authService } from '../authService';
import api from '../api';

jest.mock('../api');

describe('authService', () => {
  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', token: 'token123' };
    (api.post as jest.Mock).mockResolvedValue({ data: mockUser });

    const result = await authService.login('13800138000', '123456');
    
    expect(result.data).toEqual(mockUser);
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      phone: '13800138000',
      code: '123456',
    });
  });
});
```

### 集成测试建议

1. 使用 Mock Service Worker (MSW) 模拟 API
2. 测试完整的用户流程
3. 测试错误处理逻辑
4. 测试边界情况

---

## 📝 对接检查清单

- [ ] API 服务层创建完成
- [ ] 所有业务 API 封装完成
- [ ] 环境变量配置完成
- [ ] 错误处理机制完善
- [ ] 所有组件替换为真实 API
- [ ] 加载状态添加完成
- [ ] 错误提示添加完成
- [ ] Token 刷新机制实现
- [ ] 请求重试机制实现
- [ ] 单元测试编写完成
- [ ] 集成测试编写完成
- [ ] API 文档对接确认

---

## 🚀 快速开始

1. 创建 `services` 目录
2. 复制上述代码到对应文件
3. 安装依赖：`npm install axios`
4. 配置环境变量
5. 逐个组件替换模拟数据
6. 测试功能是否正常

---

**最后更新**: 2026-01-16
