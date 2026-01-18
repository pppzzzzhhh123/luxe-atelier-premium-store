# 快速开始指南

## 🚀 5分钟快速部署

### 步骤 1：创建 Supabase 项目

1. 访问 https://supabase.com 并注册
2. 创建新项目，记录以下信息：
   - Project URL
   - Anon Key
   - Service Key

### 步骤 2：初始化数据库

1. 在 Supabase Dashboard 进入 SQL Editor
2. 复制 `backend/supabase/migrations/001_initial_schema.sql` 内容
3. 执行 SQL

### 步骤 3：部署后端

```bash
cd backend
npm install
npm run build

# 部署到 Vercel
vercel --prod
```

在 Vercel 添加环境变量：
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`

### 步骤 4：部署前端

```bash
cd ..
npm install
npm run build

# 部署到 Vercel
vercel --prod
```

在 Vercel 添加环境变量：
- `VITE_API_URL` (后端地址)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 步骤 5：测试

访问前端地址，测试：
- 注册/登录
- 浏览商品
- 添加购物车
- 创建订单

---

## 📝 开发模式

### 后端开发

```bash
cd backend
npm install
npm run dev
```

### 前端开发

```bash
npm install
npm run dev
```

---

## 🎉 完成！

你的电商平台已经上线！

访问前端地址开始使用。
