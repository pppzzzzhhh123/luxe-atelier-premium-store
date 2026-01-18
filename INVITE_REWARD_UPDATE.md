# 邀请返现功能更新说明

## 更新时间
2026-01-17

## 更新内容

### 1. 样式调整
- **配色统一**：将所有紫粉色渐变改为黑灰色系，与个人中心保持一致
  - 主按钮：紫粉渐变 → 黑色 (slate-800)
  - 收益卡片：紫粉渐变 → 黑灰渐变 (slate-800 to slate-900)
  - 邀请码背景：紫粉渐变 → 灰色 (slate-50)
  - Tab 激活色：紫色 → 黑色
  - 金额显示：紫色 → 黑色
  - 图标背景：紫色/粉色 → 灰色

### 2. 奖励规则调整
**旧规则：**
- 好友注册：邀请人获得 20元 现金
- 好友首单：邀请人获得订单金额 5% 返现
- 好友福利：好友注册送 50元 优惠券

**新规则：**
- ✅ **好友注册**：好友获得 **2张10元优惠券**（满200可用）
- ✅ **好友下单**：邀请人获得订单金额 **5%** 现金返现
- ✅ **返现到账**：订单完成后 **24小时内** 自动到账钱包

### 3. 注册流程完善
**新增功能：**
- ✅ 注册页面添加邀请码输入框（选填）
- ✅ 邀请码自动转大写
- ✅ 输入邀请码时显示奖励提示
- ✅ 注册成功后保存邀请码关联
- ✅ 使用邀请码注册后弹窗提示获得优惠券

**实现细节：**
```typescript
// Auth.tsx 新增状态
const [inviteCode, setInviteCode] = useState('');

// 注册时保存邀请码
if (inviteCode) {
  localStorage.setItem('luxe-invite-code-used', inviteCode);
  alert('🎉 注册成功！已获得2张10元优惠券（满200可用）');
}
```

### 4. UI 优化
- 邀请码输入框带图标和提示
- 实时显示优惠券奖励说明
- 统一圆角和阴影样式
- 优化按钮交互效果

## 后端集成要点

### 注册接口需要支持邀请码
```typescript
POST /api/auth/register
{
  "phone": "13800138000",
  "code": "123456",
  "password": "password123",
  "inviteCode": "LUXE2024"  // 新增字段
}

Response:
{
  "success": true,
  "user": { ... },
  "rewards": {
    "coupons": [
      {
        "id": "coupon_1",
        "amount": 10,
        "minAmount": 200,
        "expiresAt": "2026-02-17"
      },
      {
        "id": "coupon_2",
        "amount": 10,
        "minAmount": 200,
        "expiresAt": "2026-02-17"
      }
    ]
  }
}
```

### 邀请码验证接口
```typescript
POST /api/invite/validate
{
  "inviteCode": "LUXE2024"
}

Response:
{
  "valid": true,
  "inviterName": "张三",
  "reward": "2张10元优惠券（满200可用）"
}
```

### 订单完成触发返现
```typescript
// 订单状态变更为"已完成"时
POST /api/invite/reward
{
  "orderId": "order_123",
  "orderAmount": 500,
  "inviteeUserId": "user_456"
}

Response:
{
  "success": true,
  "reward": {
    "amount": 25,  // 500 * 5%
    "inviterUserId": "user_789",
    "status": "pending",  // 24小时后变为 completed
    "availableAt": "2026-01-18T10:00:00Z"
  }
}
```

## 数据库设计建议

### invite_records 表
```sql
CREATE TABLE invite_records (
  id VARCHAR(50) PRIMARY KEY,
  inviter_user_id VARCHAR(50) NOT NULL,  -- 邀请人ID
  invitee_user_id VARCHAR(50) NOT NULL,  -- 被邀请人ID
  invite_code VARCHAR(20) NOT NULL,      -- 使用的邀请码
  registered_at TIMESTAMP NOT NULL,      -- 注册时间
  first_order_id VARCHAR(50),            -- 首单ID
  first_order_at TIMESTAMP,              -- 首单时间
  total_orders INT DEFAULT 0,            -- 总订单数
  total_reward DECIMAL(10,2) DEFAULT 0,  -- 累计返现
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inviter (inviter_user_id),
  INDEX idx_invitee (invitee_user_id),
  INDEX idx_code (invite_code)
);
```

