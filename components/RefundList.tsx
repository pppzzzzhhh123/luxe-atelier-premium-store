
import React, { useState } from 'react';
import { NavigateHandler } from '../types';

interface RefundListProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  showFeedback?: (message: string) => void;
}

const RefundList: React.FC<RefundListProps> = ({ onBack, onNavigate, showFeedback }) => {
  const [refunds, setRefunds] = useState([
    {
      id: 'R20260118001',
      shop: 'LUOJIAWANG璐珈女装',
      status: '退款成功',
      statusText: '退款已原路返回',
      items: [
        {
          title: '垂感丝绸连衣裙 | 24SS 秀场系列 极简主义',
          spec: '翡翠绿; M',
          price: '8200.00',
          count: 1,
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0'
        }
      ],
      total: '8200.00',
      action: '查看详情',
      timeline: [
        { time: '2026-01-19 14:20', text: '退款成功，金额已按原支付路径返回' },
        { time: '2026-01-18 16:45', text: '商家已同意退款，系统正在处理中' },
        { time: '2026-01-18 10:30', text: '您的退款申请已提交，等待商家审核' }
      ]
    },
    {
      id: 'R20260118002',
      shop: 'LUOJIAWANG璐珈女装',
      status: '待商家处理',
      statusText: '商家正在审核您的换货申请',
      items: [
        {
          title: '廓形羊绒针织衫 意大利进口原料 亲肤软糯',
          spec: '奶白色; S',
          price: '2325.00',
          count: 1,
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQIv_L4pQkIHnjKOrIO7GxaQm8NB0_2l1MsAZ4LqF7wxJPhCJ1Jy0VhGa_7TkEARqkPHWF3vQRAr0Kg741FhS9bo23IbcSqZ_Mjt2Ilkra9lox2owV1bfEqwadc181BnJG6fXKu9-7x_ZpbQX__5J6C4cDm1erT75JDhdPWUUV55qHB-flD3O8SRwl3FWDZL6Cy8ufNIafHZxq11A5WKnOkSpb7FmQ85ATxyAIxrwiisdfSa5A5KGLjSq-yJNL679W6Tu_4xW0oj4w'
        }
      ],
      total: '2325.00',
      action: '撤销申请',
      timeline: [
        { time: '2026-01-18 11:00', text: '您的换货申请已进入排队待处理阶段' },
        { time: '2026-01-18 09:15', text: '申请已提交，等待专属顾问审核' }
      ]
    }
  ]);

  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setRefunds(prev => prev.filter(r => r.id !== id));
    setShowRevokeConfirm(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#1a1a1a]">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <button onClick={onBack} className="material-symbols-outlined text-[24px] text-gray-400">chevron_left</button>
        <h1 className="text-[15px] font-bold tracking-widest uppercase">退款/售后记录</h1>
        <div className="w-8"></div>
      </header>

      <main className="p-4 space-y-4">
        {refunds.length > 0 ? refunds.map((refund) => (
          <div key={refund.id} className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">store</span>
                <span className="text-[12px] font-bold">{refund.shop}</span>
              </div>
              <span className={`text-[12px] font-bold ${refund.status === '退款成功' ? 'text-green-500' : 'text-primary'}`}>
                {refund.status}
              </span>
            </div>

            <div className="flex gap-4">
              <img src={refund.items[0].img} className="w-20 h-20 rounded-xl object-cover" alt="item" />
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-[13px] font-medium line-clamp-2 leading-snug mb-1">{refund.items[0].title}</h3>
                <p className="text-[11px] text-gray-400 bg-gray-50 inline-block px-2 py-0.5 rounded-md">{refund.items[0].spec}</p>
                <div className="mt-2 flex items-center gap-2">
                   <span className="text-[11px] text-gray-400">退款金额:</span>
                   <span className="text-[13px] font-bold text-red-500 font-sans">¥ {refund.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f9fafc] rounded-xl p-3 flex items-start gap-3">
              <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">info</span>
              <div>
                <p className="text-[12px] font-bold text-gray-700">{refund.statusText}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">服务单号: {refund.id}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setSelectedRefund(refund)}
                className="px-6 py-2 rounded-full border border-gray-100 text-[12px] font-bold active:bg-gray-50 transition-colors"
              >
                查看详情
              </button>
              {refund.status === '待商家处理' && (
                <button 
                  onClick={() => setShowRevokeConfirm(refund.id)}
                  className="px-6 py-2 rounded-full border border-orange-100 text-orange-500 text-[12px] font-bold active:bg-orange-50 transition-colors"
                >
                  撤销申请
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <span className="material-symbols-outlined text-[64px] mb-4">history_edu</span>
            <p className="text-[13px]">暂无售后申请记录</p>
          </div>
        )}
      </main>

      {/* Details Drawer */}
      {selectedRefund && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center" onClick={() => setSelectedRefund(null)}>
          <div 
            className="bg-white w-full max-w-[480px] rounded-t-[2.5rem] p-8 pb-12 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">售后详情</h3>
              <button onClick={() => setSelectedRefund(null)} className="material-symbols-outlined text-gray-300">close</button>
            </div>

            <div className="space-y-8">
              {/* Header Info */}
              <div className="bg-[#f9fafc] rounded-2xl p-6 text-center">
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">当前状态</p>
                <h4 className={`text-xl font-bold ${selectedRefund.status === '退款成功' ? 'text-green-500' : 'text-primary'}`}>
                  {selectedRefund.status}
                </h4>
                <p className="text-[12px] text-gray-500 mt-2">{selectedRefund.statusText}</p>
              </div>

              {/* Timeline */}
              <div className="space-y-6 pl-4 border-l border-gray-100 ml-2">
                {selectedRefund.timeline.map((item: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-primary' : 'bg-gray-200'}`} />
                    <div className="space-y-1">
                      <p className={`text-[13px] font-medium ${idx === 0 ? 'text-black' : 'text-gray-400'}`}>{item.text}</p>
                      <p className="text-[10px] text-gray-300 font-sans">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Refund Info */}
              <div className="space-y-4">
                <h5 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">单据信息</h5>
                <div className="bg-white border border-gray-50 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-[13px] text-gray-500">服务单号</span>
                    <span className="text-[13px] font-medium font-sans">{selectedRefund.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-gray-500">退款金额</span>
                    <span className="text-[13px] font-bold text-red-500 font-sans">¥ {selectedRefund.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[13px] text-gray-500">申请时间</span>
                    <span className="text-[13px] font-medium font-sans">{selectedRefund.timeline[selectedRefund.timeline.length - 1].time}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => {
                    if (showFeedback) {
                      showFeedback('已呼叫在线客服');
                    } else {
                      alert('已呼叫在线客服');
                    }
                  }}
                  className="flex-1 py-4 border border-gray-100 rounded-full text-[14px] font-bold active:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  联系客服
                </button>
                <button 
                  onClick={() => {
                    if (showFeedback) {
                      showFeedback('转接到专属售后电话');
                    } else {
                      alert('转接到专属售后电话');
                    }
                  }}
                  className="flex-1 py-4 bg-black text-white rounded-full text-[14px] font-bold active:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  售后专线
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      {showRevokeConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center px-8" onClick={() => setShowRevokeConfirm(null)}>
          <div className="bg-white w-full rounded-[2rem] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-lg font-bold">确定撤销申请？</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed px-4">
                撤销后该售后单将关闭，如果您仍需售后服务，需重新发起申请。
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowRevokeConfirm(null)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-[14px]"
                >
                  暂不撤销
                </button>
                <button 
                  onClick={() => handleRevoke(showRevokeConfirm)}
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold text-[14px] shadow-lg shadow-orange-100"
                >
                  确定撤销
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-6 py-10 text-center">
        <p className="text-[10px] text-gray-300 tracking-[0.3em] uppercase italic">LUXE Atelier Quality Guarantee</p>
      </div>
    </div>
  );
};

export default RefundList;
