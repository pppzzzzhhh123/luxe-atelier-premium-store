
import React, { useState, useMemo } from 'react';
import { CartItem, NavigateHandler } from '../types';

interface CartProps {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onBack: () => void;
  onNavigate: NavigateHandler;
}

const Cart: React.FC<CartProps> = ({ items, setItems, onBack, onNavigate }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(items.map(i => i.id)));
  const [isEditing, setIsEditing] = useState(false);

  const totals = useMemo(() => {
    let subtotal = 0;
    let savings = 0;
    items.forEach(item => {
      if (selectedIds.has(item.id)) {
        subtotal += item.price * item.count;
        if (item.expectedPrice) {
          savings += (item.price - item.expectedPrice) * item.count;
        }
      }
    });
    return { subtotal: subtotal - savings, savings };
  }, [items, selectedIds]);

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length && items.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(i => i.id)));
    }
  };

  const updateCount = (id: number, delta: number) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const nextCount = Math.max(1, item.count + delta);
        return { ...item, count: nextCount };
      }
      return item;
    }));
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    const remainingItems = items.filter(i => !selectedIds.has(i.id));
    setItems(remainingItems);
    setSelectedIds(new Set());
    setIsEditing(false);
  };

  const handleCheckout = () => {
    if (selectedIds.size > 0) {
      const selectedProducts = items.filter(i => selectedIds.has(i.id));
      onNavigate('checkout', selectedProducts);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#333] relative animate-in slide-in-from-bottom duration-300">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between relative">
          <button onClick={onBack} className="flex items-center gap-1 group active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-black">chevron_left</span>
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-black uppercase tracking-widest">返回浏览</span>
          </button>
          <h1 className="text-sm font-black tracking-[0.2em] uppercase">购物袋 ({items.length})</h1>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`text-xs font-bold transition-colors ${isEditing ? 'text-primary' : 'text-gray-400 hover:text-black'}`}
          >
            {isEditing ? '完成' : '编辑'}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-48">
        {items.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-50 bg-slate-50/50">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-3">
                <CustomCheckbox 
                  checked={selectedIds.size === items.length && items.length > 0} 
                  onChange={toggleSelectAll}
                />
                <div className="flex items-center">
                  <span className="bg-black text-white px-1.5 mr-2 text-[8px] font-bold leading-none py-1 rounded-sm">优惠</span>
                  <span className="text-gray-500 font-medium">LUXE会员限时满折：满2件享9.2折</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <CustomCheckbox 
                  checked={selectedIds.has(item.id)} 
                  onChange={() => toggleSelect(item.id)}
                />
              </div>
              <div className="w-24 aspect-[3/4] bg-gray-100 shrink-0 overflow-hidden rounded-sm cursor-pointer shadow-sm" onClick={() => onNavigate('product', item)}>
                <img alt={item.title} className="w-full h-full object-cover" src={item.img} />
              </div>
              <div className="flex-grow space-y-2 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="text-[11px] leading-snug font-bold text-gray-900 line-clamp-2 uppercase tracking-tighter">{item.title}</h3>
                  <div className="mt-2 inline-flex items-center bg-gray-100 px-2 py-0.5 rounded-sm text-[9px] text-gray-500 font-medium">
                    {item.spec}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div>
                    <div className="text-[14px] font-bold font-serif text-black">¥{item.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-sm bg-white overflow-hidden">
                    <button 
                      onClick={() => updateCount(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black active:bg-gray-50 text-sm transition-colors"
                    >－</button>
                    <span className="w-8 text-center text-[11px] font-bold border-x border-gray-100">{item.count}</span>
                    <button 
                      onClick={() => updateCount(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black active:bg-gray-50 text-sm transition-colors"
                    >＋</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-gray-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
              </div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase">您的购物袋是空的</p>
              <button 
                onClick={onBack}
                className="mt-8 px-10 py-3 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase active:scale-95 transition-all shadow-lg"
              >
                返回继续浏览
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-[70] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="px-5 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={toggleSelectAll}
          >
            <CustomCheckbox checked={selectedIds.size === items.length && items.length > 0} onChange={toggleSelectAll} />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-black uppercase">全选</span>
          </div>
          
          <div className="flex items-center gap-5">
            {!isEditing ? (
              <>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-[9px] text-gray-400 uppercase font-bold">Total</span>
                    <span className="text-xl font-serif font-bold text-black tracking-tighter">¥{totals.subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={selectedIds.size === 0}
                  className={`px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all shadow-xl ${
                    selectedIds.size > 0 
                    ? 'bg-black text-white active:scale-95 shadow-black/10' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  去结算 ({selectedIds.size})
                </button>
              </>
            ) : (
              <button 
                onClick={handleDelete}
                disabled={selectedIds.size === 0}
                className={`px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all border-2 ${
                  selectedIds.size > 0 
                  ? 'border-red-500 text-red-500 active:bg-red-50' 
                  : 'border-gray-100 text-gray-200 cursor-not-allowed'
                }`}
              >
                移除所选 ({selectedIds.size})
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

const CustomCheckbox: React.FC<{ checked?: boolean; onChange?: () => void }> = ({ checked, onChange }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onChange?.(); }}
    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${checked ? 'bg-black border-black shadow-inner' : 'border-gray-200 bg-white hover:border-gray-400'}`}
  >
    {checked && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
  </div>
);

export default Cart;
