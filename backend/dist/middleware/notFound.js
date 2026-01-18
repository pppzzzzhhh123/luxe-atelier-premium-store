"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
/**
 * 404 Not Found 处理中间件
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `路由 ${req.originalUrl} 不存在`
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFound.js.map