
import React, { useState } from 'react';
import PaymentDetails from './PaymentDetails';
import { walletAPI } from '../src/api';

interface WalletProps {
  balance: number;
  onBack: () => void;
  showFeedback?: (message: string) => void;
  onBalanceChange?: (newBalance: number) => void;
}

const Wallet: React.FC<WalletProps> = ({ balance: initialBalance, onBack, showFeedback, onBalanceChange }) => {
  const [balance, setBalance] = useState(initialBalance);
  
  // 同步外部 balance 变化
  React.useEffect(() => {
    setBalance(initialBalance);
  }, [initialBalance]);
  
  // 当本地 balance 变化时，通知父组件
  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
    if (onBalanceChange) {
      onBalanceChange(newBalance);
    }
  };
  const [activeTab, setActiveTab] = useState<'all' | 'in' | 'out'>('all');
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('500');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  
  // 新卡信息
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    bank: '',
  });

  const [transactions, setTransactions] = useState([
    { id: 1, type: '支出', title: '订单支付 - 廓形西装外套', amount: -6400.00, time: '2026-01-18 14:20' },
    { id: 2, type: '收入', title: '充值奖励', amount: 100.00, time: '2026-01-16 09:15' },
    { id: 3, type: '支出', title: '订单支付 - 极细羊绒开衫', amount: -4200.00, time: '2026-01-15 10:30' },
    { id: 4, type: '收入', title: '钱包充值', amount: 1000.00, time: '2026-01-14 11:00' },
  ]);

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'in') return t.amount > 0;
    if (activeTab === 'out') return t.amount < 0;
    return true;
  });

  const handleRecharge = async () => {
    setIsProcessing(true);
    
    try {
      const amount = parseFloat(rechargeAmount);
      
      // 调用后端 API 充值
      const response: any = await walletAPI.recharge(amount, 'alipay');
      
      console.log('✅ 充值成功:', response);
      
      const newBalance = balance + amount;
      updateBalance(newBalance);
      
      setTransactions([
        { id: Date.now(), type: '收入', title: '钱包充值', amount: amount, time: '刚刚' },
        ...transactions
      ]);
      
      setIsProcessing(false);
      setIsRechargeOpen(false);
      setShowSuccess('充值成功');
      setTimeout(() => setShowSuccess(null), 2000);
    } catch (error: any) {
      console.error('❌ 充值失败:', error);
      setIsProcessing(false);
      if (showFeedback) {
        showFeedback(error || '充值失败，请稍后重试');
      } else {
        alert(error || '充值失败，请稍后重试');
      }
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > balance) {
      if (showFeedback) {
        showFeedback('余额不足');
      } else {
        alert('余额不足');
      }
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 调用后端 API 提现
      const response: any = await walletAPI.withdraw(amount, 'default-bank-card-id');
      
      console.log('✅ 提现成功:', response);
      
      const newBalance = balance - amount;
      updateBalance(newBalance);
      
      setTransactions([
        { id: Date.now(), type: '支出', title: '钱包提现', amount: -amount, time: '刚刚' },
        ...transactions
      ]);
      
      setIsProcessing(false);
      setIsWithdrawOpen(false);
      setShowSuccess('提现申请已提交');
      setTimeout(() => setShowSuccess(null), 2000);
    } catch (error: any) {
      console.error('❌ 提现失败:', error);
      setIsProcessing(false);
      if (showFeedback) {
        showFeedback(error || '提现失败，请稍后重试');
      } else {
        alert(error || '提现失败，请稍后重试');
      }
    }
  };

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.cardHolder || !newCard.bank) {
      if (showFeedback) {
        showFeedback('请填写完整信息');
      }
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsAddCardOpen(false);
      setNewCard({ cardNumber: '', cardHolder: '', bank: '' });
      setShowSuccess('银行卡添加成功');
      setTimeout(() => setShowSuccess(null), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans relative pb-10">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 h-14 flex items-center border-b border-gray-50">
        <button onClick={onBack} className="material-symbols-outlined text-[24px]">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px] tracking-widest uppercase">我的钱包</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#3a3a3a] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden mb-8 animate-in fade-in zoom-in duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <p className="text-[11px] opacity-40 uppercase tracking-[0.2em] mb-2 font-bold">可用余额 (元)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-serif">¥</span>
            <h2 className="text-4xl font-black font-sans tracking-tighter">
              {balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          
          <div className="flex gap-4 mt-10">
            <button 
              onClick={() => setIsRechargeOpen(true)}
              className="flex-1 bg-white text-black py-3 rounded-xl text-[12px] font-bold tracking-widest uppercase active:scale-95 transition-transform"
            >
              充值
            </button>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 py-3 rounded-xl text-[12px] font-bold tracking-widest uppercase active:scale-95 transition-transform"
            >
              提现
            </button>
          </div>
        </div>

        {/* Bank Cards Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">关联账户</h3>
            <button onClick={() => setIsAddCardOpen(true)} className="text-[10px] font-bold text-primary tracking-widest uppercase">+ 添加新卡</button>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-50 flex items-center justify-between shadow-sm active:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
              </div>
              <div>
                <p className="text-[14px] font-bold">中国工商银行 (储蓄卡)</p>
                <p className="text-[11px] text-gray-400 font-sans">尾号 8820</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
          </div>
        </section>

        {/* Transactions List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">收支明细</h3>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {(['all', 'in', 'out'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
                >
                  {tab === 'all' ? '全部' : tab === 'in' ? '收入' : '支出'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredTransactions.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-50 flex justify-between items-center shadow-sm animate-in slide-in-from-bottom-2">
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-gray-800">{item.title}</p>
                  <p className="text-[10px] text-gray-400 font-sans tracking-tight">{item.time}</p>
                </div>
                <span className={`text-[15px] font-black font-sans ${item.amount < 0 ? 'text-black' : 'text-green-500'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="py-20 text-center text-gray-300">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">history_edu</span>
                <p className="text-[11px] font-bold uppercase tracking-widest">暂无记录</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Recharge Drawer */}
      {isRechargeOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRechargeOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">账户充值</h3>
              <button onClick={() => setIsRechargeOpen(false)} className="material-symbols-outlined text-gray-300">close</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['100', '500', '1000', '2000'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setRechargeAmount(amt)}
                  className={`py-4 rounded-xl border-2 font-black font-sans transition-all ${rechargeAmount === amt ? 'border-black bg-black text-white shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                >
                  ¥ {amt}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">其他金额</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-gray-400">¥</span>
                <input 
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-4 bg-gray-50 border-none rounded-xl text-xl font-black font-sans focus:ring-2 focus:ring-black/5"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button 
              onClick={handleRecharge}
              disabled={isProcessing}
              className="w-full bg-black text-white py-5 rounded-2xl text-[14px] font-bold tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '立即支付'}
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Drawer */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsWithdrawOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">提现到银行卡</h3>
              <button onClick={() => setIsWithdrawOpen(false)} className="material-symbols-outlined text-gray-300">close</button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                   <img src="https://img.icons8.com/color/48/bank-card-backside.png" className="w-5 h-5" alt="bank" />
                </div>
                <div>
                  <p className="text-[13px] font-bold">中国工商银行 (8820)</p>
                  <p className="text-[10px] text-gray-400">预计 24 小时内到账</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">提现金额</p>
                <button 
                  onClick={() => setWithdrawAmount(balance.toString())}
                  className="text-[10px] font-bold text-primary tracking-widest uppercase"
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
                  className="w-full pl-8 pr-4 py-4 bg-gray-50 border-none rounded-xl text-xl font-black font-sans focus:ring-2 focus:ring-black/5"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-3 text-[10px] text-gray-300">可用余额 ¥ {balance.toLocaleString()}</p>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={isProcessing || !withdrawAmount}
              className="w-full bg-black text-white py-5 rounded-2xl text-[14px] font-bold tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '确认提现'}
            </button>
          </div>
        </div>
      )}

      {/* Global Success Feedback */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-black/80 backdrop-blur-md text-white px-8 py-3 rounded-full text-[12px] font-bold tracking-widest animate-in fade-in zoom-in duration-300">
          {showSuccess}
        </div>
      )}

      {/* Add Card Drawer */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddCardOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">添加银行卡</h3>
              <button onClick={() => setIsAddCardOpen(false)} className="material-symbols-outlined text-gray-300">close</button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">银行名称</label>
                <input 
                  type="text"
                  value={newCard.bank}
                  onChange={(e) => setNewCard({...newCard, bank: e.target.value})}
                  placeholder="例如：中国工商银行"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">卡号</label>
                <input 
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                  placeholder="请输入银行卡号"
                  maxLength={19}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-mono focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">持卡人姓名</label>
                <input 
                  type="text"
                  value={newCard.cardHolder}
                  onChange={(e) => setNewCard({...newCard, cardHolder: e.target.value})}
                  placeholder="请输入持卡人姓名"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-yellow-600 text-lg">info</span>
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    请确保银行卡信息准确无误，添加后将用于提现和退款。
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddCard}
              disabled={isProcessing}
              className="w-full bg-black text-white py-5 rounded-2xl text-[14px] font-bold tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '确认添加'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