### reward_records 表
```sql
CREATE TABLE reward_records (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,         -- 获得返现的用户ID
  invite_record_id VARCHAR(50) NOT NULL, -- 关联的邀请记录
  order_id VARCHAR(50) NOT NULL,        -- 触发返现的订单ID
  order_amount DECIMAL(10,2) NOT NULL,  -- 订单金额
  reward_amount DECIMAL(10,2) NOT NULL, -- 返现金额
  reward_rate DECIMAL(5,2) NOT NULL,    -- 返现比例（如5.00表示5%）
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  available_at TIMESTAMP NOT NULL,      -- 可用时间（24小时后）
  completed_at TIMESTAMP,               -- 到账时间
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_order (order_id),
  INDEX idx_status (status)
);
```

### user_coupons 表（优惠券）
```sql
CREATE TABLE user_coupons (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  coupon_type ENUM('invite_register', 'other') DEFAULT 'other',
  amount DECIMAL(10,2) NOT NULL,        -- 优惠券面额
  min_amount DECIMAL(10,2) NOT NULL,    -- 最低使用金额
  used BOOLEAN DEFAULT FALSE,
  used_order_id VARCHAR(50),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_expires (expires_at)
);
```

## 业务逻辑流程

### 1. 用户注册流程
```
1. 用户填写手机号、验证码、密码、邀请码（可选）
2. 前端调用 POST /api/auth/register
3. 后端验证邀请码有效性
4. 创建用户账号
5. 如果有邀请码：
   - 创建 invite_records 记录
   - 为新用户创建2张优惠券（10元，满200可用，30天有效期）
   - 返回优惠券信息
6. 前端显示注册成功和优惠券奖励
```

### 2. 订单完成返现流程
```
1. 订单状态变更为"已完成"
2. 检查该用户是否通过邀请码注册
3. 如果是：
   - 查询邀请人信息
   - 计算返现金额（订单金额 * 5%）
   - 创建 reward_records 记录（状态：pending）
   - 设置 available_at 为 24小时后
   - 更新 invite_records 的订单统计
4. 定时任务每小时检查 pending 状态的返现
5. 到达 available_at 时间后：
   - 更新状态为 completed
   - 将金额加入用户钱包
   - 发送到账通知
```

### 3. 返现查询流程
```
GET /api/invite/info
- 查询用户的 invite_records（作为邀请人）
- 统计总邀请人数、总返现、待到账、已到账
- 返回汇总数据

GET /api/invite/friends
- 查询用户邀请的所有好友
- 关联用户信息和订单统计
- 返回好友列表

GET /api/invite/records
- 查询用户的所有 reward_records
- 按时间倒序返回
- 包含订单信息和好友信息
```

## 前端展示逻辑

### 个人中心入口
- 显示"赚¥580"（从 API 获取实际累计收益）
- 点击跳转到邀请返现页面

### 邀请返现页面
- **Tab 1 - 邀请好友**：显示收益、邀请码、规则、分享按钮
- **Tab 2 - 我的好友**：显示已邀请的好友列表和订单情况
- **Tab 3 - 返现记录**：显示详细的返现历史记录

### 注册页面
- 邀请码输入框（选填）
- 实时提示奖励内容
- 注册成功后显示优惠券

## 测试要点

1. ✅ 注册时不填邀请码，正常注册
2. ✅ 注册时填写有效邀请码，获得优惠券
3. ✅ 注册时填写无效邀请码，提示错误
4. ✅ 被邀请用户下单，邀请人获得返现
5. ✅ 返现24小时后自动到账
6. ✅ 优惠券满200可用，不满200不可用
7. ✅ 优惠券过期后不可用
8. ✅ 样式在各个页面保持一致

## 配置项

```typescript
// config.ts
export const INVITE_CONFIG = {
  // 注册奖励
  REGISTER_COUPON_COUNT: 2,      // 优惠券数量
  REGISTER_COUPON_AMOUNT: 10,    // 优惠券面额
  REGISTER_COUPON_MIN: 200,      // 最低使用金额
  REGISTER_COUPON_DAYS: 30,      // 有效期天数
  
  // 订单返现
  ORDER_REWARD_RATE: 0.05,       // 返现比例 5%
  REWARD_DELAY_HOURS: 24,        // 返现延迟小时数
  
  // 邀请码规则
  INVITE_CODE_LENGTH: 8,         // 邀请码长度
  INVITE_CODE_PREFIX: 'LUXE',    // 邀请码前缀
};
```

## 完成状态
- ✅ 样式统一为黑灰色系
- ✅ 奖励规则调整为"只有下单才返现"
- ✅ 注册奖励改为"2张10元优惠券（满200可用）"
- ✅ 注册页面添加邀请码输入框
- ✅ 邀请码验证和保存逻辑
- ✅ 注册成功提示优惠券奖励
- ✅ 完整的后端接口设计文档
- ✅ 数据库表结构设计
- ✅ 业务流程说明

## 下一步
等待后端接口开发完成后，替换前端的 mock 数据为真实 API 调用。
