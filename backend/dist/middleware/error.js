"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
/**
 * 自定义错误类
 */
class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
/**
 * 全局错误处理中间件
 */
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || '服务器内部错误';
    // 开发环境返回详细错误信息
    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            error: true,
            message,
            stack: err.stack,
        });
    }
    else {
        // 生产环境只返回错误消息
        res.status(statusCode).json({
            error: true,
            message,
        });
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map