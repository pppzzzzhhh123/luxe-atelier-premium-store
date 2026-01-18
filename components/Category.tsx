
import React, { useState } from 'react';
import { NavigateHandler } from '../types';

interface CategoryProps {
  onNavigate: NavigateHandler;
}

const Category: React.FC<CategoryProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('成衣');
  const [gender, setGender] = useState<'women' | 'men'>('women');
  const categories = ['成衣', '配饰', '包袋', '鞋履', '珠宝', '家居'];

  // 根据分类和性别获取不同的特色图片
  const getFeaturedImage = () => {
    if (activeTab === '成衣') {
      return gender === 'women' 
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9"
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV";
    } else if (activeTab === '配饰') {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuArm2Du8lgLxtZB83hevRs6udWdyth_Yi0QxXMjgF3H1BoXshfJWIJrPo9mbKI_GjCOaay3eJZUs0WFxPa5y-OdSXLI32AcTf1vgFul3dW0WQBAQqpVUH2ENrDe_A5Ts6_dA9YzWQy-2XPEFA68HcLLAFx6q74xU4PttTPCRmd3cnNmt2homHLEVL9vqD6XdnLjTzb6FMQJr4TxWXeG1NXY-Wb8Pp087OY-vtTuwi9lxMlhovCDL7ZQd06BaFyitiL-ASzH-9S_E2L_";
    } else {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuCgV5lrRQLTwzIr7YBv-zjeJs67D5xENFrwwTTDhmUolGRhGxvSR0ExL1U45oEX1q8lrY8XfYnjeyMOKYmtMGtrNjgqyqP1d2D2Wz3FT7hcUfWUFQz-YDBB4WF5ggzOX7IrSS7IeT5RyP2rh_PAwXyEGLHOKQZdWRh653L6eT4Km1lsvcagRup6X1qc766MNVldHZuE6VOpF9gzNoUEHLH4wTxXHibMs0CG69Tq3aLO2_xlE75BOAPwXTnbjQ005IdyHRdS9bOJmLD3";
    }
  };

  // 根据分类获取商品列表
  const getCategoryItems = () => {
    if (activeTab === '成衣') {
      return [
        { id: 'coat', label: '大衣', sub: 'Coat Collection', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDASneHtwVoojCyyPtB1i0HXb0LHzDoIUs53_6-nADqYNQEhDxdJ0JAEYnsAlHGUeYMFKzFdoNMSGKqF3KrHBFfAPzsfm9ZR-xx0MOB3Dh5FLZGU-mFoW34j9mD5ZjH5cL1NiuBlli3vcmB3ccSbrAwWej-uepcQPSIstC8BhezxbuzpE10QRmKoXCzx8-6y64yQao1LUfYsZRycQGSS9C3-yjTg61CbLFa4Mn8rIWuPYysmHtMROPZE1nXCNQHxOeHr2elwWvZfm1X' },
        { id: 'knitwear', label: '针织衫', sub: 'Knitwear', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV' },
        { id: 'dress', label: '连衣裙', sub: 'Dresses', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAjyGk5K6qWM8sQqEfQaDBw0nvve3D4U_WWXDVTR8gD8Mo1AIWnjY4wnHVBalXFF-S37AizzJJAF1FErphrS0ithH0F0Nczci-VWXpgPyxzbNnbYny1-a3lFJT7w4_kd5UKs4ZaVmI7fxcWUfAD4rxyvx05B0HpPHm2TVfKCmRmoFs2xNoEnkQX5y9Y8Eyl3S5-v_4xLSF6WmrtG8YCZusaG6l9UUHJa0ZmL8eshvjKTPnUP2PkMfBhDlTAzxBI_51MNtIxYIVJFUk' },
        { id: 'trousers', label: '裤装', sub: 'Trousers', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0' },
      ];
    } else if (activeTab === '配饰') {
      return [
        { id: 'scarf', label: '围巾', sub: 'Scarves', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArm2Du8lgLxtZB83hevRs6udWdyth_Yi0QxXMjgF3H1BoXshfJWIJrPo9mbKI_GjCOaay3eJZUs0WFxPa5y-OdSXLI32AcTf1vgFul3dW0WQBAQqpVUH2ENrDe_A5Ts6_dA9YzWQy-2XPEFA68HcLLAFx6q74xU4PttTPCRmd3cnNmt2homHLEVL9vqD6XdnLjTzb6FMQJr4TxWXeG1NXY-Wb8Pp087OY-vtTuwi9lxMlhovCDL7ZQd06BaFyitiL-ASzH-9S_E2L_' },
        { id: 'hat', label: '帽子', sub: 'Hats', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgV5lrRQLTwzIr7YBv-zjeJs67D5xENFrwwTTDhmUolGRhGxvSR0ExL1U45oEX1q8lrY8XfYnjeyMOKYmtMGtrNjgqyqP1d2D2Wz3FT7hcUfWUFQz-YDBB4WF5ggzOX7IrSS7IeT5RyP2rh_PAwXyEGLHOKQZdWRh653L6eT4Km1lsvcagRup6X1qc766MNVldHZuE6VOpF9gzNoUEHLH4wTxXHibMs0CG69Tq3aLO2_xlE75BOAPwXTnbjQ005IdyHRdS9bOJmLD3' },
      ];
    } else {
      return [
        { id: 'other1', label: activeTab, sub: 'Collection', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9' },
      ];
    }
  };

  const featuredImage = getFeaturedImage();
  const categoryItems = getCategoryItems();

  return (
    <div className="pb-24 flex flex-col h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white px-6 pt-8 pb-4 border-b border-slate-50">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 !text-[20px]">search</span>
          <input 
            className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-[13px] focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
            placeholder="搜索系列、单品或品牌故事" 
            type="text"
          />
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-24 bg-slate-50 overflow-y-auto no-scrollbar border-r border-gray-100">
          <nav className="flex flex-col">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative py-6 text-[12px] tracking-widest text-center transition-all ${activeTab === cat ? 'font-bold text-black border-r-2 border-black bg-white' : 'text-slate-400'}`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content */}
        <section className="flex-1 overflow-y-auto no-scrollbar">
          {/* Gender Toggle - Sticky */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md flex justify-center gap-12 py-4 border-b border-slate-50">
            <button 
              onClick={() => setGender('women')}
              className={`text-[12px] font-bold tracking-widest transition-all relative ${gender === 'women' ? 'text-black' : 'text-slate-300'}`}
            >
              女士
              {gender === 'women' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />}
            </button>
            <button 
              onClick={() => setGender('men')}
              className={`text-[12px] font-bold tracking-widest transition-all relative ${gender === 'men' ? 'text-black' : 'text-slate-300'}`}
            >
              男士
              {gender === 'men' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />}
            </button>
          </div>

          <div className="px-6 py-6">
            {/* Featured Section */}
            <div 
              className="mb-10 group cursor-pointer"
              onClick={() => onNavigate('categoryDetail', { categoryName: `${activeTab}系列`, categoryId: activeTab })}
            >
              <div className="relative aspect-[4/5] rounded-xl bg-slate-100 overflow-hidden mb-4">
                <img 
                  src={featuredImage}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Highlight"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/80 backdrop-blur rounded-lg shadow-sm">
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase">限时甄选</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5">查看{gender === 'women' ? '女士' : '男士'}{activeTab}系列</p>
                </div>
              </div>
            </div>

            {/* Grid Items */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
              {categoryItems.map((item) => (
                <CategoryItem 
                  key={item.id}
                  label={item.label} 
                  sub={item.sub} 
                  img={item.img} 
                  onClick={() => onNavigate('categoryDetail', { categoryName: item.label, categoryId: item.id })}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const CategoryItem: React.FC<{ label: string; sub: string; img: string; onClick: () => void }> = ({ label, sub, img, onClick }) => (
  <div className="space-y-3 cursor-pointer group" onClick={onClick}>
    <div className="aspect-[3/4] bg-slate-50 rounded-lg overflow-hidden relative">
      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={label} />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
    </div>
    <div>
      <p className="text-[11px] font-bold tracking-tight mb-0.5 group-hover:text-primary transition-colors">{label}</p>
      <p className="text-[9px] text-slate-400 uppercase tracking-tighter">{sub}</p>
    </div>
  </div>
);

export default Category;
