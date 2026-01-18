# LUXE 璐珈女装 - 后端API对接指南

## 概述
本文档提供前端与后端对接所需的所有API接口定义、数据结构和业务逻辑说明。

---

## 1. 用户认证模块

### 1.1 发送验证码
```
POST /api/auth/send-code
Content-Type: application/json

Request:
{
  "phone": "13800138000"
}

Response:
{
  "code": 200,
  "message": "验证码已发送",
  "data": {
    "expireTime": 60  // 秒
  }
}
```

### 1.2 验证码登录
```
POST /api/auth/login-code
Content-Type: application/json

Request:
{
  "phone": "13800138000",
  "code": "123456"
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "name": "LUXE用户",
      "phone": "13800138000",
      "avatar": "https://...",
      "isMember": false,
      "points": 0,
      "balance": 0
    }
  }
}
```

### 1.3 密码登录
```
POST /api/auth/login-password
Content-Type: application/json

Request:
{
  "phone": "13800138000",
  "password": "password123"
}

Response: 同验证码登录
```

### 1.4 注册
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "phone": "13800138000",
  "code": "123456",
  "password": "password123"
}

Response: 同登录接口
```

---

## 2. 商品模块

### 2.1 获取商品列表
```
GET /api/products?category={category}&gender={gender}&page={page}&limit={limit}

Response:
{
  "code": 200,
  "data": {
    "products": [
      {
        "id": 1,
        "title": "羊绒混纺大衣",
        "price": 2899,
        "originalPrice": 3999,
        "img": "https://...",
        "category": "外套",
        "gender": "女士",
        "stock": 234,
        "sold": 1286
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### 2.2 获取商品详情
```
GET /api/products/{id}

Response:
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "羊绒混纺大衣",
    "price": 2899,
    "originalPrice": 3999,
    "img": "https://...",
    "images": ["https://...", "https://..."],
    "category": "外套",
    "description": "商品描述",
    "specs": {
      "sizes": ["XS", "S", "M", "L"],
      "colors": ["常规色", "经典黑", "米咖色"]
    },
    "stock": 234,
    "sold": 1286
  }
}
```

### 2.3 获取商品评论
```
GET /api/products/{id}/comments?page={page}&limit={limit}

Response:
{
  "code": 200,
  "data": {
    "comments": [
      {
        "id": 1,
        "user": "张**",
        "avatar": "https://...",
        "rating": 5,
        "content": "质量非常好",
        "images": [],
        "time": "2024-01-15",
        "spec": "常规色 / M"
      }
    ],
    "total": 50
  }
}
```

### 2.4 获取购买记录
```
GET /api/products/{id}/purchase-records?limit={limit}

Response:
{
  "code": 200,
  "data": [
    {
      "user": "王**",
      "time": "5分钟前",
      "spec": "常规色 / M"
    }
  ]
}
```

---

## 3. 购物车模块

### 3.1 获取购物车
```
GET /api/cart
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "title": "羊绒混纺大衣",
        "price": 2899,
        "img": "https://...",
        "spec": "常规色 / M",
        "quantity": 1,
        "selected": true
      }
    ]
  }
}
```

### 3.2 添加到购物车
```
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "productId": 1,
  "spec": "常规色 / M",
  "quantity": 1
}

Response:
{
  "code": 200,
  "message": "已加入购物车"
}
```

### 3.3 更新购物车商品
```
PUT /api/cart/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "quantity": 2,
  "selected": true
}

Response:
{
  "code": 200,
  "message": "更新成功"
}
```

### 3.4 删除购物车商品
```
DELETE /api/cart/{itemId}
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 4. 订单模块

### 4.1 创建订单
```
POST /api/orders/create
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "items": [
    {
      "productId": 1,
      "spec": "常规色 / M",
      "quantity": 1,
      "price": 2899
    }
  ],
  "addressId": 1,
  "couponId": null,
  "usePoints": 0,
  "remark": ""
}

Response:
{
  "code": 200,
  "data": {
    "orderId": "ORDER_20240115_001",
    "totalAmount": 2899,
    "payAmount": 2899
  }
}
```

### 4.2 支付订单
```
POST /api/orders/{orderId}/pay
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "payMethod": "wechat",  // wechat, alipay, balance
  "payPassword": "123456"  // 余额支付时需要
}

Response:
{
  "code": 200,
  "message": "支付成功",
  "data": {
    "orderId": "ORDER_20240115_001",
    "status": "paid"
  }
}
```

### 4.3 获取订单列表
```
GET /api/orders?status={status}&page={page}&limit={limit}
Authorization: Bearer {token}

status: all, pending, paid, shipped, delivered, reviewed

Response:
{
  "code": 200,
  "data": {
    "orders": [
      {
        "id": "ORDER_20240115_001",
        "status": "paid",
        "items": [...],
        "totalAmount": 2899,
        "createdAt": "2024-01-15T10:00:00Z",
        "address": {...}
      }
    ],
    "total": 10
  }
}
```

### 4.4 取消订单
```
POST /api/orders/{orderId}/cancel
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "订单已取消"
}
```

### 4.5 确认收货
```
POST /api/orders/{orderId}/confirm
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "确认收货成功"
}
```

### 4.6 提交评价
```
POST /api/orders/{orderId}/review
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "rating": 5,
  "content": "非常满意",
  "images": [File, File],
  "anonymous": false
}

