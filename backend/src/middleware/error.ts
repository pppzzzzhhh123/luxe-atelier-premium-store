import { Request, Response, NextFunction } from 'express';

/**
 * 自定义错误类
 */
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = (err as AppError).statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  // 开发环境返回详细错误信息
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      error: true,
      message,
      stack: err.stack,
    });
  } else {
    // 生产环境只返回错误消息
    res.status(statusCode).json({
      error: true,
      message,
    });
  }
};
