import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * 扩展 Request 接口，添加 userId 字段
 */
export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

/**
 * JWT 认证中间件
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: '未提供认证令牌' });
      return;
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证 token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string };

    // 将用户 ID 添加到请求对象
    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: '无效的认证令牌' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: '认证令牌已过期' });
      return;
    }
    res.status(500).json({ message: '认证失败' });
  }
};

/**
 * 可选认证中间件（不强制要求登录）
 */
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: string };
      
      req.userId = decoded.userId;
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // 可选认证失败不阻止请求
    next();
  }
};
