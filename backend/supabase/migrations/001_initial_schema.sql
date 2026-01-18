-- LUÒJIAWANG 璐珈女装 - 数据库初始化脚本
-- Supabase PostgreSQL
-- 分两阶段创建：第一阶段创建表结构（不含外键），第二阶段添加外键约束

-- ============================================
-- 第一阶段：创建所有表（不含外键约束）
-- ============================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) DEFAULT '用户',
  avatar TEXT,
  password_hash TEXT,
  email VARCHAR(255),
  gender VARCHAR(10),
  birthday DATE,
  points INTEGER DEFAULT 0,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  invite_code VARCHAR(20) UNIQUE NOT NULL,
  invited_by UUID,
  is_member BOOLEAN DEFAULT FALSE,
  member_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- 2. 商品分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. 商品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category_id UUID,
  images TEXT[],
  specs JSONB,
  stock INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  is_hot BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. 收货地址表
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50),
  detail TEXT NOT NULL,
  tag VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. 优惠券模板表
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2),
  min_amount DECIMAL(10, 2) DEFAULT 0.00,
  description TEXT,
  total_count INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_days INTEGER,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. 订单表
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT '待付款',
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0.00,
  shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
  final_amount DECIMAL(10, 2) NOT NULL,
  address_id UUID,
  address_snapshot JSONB,
  coupon_id UUID,
  payment_method VARCHAR(50),
  payment_time TIMESTAMP,
  payment_deadline TIMESTAMP,
  shipping_time TIMESTAMP,
  received_time TIMESTAMP,
  remark TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. 订单商品表
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) NOT NULL,
  product_id UUID NOT NULL,
  product_snapshot JSONB NOT NULL,
  spec VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. 购物车表
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  spec VARCHAR(255),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. 用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  coupon_id UUID,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2),
  min_amount DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'unused',
  source VARCHAR(50),
  used_order_id VARCHAR(50),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- 10. 积分记录表
CREATE TABLE IF NOT EXISTS points_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  related_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 11. 邀请记录表
CREATE TABLE IF NOT EXISTS invite_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL,
  invitee_id UUID NOT NULL,
  invite_code VARCHAR(20) NOT NULL,
  registered_at TIMESTAMP DEFAULT NOW(),
  first_order_id VARCHAR(50),
  first_order_at TIMESTAMP,
  total_orders INTEGER DEFAULT 0,
  total_reward DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 12. 返现记录表
CREATE TABLE IF NOT EXISTS reward_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  invite_record_id UUID NOT NULL,
  order_id VARCHAR(50) NOT NULL,
  order_amount DECIMAL(10, 2) NOT NULL,
  reward_amount DECIMAL(10, 2) NOT NULL,
  reward_rate DECIMAL(5, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  available_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 13. 钱包交易记录表
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  description TEXT,
  related_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 14. 社区帖子表
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 15. 帖子评论表
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 16. 商品评价表
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  images TEXT[],
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 17. 退款/售后表
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT[],
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  admin_reply TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 18. 签到记录表
CREATE TABLE IF NOT EXISTS checkin_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  continuous_days INTEGER DEFAULT 1,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 19. 会员记录表
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 20. 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 第二阶段：添加外键约束
-- ============================================

-- users 表外键
ALTER TABLE users ADD CONSTRAINT fk_users_invited_by 
  FOREIGN KEY (invited_by) REFERENCES users(id);

-- categories 表外键
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent 
  FOREIGN KEY (parent_id) REFERENCES categories(id);

-- products 表外键
ALTER TABLE products ADD CONSTRAINT fk_products_category 
  FOREIGN KEY (category_id) REFERENCES categories(id);

-- addresses 表外键
ALTER TABLE addresses ADD CONSTRAINT fk_addresses_user 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- orders 表外键
ALTER TABLE orders ADD CONSTRAINT fk_orders_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_address 
  FOREIGN KEY (address_id) REFERENCES addresses(id);

-- order_items 表外键
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product 
  FOREIGN KEY (product_id) REFERENCES products(id);

-- cart_items 表外键
ALTER TABLE cart_items ADD CONSTRAINT fk_cart_items_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE cart_items ADD CONSTRAINT fk_cart_items_product 
  FOREIGN KEY (product_id) REFERENCES products(id);

-- user_coupons 表外键
ALTER TABLE user_coupons ADD CONSTRAINT fk_user_coupons_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_coupons ADD CONSTRAINT fk_user_coupons_coupon 
  FOREIGN KEY (coupon_id) REFERENCES coupons(id);

-- points_records 表外键
ALTER TABLE points_records ADD CONSTRAINT fk_points_records_user 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- invite_records 表外键
ALTER TABLE invite_records ADD CONSTRAINT fk_invite_records_inviter 
  FOREIGN KEY (inviter_id) REFERENCES users(id);
ALTER TABLE invite_records ADD CONSTRAINT fk_invite_records_invitee 
  FOREIGN KEY (invitee_id) REFERENCES users(id);

-- reward_records 表外键
ALTER TABLE reward_records ADD CONSTRAINT fk_reward_records_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE reward_records ADD CONSTRAINT fk_reward_records_invite 
  FOREIGN KEY (invite_record_id) REFERENCES invite_records(id);

-- wallet_transactions 表外键
ALTER TABLE wallet_transactions ADD CONSTRAINT fk_wallet_transactions_user 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- posts 表外键
ALTER TABLE posts ADD CONSTRAINT fk_posts_user 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- post_comments 表外键
ALTER TABLE post_comments ADD CONSTRAINT fk_post_comments_post 
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE post_comments ADD CONSTRAINT fk_post_comments_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE post_comments ADD CONSTRAINT fk_post_comments_parent 
  FOREIGN KEY (parent_id) REFERENCES post_comments(id);

-- reviews 表外键
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_order 
  FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_product 
  FOREIGN KEY (product_id) REFERENCES products(id);

-- refunds 表外键
ALTER TABLE refunds ADD CONSTRAINT fk_refunds_order 
  FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE refunds ADD CONSTRAINT fk_refunds_user 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- checkin_records 表外键
ALTER TABLE checkin_records ADD CONSTRAINT fk_checkin_records_user 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- memberships 表外键
ALTER TABLE memberships ADD CONSTRAINT fk_memberships_user 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- ============================================
-- 第三阶段：创建索引
-- ============================================

-- users 表索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_users_invited_by ON users(invited_by);

-- categories 表索引
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- products 表索引
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_hot ON products(is_hot);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);

