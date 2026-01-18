# 🚀 后端部署完整指南 - 第一部分：准备与配置

## 📋 目录

- [第一部分：准备与配置](#第一部分准备与配置)
  - [1. 环境准备](#1-环境准备)
  - [2. Supabase 数据库配置](#2-supabase-数据库配置)
  - [3. 本地测试](#3-本地测试)
- [第二部分：部署与验证](./BACKEND_DEPLOYMENT_PART2.md)

---

## 第一部分：准备与配置

### 1. 环境准备

#### 1.1 检查 Node.js 版本

```bash
# 打开 PowerShell 或 CMD
node -v
```

**预期输出**：
```
v18.x.x 或更高版本
```

**如果版本过低或未安装**：
1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 18.x 或 20.x）
3. 运行安装程序
4. 重启终端，再次检查版本

#### 1.2 安装 Vercel CLI

```bash
# 全局安装 Vercel CLI
npm install -g vercel

# 验证安装
vercel --version
```

**预期输出**：
```
Vercel CLI 33.x.x
```

**如果安装失败**：
```bash
# 清理 npm 缓存
npm cache clean --force

# 重新安装
npm install -g vercel
```

#### 1.3 注册 Vercel 账号

1. 访问 https://vercel.com/
2. 点击右上角 **"Sign Up"**
3. 选择 **"Continue with GitHub"**（推荐）
4. 授权 Vercel 访问 GitHub
5. 完成注册

**重要提示**：使用 GitHub 登录可以自动关联代码仓库，方便后续部署。

---

### 2. Supabase 数据库配置

#### 2.1 创建 Supabase 项目

**步骤 1：访问 Supabase**
1. 打开浏览器，访问 https://supabase.com/
2. 点击右上角 **"Start your project"**
3. 使用 GitHub 账号登录

**步骤 2：创建新项目**
1. 登录后，点击 **"New project"** 按钮
2. 填写项目信息：

| 字段 | 填写内容 | 说明 |
|------|---------|------|
| **Organization** | 选择你的组织 | 如果是第一次使用，会自动创建 |
| **Name** | `luxe-atelier` | 项目名称，可自定义 |
| **Database Password** | 设置强密码 | **务必保存！** 后续无法查看 |
| **Region** | `Northeast Asia (Tokyo)` | 选择最近的区域 |
| **Pricing Plan** | `Free` | 免费版足够使用 |

3. 点击 **"Create new project"**
4. 等待 2-3 分钟，项目初始化完成

**步骤 3：等待项目就绪**

你会看到一个进度条：
```
Setting up your project...
⏳ Provisioning database
⏳ Setting up API
⏳ Configuring storage
```

当所有项都显示 ✅ 时，项目就绪。

#### 2.2 获取 API 密钥

**步骤 1：进入 API 设置**
1. 在项目页面，点击左侧菜单 **"Settings"**（齿轮图标）
2. 点击 **"API"** 子菜单

**步骤 2：复制密钥**

你会看到以下信息：

```
Project URL
https://xxxxxxxxxxxxx.supabase.co
```

```
Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0NzYwMDAsImV4cCI6MjAyMTA1MjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTQ3NjAwMCwiZXhwIjoyMDIxMDUyMDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**步骤 3：保存到记事本**

创建一个临时文本文件，保存以下信息：

```
Supabase 配置信息
==================

Project URL: https://xxxxxxxxxxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Database Password: [你设置的密码]
```

**⚠️ 重要提示**：
- `anon public` 用于前端
- `service_role secret` 用于后端（**不要泄露！**）

#### 2.3 执行数据库初始化脚本

**步骤 1：打开 SQL Editor**
1. 在 Supabase 项目页面，点击左侧菜单 **"SQL Editor"**
2. 点击右上角 **"New query"** 按钮

**步骤 2：复制 SQL 脚本**
1. 在本地打开文件：
   ```
   c:\Users\pizhe\Downloads\luxe-atelier-premium-store\backend\supabase\migrations\001_initial_schema.sql
   ```
2. 使用 VS Code 或记事本打开
3. 按 `Ctrl+A` 全选
4. 按 `Ctrl+C` 复制

**步骤 3：粘贴并执行**
1. 回到 Supabase SQL Editor
2. 在编辑器中按 `Ctrl+V` 粘贴
3. 点击右下角 **"Run"** 按钮（或按 `Ctrl+Enter`）
4. 等待执行完成（约 10-20 秒）

**步骤 4：验证执行结果**

**成功标志**：
```
Success. No rows returned
```

**如果看到错误**：
- 检查是否完整复制了所有内容
- 确认没有多余的字符
- 查看错误信息，根据提示修改

**步骤 5：验证表创建**
1. 点击左侧菜单 **"Table Editor"**
2. 应该看到 20 张表：

```
✅ addresses
✅ cart_items
✅ categories
✅ checkin_records
✅ coupons
✅ invite_records
✅ memberships
✅ order_items
✅ orders
✅ points_records
✅ post_comments
✅ posts
✅ products
✅ refunds
✅ reviews
✅ reward_records
✅ system_configs
✅ user_coupons
✅ users
✅ wallet_transactions
```

**如果表数量不对**：
1. 点击 SQL Editor
2. 执行以下查询检查：
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
3. 对比缺少的表，重新执行对应的 SQL

#### 2.4 插入测试数据（可选但推荐）

**步骤 1：创建商品分类**

在 SQL Editor 中执行：

```sql
-- 插入商品分类
INSERT INTO categories (name, slug, description, is_active) VALUES
  ('连衣裙', 'dresses', '优雅连衣裙系列', true),
  ('上衣', 'tops', '时尚上衣系列', true),
  ('裤装', 'pants', '舒适裤装系列', true),
  ('外套', 'coats', '保暖外套系列', true),
  ('配饰', 'accessories', '精美配饰系列', true);
```

**预期输出**：
```
Success. 5 rows affected.
```

**步骤 2：插入测试商品**

```sql
-- 插入测试商品
INSERT INTO products (title, description, price, original_price, category_id, images, stock, is_hot, is_new, is_active) 
SELECT 
  '优雅蕾丝连衣裙',
  '精致蕾丝工艺，展现女性优雅气质。采用高品质面料，穿着舒适透气。适合约会、聚会等多种场合。',
  599.00,
  899.00,
  id,
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
  100,
  true,
  true,
  true
FROM categories WHERE slug = 'dresses' LIMIT 1;

INSERT INTO products (title, description, price, original_price, category_id, images, stock, is_hot, is_active) 
SELECT 
  '简约白色衬衫',
  '经典百搭款式，职场必备单品。纯棉面料，舒适透气。可搭配裤装或裙装。',
  299.00,
  399.00,
  id,
  ARRAY['https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800'],
  150,
  true,
  true
FROM categories WHERE slug = 'tops' LIMIT 1;

INSERT INTO products (title, description, price, original_price, category_id, images, stock, is_new, is_active) 
SELECT 
  '高腰阔腿裤',
  '显瘦显高的阔腿裤设计，修饰腿型。高腰设计拉长身材比例。',
  399.00,
  599.00,
  id,
  ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
  80,
  true,
  true
FROM categories WHERE slug = 'pants' LIMIT 1;

INSERT INTO products (title, description, price, original_price, category_id, images, stock, is_active) 
SELECT 
  '羊毛呢大衣',
  '经典羊毛呢面料，保暖又时尚。双排扣设计，彰显优雅气质。',
  1299.00,
  1899.00,
  id,
  ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
  50,
  true
FROM categories WHERE slug = 'coats' LIMIT 1;

INSERT INTO products (title, description, price, original_price, category_id, images, stock, is_hot, is_active) 
SELECT 
  '真皮手提包',
  '意大利进口头层牛皮，手工缝制。大容量设计，满足日常需求。',
  899.00,
  1299.00,
  id,
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
  60,
  true,
  true
FROM categories WHERE slug = 'accessories' LIMIT 1;
```

**预期输出**：
```
Success. 5 rows affected.
```

**步骤 3：验证数据**

```sql
-- 查看商品列表
SELECT id, title, price, stock FROM products;
```

应该看到 5 条商品记录。

---

### 3. 本地测试

#### 3.1 准备后端代码

**步骤 1：打开终端**
```bash
# Windows PowerShell
# 按 Win+X，选择 "Windows PowerShell"

# 或在 VS Code 中按 Ctrl+` 打开终端
```

**步骤 2：进入后端目录**
```bash
cd c:\Users\pizhe\Downloads\luxe-atelier-premium-store\backend
```

**步骤 3：验证目录结构**
```bash
# 列出文件
dir

# 应该看到：
# src/
# package.json
# tsconfig.json
# README.md
```

#### 3.2 安装依赖

**步骤 1：安装 npm 包**
```bash
npm install
```

**预期输出**：
```
added 234 packages, and audited 235 packages in 45s

52 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**如果遇到错误**：

**错误 1：网络超时**
```bash
# 切换到淘宝镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

**错误 2：权限问题**
```bash
# 以管理员身份运行 PowerShell
# 右键 PowerShell 图标 → "以管理员身份运行"

# 重新安装
npm install
```

**错误 3：node-gyp 编译失败**
```bash
# 安装 Windows 构建工具
npm install --global windows-build-tools

# 重新安装
npm install
```

#### 3.3 配置环境变量

**步骤 1：创建 .env 文件**

在 `backend` 目录下创建 `.env` 文件：

```bash
# Windows PowerShell
New-Item -Path .env -ItemType File

# 或使用记事本
notepad .env
```

**步骤 2：填写配置**

将以下内容复制到 `.env` 文件（**替换为你的实际值**）：

```env
# Supabase 配置（从步骤 2.2 获取）
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0NzYwMDAsImV4cCI6MjAyMTA1MjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTQ3NjAwMCwiZXhwIjoyMDIxMDUyMDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT 密钥（生成一个随机字符串）
JWT_SECRET=luxe-atelier-super-secret-jwt-key-2024-change-this-in-production

# 服务器配置
PORT=3000
NODE_ENV=development

# 前端地址（CORS）
FRONTEND_URL=http://localhost:5173
```

**步骤 3：生成安全的 JWT_SECRET（推荐）**

```bash
# 使用 Node.js 生成随机字符串
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

将输出的字符串替换 `JWT_SECRET` 的值。

**步骤 4：保存文件**
- 按 `Ctrl+S` 保存
- 关闭编辑器

#### 3.4 编译 TypeScript

**步骤 1：编译代码**
```bash
npm run build
```

**预期输出**：
```
> backend@1.0.0 build
> tsc

# 编译成功，没有错误
```

**步骤 2：验证编译结果**
```bash
# 查看 dist 目录
dir dist

# 应该看到：
# config/
# middleware/
# routes/
# index.js
# index.d.ts
```

**如果编译失败**：

**错误 1：找不到模块**
```
error TS2307: Cannot find module 'express'
```

**解决方案**：
```bash
npm install --save-dev @types/express @types/node
npm run build
```

**错误 2：语法错误**
```
error TS2304: Cannot find name 'xxx'
```

**解决方案**：
- 检查代码中是否有拼写错误
- 确认所有导入语句正确

#### 3.5 启动开发服务器

**步骤 1：启动服务器**
```bash
npm run dev
```

**预期输出**：
```
> backend@1.0.0 dev
> tsx watch src/index.ts

🚀 Server running on port 3000
📝 Environment: development
🔗 Health check: http://localhost:3000/health
```

**步骤 2：验证服务器运行**

打开新的终端窗口（不要关闭服务器），执行：

```bash
# 测试健康检查接口
curl http://localhost:3000/health
```

**预期输出**：
```json
{
  "status": "ok",
  "timestamp": "2024-01-17T12:00:00.000Z",
  "environment": "development"
}
```

**或在浏览器中访问**：
```
http://localhost:3000/health
```

应该看到 JSON 响应。

**如果无法访问**：

**问题 1：端口被占用**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案**：
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 结束进程（替换 PID）
taskkill /PID [进程ID] /F

# 或修改 .env 中的 PORT
PORT=3001
```

**问题 2：防火墙阻止**
- 打开 Windows 防火墙设置
- 允许 Node.js 通过防火墙

#### 3.6 测试 API 接口

**使用 PowerShell 测试**：

**测试 1：注册接口**
```powershell
$body = @{
    phone = "13800138000"
    password = "Test123456"
    name = "测试用户"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

**预期输出**：
```json
{
  "message": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "phone": "13800138000",
    "name": "测试用户",
    "inviteCode": "ABC12345",
    "points": 0,
    "balance": 0
  }
}
```

**测试 2：登录接口**
```powershell
$body = @{
    phone = "13800138000"
    password = "Test123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

**测试 3：获取商品列表**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
```

**预期输出**：
```json
{
  "products": [
    {
      "id": "uuid",
      "title": "优雅蕾丝连衣裙",
      "price": 599.00,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

**如果测试失败**：
1. 检查服务器是否正在运行
2. 查看服务器终端的错误日志
3. 确认 Supabase 配置正确
4. 验证数据库表已创建

---

## ✅ 第一部分完成检查清单

- [ ] Node.js 版本 >= 18
- [ ] Vercel CLI 已安装
- [ ] Vercel 账号已注册
- [ ] Supabase 项目已创建
- [ ] API 密钥已保存
- [ ] 数据库 20 张表已创建
- [ ] 测试数据已插入
- [ ] 后端依赖已安装
- [ ] .env 文件已配置
- [ ] TypeScript 编译成功
- [ ] 开发服务器启动成功
- [ ] 健康检查接口正常
- [ ] 注册接口测试通过
- [ ] 登录接口测试通过
- [ ] 商品列表接口测试通过

**全部完成后，继续 [第二部分：部署与验证](./BACKEND_DEPLOYMENT_PART2.md)**

---

## 📞 遇到问题？

### 常见问题快速索引

1. **Node.js 版本问题** → 1.1 节
2. **Vercel CLI 安装失败** → 1.2 节
3. **Supabase 表创建失败** → 2.3 节
4. **npm install 失败** → 3.2 节
5. **TypeScript 编译错误** → 3.4 节
6. **服务器启动失败** → 3.5 节
7. **API 测试失败** → 3.6 节

### 获取帮助

- 查看服务器日志：终端中的错误信息
- 查看 Supabase 日志：Supabase → Logs
- 检查网络连接：确保可以访问 Supabase
- 验证配置：检查 .env 文件中的值

---

**继续阅读：[第二部分：部署与验证](./BACKEND_DEPLOYMENT_PART2.md)**
