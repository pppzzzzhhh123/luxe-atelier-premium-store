
import React, { useState } from 'react';
import { addressAPI } from '../src/api';

interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  detail: string;
  isDefault: boolean;
  tag: string;
}

interface AddressManagementProps {
  onBack: () => void;
  onAdd: () => void;
  onEdit: (addr: Address) => void;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

const AddressManagement: React.FC<AddressManagementProps> = ({ onBack, onAdd, onEdit, addresses, setAddresses }) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSetDefault = async (id: number) => {
    try {
      setLoading(true);
      console.log('📤 设置默认地址:', id);
      
      await addressAPI.setDefault(id);
      console.log('✅ 默认地址设置成功');
      
      // 更新本地状态
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
    } catch (error: any) {
      console.error('❌ 设置默认地址失败:', error.response?.data || error.message);
      alert('设置失败：' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      setLoading(true);
      console.log('📤 删除地址:', deleteConfirmId);
      
      await addressAPI.deleteAddress(deleteConfirmId);
      console.log('✅ 地址删除成功');
      
      // 更新本地状态
      setAddresses(prev => prev.filter(addr => addr.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error: any) {
      console.error('❌ 删除地址失败:', error.response?.data || error.message);
      alert('删除失败：' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans pb-32">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100 shadow-sm">
        <button onClick={onBack} className="material-symbols-outlined text-[24px] active:scale-90 transition-transform">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px] tracking-widest uppercase">地址管理</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-4 space-y-4">
        {addresses.length > 0 ? (
          addresses.map(addr => (
            <div key={addr.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 relative overflow-hidden group">
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Default
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[15px] font-bold">{addr.name}</span>
                <span className="text-[14px] text-gray-400 font-sans">{addr.phone}</span>
                {addr.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded uppercase font-bold">{addr.tag}</span>
                )}
              </div>
              
              <p className="text-[13px] text-gray-600 leading-relaxed mb-5">
                {addr.province} {addr.city} {addr.detail}
              </p>

              <div className="h-px bg-gray-50 mb-4" />

              <div className="flex justify-between items-center">
                <div 
                  onClick={() => !loading && handleSetDefault(addr.id)}
                  className={`flex items-center gap-1.5 cursor-pointer group/item active:scale-95 transition-transform ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span 
                    className={`material-symbols-outlined !text-[18px] transition-colors ${addr.isDefault ? 'text-black' : 'text-gray-200 group-hover/item:text-gray-400'}`} 
                    style={{ fontVariationSettings: addr.isDefault ? "'FILL' 1" : "" }}
                  >
                    {addr.isDefault ? 'check_circle' : 'circle'}
                  </span>
                  <span className={`text-[12px] font-medium transition-colors ${addr.isDefault ? 'text-black' : 'text-gray-400'}`}>设为默认</span>
                </div>
                <div className="flex gap-6">
                  <button 
                    onClick={() => onEdit(addr)}
                    disabled={loading}
                    className="text-[12px] font-bold text-gray-400 hover:text-black flex items-center gap-1 active:scale-90 transition-transform disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined !text-[16px]">edit</span> 编辑
                  </button>
                  <button 
                    onClick={() => setDeleteConfirmId(addr.id)}
                    disabled={loading}
                    className="text-[12px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 active:scale-90 transition-transform disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined !text-[16px]">delete</span> 删除
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[48px]">location_off</span>
            </div>
            <p className="text-[13px] font-bold tracking-widest">暂无收货地址</p>
            <p className="text-[10px] mt-1 opacity-60">请添加您的第一个收货地址</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-6">
        <button 
          onClick={onAdd}
          className="w-full bg-black text-white py-4 rounded-full text-[14px] font-bold tracking-[0.2em] uppercase shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          新增收货地址
        </button>
      </footer>

      {/* 删除二次确认弹窗 */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white w-full rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-center mb-2">删除确认</h3>
            <p className="text-[13px] text-gray-500 text-center mb-8">确定要删除该收货地址吗？此操作不可撤销。</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-xl text-[14px] font-bold"
              >
                取消
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-4 bg-red-500 text-white rounded-xl text-[14px] font-bold shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