Response:
{
  "code": 200,
  "message": "评价成功"
}
```

---

## 5. 售后模块

### 5.1 申请售后
```
POST /api/after-sales/apply
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "orderId": "ORDER_20240115_001",
  "type": "refund",  // refund, exchange
  "reason": "不喜欢",
  "description": "详细说明",
  "refundAmount": 2899,
  "images": [File, File]
}

Response:
{
  "code": 200,
  "message": "申请已提交",
  "data": {
    "afterSalesId": "AS_20240115_001"
  }
}
```

### 5.2 获取售后列表
```
GET /api/after-sales?page={page}&limit={limit}
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "records": [
      {
        "id": "AS_20240115_001",
        "orderId": "ORDER_20240115_001",
        "type": "refund",
        "status": "pending",
        "refundAmount": 2899,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

## 6. 地址模块

### 6.1 获取地址列表
```
GET /api/addresses
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "phone": "13800138000",
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "detail": "xxx街道xxx号",
      "isDefault": true
    }
  ]
}
```

### 6.2 添加地址
```
POST /api/addresses
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "张三",
  "phone": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "朝阳区",
  "detail": "xxx街道xxx号",
  "isDefault": false
}

Response:
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": 1
  }
}
```

### 6.3 更新地址
```
PUT /api/addresses/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request: 同添加地址

Response:
{
  "code": 200,
  "message": "更新成功"
}
```

### 6.4 删除地址
```
DELETE /api/addresses/{id}
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 7. 积分模块

### 7.1 获取积分商品列表
```
GET /api/points/products?type={type}&page={page}&limit={limit}

type: all, coupon, physical

Response:
{
  "code": 200,
  "data": {
    "products": [
      {
        "id": 1,
        "title": "50元优惠券",
        "type": "coupon",
        "points": 500,
        "price": 0,
        "img": "https://...",
        "stock": 100
      }
    ]
  }
}
```

### 7.2 兑换积分商品
```
POST /api/points/exchange
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "productId": 1,
  "addressId": 1  // 实物商品需要
}

Response:
{
  "code": 200,
  "message": "兑换成功",
  "data": {
    "recordId": 1
  }
}
```

### 7.3 获取积分记录
```
GET /api/points/records?page={page}&limit={limit}
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "records": [
      {
        "id": 1,
        "type": "earn",  // earn, spend
        "points": 100,
        "description": "购物获得",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

## 8. 优惠券模块

### 8.1 获取优惠券列表
```
GET /api/coupons?status={status}
Authorization: Bearer {token}

status: available, used, expired

Response:
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "新人专享券",
      "type": "discount",
      "value": 50,
      "minAmount": 299,
      "expireDate": "2024-12-31",
      "status": "available"
    }
  ]
}
```

### 8.2 领取优惠券
```
POST /api/coupons/{id}/claim
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "领取成功"
}
```

---

## 9. 会员模块

### 9.1 申请会员
```
POST /api/membership/apply
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "张三",
  "phone": "13800138000",
  "email": "example@email.com",
  "birthday": "1990-01-01",
  "gender": "女",
  "occupation": "企业高管",
  "income": "50-100万",
  "interests": ["时尚服饰", "奢侈品"]
}

Response:
{
  "code": 200,
  "message": "申请已提交，我们将在3个工作日内审核"
}
```

### 9.2 签到
```
POST /api/membership/check-in
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "message": "签到成功",
  "data": {
    "points": 10,
    "continuousDays": 5
  }
}
```

---

## 10. 用户信息模块

### 10.1 获取用户信息
```
GET /api/user/profile
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "id": "user_123",
    "name": "张三",
    "phone": "13800138000",
    "avatar": "https://...",
    "email": "example@email.com",
    "birthday": "1990-01-01",
    "gender": "女",
    "isMember": true,
    "points": 1000,
    "balance": 500.00
  }
}
```

### 10.2 更新用户信息
```
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "张三",
  "email": "example@email.com",
  "birthday": "1990-01-01",
  "gender": "女"
}

Response:
{
  "code": 200,
  "message": "更新成功"
}
```

### 10.3 上传头像
```
POST /api/user/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "avatar": File
}

Response:
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "avatarUrl": "https://..."
  }
}
```

---

## 11. 钱包模块

### 11.1 获取余额
```
GET /api/wallet/balance
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "balance": 500.00
  }
}
```

### 11.2 充值
```
POST /api/wallet/recharge
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "amount": 100,
  "payMethod": "wechat"
}

Response:
{
  "code": 200,
  "message": "充值成功"
}
```

### 11.3 获取交易记录
```
GET /api/wallet/transactions?page={page}&limit={limit}
Authorization: Bearer {token}

Response:
{
  "code": 200,
  "data": {
    "transactions": [
      {
        "id": 1,
        "type": "recharge",  // recharge, payment, refund
        "amount": 100,
        "description": "充值",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 常见错误码
- 200: 成功
- 400: 请求参数错误
- 401: 未授权（token无效或过期）
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器内部错误

---

## 认证方式

所有需要登录的接口都需要在请求头中携带 token：

```
Authorization: Bearer {token}
```

---

## 文件上传

文件上传使用 `multipart/form-data` 格式，支持的图片格式：
- jpg/jpeg
- png
- gif
- webp

单个文件大小限制：5MB

---

## 分页参数

所有列表接口都支持分页：
- page: 页码，从1开始
- limit: 每页数量，默认20，最大100

---

## 前端需要修改的地方

1. **替换所有模拟数据**：将 localStorage 和 setTimeout 替换为真实 API 调用
2. **添加 axios 或 fetch 封装**：统一处理请求和响应
3. **添加 token 管理**：登录后保存 token，请求时自动携带
4. **添加错误处理**：统一处理 API 错误
5. **添加加载状态**：API 请求时显示 loading
6. **图片上传**：使用 FormData 上传图片
7. **订单倒计时**：从服务器获取订单创建时间，计算剩余时间

---

## 建议的技术栈

- **HTTP 客户端**: axios
- **状态管理**: React Context 或 Zustand
- **图片上传**: react-dropzone
- **日期处理**: dayjs

---

## 下一步工作

1. 创建 API 服务层（services/api.ts）
2. 创建请求拦截器（添加 token）
3. 创建响应拦截器（统一错误处理）
4. 逐模块替换模拟数据为真实 API
5. 添加环境变量配置（开发/生产环境 API 地址）
6. 进行联调测试

---

## 联系方式

如有疑问，请联系后端开发团队。
