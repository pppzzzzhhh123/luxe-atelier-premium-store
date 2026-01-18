
import React, { useState } from 'react';
import { postAPI } from '../src/api';

interface PostEditorProps {
  onBack: () => void;
  showFeedback?: (message: string) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ onBack, showFeedback }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('穿搭');

  const categories = ['穿搭', '趋势', '日常', '社论', '极简', '生活方式'];

  const handleAddImage = () => {
    if (images.length >= 9) return;
    const mockImgs = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV'
    ];
    setImages([...images, mockImgs[images.length % 2]]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handlePublish = async () => {
    if (!title || !content) {
      if (showFeedback) {
        showFeedback('请输入标题和内容');
      } else {
        alert('请输入标题和内容');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 准备帖子数据
      const postData = {
        content: `${title}\n\n${content}`,
        images: images,
        category: selectedCategory
      };

      console.log('📤 发布帖子请求:', postData);

      // 调用后端 API 创建帖子
      const response: any = await postAPI.createPost(postData);

      console.log('✅ 帖子发布成功:', response);

      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => onBack(), 2000);
    } catch (error: any) {
      console.error('❌ 帖子发布失败:', error);
      setIsSubmitting(false);
      if (showFeedback) {
        showFeedback(error || '发布失败，请稍后重试');
      } else {
        alert(error || '发布失败，请稍后重试');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a] pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-50">
        <button onClick={onBack} className="material-symbols-outlined text-[24px] text-gray-400 active:scale-90 transition-transform">close</button>
        <h1 className="text-[15px] font-bold tracking-widest uppercase italic font-display">发布动态</h1>
        <button 
          onClick={handlePublish}
          disabled={isSubmitting}
          className={`text-[14px] font-bold px-4 py-1.5 rounded-full transition-all ${isSubmitting ? 'text-gray-300' : 'bg-black text-white active:bg-gray-800'}`}
        >
          {isSubmitting ? '发布中...' : '发布'}
        </button>
      </header>

      <main className="p-6 space-y-8">
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square group animate-in zoom-in duration-300">
              <img src={img} className="w-full h-full object-cover rounded-lg shadow-sm" alt="upload" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          ))}
          
          {images.length < 9 && (
            <button 
              onClick={handleAddImage}
              className="aspect-square border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-300 active:bg-gray-50 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">添加图片</span>
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入一个亮眼的标题..."
            className="w-full text-xl font-bold border-none focus:ring-0 p-0 placeholder:text-gray-200"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的穿搭灵感或生活瞬间..."
            className="w-full h-48 text-[15px] leading-relaxed border-none focus:ring-0 p-0 resize-none placeholder:text-gray-200"
          />
        </div>

        {/* Category Chips */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">选择分类</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all border ${selectedCategory === cat ? 'bg-black text-white border-black shadow-lg shadow-black/10' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Success Feedback Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="bg-black/80 backdrop-blur-xl text-white px-10 py-8 rounded-[2rem] flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-black text-3xl">verified</span>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold tracking-widest">动态已发布</p>
              <p className="text-[12px] opacity-60 mt-1 uppercase tracking-tighter">感谢你的分享！</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[90] bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;
