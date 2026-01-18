import React, { useState } from 'react';
import { inviteAPI } from '../src/api';

interface InviteRewardProps {
  onBack: () => void;
  showFeedback: (message: string) => void;
  onAddCoupon?: (coupon: any) => void;
  onUpdateBalance?: (amount: number) => void;
  onAddTransaction?: (transaction: any) => void;
}

interface InviteData {
  inviteCode: string;
  totalInvited: number;
  totalReward: number;
  pendingReward: number;
  completedReward: number;
}

interface InvitedFriend {
  id: number;
  name: string;
  avatar: string;
  registerTime: string;
  orderCount: number;
  reward: number;
  status: 'pending' | 'completed';
}

const InviteReward: React.FC<InviteRewardProps> = ({ onBack, showFeedback, onAddCoupon, onUpdateBalance, onAddTransaction }) => {
  const [activeTab, setActiveTab] = useState<'invite' | 'friends' | 'records'>('invite');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 用户邀请数据 - 使用 state 以便更新
  const [inviteData, setInviteData] = useState<InviteData>({
    inviteCode: 'LUXE8888',
    totalInvited: 12,
    totalReward: 580.00,
    pendingReward: 120.00,
    completedReward: 460.00,
  });

  // 邀请好友列表
  const [friends] = useState<InvitedFriend[]>([
    {
      id: 1,
      name: '张**',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      registerTime: '2026-01-15 14:30',
      orderCount: 3,
      reward: 50.00,
      status: 'completed',
    },
    {
      id: 2,
      name: '李**',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      registerTime: '2026-01-16 10:20',
      orderCount: 1,
      reward: 30.00,
      status: 'completed',
    },
    {
      id: 3,
      name: '王**',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      registerTime: '2026-01-17 09:15',
      orderCount: 0,
      reward: 20.00,
      status: 'pending',
    },
  ]);

  // 返现记录
  const rewardRecords = [
    { id: 1, type: '订单返现', friend: '张**', amount: 25.00, time: '2026-01-15 14:35', status: '已到账' },
    { id: 2, type: '订单返现', friend: '张**', amount: 30.00, time: '2026-01-15 16:20', status: '已到账' },
    { id: 3, type: '订单返现', friend: '李**', amount: 20.00, time: '2026-01-16 10:25', status: '已到账' },
    { id: 4, type: '订单返现', friend: '李**', amount: 10.00, time: '2026-01-16 15:40', status: '已到账' },
    { id: 5, type: '订单返现', friend: '王**', amount: 35.00, time: '2026-01-17 09:20', status: '待到账' },
  ];

  // 提现到余额
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      showFeedback('请输入有效金额');
      return;
    }
    
    if (amount > inviteData.completedReward) {
      showFeedback('可提现金额不足');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 调用后端 API 提现
      const response: any = await inviteAPI.withdraw(amount);
      
      console.log('✅ 邀请返现提现成功:', response);
      
      // 1. 更新余额
      if (onUpdateBalance) {
        onUpdateBalance(amount);
      }
      
      // 2. 添加钱包交易记录
      if (onAddTransaction) {
        onAddTransaction({
          id: Date.now(),
          type: '收入',
          title: '邀请返现提现',
          amount: amount,
          time: new Date().toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          }).replace(/\//g, '-')
        });
      }
      
      // 3. 更新邀请返现数据（减少已到账金额）
      setInviteData(prev => ({
        ...prev,
        completedReward: prev.completedReward - amount
      }));
      
      setIsProcessing(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      showFeedback(`成功提现¥${amount.toFixed(2)}到余额`);
    } catch (error: any) {
      console.error('❌ 邀请返现提现失败:', error);
      setIsProcessing(false);
      showFeedback(error || '提现失败，请稍后重试');
    }
  };

  // 复制邀请码
  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteData.inviteCode);
    showFeedback('邀请码已复制');
  };

  // 复制邀请链接
  const handleCopyLink = () => {
    const link = `https://luxe-atelier.com/invite/${inviteData.inviteCode}`;
    navigator.clipboard.writeText(link);
    showFeedback('邀请链接已复制');
  };

  // 分享功能
  const handleShare = (platform: string) => {
    const link = `https://luxe-atelier.com/invite/${inviteData.inviteCode}`;
    const text = `我在LUÒJIAWANG璐珈女装发现了超棒的商品！使用我的邀请码 ${inviteData.inviteCode} 注册，你我都能获得优惠券！`;
    
    switch (platform) {
      case 'wechat':
        showFeedback('请在微信中打开分享');
        break;
      case 'moments':
        showFeedback('请在微信中打开分享到朋友圈');
        break;
      case 'qq':
        window.open(`mqqwpa://im/chat?share_url=${encodeURIComponent(link)}&title=${encodeURIComponent(text)}`);
        break;
      case 'weibo':
        window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(link)}&title=${encodeURIComponent(text)}`);
        break;
      case 'copy':
        handleCopyLink();
        break;
    }
    setShowShareModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span className="text-[14px] font-bold">分享返现</span>
          <button className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'invite' ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            邀请好友
            {activeTab === 'invite' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'friends' ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            我的好友
            {activeTab === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'records' ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            返现记录
            {activeTab === 'records' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
            )}
          </button>
        </div>
      </header>

      {/* 邀请页面 */}
      {activeTab === 'invite' && (
        <div className="px-4 py-6 space-y-6">
          {/* 收益卡片 */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm opacity-80 mb-1">累计收益</p>
                <p className="text-3xl font-bold">¥{inviteData.totalReward.toFixed(2)}</p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-4xl">redeem</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-xs opacity-70 mb-1">已邀请</p>
                <p className="text-lg font-bold">{inviteData.totalInvited}人</p>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1">待到账</p>
                <p className="text-lg font-bold">¥{inviteData.pendingReward}</p>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1">已到账</p>
                <p className="text-lg font-bold">¥{inviteData.completedReward}</p>
              </div>
            </div>

            {/* 提现按钮 */}
            {inviteData.completedReward > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                  提现到余额
                </button>
              </div>
            )}
          </div>

          {/* 邀请码 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">我的邀请码</h3>
              <span className="text-xs text-gray-400">分享给好友注册</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex-1">
                <p className="text-2xl font-bold text-slate-800 tracking-widest">{inviteData.inviteCode}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold active:scale-95 transition-transform"
              >
                复制
              </button>
            </div>
          </div>

          {/* 奖励规则 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold mb-4">奖励规则</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-slate-700">person_add</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">好友注册</p>
                  <p className="text-xs text-gray-500">好友使用你的邀请码注册，好友获得 <span className="text-slate-800 font-bold">2张10元优惠券</span>（满200可用）</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-slate-700">shopping_bag</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">好友下单</p>
                  <p className="text-xs text-gray-500">好友完成订单支付，你获得订单金额 <span className="text-slate-800 font-bold">5%</span> 现金返现</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-slate-700">payments</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">返现到账</p>
                  <p className="text-xs text-gray-500">订单完成后 <span className="text-slate-800 font-bold">24小时内</span> 返现自动到账钱包，可提现或购物</p>
                </div>
              </div>
            </div>
          </div>

          {/* 分享按钮 */}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full h-14 bg-slate-800 text-white rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl">share</span>
            立即分享邀请好友
          </button>
        </div>
      )}

      {/* 我的好友页面 */}
      {activeTab === 'friends' && (
        <div className="px-4 py-6">
          {friends.length > 0 ? (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold">{friend.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          friend.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {friend.status === 'completed' ? '已返现' : '待返现'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">注册时间：{friend.registerTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">+¥{friend.reward}</p>
                      <p className="text-xs text-gray-400">{friend.orderCount}笔订单</p>
                    </div>
                  </div>

                  {friend.status === 'pending' && (
                    <div className="bg-orange-50 rounded-lg p-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-orange-500 text-sm">info</span>
                      <p className="text-xs text-orange-600">好友完成首单后，返现将自动到账</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-300 text-5xl">group</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">还没有邀请好友</p>
              <button
                onClick={() => setActiveTab('invite')}
                className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold active:scale-95 transition-transform"
              >
                立即邀请
              </button>
            </div>
          )}
        </div>
      )}

      {/* 返现记录页面 */}
      {activeTab === 'records' && (
        <div className="px-4 py-6">
          {rewardRecords.length > 0 ? (
            <div className="space-y-3">
              {rewardRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-700">payments</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{record.type}</p>
                        <p className="text-xs text-gray-400">来自好友：{record.friend}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">+¥{record.amount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        record.status === '已到账' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 pl-12">{record.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-300 text-5xl">receipt_long</span>
              </div>
              <p className="text-gray-400 text-sm">暂无返现记录</p>
            </div>
          )}
        </div>
      )}

      {/* 分享弹窗 */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
          
          <div className="relative w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">分享给好友</h3>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-gray-400">close</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
              <button onClick={() => handleShare('wechat')} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">微</span>
                </div>
                <span className="text-xs text-gray-600">微信</span>
              </button>

              <button onClick={() => handleShare('moments')} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-2xl">public</span>
                </div>
                <span className="text-xs text-gray-600">朋友圈</span>
              </button>

              <button onClick={() => handleShare('qq')} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">Q</span>
                </div>
                <span className="text-xs text-gray-600">QQ</span>
              </button>

              <button onClick={() => handleShare('weibo')} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">微</span>
                </div>
                <span className="text-xs text-gray-600">微博</span>
              </button>
            </div>

            <button
              onClick={() => handleShare('copy')}
              className="w-full h-12 bg-gray-100 text-gray-700 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">content_copy</span>
              复制邀请链接
            </button>
          </div>
        </div>
      )}

      {/* 提现弹窗 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)} />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-3xl p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">提现到余额</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="material-symbols-outlined text-gray-300">close</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">可提现金额</p>
                  <p className="text-2xl font-bold text-slate-800">¥{inviteData.completedReward.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">account_balance_wallet</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">提现金额</p>
                <button 
                  onClick={() => setWithdrawAmount(inviteData.completedReward.toString())}
                  className="text-xs font-bold text-slate-800 tracking-widest uppercase"
                >
                  全部提现
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-gray-400">¥</span>
                <input 
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-4 bg-slate-50 border-none rounded-xl text-xl font-black font-sans focus:ring-2 focus:ring-slate-800/10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">info</span>
                <p className="text-xs text-blue-800 leading-relaxed">
                  提现金额将立即转入您的账户余额，可用于购物或继续提现到银行卡。
                </p>
              </div>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={isProcessing || !withdrawAmount}
              className="w-full bg-slate-800 text-white py-5 rounded-2xl text-sm font-bold tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '确认提现'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteReward;
