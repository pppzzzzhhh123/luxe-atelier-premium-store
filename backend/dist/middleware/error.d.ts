import { Request, Response, NextFunction } from 'express';
/**
 * 自定义错误类
 */
export declare class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
/**
 * 全局错误处理中间件
 */
export declare const errorHandler: (err: Error | AppError, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.d.ts.map