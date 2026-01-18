import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 导入中间件
import { errorHandler } from './middleware/error';
import { notFoundHandler } from './middleware/notFound';

// 导入路由
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import ordersRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import addressRoutes from './routes/address';
import couponsRoutes from './routes/coupons';
import pointsRoutes from './routes/points';
import inviteRoutes from './routes/invite';
import walletRoutes from './routes/wallet';
import postsRoutes from './routes/posts';
import reviewsRoutes from './routes/reviews';
import usersRoutes from './routes/users';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 中间件配置
// ============================================

// 安全头部
app.use(helmet());

// CORS 配置
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://bucdjuuybcywyercijfr.supabase.co',
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true,
}));

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
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
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);

// ============================================
// 错误处理
// ============================================

// 404 处理
app.use(notFoundHandler);

// 全局错误处理
app.use(errorHandler);

// ============================================
// 启动服务器
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
