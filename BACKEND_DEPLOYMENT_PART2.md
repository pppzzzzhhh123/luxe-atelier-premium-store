# 🚀 后端部署完整指南 - 第二部分：部署与验证

## 📋 目录

- [第一部分：准备与配置](./BACKEND_DEPLOYMENT_PART1.md)
- [第二部分：部署与验证](#第二部分部署与验证)
  - [4. 部署到 Vercel](#4-部署到-vercel)
  - [5. 配置环境变量](#5-配置环境变量)
  - [6. 验证部署](#6-验证部署)
  - [7. 连接前端](#7-连接前端)
  - [8. 完整测试](#8-完整测试)

---

## 第二部分：部署与验证

### 4. 部署到 Vercel

#### 4.1 登录 Vercel

**步骤 1：在终端登录**
```bash
# 确保在 backend 目录
cd c:\Users\pizhe\Downloads\luxe-atelier-premium-store\backend

# 登录 Vercel
vercel login
```

**预期输出**：
```
Vercel CLI 33.x.x
? Log in to Vercel (Use arrow keys)
> Continue with GitHub
  Continue with GitLab
  Continue with Bitbucket
  Continue with Email
  Continue with SAML Single Sign-On
```

**步骤 2：选择登录方式**
- 使用方向键选择 **"Continue with GitHub"**
- 按 `Enter` 确认

**步骤 3：浏览器授权**
- 自动打开浏览器
- 显示授权页面
- 点击 **"Authorize"** 按钮

**步骤 4：确认登录成功**

终端显示：
```
> Success! GitHub authentication complete for xxx@xxx.com
```

#### 4.2 初始化项目

**步骤 1：开始部署**
```bash
vercel
```

**步骤 2：回答配置问题**

**问题 1：设置和部署项目**
```
? Set up and deploy "~/backend"? [Y/n]
```
输入 `y` 并按 `Enter`

**问题 2：选择作用域**
```
? Which scope do you want to deploy to?
> Your Name (个人账号)
  Team Name (团队账号，如果有)
```
选择你的个人账号，按 `Enter`

**问题 3：链接到现有项目**
```
? Link to existing project? [y/N]
```
输入 `n` 并按 `Enter`（首次部署）

**问题 4：项目名称**
```
? What's your project's name? (backend)
```
输入 `luxe-atelier-backend` 并按 `Enter`

**问题 5：代码目录**
```
? In which directory is your code located? ./
```
直接按 `Enter`（使用默认值）

**问题 6：覆盖设置**
```
? Want to override the settings? [y/N]
```
输入 `y` 并按 `Enter`

**问题 7：选择要覆盖的设置**
```
? Which settings would you like to override? (Press <space> to select)
◯ Build Command
◯ Output Directory
◉ Install Command
◯ Development Command
```
- 使用空格键选中 **"Install Command"**
- 按 `Enter` 确认

**问题 8：安装命令**
```
? What's your Install Command?
```
输入 `npm install` 并按 `Enter`

**步骤 3：等待部署**

你会看到部署进度：
```
🔗  Linked to your-name/luxe-atelier-backend (created .vercel)
🔍  Inspect: https://vercel.com/your-name/luxe-atelier-backend/xxx [1s]
✅  Production: https://luxe-atelier-backend.vercel.app [copied to clipboard] [30s]
```

**重要**：复制并保存 Production URL！

#### 4.3 验证部署状态

**步骤 1：访问 Vercel 控制台**
1. 打开浏览器
2. 访问 https://vercel.com/dashboard
3. 找到 `luxe-atelier-backend` 项目
4. 点击进入

**步骤 2：查看部署状态**

你会看到：
```
Deployment Status: Ready
Domain: luxe-atelier-backend.vercel.app
```

**步骤 3：测试健康检查**

在浏览器访问：
```
https://luxe-atelier-backend.vercel.app/health
```

**如果看到错误**：
```json
{
  "error": "Internal Server Error"
}
```

**原因**：环境变量未配置，继续下一步。

---

### 5. 配置环境变量

#### 5.1 在 Vercel 添加环境变量

**步骤 1：进入设置页面**
1. 在 Vercel 项目页面
2. 点击顶部 **"Settings"** 标签
3. 点击左侧 **"Environment Variables"**

**步骤 2：添加变量**

点击 **"Add New"** 按钮，逐个添加以下变量：

**变量 1：SUPABASE_URL**
```
Name: SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co
Environment: Production (勾选)
```
点击 **"Save"**

**变量 2：SUPABASE_ANON_KEY**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production (勾选)
```
点击 **"Save"**

**变量 3：SUPABASE_SERVICE_KEY**
```
Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production (勾选)
```
点击 **"Save"**

**变量 4：JWT_SECRET**
```
Name: JWT_SECRET
Value: luxe-atelier-super-secret-jwt-key-2024
Environment: Production (勾选)
```
点击 **"Save"**

**变量 5：NODE_ENV**
```
Name: NODE_ENV
Value: production
Environment: Production (勾选)
```
点击 **"Save"**

**变量 6：FRONTEND_URL**
```
Name: FRONTEND_URL
Value: https://luxe-atelier.vercel.app
Environment: Production (勾选)
```
点击 **"Save"**（暂时使用占位符，后续更新）

**步骤 3：验证变量**

确认所有 6 个变量都已添加：
```
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_KEY
✅ JWT_SECRET
✅ NODE_ENV
✅ FRONTEND_URL
```

#### 5.2 重新部署

**步骤 1：触发重新部署**

**方法 1：通过 Vercel 控制台**
1. 点击顶部 **"Deployments"** 标签
2. 找到最新的部署记录
3. 点击右侧的 **"..."** 菜单
4. 选择 **"Redeploy"**
5. 点击 **"Redeploy"** 确认

**方法 2：通过命令行**
```bash
# 在 backend 目录
vercel --prod
```

**步骤 2：等待部署完成**

部署进度：
```
Building...
⏳ Installing dependencies
⏳ Building application
⏳ Uploading build output
✅ Deployment complete
```

大约需要 1-2 分钟。

**步骤 3：验证环境变量生效**

访问：
```
https://luxe-atelier-backend.vercel.app/health
```

**预期输出**：
```json
{
  "status": "ok",
  "timestamp": "2024-01-17T12:00:00.000Z",
  "environment": "production"
}
```

**如果仍然报错**：
1. 检查环境变量是否正确
2. 查看 Vercel 部署日志
3. 确认 Supabase 项目未暂停

---

### 6. 验证部署

#### 6.1 测试基础接口

**测试 1：健康检查**
```bash
curl https://luxe-atelier-backend.vercel.app/health
```

**测试 2：获取商品列表**
```bash
curl https://luxe-atelier-backend.vercel.app/api/products
```

**预期输出**：
```json
{
  "products": [...],
  "pagination": {...}
}
```

**测试 3：注册用户**
```bash
curl -X POST https://luxe-atelier-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"13900139000\",\"password\":\"Test123456\",\"name\":\"线上测试用户\"}"
```

**预期输出**：
```json
{
  "message": "注册成功",
  "token": "eyJhbGci...",
  "user": {...}
}
```

#### 6.2 使用 Postman 测试（推荐）

**步骤 1：安装 Postman**
1. 访问 https://www.postman.com/downloads/
2. 下载并安装

**步骤 2：创建集合**
1. 打开 Postman
2. 点击 **"New"** → **"Collection"**
3. 命名为 `Luxe Atelier API`

**步骤 3：添加请求**

**请求 1：注册**
- Method: `POST`
- URL: `https://luxe-atelier-backend.vercel.app/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "phone": "13900139001",
  "password": "Test123456",
  "name": "Postman测试"
}
```
- 点击 **"Send"**

**请求 2：登录**
- Method: `POST`
- URL: `https://luxe-atelier-backend.vercel.app/api/auth/login`
- Body:
```json
{
  "phone": "13900139001",
  "password": "Test123456"
}
```
- 点击 **"Send"**
- 复制返回的 `token`

**请求 3：获取个人信息（需要认证）**
- Method: `GET`
- URL: `https://luxe-atelier-backend.vercel.app/api/users/profile`
- Headers: `Authorization: Bearer [粘贴token]`
- 点击 **"Send"**

#### 6.3 查看部署日志

**步骤 1：访问日志页面**
1. Vercel 项目页面
2. 点击 **"Deployments"**
3. 点击最新的部署
4. 点击 **"Functions"** 标签

**步骤 2：查看实时日志**
- 选择一个函数（如 `index`）
- 点击 **"View Logs"**
- 可以看到所有请求日志

**步骤 3：调试错误**

如果看到错误：
```
Error: Cannot connect to Supabase
```

检查：
1. Supabase URL 是否正确
2. API Key 是否有效
3. Supabase 项目是否暂停

---

### 7. 连接前端

#### 7.1 更新前端环境变量

**步骤 1：创建前端 .env 文件**
```bash
cd c:\Users\pizhe\Downloads\luxe-atelier-premium-store
notepad .env
```

**步骤 2：填写配置**
```env
# 后端 API 地址
VITE_API_URL=https://luxe-atelier-backend.vercel.app

# Supabase 配置（前端用 anon key）
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 7.2 更新 CORS 配置

**步骤 1：修改后端代码**

打开 `backend/src/index.ts`，找到 CORS 配置：

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://luxe-atelier.vercel.app',  // 添加前端域名
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true,
}));
```

**步骤 2：重新部署后端**
```bash
cd backend
vercel --prod
```

#### 7.3 测试前后端连接

**步骤 1：启动前端**
```bash
cd c:\Users\pizhe\Downloads\luxe-atelier-premium-store
npm run dev
```

**步骤 2：测试注册**
1. 访问 `http://localhost:5173`
2. 点击 **"登录/注册"**
3. 填写注册信息
4. 点击 **"注册"**

**步骤 3：检查网络请求**
1. 按 `F12` 打开开发者工具
2. 切换到 **"Network"** 标签
3. 查看请求是否发送到 Vercel 后端
4. 检查响应状态码（应该是 200 或 201）

---

### 8. 完整测试

#### 8.1 用户注册流程

**测试步骤**：
1. 打开前端应用
2. 注册新用户（手机号：13900139002）
3. 填写邀请码（可选）
4. 提交注册

**验证点**：
- ✅ 注册成功提示
- ✅ 自动登录
- ✅ 右上角显示用户信息
- ✅ 如果填写邀请码，收到 2 张优惠券

**数据库验证**：
```sql
-- 在 Supabase SQL Editor 执行
SELECT * FROM users WHERE phone = '13900139002';
SELECT * FROM user_coupons WHERE user_id = (SELECT id FROM users WHERE phone = '13900139002');
```

#### 8.2 商品浏览流程

**测试步骤**：
1. 在首页查看商品列表
2. 点击商品卡片
3. 查看商品详情

**验证点**：
- ✅ 商品列表正常显示
- ✅ 商品图片加载
- ✅ 价格、库存显示正确
- ✅ 详情页信息完整

#### 8.3 购物车流程

**测试步骤**：
1. 在商品详情页点击 **"加入购物车"**
2. 点击右上角购物车图标
3. 修改商品数量
4. 删除商品

**验证点**：
- ✅ 添加成功提示
- ✅ 购物车数量更新
- ✅ 购物车列表显示
- ✅ 数量修改生效
- ✅ 删除功能正常

**数据库验证**：
```sql
SELECT * FROM cart_items WHERE user_id = (SELECT id FROM users WHERE phone = '13900139002');
```

#### 8.4 订单创建流程

**测试步骤**：
1. 购物车点击 **"去结算"**
2. 添加收货地址
3. 选择优惠券（如有）
4. 提交订单
5. 模拟支付

**验证点**：
- ✅ 地址保存成功
- ✅ 优惠券可选择
- ✅ 订单创建成功
- ✅ 订单号生成
- ✅ 支付后状态变为"待发货"
- ✅ 库存减少
- ✅ 积分增加

**数据库验证**：
```sql
-- 查看订单
SELECT * FROM orders WHERE user_id = (SELECT id FROM users WHERE phone = '13900139002');

-- 查看订单商品
SELECT * FROM order_items WHERE order_id = '[订单号]';

-- 查看积分记录
SELECT * FROM points_records WHERE user_id = (SELECT id FROM users WHERE phone = '13900139002');
```

#### 8.5 邀请返现流程

**测试步骤**：
1. 用户 A 获取邀请码
2. 用户 B 注册时填写邀请码
3. 用户 B 下单并支付
4. 用户 A 查看返现记录
5. 用户 A 提现到余额

**验证点**：
- ✅ 用户 B 收到 2 张优惠券
- ✅ 用户 B 首单后，用户 A 获得返现
- ✅ 返现金额 = 订单金额 × 5%
- ✅ 7 天后可提现
- ✅ 提现后余额增加

**数据库验证**：
```sql
-- 查看邀请记录
SELECT * FROM invite_records WHERE inviter_id = (SELECT id FROM users WHERE phone = '13900139002');

-- 查看返现记录
SELECT * FROM reward_records WHERE user_id = (SELECT id FROM users WHERE phone = '13900139002');

-- 查看钱包交易
SELECT * FROM wallet_transactions WHERE user_id = (SELECT id FROM users WHERE phone = '13900139002');
```

#### 8.6 签到功能测试

**测试步骤**：
1. 进入个人中心
2. 点击积分页面
3. 点击签到按钮
4. 查看积分增加

**验证点**：
- ✅ 签到成功提示
- ✅ 积分增加（基础 10 分）
- ✅ 连续签到天数显示
- ✅ 今天已签到后不能重复签到

**数据库验证**：
```sql
SELECT * FROM checkin_records WHERE user_id = (SELECT id FROM users WHERE phone = '13900139002');
```

---

## ✅ 完整部署检查清单

### 后端部署
- [ ] Vercel 项目创建成功
- [ ] 环境变量配置完成（6 个）
- [ ] 部署状态为 Ready
- [ ] 健康检查接口返回正常
- [ ] 商品列表接口返回数据
- [ ] 注册接口测试通过
- [ ] 登录接口测试通过

### 数据库
- [ ] Supabase 项目运行中
- [ ] 20 张表全部创建
- [ ] 测试数据已插入
- [ ] RLS 策略已启用
- [ ] 索引已创建

### 前后端连接
- [ ] CORS 配置正确
- [ ] 前端环境变量配置
- [ ] 前端可以调用后端 API
- [ ] 网络请求无跨域错误

### 功能测试
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 商品浏览功能正常
- [ ] 购物车功能正常
- [ ] 订单创建功能正常
- [ ] 订单支付功能正常
- [ ] 邀请返现功能正常
- [ ] 签到功能正常
- [ ] 优惠券功能正常
- [ ] 积分功能正常

---

## 🎯 性能优化建议

### 1. 数据库优化
```sql
-- 添加常用查询的索引
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active);
```

### 2. API 缓存
在 `vercel.json` 中配置：
```json
{
  "headers": [
    {
      "source": "/api/products",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### 3. 图片优化
使用 CDN 服务：
- Cloudinary
- Imgix
- Vercel Image Optimization

---

## 🔧 故障排查

### 问题 1：部署后 500 错误

**症状**：所有 API 返回 500 错误

**排查步骤**：
1. 查看 Vercel 函数日志
2. 检查环境变量是否配置
3. 验证 Supabase 连接

**解决方案**：
```bash
# 重新部署
vercel --prod --force
```

### 问题 2：数据库连接超时

**症状**：请求超时，无响应

**排查步骤**：
1. 检查 Supabase 项目状态
2. 验证 API Key 是否有效
3. 检查网络连接

**解决方案**：
- 重启 Supabase 项目
- 重新生成 API Key
- 检查防火墙设置

### 问题 3：CORS 错误

**症状**：前端请求被阻止

**排查步骤**：
1. 检查浏览器控制台错误
2. 验证 CORS 配置
3. 确认前端域名

**解决方案**：
```typescript
// backend/src/index.ts
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app'],
  credentials: true,
}));
```

---

## 📚 相关文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Supabase 官方文档](https://supabase.com/docs)
- [Express.js 文档](https://expressjs.com/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

---

## 🎉 恭喜！

您已成功完成后端部署！

**下一步**：
1. 部署前端应用
2. 配置自定义域名
3. 设置监控和日志
4. 进行压力测试
5. 优化性能

**返回：[第一部分：准备与配置](./BACKEND_DEPLOYMENT_PART1.md)**
