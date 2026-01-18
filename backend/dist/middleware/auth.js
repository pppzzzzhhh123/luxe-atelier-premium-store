"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * JWT 认证中间件
 */
const authMiddleware = async (req, res, next) => {
    try {
        // 从请求头获取 token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: '未提供认证令牌' });
            return;
        }
        const token = authHeader.substring(7); // 移除 "Bearer " 前缀
        // 验证 token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // 将用户 ID 添加到请求对象
        req.userId = decoded.userId;
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: '无效的认证令牌' });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: '认证令牌已过期' });
            return;
        }
        res.status(500).json({ message: '认证失败' });
    }
};
exports.authMiddleware = authMiddleware;
/**
 * 可选认证中间件（不强制要求登录）
 */
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.userId = decoded.userId;
            req.user = decoded;
        }
        next();
    }
    catch (error) {
        // 可选认证失败不阻止请求
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map