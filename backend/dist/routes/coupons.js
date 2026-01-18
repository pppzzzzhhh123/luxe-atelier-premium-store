"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * GET /api/coupons
 * 获取用户优惠券列表
 */
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { status } = req.query;
        let query = supabase_1.supabase
            .from('user_coupons')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (status) {
            query = query.eq('status', status);
        }
        const { data: coupons, error } = await query;
        if (error) {
            console.error('获取优惠券列表失败:', error);
            return res.status(500).json({ message: '获取优惠券列表失败' });
        }
        res.json({ coupons });
    }
    catch (error) {
        console.error('获取优惠券列表错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * GET /api/coupons/available
 * 获取可用优惠券（根据订单金额）
 */
router.get('/available', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { amount } = req.query;
        if (!amount) {
            return res.status(400).json({ message: '订单金额不能为空' });
        }
        const orderAmount = parseFloat(amount);
        const { data: coupons, error } = await supabase_1.supabase
            .from('user_coupons')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'unused')
            .lte('min_amount', orderAmount)
            .gte('expires_at', new Date().toISOString())
            .order('amount', { ascending: false });
        if (error) {
            console.error('获取可用优惠券失败:', error);
            return res.status(500).json({ message: '获取可用优惠券失败' });
        }
        res.json({ coupons });
    }
    catch (error) {
        console.error('获取可用优惠券错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * POST /api/coupons/receive
 * 领取优惠券
 */
router.post('/receive', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { couponId } = req.body;
        if (!couponId) {
            return res.status(400).json({ message: '优惠券ID不能为空' });
        }
        // 获取优惠券模板
        const { data: couponTemplate, error: templateError } = await supabase_1.supabase
            .from('coupons')
            .select('*')
            .eq('id', couponId)
            .eq('is_active', true)
            .single();
        if (templateError || !couponTemplate) {
            return res.status(404).json({ message: '优惠券不存在' });
        }
        // 检查是否已领取
        const { data: existingCoupon } = await supabase_1.supabase
            .from('user_coupons')
            .select('*')
            .eq('user_id', userId)
            .eq('coupon_id', couponId)
            .single();
        if (existingCoupon) {
            return res.status(400).json({ message: '您已领取过该优惠券' });
        }
        // 检查库存
        if (couponTemplate.total_count && couponTemplate.used_count >= couponTemplate.total_count) {
            return res.status(400).json({ message: '优惠券已领完' });
        }
        // 计算过期时间
        let expiresAt;
        if (couponTemplate.valid_days) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + couponTemplate.valid_days);
        }
        else if (couponTemplate.end_date) {
            expiresAt = new Date(couponTemplate.end_date);
        }
        else {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 默认30天
        }
        // 创建用户优惠券
        const { data: userCoupon, error } = await supabase_1.supabase
            .from('user_coupons')
            .insert({
            user_id: userId,
            coupon_id: couponId,
            title: couponTemplate.title,
            amount: couponTemplate.amount,
            min_amount: couponTemplate.min_amount,
            status: 'unused',
            source: 'manual',
            expires_at: expiresAt.toISOString(),
        })
            .select()
            .single();
        if (error) {
            console.error('领取优惠券失败:', error);
            return res.status(500).json({ message: '领取优惠券失败' });
        }
        // 更新优惠券使用数量
        await supabase_1.supabase
            .from('coupons')
            .update({ used_count: couponTemplate.used_count + 1 })
            .eq('id', couponId);
        res.status(201).json({
            message: '领取成功',
            coupon: userCoupon,
        });
    }
    catch (error) {
        console.error('领取优惠券错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
exports.default = router;
//# sourceMappingURL=coupons.js.map