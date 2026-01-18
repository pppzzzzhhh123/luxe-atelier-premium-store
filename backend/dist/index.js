"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// 导入中间件
const error_1 = require("./middleware/error");
const notFound_1 = require("./middleware/notFound");
// 导入路由
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const cart_1 = __importDefault(require("./routes/cart"));
const address_1 = __importDefault(require("./routes/address"));
const coupons_1 = __importDefault(require("./routes/coupons"));
const points_1 = __importDefault(require("./routes/points"));
const invite_1 = __importDefault(require("./routes/invite"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const posts_1 = __importDefault(require("./routes/posts"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const users_1 = __importDefault(require("./routes/users"));
// 加载环境变量
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ============================================
// 中间件配置
// ============================================
// 安全头部
app.use((0, helmet_1.default)());
// CORS 配置
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://bucdjuuybcywyercijfr.supabase.co',
        process.env.FRONTEND_URL || '*'
    ],
    credentials: true,
}));
// 请求体解析
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 日志
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
// ============================================
// 路由配置
// ============================================
// 健康检查
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API 路由
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/cart', cart_1.default);
app.use('/api/addresses', address_1.default);
app.use('/api/coupons', coupons_1.default);
app.use('/api/points', points_1.default);
app.use('/api/invite', invite_1.default);
app.use('/api/wallet', wallet_1.default);
app.use('/api/posts', posts_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/users', users_1.default);
// ============================================
// 错误处理
// ============================================
// 404 处理
app.use(notFound_1.notFoundHandler);
// 全局错误处理
app.use(error_1.errorHandler);
// ============================================
// 启动服务器
// ============================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map