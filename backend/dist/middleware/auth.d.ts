import { Request, Response, NextFunction } from 'express';
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
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * 可选认证中间件（不强制要求登录）
 */
export declare const optionalAuth: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map