
import React, { useState, useEffect } from 'react';
import { Address } from '../types';
import { addressAPI } from '../src/api';

interface AddAddressProps {
  onBack: () => void;
  onSave: (address: Address) => void;
  initialData?: Address | null;
  showFeedback?: (message: string) => void;
}

const AddAddress: React.FC<AddAddressProps> = ({ onBack, onSave, initialData, showFeedback }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    detail: '',
    tag: '家',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!formData.name || !formData.phone || !formData.detail) {
      if (showFeedback) {
        showFeedback('请完善收货信息');
      } else {
        alert('请完善收货信息');
      }
      return;
    }
    if (!phoneRegex.test(formData.phone.replace(/\*/g, ''))) {
      if (showFeedback) {
        showFeedback('请输入正确的手机号码');
      } else {
        alert('请输入正确的手机号码');
      }
      return;
    }
    if (formData.detail.length < 5) {
      if (showFeedback) {
        showFeedback('详细地址至少需要5个字符');
      } else {
        alert('详细地址至少需要5个字符');
      }
      return;
    }

    try {
      setLoading(true);
      
      if (initialData?.id) {
        // 编辑地址
        console.log('📤 更新地址:', formData);
        const response = await addressAPI.updateAddress(initialData.id, formData);
        console.log('✅ 地址更新成功:', response);
        
        if (showFeedback) {
          showFeedback('地址更新成功');
        }
        
        // 返回更新后的地址
        onSave({ ...formData, id: initialData.id } as Address);
      } else {
        // 新增地址
        console.log('📤 创建地址:', formData);
        const response = await addressAPI.createAddress(formData);
        console.log('✅ 地址创建成功:', response);
        
        if (showFeedback) {
          showFeedback('地址添加成功');
        }
        
        // 返回新创建的地址
        onSave(response.data as Address);
      }
    } catch (error: any) {
      console.error('❌ 保存地址失败:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.message || '保存失败';
      
      if (showFeedback) {
        showFeedback(errorMsg);
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen font-sans text-[#1a1a1a] pb-32">
      <header className="sticky top-0 bg-white z-50 h-14 flex items-center justify-between px-4 border-b border-gray-50">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:opacity-60 transition-opacity">
          <span className="material-symbols-outlined text-[24px]">chevron_left</span>
        </button>
        <h1 className="text-[15px] font-bold tracking-widest uppercase">{initialData ? '编辑地址' : '新增地址'}</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-4 py-3 space-y-3">
        <div className="flex justify-between items-center px-1 mb-1">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">收货信息</span>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-[11px] text-gray-400 font-bold uppercase hover:text-black transition-colors">
              <img src="https://img.icons8.com/color/48/weixing.png" className="w-4 h-4" alt="wechat" />
              微信导入
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 divide-y divide-gray-50">
          <InputField 
            label="收货人" 
            placeholder="收货人姓名" 
            value={formData.name} 
            onChange={(v) => handleChange('name', v)} 
          />
          <InputField 
            label="手机号码" 
            placeholder="收货人手机号" 
            value={formData.phone} 
            onChange={(v) => handleChange('phone', v)} 
          />
          <div className="flex items-center px-5 py-5">
            <label className="w-20 text-[14px] font-medium text-gray-700 shrink-0">所在地区</label>
            <div className="flex-1 flex items-center justify-between">
              <div className="flex gap-2 flex-1">
                <input 
                  className="w-1/2 text-[14px] border-none focus:ring-0 p-0 placeholder:text-gray-300" 
                  placeholder="省份" 
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                />
                <input 
                  className="w-1/2 text-[14px] border-none focus:ring-0 p-0 placeholder:text-gray-300" 
                  placeholder="城市" 
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div className="flex items-center text-gray-300 gap-1 ml-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
            </div>
          </div>
          <InputField 
            label="详细地址" 
            placeholder="请填写街道、门牌号等详细地址" 
            value={formData.detail} 
            onChange={(v) => handleChange('detail', v)} 
            last 
          />
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 px-5">
          <div className="flex items-center py-5 border-b border-gray-50">
            <label className="w-20 text-[14px] font-medium text-gray-700 shrink-0">地址标签</label>
            <div className="flex gap-2">
              {['家', '公司', '学校'].map(t => (
                <button 
                  key={t}
                  onClick={() => handleChange('tag', t)}
                  className={`px-6 py-1.5 text-[12px] font-bold rounded-full transition-all border ${formData.tag === t ? 'bg-black text-white border-black shadow-lg shadow-black/10' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-5">
            <label className="text-[14px] font-medium text-gray-700">设为默认收货地址</label>
            <button 
              onClick={() => handleChange('isDefault', !formData.isDefault)}
              className={`w-11 h-6 rounded-full relative transition-all duration-300 ${formData.isDefault ? 'bg-black' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.isDefault ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-6">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-[#111] text-white py-4 rounded-full text-[14px] font-bold tracking-[0.2em] uppercase active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '保存中...' : (initialData ? '保存修改' : '保存并使用')}
        </button>
      </footer>
    </div>
  );
};

const InputField: React.FC<{ label: string; placeholder: string; value: string; onChange: (v: string) => void; last?: boolean }> = ({ label, placeholder, value, onChange, last }) => (
  <div className={`flex items-center px-5 py-5 ${!last ? 'border-b border-gray-50' : ''}`}>
    <label className="w-20 text-[14px] font-medium text-gray-700 shrink-0">{label}</label>
    <input 
      className="flex-1 text-[14px] border-none focus:ring-0 p-0 placeholder:text-gray-300 font-sans" 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default AddAddress;
