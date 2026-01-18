
import React, { useState, useEffect } from 'react';
import { userAPI } from '../src/api';

interface InfoState {
  nickname: string;
  gender: string;
  birthday: string;
  height: string;
  weight: string;
  size: string;
  phone: string;
}

const PersonalInfo: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [info, setInfo] = useState<InfoState>({
    nickname: 'LUXE用户',
    gender: '女',
    birthday: '1998-05-20',
    height: '165',
    weight: '50',
    size: 'S / 160',
    phone: '138****8820'
  });

  const [editingField, setEditingField] = useState<keyof InfoState | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(false);

  const fieldLabels: Record<string, string> = {
    nickname: '昵称',
    gender: '性别',
    birthday: '生日',
    height: '身高 (cm)',
    weight: '体重 (kg)',
    size: '尺码偏好'
  };

  // 加载用户信息
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      console.log('📥 加载用户信息...');
      const response = await userAPI.getProfile();
      console.log('✅ 用户信息加载成功:', response);
      
      if (response.data) {
        setInfo({
          nickname: response.data.nickname || 'LUXE用户',
          gender: response.data.gender || '未设置',
          birthday: response.data.birthday || '未设置',
          height: response.data.height?.toString() || '未设置',
          weight: response.data.weight?.toString() || '未设置',
          size: response.data.size || '未设置',
          phone: response.data.phone || '未绑定'
        });
      }
    } catch (error: any) {
      console.error('❌ 加载用户信息失败:', error.response?.data || error.message);
    }
  };

  const openEditor = (field: keyof InfoState) => {
    if (field === 'phone') return;
    setEditingField(field);
    setTempValue(info[field] === '未设置' ? '' : info[field]);
  };

  const saveEdit = async () => {
    if (!editingField) return;

    try {
      setLoading(true);
      const updateData: any = {};
      
      // 根据字段类型转换数据
      if (editingField === 'height' || editingField === 'weight') {
        updateData[editingField] = tempValue ? parseFloat(tempValue) : null;
      } else {
        updateData[editingField] = tempValue || null;
      }

      console.log('📤 更新用户信息:', updateData);
      const response = await userAPI.updateProfile(updateData);
      console.log('✅ 用户信息更新成功:', response);

      // 更新本地状态
      setInfo({ ...info, [editingField]: tempValue || '未设置' });
      setEditingField(null);
      
      // 显示成功提示
      alert('保存成功！');
    } catch (error: any) {
      console.error('❌ 更新用户信息失败:', error.response?.data || error.message);
      alert('保存失败：' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const renderEditorContent = () => {
    if (!editingField) return null;

    if (editingField === 'gender') {
      return (
        <div className="flex gap-3 mb-8">
          {['男', '女', '保密'].map((g) => (
            <button
              key={g}
              onClick={() => setTempValue(g)}
              className={`flex-1 py-4 rounded-xl border text-[14px] font-bold transition-all ${
                tempValue === g 
                ? 'bg-black text-white border-black shadow-lg shadow-black/10 scale-[1.02]' 
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      );
    }

    if (editingField === 'birthday') {
      return (
        <div className="mb-8">
          <input 
            autoFocus
            type="date"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-[15px] focus:ring-2 focus:ring-black/5 font-sans"
          />
          <p className="mt-3 text-[11px] text-gray-400 px-1 italic">设置生日可获得每年专属生日礼券</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <input 
          autoFocus
          type={['height', 'weight'].includes(editingField) ? 'number' : 'text'}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          placeholder={`请输入您的${fieldLabels[editingField]}`}
          className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-[15px] focus:ring-2 focus:ring-black/5 placeholder:text-gray-300"
        />
        {editingField === 'size' && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {['XS', 'S', 'M', 'L', 'XL'].map(s => (
              <button 
                key={s}
                onClick={() => setTempValue(s)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${tempValue === s ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans relative">
      <header className="sticky top-0 z-50 bg-white px-4 h-14 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="material-symbols-outlined text-[24px] active:scale-90 transition-transform">chevron_left</button>
        <h1 className="flex-1 text-center font-bold text-[15px] tracking-widest uppercase">个人信息</h1>
        <div className="w-6"></div>
      </header>

      <main className="p-4 space-y-6">
        <section>
          <p className="px-1 mb-3 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">基础资料</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 divide-y divide-gray-50">
            <div className="flex items-center justify-between p-5 active:bg-gray-50 transition-colors cursor-pointer group">
              <span className="text-[14px] font-medium text-gray-700">头像</span>
              <div className="flex items-center gap-3">
                <img 
                  className="w-12 h-12 rounded-full object-cover border border-gray-100" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw" 
                  alt="Avatar"
                />
                <span className="material-symbols-outlined text-gray-300 group-hover:text-black">chevron_right</span>
              </div>
            </div>
            
            <InfoRow label="昵称" value={info.nickname} onClick={() => openEditor('nickname')} />
            <InfoRow label="性别" value={info.gender} onClick={() => openEditor('gender')} />
            <InfoRow label="生日" value={info.birthday} onClick={() => openEditor('birthday')} />
          </div>
        </section>

        <section>
          <p className="px-1 mb-3 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">身材数据 (仅自己可见)</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 divide-y divide-gray-50">
            <InfoRow label="身高 (cm)" value={info.height} onClick={() => openEditor('height')} />
            <InfoRow label="体重 (kg)" value={info.weight} onClick={() => openEditor('weight')} />
            <InfoRow label="尺码偏好" value={info.size} onClick={() => openEditor('size')} />
          </div>
        </section>

        <section>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            <InfoRow label="手机号" value={info.phone} />
          </div>
        </section>

        <div className="px-4 py-8 text-center space-y-2">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">完善信息可获得 50 积分奖励</p>
          <p className="text-[9px] text-gray-200 uppercase tracking-tighter">LUXE ATELIER Privacy Secured</p>
        </div>
      </main>

      {editingField && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
            onClick={() => setEditingField(null)}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">修改{fieldLabels[editingField]}</h3>
              <button onClick={() => setEditingField(null)} className="material-symbols-outlined text-gray-300">close</button>
            </div>
            
            {renderEditorContent()}

            <button 
              onClick={saveEdit}
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full text-[14px] font-bold tracking-widest uppercase active:scale-95 transition-transform shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '保存修改'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string; onClick?: () => void }> = ({ label, value, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-5 transition-colors group ${onClick ? 'active:bg-gray-50 cursor-pointer' : 'opacity-80'}`}
  >
    <span className="text-[14px] font-medium text-gray-700">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-[14px] text-gray-400 font-sans">{value}</span>
      {onClick && <span className="material-symbols-outlined text-gray-300 group-hover:text-black transition-colors">chevron_right</span>}
    </div>
  </div>
);

export default PersonalInfo;
