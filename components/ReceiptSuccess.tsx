
import React from 'react';
import { NavigateHandler } from '../types';

interface ReceiptSuccessProps {
  onNavigate: NavigateHandler;
  onEvaluate?: () => void;
  orderTotal: string;
}

const ReceiptSuccess: React.FC<ReceiptSuccessProps> = ({ onNavigate, onEvaluate, orderTotal }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 pt-20">
      <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-8 shadow-xl shadow-gray-200">
        <span className="material-symbols-outlined text-white text-[40px]">check</span>
      </div>
      
      <h1 className="text-2xl font-serif font-bold tracking-widest mb-2">交易成功</h1>
      <p className="text-gray-400 text-sm font-sans mb-12">感谢您对 LUÒJIAWANG 的信任</p>
      
      <div className="w-full bg-[#f9f9f9] rounded-2xl p-6 mb-12 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">实付金额</span>
          <span className="font-serif font-bold text-lg">¥ {orderTotal}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">获得积分</span>
          <span className="text-primary font-bold">+ 820 pts</span>
        </div>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={onEvaluate}
          className="w-full py-4 bg-black text-white text-[13px] font-bold tracking-[0.2em] uppercase rounded-sm active:scale-95 transition-transform"
        >
          立即评价
        </button>
        <button 
          onClick={() => onNavigate('home')}
          className="w-full py-4 border border-gray-200 text-gray-600 text-[13px] font-bold tracking-[0.2em] uppercase rounded-sm active:scale-95 transition-transform"
        >
          返回首页
        </button>
      </div>
      
      <div className="mt-auto pb-12">
        <p className="text-[10px] text-gray-300 tracking-widest uppercase italic">Elegance is an attitude</p>
      </div>
    </div>
  );
};

export default ReceiptSuccess;
