import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('缺少 Supabase 配置环境变量');
}

// 客户端（用于前端交互）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端客户端（用于管理员操作，绕过 RLS）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 数据库表名常量
export const TABLES = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  CART_ITEMS: 'cart_items',
  ADDRESSES: 'addresses',
  COUPONS: 'coupons',
  USER_COUPONS: 'user_coupons',
  POINTS_RECORDS: 'points_records',
  INVITE_RECORDS: 'invite_records',
  REWARD_RECORDS: 'reward_records',
  WALLET_TRANSACTIONS: 'wallet_transactions',
  POSTS: 'posts',
  POST_COMMENTS: 'post_comments',
  REVIEWS: 'reviews',
  REFUNDS: 'refunds',
  CHECKIN_RECORDS: 'checkin_records',
  MEMBERSHIPS: 'memberships',
} as const;

export default supabase;
