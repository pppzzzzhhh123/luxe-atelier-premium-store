# 前端连接后端问题修复指南

## 问题总结

1. ❌ 前端 API baseURL 配置错误：`/api/v1` 应该是 `/api`
2. ❌ 前端端口 3000 与后端冲突
3. ❌ 前端环境变量未配置

## 修复步骤

### 步骤 1：创建前端环境变量文件

在项目根目录创建 `.env` 文件：

```bash
cd c:\Users\pizhe\Downloads\luxe-atelier-premium-store
notepad .env
```

填入以下内容：

```env
# 后端 API 地址（使用已部署的 Vercel 地址）
VITE_API_URL=https://luxe-pi-kohl.vercel.app/api

# 或使用本地后端（如果后端在本地运行）
# VITE_API_URL=http://localhost:3001/api

# Supabase 配置（前端用 ANON_KEY）
VITE_SUPABASE_URL=你的supabase地址
VITE_SUPABASE_ANON_KEY=你的anon_key
```

### 步骤 2：修改前端 API 配置

修改 `src/api/index.ts` 第 4 行：

**修改前：**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
```

**修改后：**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### 步骤 3：修改前端端口（避免冲突）

修改 `vite.config.ts`：

**修改前：**
```typescript
export default defineConfig({
  plugins: [react()],
  // ...
})
```

**修改后：**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // 改为 5173 或其他端口
    proxy: {
      '/api': {
        target: 'https://luxe-pi-kohl.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
```

### 步骤 4：重启前端

```bash
# 停止当前运行的前端（Ctrl+C）

# 重新启动
npm run dev
```

现在应该显示：
```
➜  Local:   http://localhost:5173/
```

### 步骤 5：测试注册

1. 打开浏览器访问 `http://localhost:5173/`
2. 点击注册
3. 填写信息：
   - 手机号：13900139999
   - 密码：Test123456
   - 验证码：123456（测试环境固定）
4. 点击注册

### 步骤 6：检查网络请求

按 F12 打开开发者工具 → Network 标签

应该看到：
```
POST https://luxe-pi-kohl.vercel.app/api/auth/register
Status: 201 Created
```

## 快速修复命令

```powershell
# 1. 创建环境变量文件
cd c:\Users\pizhe\Downloads\luxe-atelier-premium-store
echo "VITE_API_URL=https://luxe-pi-kohl.vercel.app/api" > .env

# 2. 重启前端
npm run dev
```

## 验证修复

### 测试 1：检查 API 地址

在浏览器控制台执行：
```javascript
console.log(import.meta.env.VITE_API_URL)
// 应该输出: https://luxe-pi-kohl.vercel.app/api
```

### 测试 2：手动调用 API

在浏览器控制台执行：
```javascript
fetch('https://luxe-pi-kohl.vercel.app/api/products')
  .then(r => r.json())
  .then(d => console.log(d))
// 应该返回商品列表
```

### 测试 3：注册用户

使用前端界面注册，然后在 Supabase 检查：

```sql
-- 在 Supabase SQL Editor 执行
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

应该看到新注册的用户。

## 常见问题

### 问题 1：CORS 错误

**错误信息：**
```
Access to fetch at 'https://luxe-pi-kohl.vercel.app/api/auth/register' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**解决方案：**

在后端 `src/index.ts` 中添加前端域名：

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://luxe-atelier.vercel.app',  // 前端生产域名
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true,
}));
```

然后重新部署后端：
```bash
cd backend
vercel --prod
```

### 问题 2：环境变量不生效

**解决方案：**

1. 确认 `.env` 文件在项目根目录
2. 重启开发服务器（Ctrl+C 然后 npm run dev）
3. 清除浏览器缓存（Ctrl+Shift+Delete）

### 问题 3：404 Not Found

**错误信息：**
```
POST http://localhost:5173/api/auth/register 404 (Not Found)
```

**原因：** 前端没有配置代理或环境变量

**解决方案：** 确保 `.env` 文件存在且配置正确

## 完整配置示例

### .env（项目根目录）
```env
VITE_API_URL=https://luxe-pi-kohl.vercel.app/api
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  }
})
```

### src/api/index.ts（第 4 行）
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

## 测试清单

- [ ] `.env` 文件已创建
- [ ] `VITE_API_URL` 配置正确
- [ ] 前端端口改为 5173
- [ ] 前端已重启
- [ ] 浏览器访问 http://localhost:5173
- [ ] 注册功能正常
- [ ] 数据写入 Supabase
- [ ] 登录功能正常

全部完成后，前端应该能正常连接后端了！
