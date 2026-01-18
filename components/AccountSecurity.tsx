
import React, { useState } from 'react';
import { userAPI } from '../src/api';

interface SecurityState {
  phone: string;
  hasLoginPwd: boolean;
  hasPayPwd: boolean;
  isRealName: boolean;
  wechatLinked: boolean;
  alipayLinked: boolean;
}

const AccountSecurity: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [security, setSecurity] = useState<SecurityState>({
    phone: '138****8820',
    hasLoginPwd: true,
    hasPayPwd: true,
    isRealName: false,
    wechatLinked: true,
    alipayLinked: false
  });

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // 计算安全等级
  const securityScore = [
    security.hasLoginPwd,
    security.hasPayPwd,
    security.isRealName,
    security.phone !== ''
  ].filter(Boolean).length * 25;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleToggle = (key: 'wechatLinked' | 'alipayLinked') => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(security[key] ? '已取消关联' : '关联成功');
  };

  const handleAction = (type: string) => {
    setActivePanel(type);
  };

  const confirmAction = async () => {
    try {
      if (activePanel === 'realname') {
        // 实名认证（后端可能需要新增接口）
        setSecurity(prev => ({ ...prev, isRealName: true }));
        showToast('认证提交成功');
      } else if (activePanel === 'loginPwd') {
        // 修改登录密码
        console.log('📤 修改密码请求');
        // 注意：这里需要获取旧密码和新密码
        // const response = await userAPI.changePassword(oldPassword, newPassword);
        showToast('密码修改成功');
      } else {
        showToast('修改成功');
      }
      setActivePanel(null);
    } catch (error: any) {
      console.error('❌ 操作失败:', error);
      showToast(error || '操作失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans relative">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px] active:scale-90">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px] tracking-widest uppercase">账号与安全</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-4 space-y-6">
        {/* 安全等级概览 */}
        <section className="bg-black rounded-3xl p-6 text-white shadow-xl shadow-black/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">Security Level</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{securityScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out"
              style={{ width: `${securityScore}%` }}
            />
          </div>
          <p className="mt-4 text-[13px] font-medium opacity-90">
            {securityScore < 100 ? '您的账号存在安全风险，建议完善' : '您的账号非常安全'}
          </p>
        </section>

        {/* 基础安全 */}
        <section>
          <p className="px-1 mb-3 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">基础安全</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 divide-y divide-gray-50">
            <SecurityRow 
              label="修改登录密码" 
              sub="建议定期更换以保护账号" 
              onClick={() => handleAction('loginPwd')} 
            />
            <SecurityRow 
              label="绑定手机" 
              sub={`已绑定 ${security.phone}`} 
              onClick={() => handleAction('phone')} 
            />
          </div>
        </section>

        {/* 资产保护 */}
        <section>
          <p className="px-1 mb-3 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">资产与身份</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 divide-y divide-gray-50">
            <SecurityRow 
              label="支付密码" 
              sub={security.hasPayPwd ? '已开启安全保护' : '未设置'} 
              onClick={() => handleAction('payPwd')} 
            />
            <SecurityRow 
              label="实名认证" 
              sub={security.isRealName ? '已完成认证' : '未认证，认证后可提升安全等级'} 
              onClick={() => !security.isRealName && handleAction('realname')}
              isCompleted={security.isRealName}
            />
          </div>
        </section>

        {/* 账号关联 */}
        <section>
          <p className="px-1 mb-3 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">第三方关联</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 divide-y divide-gray-50">
            <div className="p-5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/color/48/weixing.png" className="w-5 h-5 opacity-80" alt="wechat" />
                <span className="text-[14px] font-bold text-gray-800">微信</span>
              </div>
              <button 
                onClick={() => handleToggle('wechatLinked')}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${security.wechatLinked ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${security.wechatLinked ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <div className="p-5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/color/48/alipay.png" className="w-5 h-5 opacity-80" alt="alipay" />
                <span className="text-[14px] font-bold text-gray-800">支付宝</span>
              </div>
              <button 
                onClick={() => handleToggle('alipayLinked')}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${security.alipayLinked ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${security.alipayLinked ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="pt-6">
          <SecurityRow label="账号注销" sub="注销后所有数据将清空且不可恢复" warning onClick={() => handleAction('delete')} />
        </div>
      </main>

      {/* 动态修改面板 (模拟) */}
      {activePanel && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in" onClick={() => setActivePanel(null)} />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">
                {activePanel === 'loginPwd' && '修改登录密码'}
                {activePanel === 'phone' && '更换绑定手机'}
                {activePanel === 'realname' && '实名认证'}
                {activePanel === 'delete' && '账号注销确认'}
              </h3>
              <button onClick={() => setActivePanel(null)} className="material-symbols-outlined text-gray-300">close</button>
            </div>

            <div className="space-y-4 mb-8">
              {activePanel === 'phone' ? (
                <>
                  <input className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-[14px]" placeholder="新手机号" />
                  <div className="flex gap-2">
                    <input className="flex-1 bg-gray-50 border-none rounded-xl py-4 px-6 text-[14px]" placeholder="验证码" />
                    <button className="px-6 bg-gray-100 rounded-xl text-[12px] font-bold">获取验证码</button>
                  </div>
                </>
              ) : activePanel === 'realname' ? (
                <>
                  <input className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-[14px]" placeholder="真实姓名" />
                  <input className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-[14px]" placeholder="身份证号" />
                </>
              ) : (
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {activePanel === 'delete' ? '账号注销后，您在该平台的所有权益（如积分、余额、订单记录）将被永久清除。请谨慎操作。' : '为了您的账号安全，操作前需验证当前身份。'}
                </p>
              )}
            </div>

            <button 
              onClick={confirmAction}
              className={`w-full py-4 rounded-full text-[14px] font-bold tracking-widest uppercase active:scale-95 transition-all ${activePanel === 'delete' ? 'bg-red-500 text-white' : 'bg-black text-white'}`}
            >
              {activePanel === 'delete' ? '确认注销' : '确认提交'}
            </button>
          </div>
        </div>
      )}

      {/* Toast 提示 */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-black/80 text-white px-6 py-3 rounded-full text-[12px] font-bold tracking-widest animate-in fade-in zoom-in">
          {toast}
        </div>
      )}
    </div>
  );
};

const SecurityRow: React.FC<{ 
  label: string; 
  sub: string; 
  warning?: boolean; 
  isCompleted?: boolean;
  onClick?: () => void 
}> = ({ label, sub, warning, isCompleted, onClick }) => (
  <div 
    onClick={onClick}
    className="p-5 active:bg-gray-50 transition-colors cursor-pointer group flex items-center justify-between"
  >
    <div className="flex-1 pr-4">
      <p className={`text-[14px] font-bold ${warning ? 'text-red-500' : 'text-gray-800'}`}>{label}</p>
      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
    </div>
    <div className="flex items-center gap-2">
      {isCompleted && (
        <span className="material-symbols-outlined text-green-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      )}
      {!warning && <span className="material-symbols-outlined text-gray-200 group-hover:text-black transition-colors text-[20px]">chevron_right</span>}
    </div>
  </div>
);

export default AccountSecurity;
