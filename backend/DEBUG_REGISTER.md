# 注册失败排查指南

## 问题：注册返回 "注册失败，请稍后重试"

### 排查步骤

#### 1. 查看服务器日志

在运行 `npm run dev` 的终端窗口中，应该能看到详细错误。找到这行：
```
创建用户失败: { ... }
```

常见错误：
- `duplicate key value violates unique constraint` - 手机号或邀请码重复
- `null value in column "xxx" violates not-null constraint` - 缺少必填字段
- `permission denied` - 数据库权限问题

#### 2. 检查数据库中是否已有该用户

在 Supabase SQL Editor 执行：

```sql
-- 检查手机号是否已存在
SELECT * FROM users WHERE phone = '13800138000';

-- 如果存在，删除它
DELETE FROM users WHERE phone = '13800138000';
```

#### 3. 检查 RLS 策略

Supabase 的 Row Level Security 可能阻止了插入操作。

在 Supabase SQL Editor 执行：

```sql
-- 临时禁用 users 表的 RLS（仅用于测试）
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 或者添加允许插入的策略
CREATE POLICY users_insert_all ON users FOR INSERT WITH CHECK (true);
```

#### 4. 检查表结构

确认 users 表的所有字段：

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

确保以下字段存在且可为空或有默认值：
- `id` - UUID, 默认 gen_random_uuid()
- `phone` - VARCHAR, NOT NULL
- `password_hash` - TEXT
- `name` - VARCHAR, 默认 '用户'
- `invite_code` - VARCHAR, NOT NULL, UNIQUE
- `invited_by` - UUID, 可为空
- `points` - INTEGER, 默认 0
- `balance` - DECIMAL, 默认 0.00

#### 5. 使用不同的手机号测试

```powershell
$body = @{
    phone = "13900139999"
    password = "Test123456"
    name = "新测试用户"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

#### 6. 直接在数据库插入测试

在 Supabase SQL Editor 执行：

```sql
-- 手动插入一个用户
INSERT INTO users (phone, password_hash, name, invite_code, points, balance)
VALUES (
  '13800138001',
  '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890',  -- 假密码哈希
  '手动测试用户',
  'TEST1234',
  0,
  0.00
);

-- 查看是否成功
SELECT * FROM users WHERE phone = '13800138001';
```

如果手动插入成功，说明表结构没问题，问题在代码逻辑。

#### 7. 检查环境变量

确认 `.env` 文件中的 Supabase 配置正确：

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
```

**重要**：注册操作需要使用 `SERVICE_KEY`，不是 `ANON_KEY`。

检查 `backend/src/config/supabase.ts`：

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!; // 应该用 SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 快速修复方案

### 方案 1：禁用 RLS（仅测试环境）

```sql
-- 在 Supabase SQL Editor 执行
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE invite_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons DISABLE ROW LEVEL SECURITY;
```

### 方案 2：添加正确的 RLS 策略

```sql
-- 允许任何人注册（插入用户）
CREATE POLICY users_insert_public ON users 
FOR INSERT 
WITH CHECK (true);

-- 允许 service_role 完全访问
CREATE POLICY users_service_role ON users 
FOR ALL 
USING (auth.role() = 'service_role');
```

### 方案 3：使用 SERVICE_KEY

确保 `supabase.ts` 使用的是 `SERVICE_KEY`：

```typescript
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY!;
```

## 测试命令

### 清理并重新测试

```powershell
# 1. 在 Supabase 删除测试用户
# 执行 SQL: DELETE FROM users WHERE phone = '13800138000';

# 2. 重启后端服务器
# Ctrl+C 停止，然后 npm run dev

# 3. 重新注册
$body = @{
    phone = "13800138000"
    password = "Test123456"
    name = "测试用户"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

## 预期成功响应

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

## 如果还是失败

请提供：
1. 服务器终端的完整错误日志
2. Supabase 中 users 表的结构（上面的 SQL 查询结果）
3. 是否能手动在 Supabase 插入用户

我会根据具体错误信息帮您解决。
