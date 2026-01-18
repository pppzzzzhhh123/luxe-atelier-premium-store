# LUXE 璐珈女装 - 项目总览

## 项目简介
高端女装电商平台前端项目，采用 React + TypeScript + Tailwind CSS 开发，提供完整的购物体验。

## 技术栈
- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Material Symbols
- **构建工具**: Vite / Create React App

## 项目结构
```
luxe-atelier-premium-store/
├── components/              # 所有组件
│   ├── Home.tsx            # 首页（轮播图、畅销商品）
│   ├── Category.tsx        # 分类页
│   ├── ProductList.tsx     # 商品列表
│   ├── ProductDetail.tsx   # 商品详情（动态购买记录、推荐商品）
│   ├── Cart.tsx            # 购物车
│   ├── Checkout.tsx        # 结算页
│   ├── OrderList.tsx       # 订单列表（倒计时、自动取消）
│   ├── OrderDetail.tsx     # 订单详情
│   ├── Review.tsx          # 评价页
│   ├── AfterSales.tsx      # 售后申请
│   ├── Profile.tsx         # 个人中心
│   ├── Auth.tsx            # 登录注册（验证码/密码登录）
│   ├── MembershipApplication.tsx  # 会员申请
│   ├── PointsCenter.tsx    # 积分中心
│   ├── PointsProductDetail.tsx    # 积分商品详情
│   ├── PointsCheckout.tsx  # 积分结算
│   ├── Coupons.tsx         # 优惠券
│   ├── AddressManagement.tsx      # 地址管理
│   ├── Discovery.tsx       # 发现页
│   └── ...                 # 其他组件
├── types.ts                # TypeScript 类型定义
├── App.tsx                 # 主应用组件
├── BACKEND_API_GUIDE.md    # 后端API对接文档 ⭐
├── EIGHTH_ROUND_FIXES.md   # 第八轮修改文档
└── README.md               # 本文件
```

## 核心功能

### 1. 用户系统
- ✅ 验证码登录
- ✅ 密码登录
- ✅ 注册（设置密码）
- ✅ 会员申请系统
- ✅ 个人信息管理
- ✅ 签到功能

### 2. 商品浏览
- ✅ 首页轮播图（3图自动切换）
- ✅ 畅销商品（自动滚动）
- ✅ 分类浏览（男士/女士）
- ✅ 商品列表（性别筛选）
- ✅ 商品详情（动态购买记录）
- ✅ 推荐商品展示

### 3. 购物流程
- ✅ 加入购物车
- ✅ 购物车管理
- ✅ 结算页面
- ✅ 地址管理
- ✅ 优惠券使用
- ✅ 支付流程（微信/支付宝/余额）

### 4. 订单管理
- ✅ 订单列表（待付款/待发货/待收货/待评价）
- ✅ 订单详情
- ✅ 订单倒计时（1小时自动取消）
- ✅ 取消订单
- ✅ 确认收货
- ✅ 订单评价
- ✅ 售后申请

### 5. 积分系统
- ✅ 积分商城
- ✅ 积分兑换（优惠券/实物）
- ✅ 积分+现金混合支付
- ✅ 积分记录

### 6. 会员系统
- ✅ 会员申请表单
- ✅ 会员权益展示
- ✅ 会员中心

### 7. 社交功能
- ✅ 发现页（图文内容）
- ✅ 内容发布
- ✅ 点赞评论

## UI/UX 特色

### 设计风格
- 🎨 现代极简主义
- 🎨 黑白金配色
- 🎨 渐变效果
- 🎨 流畅动画

### 交互体验
- ⚡ 页面切换动画
- ⚡ 按钮点击反馈
- ⚡ 加载状态提示
- ⚡ 错误友好提示
- ⚡ 自动滚动效果
- ⚡ 倒计时功能

### 视觉优化
- 🎯 SVG 图标（微信/支付宝）
- 🎯 渐变背景
- 🎯 阴影效果
- 🎯 圆角设计
- 🎯 响应式布局

## 最近更新（第八轮）

### 1. 会员申请系统
- 创建完整的会员申请页面
- 包含个人信息、职业、收入、兴趣等字段
- 美观的会员权益展示
- 申请须知提示

### 2. 登录体验优化
- 修复关闭按钮点击无响应问题
- 添加密码登录选项
- 支持验证码/密码两种登录方式
- 改进事件处理和交互反馈

### 3. 图标美化
- 微信/支付宝图标从文字改为 SVG
- 添加渐变背景和阴影
- 更专业的视觉效果

