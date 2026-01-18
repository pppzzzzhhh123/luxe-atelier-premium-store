
import React, { useState, useMemo } from 'react';
import { NavigateHandler } from '../types';

interface DiscoveryProps {
  onNavigate: NavigateHandler;
}

const Discovery: React.FC<DiscoveryProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'outfits'>('recommended');

  const allPosts = [
    { 
      id: 1, 
      category: 'recommended',
      title: '2024早秋系列：解构主义与流动美学的对话', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9', 
      likes: '1.2k', 
      author: 'LUXE Editorial',
      authorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    { 
      id: 2, 
      category: 'outfits',
      title: '城市漫步中的极简之美：灰色羊绒衫的多种穿法', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV', 
      likes: '482', 
      author: 'Aria.W',
      authorImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    { 
      id: 3, 
      category: 'outfits',
      title: '法式复古：如何用廓形大衣穿出松弛感', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAjyGk5K6qWM8sQqEfQaDBw0nvve3D4U_WWXDVTR8gD8Mo1AIWnjY4wnHVBalXFF-S37AizzJJAF1FErphrS0ithH0F0Nczci-VWXpgPyxzbNnbYny1-a3lFJT7w4_kd5UKs4ZaVmI7fxcWUfAD4rxyvx05B0HpPHm2TVfKCmRmoFs2xNoEnkQX5y9Y8Eyl3S5-v_4xLSF6WmrtG8YCZusaG6l9UUHJa0ZmL8eshvjKTPnUP2PkMfBhDlTAzxBI_51MNtIxYIVJFUk', 
      likes: '891', 
      author: 'Stylist.Jo',
      authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    { 
      id: 4, 
      category: 'recommended',
      title: '关于细节的执念：手工针脚背后的故事', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJKLWNxNfR3yv1RElBNsJjTQTHB5N-4p_g7Jutn1-kP-_4-Ab72sw-kLcgBqfkS56ybC7fXoESf6eHEeqrskGIjBKOw30zn_2SOTvS2rZThfyItboCT1q-CBnHH3n4v8nvLL7yIH1LLYuYyKBhKlf7yTqtwAl8rN_I_mdIEOUVf18fN68VSOq2rq870HBeueK4rnu5fU--bBRCIecApz_u_bhOC5uokh6oOfCzVUfCIViQJDcdv5Pgl9jVyJlsAXNELeuMRTq8dhzY', 
      likes: '235', 
      author: 'Silence Design',
      authorImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop'
    },
    { 
      id: 5, 
      category: 'outfits',
      title: '职场通勤：一套高级灰装束的干练选择', 
      img: 'https://images.unsplash.com/photo-1548624149-f7b31640e1ee?w=400&h=600&fit=crop', 
      likes: '512', 
      author: 'OfficeStyle',
      authorImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
    },
    { 
      id: 6, 
      category: 'outfits',
      title: '周末胶囊衣橱：六件单品搞定所有出街Look', 
      img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop', 
      likes: '967', 
      author: 'Minimalist',
      authorImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    }
  ];

  const filteredPosts = useMemo(() => {
    if (activeTab === 'recommended') return allPosts;
    return allPosts.filter(post => post.category === 'outfits');
  }, [activeTab]);

  return (
    <div className="pb-32 bg-[#fcfcfc] min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-6 pt-8 pb-4 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-wider">发现</h1>
        </div>
        <div className="flex gap-4">
          <button className="material-symbols-outlined text-slate-400 active:scale-90 transition-transform">search</button>
          <button className="material-symbols-outlined text-slate-400" onClick={() => onNavigate('cart')}>shopping_bag</button>
        </div>
      </header>
      
      <div className="flex gap-8 px-6 py-4 border-b border-slate-50 bg-white/50 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('recommended')}
          className={`pb-3 text-[14px] font-bold tracking-wide transition-all whitespace-nowrap relative ${activeTab === 'recommended' ? 'text-black' : 'text-slate-400'}`}
        >
          推荐
          {activeTab === 'recommended' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
        </button>
        <button 
          onClick={() => setActiveTab('outfits')}
          className={`pb-3 text-[14px] font-bold tracking-wide transition-all whitespace-nowrap relative ${activeTab === 'outfits' ? 'text-black' : 'text-slate-400'}`}
        >
          穿搭指南
          {activeTab === 'outfits' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
        </button>
      </div>
      
      <main className="px-4 py-6">
        <div className="columns-2 gap-3 space-y-6">
          {filteredPosts.map(post => (
            <div 
              key={post.id} 
              className="break-inside-avoid group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
              onClick={() => onNavigate('postDetail', post)}
            >
              <div className="rounded-2xl overflow-hidden bg-slate-100 relative shadow-sm">
                <img src={post.img} alt={post.title} className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-125">
                   <span className="material-symbols-outlined text-red-500 !text-[18px]">favorite</span>
                </button>
              </div>
              
              <div className="mt-3 px-1">
                <h3 className="text-xs font-bold leading-relaxed mb-3 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={post.authorImg} className="w-5 h-5 rounded-full object-cover border border-slate-100 shadow-sm" alt={post.author} />
                    <span className="text-[10px] text-slate-400 font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <span className="material-symbols-outlined text-[14px]">favorite</span>
                    <span className="text-[9px] font-sans font-bold tracking-tighter">{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-slate-300 space-y-4">
             <span className="material-symbols-outlined text-[48px] opacity-20">auto_stories</span>
             <p className="text-xs tracking-widest uppercase">暂无内容更新</p>
          </div>
        )}
      </main>
      
      <button 
        onClick={() => onNavigate('discoveryEditor')}
        className="fixed bottom-28 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform group"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
      </button>
    </div>
  );
};

export default Discovery;
