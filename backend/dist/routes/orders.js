"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * 生成订单号
 */
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${timestamp}${random}`;
}
/**
 * GET /api/orders
 * 获取订单列表
 */
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { status, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        let query = supabase_1.supabase
            .from('orders')
            .select('*, order_items(*)', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (status) {
            query = query.eq('status', status);
        }
        query = query.range(offset, offset + limitNum - 1);
        const { data: orders, error, count } = await query;
        if (error) {
            console.error('获取订单列表失败:', error);
            return res.status(500).json({ message: '获取订单列表失败' });
        }
        res.json({
            orders,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limitNum),
            },
        });
    }
    catch (error) {
        console.error('获取订单列表错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * GET /api/orders/:id
 * 获取订单详情
 */
router.get('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { data: order, error } = await supabase_1.supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error || !order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        res.json({ order });
    }
    catch (error) {
        console.error('获取订单详情错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * POST /api/orders
 * 创建订单
 */
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId, cartItemIds, couponId, remark, shippingFee = 0, } = req.body;
        // 验证必填字段
        if (!addressId || !cartItemIds || cartItemIds.length === 0) {
            return res.status(400).json({ message: '收货地址和商品不能为空' });
        }
        // 获取收货地址
        const { data: address } = await supabase_1.supabase
            .from('addresses')
            .select('*')
            .eq('id', addressId)
            .eq('user_id', userId)
            .single();
        if (!address) {
            return res.status(404).json({ message: '收货地址不存在' });
        }
        // 获取购物车商品
        const { data: cartItems } = await supabase_1.supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .in('id', cartItemIds)
            .eq('user_id', userId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: '购物车商品不存在' });
        }
        // 计算订单金额
        let totalAmount = 0;
        const orderItems = [];
        for (const item of cartItems) {
            const product = item.product;
            // 检查库存
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `商品 ${product.title} 库存不足`
                });
            }
            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;
            orderItems.push({
                product_id: product.id,
                product_snapshot: product,
                spec: item.spec,
                price: product.price,
                quantity: item.quantity,
                subtotal,
            });
        }
        // 处理优惠券
        let discountAmount = 0;
        if (couponId) {
            const { data: coupon } = await supabase_1.supabase
                .from('user_coupons')
                .select('*')
                .eq('id', couponId)
                .eq('user_id', userId)
                .eq('status', 'unused')
                .single();
            if (coupon) {
                if (totalAmount >= coupon.min_amount) {
                    discountAmount = coupon.amount;
                }
            }
        }
        const finalAmount = totalAmount - discountAmount + shippingFee;
        // 生成订单号
        const orderId = generateOrderId();
        // 创建订单
        const { data: order, error: orderError } = await supabase_1.supabase
            .from('orders')
            .insert({
            id: orderId,
            user_id: userId,
            status: '待付款',
            total_amount: totalAmount,
            discount_amount: discountAmount,
            shipping_fee: shippingFee,
            final_amount: finalAmount,
            address_id: addressId,
            address_snapshot: address,
            coupon_id: couponId,
            remark,
            payment_deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟后过期
        })
            .select()
            .single();
        if (orderError) {
            console.error('创建订单失败:', orderError);
            return res.status(500).json({ message: '创建订单失败' });
        }
        // 创建订单商品
        const orderItemsWithOrderId = orderItems.map(item => ({
            ...item,
            order_id: orderId,
        }));
        const { error: itemsError } = await supabase_1.supabase
            .from('order_items')
            .insert(orderItemsWithOrderId);
        if (itemsError) {
            console.error('创建订单商品失败:', itemsError);
            // 回滚订单
            await supabase_1.supabase.from('orders').delete().eq('id', orderId);
            return res.status(500).json({ message: '创建订单失败' });
        }
        // 清空购物车
        await supabase_1.supabase
            .from('cart_items')
            .delete()
            .in('id', cartItemIds);
        res.status(201).json({
            message: '订单创建成功',
            order,
        });
    }
    catch (error) {
        console.error('创建订单错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * POST /api/orders/:id/pay
 * 支付订单
 */
router.post('/:id/pay', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { paymentMethod } = req.body;
        // 获取订单
        const { data: order } = await supabase_1.supabase
            .from('orders')
            .select('*, order_items(*, product:products(*))')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        if (order.status !== '待付款') {
            return res.status(400).json({ message: '订单状态不正确' });
        }
        // 检查是否超时
        if (new Date(order.payment_deadline) < new Date()) {
            await supabase_1.supabase
                .from('orders')
                .update({ status: '已取消' })
                .eq('id', id);
            return res.status(400).json({ message: '订单已超时' });
        }
        // TODO: 调用支付接口（微信/支付宝/余额）
        // 这里模拟支付成功
        // 更新订单状态
        const { error: updateError } = await supabase_1.supabase
            .from('orders')
            .update({
            status: '待发货',
            payment_method: paymentMethod,
            payment_time: new Date().toISOString(),
        })
            .eq('id', id);
        if (updateError) {
            console.error('更新订单失败:', updateError);
            return res.status(500).json({ message: '支付失败' });
        }
        // 扣减库存
        for (const item of order.order_items) {
            await supabase_1.supabase
                .from('products')
                .update({
                stock: item.product.stock - item.quantity,
                sales_count: item.product.sales_count + item.quantity,
            })
                .eq('id', item.product_id);
        }
        // 使用优惠券
        if (order.coupon_id) {
            await supabase_1.supabase
                .from('user_coupons')
                .update({
                status: 'used',
                used_order_id: id,
                used_at: new Date().toISOString(),
            })
                .eq('id', order.coupon_id);
        }
        // 增加积分（每元1积分）
        const points = Math.floor(order.final_amount);
        // 获取当前积分
        const { data: currentUser } = await supabase_1.supabase
            .from('users')
            .select('points')
            .eq('id', userId)
            .single();
        // 更新积分
        await supabase_1.supabase
            .from('users')
            .update({
            points: (currentUser?.points || 0) + points,
        })
            .eq('id', userId);
        await supabase_1.supabase.from('points_records').insert({
            user_id: userId,
            type: 'order',
            points,
            description: `订单消费获得积分`,
            related_id: id,
        });
        // 处理邀请返现
        const { data: user } = await supabase_1.supabase
            .from('users')
            .select('invited_by')
            .eq('id', userId)
            .single();
        if (user?.invited_by) {
            // 检查是否是首单
            const { data: inviteRecord } = await supabase_1.supabase
                .from('invite_records')
                .select('*')
                .eq('invitee_id', userId)
                .single();
            if (inviteRecord && !inviteRecord.first_order_id) {
                // 首单，给邀请人返现
                const rewardRate = 0.05; // 5%
                const rewardAmount = order.final_amount * rewardRate;
                // 更新邀请记录
                await supabase_1.supabase
                    .from('invite_records')
                    .update({
                    first_order_id: id,
                    first_order_at: new Date().toISOString(),
                    total_orders: 1,
                    total_reward: rewardAmount,
                })
                    .eq('id', inviteRecord.id);
                // 创建返现记录
                await supabase_1.supabase.from('reward_records').insert({
                    user_id: user.invited_by,
                    invite_record_id: inviteRecord.id,
                    order_id: id,
                    order_amount: order.final_amount,
                    reward_amount: rewardAmount,
                    reward_rate: rewardRate,
                    status: 'pending',
                    available_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后可提现
                });
            }
        }
        res.json({
            message: '支付成功',
            order: { ...order, status: '待发货' },
        });
    }
    catch (error) {
        console.error('支付订单错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * POST /api/orders/:id/cancel
 * 取消订单
 */
router.post('/:id/cancel', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { data: order } = await supabase_1.supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        if (order.status !== '待付款') {
            return res.status(400).json({ message: '该订单无法取消' });
        }
        const { error } = await supabase_1.supabase
            .from('orders')
            .update({ status: '已取消' })
            .eq('id', id);
        if (error) {
            console.error('取消订单失败:', error);
            return res.status(500).json({ message: '取消订单失败' });
        }
        res.json({ message: '订单已取消' });
    }
    catch (error) {
        console.error('取消订单错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * POST /api/orders/:id/confirm
 * 确认收货
 */
router.post('/:id/confirm', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { data: order } = await supabase_1.supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        if (order.status !== '待收货') {
            return res.status(400).json({ message: '订单状态不正确' });
        }
        const { error } = await supabase_1.supabase
            .from('orders')
            .update({
            status: '已完成',
            received_time: new Date().toISOString(),
        })
            .eq('id', id);
        if (error) {
            console.error('确认收货失败:', error);
            return res.status(500).json({ message: '确认收货失败' });
        }
        res.json({ message: '确认收货成功' });
    }
    catch (error) {
        console.error('确认收货错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map