### 4. 商品详情增强
- 购买记录改为动态滚动（每3秒自动滚动）
- 添加推荐商品栏（2列网格）
- 悬停放大效果
- 点击跳转到商品详情

### 5. 代码质量
- 完整的 TypeScript 类型定义
- 清晰的组件结构
- 统一的代码风格
- 良好的性能优化

## 开始使用

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 后端对接

### 📖 重要文档
请查看 **`BACKEND_API_GUIDE.md`** 获取完整的 API 接口文档，包括：
- 所有接口定义
- 请求/响应格式
- 认证方式
- 错误处理
- 分页参数
- 文件上传

### 🔧 对接步骤

#### 1. 安装依赖
```bash
npm install axios
```

#### 2. 创建 API 服务层
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// 添加请求拦截器（自动携带 token）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxe-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 添加响应拦截器（统一错误处理）
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('luxe-token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 3. 创建服务模块
```typescript
// services/auth.ts
import api from './api';

export const authService = {
  sendCode: (phone: string) => 
    api.post('/auth/send-code', { phone }),
  
  login: (phone: string, code: string) => 
    api.post('/auth/login', { phone, code }),
  
  register: (data: any) => 
    api.post('/auth/register', data),
};
```

#### 4. 替换模拟数据
将组件中的 `localStorage` 和 `setTimeout` 替换为真实 API 调用。

#### 5. 配置环境变量
```bash
# .env.development
REACT_APP_API_URL=http://localhost:3000/api

# .env.production
REACT_APP_API_URL=https://api.luxe.com/api
```

## 需要对接的主要模块

### 优先级 P0（核心功能）
- [ ] 用户认证（登录/注册）
- [ ] 商品列表和详情
- [ ] 购物车
- [ ] 订单创建和支付
- [ ] 地址管理

### 优先级 P1（重要功能）
- [ ] 订单管理（列表/详情/取消）
- [ ] 订单倒计时和自动取消
- [ ] 评价系统
- [ ] 售后申请

### 优先级 P2（扩展功能）
- [ ] 积分系统
- [ ] 优惠券
- [ ] 会员申请
- [ ] 发现页内容

## 数据流说明

### 当前实现（模拟数据）
```
组件 → localStorage → 组件状态更新
```

### 对接后（真实数据）
```
组件 → API Service → 后端 → 响应 → 组件状态更新
```

## 状态管理

### 当前方案
- 使用 React State 和 Props 传递
- localStorage 存储用户信息和 token
- 组件内部管理局部状态

### 可选优化
如果状态管理变得复杂，可以考虑：
- React Context API
- Zustand（轻量级）
- Redux Toolkit（复杂应用）

## 性能优化建议

### 已实现
- ✅ 图片懒加载
- ✅ 组件按需渲染
- ✅ 事件防抖节流
- ✅ useEffect 清理

### 可以添加
- [ ] React.memo 优化重渲染
- [ ] useMemo 缓存计算结果
- [ ] useCallback 缓存函数
- [ ] 虚拟滚动（长列表）
- [ ] 图片压缩和 CDN

## 测试建议

### 功能测试
- [ ] 完整购物流程测试
- [ ] 登录注册流程测试
- [ ] 订单管理流程测试
- [ ] 支付流程测试
- [ ] 积分兑换流程测试

### 兼容性测试
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] 移动端浏览器

### 性能测试
- [ ] 页面加载速度
- [ ] 交互响应时间
- [ ] 内存占用

## 部署建议

### 前端部署
- Vercel（推荐）
- Netlify
- 阿里云 OSS + CDN
- 腾讯云 COS + CDN

### 环境配置
- 开发环境：本地 API
- 测试环境：测试服务器 API
- 生产环境：生产服务器 API

## 常见问题

### Q: 如何切换 API 环境？
A: 修改 `.env` 文件中的 `REACT_APP_API_URL`

### Q: 如何处理跨域问题？
A: 开发环境配置代理，生产环境后端配置 CORS

### Q: 如何上传图片？
A: 使用 FormData，参考 `BACKEND_API_GUIDE.md` 中的文件上传说明

### Q: Token 过期如何处理？
A: 响应拦截器中检测 401 状态码，清除 token 并跳转登录

## 联系方式

如有问题，请联系开发团队。

## 许可证

MIT License

---

**项目状态**: ✅ 前端开发完成，准备对接后端

**最后更新**: 2024-01-15

**版本**: v1.0.0