-- addresses 表索引
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

-- orders 表索引
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- order_items 表索引
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- cart_items 表索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique ON cart_items(user_id, product_id, COALESCE(spec, ''));
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- user_coupons 表索引
CREATE INDEX IF NOT EXISTS idx_user_coupons_user ON user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_status ON user_coupons(status);

-- points_records 表索引
CREATE INDEX IF NOT EXISTS idx_points_records_user ON points_records(user_id);
CREATE INDEX IF NOT EXISTS idx_points_records_created ON points_records(created_at DESC);

-- invite_records 表索引
CREATE INDEX IF NOT EXISTS idx_invite_records_inviter ON invite_records(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invite_records_invitee ON invite_records(invitee_id);

-- reward_records 表索引
CREATE INDEX IF NOT EXISTS idx_reward_records_user ON reward_records(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_records_status ON reward_records(status);

-- wallet_transactions 表索引
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created ON wallet_transactions(created_at DESC);

-- posts 表索引
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

-- post_comments 表索引
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user ON post_comments(user_id);

-- reviews 表索引
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- refunds 表索引
CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_user ON refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- checkin_records 表索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_checkin_records_user_date ON checkin_records(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_checkin_records_user ON checkin_records(user_id);

-- memberships 表索引
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

-- ============================================
-- 第四阶段：创建触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 第五阶段：配置 Row Level Security (RLS)
-- ============================================

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的数据
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update_own ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY orders_select_own ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY orders_insert_own ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY cart_select_own ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY cart_insert_own ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY cart_update_own ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY cart_delete_own ON cart_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY addresses_select_own ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY addresses_insert_own ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY addresses_update_own ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY addresses_delete_own ON addresses FOR DELETE USING (auth.uid() = user_id);

-- 商品和分类对所有人可见
CREATE POLICY products_select_all ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY categories_select_all ON categories FOR SELECT USING (is_active = TRUE);

-- ============================================
-- 第六阶段：初始化系统配置
-- ============================================

INSERT INTO system_configs (key, value, description) VALUES
  ('invite_register_coupon_count', '2', '注册赠送优惠券数量'),
  ('invite_register_coupon_amount', '10', '注册优惠券面额'),
  ('invite_register_coupon_min', '200', '注册优惠券最低使用金额'),
  ('invite_order_reward_rate', '0.05', '订单返现比例'),
  ('points_per_yuan', '1', '每元订单获得积分'),
  ('points_checkin_base', '10', '签到基础积分'),
  ('membership_annual_fee', '299', '年费会员价格')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 完成
-- ============================================

COMMENT ON TABLE users IS '用户表';
COMMENT ON TABLE products IS '商品表';
COMMENT ON TABLE orders IS '订单表';
COMMENT ON TABLE order_items IS '订单商品表';
COMMENT ON TABLE cart_items IS '购物车表';
COMMENT ON TABLE addresses IS '收货地址表';
COMMENT ON TABLE coupons IS '优惠券模板表';
COMMENT ON TABLE user_coupons IS '用户优惠券表';
COMMENT ON TABLE invite_records IS '邀请记录表';
COMMENT ON TABLE reward_records IS '返现记录表';
COMMENT ON TABLE wallet_transactions IS '钱包交易记录表';
COMMENT ON TABLE posts IS '社区帖子表';
COMMENT ON TABLE reviews IS '商品评价表';
COMMENT ON TABLE checkin_records IS '签到记录表';
