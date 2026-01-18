import React, { useState } from 'react';

// 注意：会员申请功能需要后端新增接口
// 目前暂时保留模拟逻辑，等待后端接口完善

interface MembershipApplicationProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

const MembershipApplication: React.FC<MembershipApplicationProps> = ({ onBack, showFeedback }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    gender: '',
    occupation: '',
    income: '',
    interests: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    '时尚服饰', '奢侈品', '美妆护肤', '珠宝配饰',
    '艺术收藏', '旅行度假', '美食品鉴', '健身运动'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      showFeedback('请填写必填信息');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      showFeedback('请输入正确的手机号');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: 调用后端 API 提交会员申请
      // 注意：后端需要新增会员申请接口
      const applicationData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        birthday: formData.birthday,
        gender: formData.gender,
        occupation: formData.occupation,
        income: formData.income,
        interests: formData.interests
      };

      console.log('📤 提交会员申请:', applicationData);

      // 模拟提交（等待后端接口）
      setTimeout(() => {
        setIsSubmitting(false);
        showFeedback('申请已提交，我们将在3个工作日内审核');
        setTimeout(() => {
          onBack();
        }, 1500);
      }, 2000);
    } catch (error: any) {
      console.error('❌ 会员申请失败:', error);
      setIsSubmitting(false);
      showFeedback(error || '提交失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-32">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <span className="text-[14px] font-bold tracking-wider">申请入会</span>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* 会员权益介绍 */}
        <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-8 mb-6 text-white shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">LUXE 尊享会员</h2>
            <p className="text-sm text-gray-300">开启专属奢华体验</p>
          </div>

          <div className="space-y-3">
            {[
              { icon: 'discount', text: '全场商品专享折扣' },
              { icon: 'card_giftcard', text: '生日专属礼遇' },
              { icon: 'local_shipping', text: '免费顺丰速运' },
              { icon: 'stars', text: '积分双倍累积' },
              { icon: 'event', text: '优先参与新品发布' },
              { icon: 'support_agent', text: '专属客服通道' },
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-yellow-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{benefit.icon}</span>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 申请表单 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold mb-6">申请信息</h3>

          <div className="space-y-5">
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入您的真实姓名"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* 手机号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入手机号"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱地址"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* 生日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生日
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <div className="flex gap-3">
                {['男', '女', '保密'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      formData.gender === gender
                        ? 'bg-black text-white'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* 职业 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                职业
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">请选择职业</option>
                <option value="企业高管">企业高管</option>
                <option value="专业人士">专业人士</option>
                <option value="创业者">创业者</option>
                <option value="自由职业">自由职业</option>
                <option value="学生">学生</option>
                <option value="其他">其他</option>
              </select>
            </div>

            {/* 年收入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年收入
              </label>
              <select
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">请选择年收入范围</option>
                <option value="10万以下">10万以下</option>
                <option value="10-30万">10-30万</option>
                <option value="30-50万">30-50万</option>
                <option value="50-100万">50-100万</option>
                <option value="100万以上">100万以上</option>
              </select>
            </div>

            {/* 兴趣爱好 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                兴趣爱好
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-black text-white'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-900 mb-2">申请须知</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 提交申请后，我们将在3个工作日内完成审核</li>
                <li>• 审核通过后将通过短信和邮件通知您</li>
                <li>• 会员资格终身有效，享受持续升级的专属权益</li>
                <li>• 如有疑问，请联系客服：400-888-8888</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 底部提交按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[480px] mx-auto">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.name || !formData.phone}
          className={`w-full h-12 rounded-full text-sm font-bold transition-all ${
            isSubmitting || !formData.name || !formData.phone
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white active:scale-95 shadow-lg'
          }`}
        >
          {isSubmitting ? '提交中...' : '提交申请'}
        </button>
      </div>
    </div>
  );
};

export default MembershipApplication;
