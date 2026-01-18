"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * GET /api/invite/stats
 * 获取邀请统计数据
 */
router.get('/stats', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        // 获取邀请人数
        const { data: inviteRecords, count: inviteCount } = await supabase_1.supabase
            .from('invite_records')
            .select('*', { count: 'exact' })
            .eq('inviter_id', userId);
        // 获取返现记录
        const { data: rewardRecords } = await supabase_1.supabase
            .from('reward_records')
            .select('*')
            .eq('user_id', userId);
        // 计算各状态金额
        let pendingAmount = 0;
        let availableAmount = 0;
        let completedAmount = 0;
        rewardRecords?.forEach(record => {
            if (record.status === 'pending') {
                pendingAmount += parseFloat(record.reward_amount);
            }
            else if (record.status === 'available') {
                availableAmount += parseFloat(record.reward_amount);
            }
            else if (record.status === 'completed') {
                completedAmount += parseFloat(record.reward_amount);
            }
        });
        res.json({
            inviteCount: inviteCount || 0,
            pendingAmount,
            availableAmount,
            completedAmount,
            totalAmount: pendingAmount + availableAmount + completedAmount,
        });
    }
    catch (error) {
        console.error('获取邀请统计错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * GET /api/invite/records
 * 获取邀请记录列表
 */
router.get('/records', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const { data: records, error, count } = await supabase_1.supabase
            .from('invite_records')
            .select(`
        *,
        invitee:users!invite_records_invitee_id_fkey(id, name, phone, created_at)
      `, { count: 'exact' })
            .eq('inviter_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limitNum - 1);
        if (error) {
            console.error('获取邀请记录失败:', error);
            return res.status(500).json({ message: '获取邀请记录失败' });
        }
        res.json({
            records,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limitNum),
            },
        });
    }
    catch (error) {
        console.error('获取邀请记录错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * GET /api/invite/rewards
 * 获取返现记录列表
 */
router.get('/rewards', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { status, page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        let query = supabase_1.supabase
            .from('reward_records')
            .select(`
        *,
        invite_record:invite_records(
          invitee:users!invite_records_invitee_id_fkey(name, phone)
        )
      `, { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (status) {
            query = query.eq('status', status);
        }
        query = query.range(offset, offset + limitNum - 1);
        const { data: rewards, error, count } = await query;
        if (error) {
            console.error('获取返现记录失败:', error);
            return res.status(500).json({ message: '获取返现记录失败' });
        }
        res.json({
            rewards,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limitNum),
            },
        });
    }
    catch (error) {
        console.error('获取返现记录错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
/**
 * POST /api/invite/withdraw
 * 提现到余额
 */
router.post('/withdraw', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        // 获取可提现的返现记录
        const { data: availableRewards } = await supabase_1.supabase
            .from('reward_records')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'available')
            .lte('available_at', new Date().toISOString());
        if (!availableRewards || availableRewards.length === 0) {
            return res.status(400).json({ message: '暂无可提现金额' });
        }
        // 计算总金额
        const totalAmount = availableRewards.reduce((sum, record) => sum + parseFloat(record.reward_amount), 0);
        // 获取当前余额
        const { data: user } = await supabase_1.supabase
            .from('users')
            .select('balance')
            .eq('id', userId)
            .single();
        const newBalance = parseFloat(user?.balance || '0') + totalAmount;
        // 更新用户余额
        const { error: updateError } = await supabase_1.supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', userId);
        if (updateError) {
            console.error('更新余额失败:', updateError);
            return res.status(500).json({ message: '提现失败' });
        }
        // 更新返现记录状态
        const rewardIds = availableRewards.map(r => r.id);
        await supabase_1.supabase
            .from('reward_records')
            .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
        })
            .in('id', rewardIds);
        // 创建钱包交易记录
        await supabase_1.supabase.from('wallet_transactions').insert({
            user_id: userId,
            type: 'invite_reward',
            amount: totalAmount,
            balance_after: newBalance,
            description: '邀请返现提现',
            status: 'completed',
        });
        res.json({
            message: '提现成功',
            amount: totalAmount,
            newBalance,
        });
    }
    catch (error) {
        console.error('提现错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
exports.default = router;
//# sourceMappingURL=invite.js.map