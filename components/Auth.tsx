import React, { useState } from 'react';
import { authAPI } from '../src/api';

interface AuthProps {
  onClose: () => void;
  onSuccess: (user: UserInfo) => void;
}

export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  token: string;
}

const Auth: React.FC<AuthProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'code' | 'password'>('code');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    try {
      setError('');
      
      // 调用后端 API 发送验证码
      await authAPI.sendCode(phone);
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      console.log('✅ 验证码已发送到:', phone);
      alert('验证码已发送，请查收短信（开发环境默认：123456）');
    } catch (err: any) {
      console.error('❌ 发送验证码失败:', err);
      setError(err || '发送验证码失败，请稍后重试');
    }
  };

  // 登录
  const handleLogin = async () => {
    setError('');
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    if (loginMethod === 'code' && !code) {
      setError('请输入验证码');
      return;
    }

    if (loginMethod === 'password' && !password) {
      setError('请输入密码');
      return;
    }

    setLoading(true);

    try {
      // 调用后端 API 登录
      const response: any = await authAPI.login({
        phone,
        password: loginMethod === 'password' ? password : undefined,
        code: loginMethod === 'code' ? code : undefined,
        loginMethod
      });

      console.log('✅ 登录成功:', response);

      // 后端返回格式：{ message, token, user }
      const user: UserInfo = {
        id: response.user.id,
        name: response.user.name || 'LUXE用户',
        phone: response.user.phone,
        avatar: response.user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw',
        token: response.token,
      };

      // 保存到 localStorage
      try {
        localStorage.setItem('luxe-user', JSON.stringify(user));
        localStorage.setItem('luxe-token', user.token);
      } catch (error) {
        console.error('Failed to save user info:', error);
      }

      setLoading(false);
      onSuccess(user);
    } catch (err: any) {
      console.error('❌ 登录失败:', err);
      setLoading(false);
      setError(err || '登录失败，请检查手机号和密码/验证码');
    }
  };

  // 注册
  const handleRegister = async () => {
    setError('');
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    if (!code) {
      setError('请输入验证码');
      return;
    }

    if (!password || password.length < 6) {
      setError('密码至少6位');
      return;
    }

    setLoading(true);

    try {
      // 调用后端 API 注册
      const response: any = await authAPI.register({
        phone,
        code,
        password,
        inviteCode: inviteCode || undefined
      });

      console.log('✅ 注册成功:', response);

      // 后端返回格式：{ message, token, user }
      const user: UserInfo = {
        id: response.user.id,
        name: response.user.name || 'LUXE用户',
        phone: response.user.phone,
        avatar: response.user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw',
        token: response.token,
      };

      // 保存到 localStorage
      try {
        localStorage.setItem('luxe-user', JSON.stringify(user));
        localStorage.setItem('luxe-token', user.token);
        
        // 如果有邀请码，保存到用户信息中
        if (inviteCode) {
          localStorage.setItem('luxe-invite-code-used', inviteCode);
          console.log('使用邀请码:', inviteCode);
        }
      } catch (error) {
        console.error('Failed to save user info:', error);
      }

      setLoading(false);
      
      // 如果使用了邀请码，显示奖励提示
      if (inviteCode) {
        setTimeout(() => {
          alert('🎉 注册成功！已获得2张10元优惠券（满200可用）');
        }, 500);
      }
      
      onSuccess(user);
    } catch (err: any) {
      console.error('❌ 注册失败:', err);
      setLoading(false);
      setError(err || '注册失败，请检查信息是否正确');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-gray-600">close</span>
        </button>

        {/* 头部装饰 */}
        <div className="h-32 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold tracking-wider mb-2">LUÒJIAWANG</h1>
            <p className="text-xs text-white/60">欢迎来到璐珈女装</p>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="p-8">
          {/* 切换标签 */}
          <div className="flex gap-2 mb-8 bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-black shadow-md'
                  : 'text-gray-400'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-black shadow-md'
                  : 'text-gray-400'
              }`}
            >
              注册
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          {/* 表单 */}
          <div className="space-y-4">
            {/* 登录方式切换（仅登录时显示） */}
            {mode === 'login' && (
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setLoginMethod('code')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    loginMethod === 'code'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  验证码登录
                </button>
                <button
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    loginMethod === 'password'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  密码登录
                </button>
              </div>
            )}

            {/* 手机号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">phone_iphone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  maxLength={11}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>

            {/* 验证码（登录验证码模式或注册时显示） */}
            {(mode === 'register' || (mode === 'login' && loginMethod === 'code')) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">shield</span>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="请输入验证码"
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                      countdown > 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </button>
                </div>
              </div>
            )}

            {/* 密码（注册时或密码登录时显示） */}
            {(mode === 'register' || (mode === 'login' && loginMethod === 'password')) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'register' ? '设置密码' : '密码'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? '请设置密码（至少6位）' : '请输入密码'}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            )}

            {/* 邀请码（仅注册时显示） */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邀请码 <span className="text-xs text-gray-400">（选填）</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">redeem</span>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="请输入邀请码，获得2张10元优惠券"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 uppercase"
                  />
                </div>
                {inviteCode && (
                  <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    填写邀请码可获得2张10元优惠券（满200可用）
                  </p>
                )}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              onClick={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              className={`w-full h-12 rounded-xl text-sm font-bold tracking-wider uppercase transition-all ${
                loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  处理中...
                </div>
              ) : (
                mode === 'login' ? '登录' : '注册'
              )}
            </button>
          </div>

          {/* 协议 */}
          <p className="mt-6 text-xs text-center text-gray-400 leading-relaxed">
            {mode === 'login' ? '登录' : '注册'}即表示同意
            <a href="#" className="text-black font-medium">《用户协议》</a>
            和
            <a href="#" className="text-black font-medium">《隐私政策》</a>
          </p>

          {/* 其他登录方式 */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 mb-4">其他登录方式</p>
            <div className="flex justify-center gap-4">
              <button className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 18.5c.5.3 1 .5 1.6.5.9 0 1.7-.4 2.2-1.1.3-.4.4-.9.4-1.4 0-.7-.3-1.4-.8-1.9-.5-.5-1.2-.8-1.9-.8-.5 0-1 .1-1.4.4-.7.5-1.1 1.3-1.1 2.2 0 .6.2 1.1.5 1.6.2.3.3.4.5.5zm-3.6-3.3c.4.2.8.3 1.2.3.7 0 1.3-.3 1.8-.8.4-.5.7-1.1.7-1.8 0-.4-.1-.8-.3-1.2-.4-.7-1.1-1.2-1.9-1.2-.4 0-.8.1-1.2.3-.7.4-1.2 1.1-1.2 1.9 0 .8.5 1.5 1.2 1.9.2.1.5.3.7.4zm14.2-1.7c-.2-.4-.5-.7-.9-.9-.4-.2-.8-.3-1.2-.3-.8 0-1.5.5-1.9 1.2-.2.4-.3.8-.3 1.2 0 .7.3 1.3.7 1.8.5.5 1.1.8 1.8.8.4 0 .8-.1 1.2-.3.2-.1.5-.3.7-.4.7-.4 1.2-1.1 1.2-1.9 0-.8-.5-1.5-1.2-1.9-.1-.1-.1-.2-.1-.3zm-4.6-3.8c.5.3 1.1.5 1.7.5 1 0 1.9-.5 2.5-1.3.3-.5.5-1 .5-1.6 0-.8-.3-1.6-.9-2.2-.6-.6-1.4-.9-2.2-.9-.6 0-1.1.2-1.6.5-.8.6-1.3 1.5-1.3 2.5 0 .6.2 1.2.5 1.7.3.4.5.6.8.8z"/>
                </svg>
              </button>
              <button className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
