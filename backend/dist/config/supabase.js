"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TABLES = exports.supabaseAdmin = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error('缺少 Supabase 配置环境变量');
}
// 客户端（用于前端交互）
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// 服务端客户端（用于管理员操作，绕过 RLS）
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
// 数据库表名常量
exports.TABLES = {
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
};
exports.default = exports.supabase;
//# sourceMappingURL=supabase.js.map