
import React from 'react';

interface PaymentDetailsProps {
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ onClose, onConfirm, amount }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[480px] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle / Indicator */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
        </div>

        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-300 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full active:bg-slate-100"
        >
          <span className="material-symbols-outlined !text-[22px]">close</span>
        </button>

        <div className="pt-6 pb-2 text-center">
          <h1 className="text-[13px] font-bold text-slate-400 tracking-[0.2em] uppercase font-sans">支付详情</h1>
        </div>

        <div className="px-8 pb-8 text-center">
          <p className="text-[#1a1a1a]/30 text-[9px] mb-1 uppercase tracking-[0.4em] font-black">LUÒJIAWANG</p>
          <div className="flex items-center justify-center gap-1 text-[#1a1a1a]">
            <span className="text-2xl font-light mt-1 font-serif">¥</span>
            <span className="text-5xl font-black tracking-tighter font-sans">{amount}</span>
          </div>
        </div>

        <div className="mx-8 border-t border-slate-50"></div>

        <div className="px-8 py-6 space-y-5">
          {/* Payment Method Selector */}
          <div className="flex items-center justify-between group cursor-pointer active:opacity-60 transition-all py-1">
            <span className="text-slate-500 text-[14px] font-medium">支付方式</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 18.5c.5.3 1 .5 1.6.5.9 0 1.7-.4 2.2-1.1.3-.4.4-.9.4-1.4 0-.7-.3-1.4-.8-1.9-.5-.5-1.2-.8-1.9-.8-.5 0-1 .1-1.4.4-.7.5-1.1 1.3-1.1 2.2 0 .6.2 1.1.5 1.6.2.3.3.4.5.5zm-3.6-3.3c.4.2.8.3 1.2.3.7 0 1.3-.3 1.8-.8.4-.5.7-1.1.7-1.8 0-.4-.1-.8-.3-1.2-.4-.7-1.1-1.2-1.9-1.2-.4 0-.8.1-1.2.3-.7.4-1.2 1.1-1.2 1.9 0 .8.5 1.5 1.2 1.9.2.1.5.3.7.4zm14.2-1.7c-.2-.4-.5-.7-.9-.9-.4-.2-.8-.3-1.2-.3-.8 0-1.5.5-1.9 1.2-.2.4-.3.8-.3 1.2 0 .7.3 1.3.7 1.8.5.5 1.1.8 1.8.8.4 0 .8-.1 1.2-.3.2-.1.5-.3.7-.4.7-.4 1.2-1.1 1.2-1.9 0-.8-.5-1.5-1.2-1.9-.1-.1-.1-.2-.1-.3zm-4.6-3.8c.5.3 1.1.5 1.7.5 1 0 1.9-.5 2.5-1.3.3-.5.5-1 .5-1.6 0-.8-.3-1.6-.9-2.2-.6-.6-1.4-.9-2.2-.9-.6 0-1.1.2-1.6.5-.8.6-1.3 1.5-1.3 2.5 0 .6.2 1.2.5 1.7.3.4.5.6.8.8z"/>
                  </svg>
                </div>
                <span className="font-bold text-[15px] text-[#1a1a1a]">微信支付</span>
                <span className="material-symbols-outlined text-slate-300 text-[20px]">chevron_right</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">点击切换更多支付方式</span>
            </div>
          </div>

          {/* Promotion Card */}
          <div className="bg-[#f9fafc] rounded-2xl p-4 flex items-center justify-between border border-[#f0f3f6]">
            <div className="flex items-center gap-3">
              <div className="bg-[#007AFF] text-white rounded-lg w-7 h-7 flex items-center justify-center shadow-sm shadow-blue-100">
                <span className="material-symbols-outlined !text-[16px] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <p className="text-[12px] font-semibold text-slate-600">花呗分期，分期还更轻松</p>
            </div>
            <button className="text-[12px] font-bold text-[#007AFF] active:opacity-40 transition-all">立即使用</button>
          </div>

          {/* Summary Row */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-[12px] py-1">
              <span className="text-slate-400 font-medium">订单内容</span>
              <span className="text-slate-700 font-bold">LUXE高级定制系列 等共 1 件</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-8 pb-12 pt-4">
          <button 
            onClick={onConfirm}
            className="w-full bg-[#111111] text-white font-bold py-5 rounded-[1.25rem] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-[0.96] active:bg-black"
          >
            确认支付
          </button>
          <p className="mt-6 text-[10px] text-center text-slate-300 leading-relaxed max-w-[300px] mx-auto font-medium">
            支付即代表您同意我们的 <a className="underline decoration-slate-200" href="#">服务协议</a> 与 <a className="underline decoration-slate-200" href="#">隐私权政策</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;