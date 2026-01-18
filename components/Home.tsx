
import React from 'react';
import { NavigateHandler, Product } from '../types';

interface HomeProps {
  onNavigate: NavigateHandler;
  onSearch?: () => void;
  onMenu?: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onSearch, onMenu }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  
  const banners = [
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDASneHtwVoojCyyPtB1i0HXb0LHzDoIUs53_6-nADqYNQEhDxdJ0JAEYnsAlHGUeYMFKzFdoNMSGKqF3KrHBFfAPzsfm9ZR-xx0MOB3Dh5FLZGU-mFoW34j9mD5ZjH5cL1NiuBlli3vcmB3ccSbrAwWej-uepcQPSIstC8BhezxbuzpE10QRmKoXCzx8-6y64yQao1LUfYsZRycQGSS9C3-yjTg61CbLFa4Mn8rIWuPYysmHtMROPZE1nXCNQHxOeHr2elwWvZfm1X',
      title: '幕染冬日 · 浪漫色彩',
      subtitle: 'NEW IN WINTER'
    },
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9',
      title: '优雅剪裁 · 极致工艺',
      subtitle: 'ELEGANT TAILORING'
    },
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0',
      title: '丝绸之韵 · 轻奢体验',
      subtitle: 'SILK COLLECTION'
    }
  ];

  // 自动轮播
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 畅销单品自动滚动
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAutoScrolling) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 30;

    const autoScroll = setInterval(() => {
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        container.scrollLeft += scrollStep;
        scrollAmount += scrollStep;
      }
    }, scrollInterval);

    return () => clearInterval(autoScroll);
  }, [isAutoScrolling]);

  // 检测畅销单品区域是否在视口中
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsAutoScrolling(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pb-24 bg-[#fcfcfc] text-[#1a1a1a]">
      {/* 顶部 Header */}
      <header className="fixed top-0 w-full max-w-[480px] z-50 bg-white/40 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-b border-transparent">
        <div className="flex items-center gap-4">
          <button onClick={onSearch} className="material-symbols-outlined text-2xl font-light">search</button>
        </div>
        <h1 className="text-lg font-bold tracking-[0.4em] ml-4 font-sans">LUÒJIAWANG</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('cart')} className="material-symbols-outlined text-2xl font-light">shopping_bag</button>
          <button onClick={onMenu} className="material-symbols-outlined text-2xl font-light">menu</button>
        </div>
      </header>

      {/* 轮播图 */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url("${banner.img}")` }}
            />
            <div className="absolute inset-0 bg-black/15"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
              <h2 className="text-3xl font-light tracking-[0.5em] mb-4 opacity-90">LUÒJIAWANG</h2>
              <div className="h-[1px] w-12 bg-white/60 mb-8"></div>
              <p className="text-[10px] tracking-[0.6em] mb-3 opacity-80 uppercase">{banner.subtitle}</p>
              <h3 className="text-4xl font-serif mb-12 tracking-[0.1em]">{banner.title}</h3>
              <button 
                onClick={() => onNavigate('productList')}
                className="border border-white/60 px-10 py-2.5 text-[10px] tracking-[0.4em] backdrop-blur-md hover:bg-white hover:text-black transition-all duration-500 uppercase active:scale-95"
              >
                立即探索
              </button>
            </div>
          </div>
        ))}
        
        {/* 轮播指示器 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 品类专区 */}
      <section className="py-20 px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold tracking-[0.3em] mb-2 uppercase">品类专区</h2>
          <p className="text-[9px] text-slate-400 tracking-[0.2em] uppercase">LUOJIAWANG · Category</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-sm group cursor-pointer" onClick={() => onNavigate('productList')}>
            <img 
              alt="Featured" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9"
            />
          </div>
          
          <CategoryBox 
            label="上装" sub="Suit/Coat" 
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV" 
            onClick={() => onNavigate('productList')}
          />
          <CategoryBox 
            label="下装" sub="Skirt/Pants" 
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0" 
            onClick={() => onNavigate('productList')}
          />
          <CategoryBox 
            label="连衣裙" sub="Dresses" 
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuDAjyGk5K6qWM8sQqEfQaDBw0nvve3D4U_WWXDVTR8gD8Mo1AIWnjY4wnHVBalXFF-S37AizzJJAF1FErphrS0ithH0F0Nczci-VWXpgPyxzbNnbYny1-a3lFJT7w4_kd5UKs4ZaVmI7fxcWUfAD4rxyvx05B0HpPHm2TVfKCmRmoFs2xNoEnkQX5y9Y8Eyl3S5-v_4xLSF6WmrtG8YCZusaG6l9UUHJa0ZmL8eshvjKTPnUP2PkMfBhDlTAzxBI_51MNtIxYIVJFUk" 
            onClick={() => onNavigate('productList')}
          />
          <CategoryBox 
            label="配饰" sub="Accessory" 
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuArm2Du8lgLxtZB83hevRs6udWdyth_Yi0QxXMjgF3H1BoXshfJWIJrPo9mbKI_GjCOaay3eJZUs0WFxPa5y-OdSXLI32AcTf1vgFul3dW0WQBAQqpVUH2ENrDe_A5Ts6_dA9YzWQy-2XPEFA68HcLLAFx6q74xU4PttTPCRmd3cnNmt2homHLEVL9vqD6XdnLjTzb6FMQJr4TxWXeG1NXY-Wb8Pp087OY-vtTuwi9lxMlhovCDL7ZQd06BaFyitiL-ASzH-9S_E2L_" 
            onClick={() => onNavigate('productList')}
          />
        </div>
      </section>

      {/* 畅销单品 */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold tracking-[0.3em] uppercase">畅销单品</h2>
            <button 
              onClick={() => onNavigate('productList')}
              className="text-xs text-gray-400 flex items-center gap-1 active:opacity-60"
            >
              查看全部
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <p className="text-[9px] text-slate-400 tracking-[0.2em] uppercase">Best Sellers</p>
        </div>
        
        <div className="overflow-x-auto no-scrollbar" ref={scrollContainerRef}>
          <div className="flex gap-4 px-6 pb-2">
            {[
              { id: 101, title: '雕塑感剪裁大衣', price: 5850.00, sales: 1286, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9' },
              { id: 102, title: '垂感丝绸连衣裙', price: 8200.00, sales: 982, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0' },
              { id: 103, title: '极细羊绒开衫', price: 4200.00, sales: 1543, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw' },
              { id: 104, title: '廓形西装外套', price: 6400.00, sales: 876, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV' },
              { id: 105, title: '复古直筒裤', price: 3200.00, sales: 1124, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZeo4St60hBIBNh_Zfb_OqaJ05m0cQB2X4P6U2LrJb2yKibSsCYzkZcoxMH_JbCxyxw7tKgfTRarC17lfnKO8KpuShEcVKgjhCLv300vFSue8xebswzilGz2XMIzKCH4H7_7fq4HfktB7-kh6xJF8WeASxv0WJcpEg4h8QA4asclfa9POJHT9DE9S8EVmhqfaxp69Le9qWWy7_RgnIjGDnJPvcasyOu-9t3-mksXOhEhxguA11Dfee0Ij0RzSuPWWjsTCzPbjQCPip' },
            ].map((product) => (
              <div 
                key={product.id}
                onClick={() => onNavigate('product', product)}
                className="flex-shrink-0 w-[160px] group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 mb-3 shadow-sm">
                  <img 
                    src={product.img} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={product.title} 
                  />
                  <div className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-1 rounded-full">
                    HOT
                  </div>
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px]">favorite</span>
                  </button>
                </div>
                <div className="space-y-1 px-1">
                  <h3 className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">{product.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                    <span>已售 {product.sales}</span>
                  </div>
                  <p className="text-sm font-bold">¥{product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 品牌理念 */}
      <section className="py-24 px-6 bg-white border-y border-slate-50">
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.2em] font-bold mb-1 uppercase">BRAND CONCEPT</p>
            <p className="text-xs text-slate-400 mb-8 font-medium">品牌理念</p>
            <div className="space-y-4 text-[11px] leading-[1.8] text-slate-500 font-light">
              <p>LUÒJIAWANG 女装是由创始人王璐瑶与先生 Ni 共同创立的品牌</p>
              <p>服装能量上，我们追求时尚与实用的平衡</p>
              <p>承载着彼此的梦想与信念，以自我之名，立品质之诺</p>
              <p>将对品质与设计的执着追求</p>
              <p>与对顾客的诚挚关怀融入每一件产品之中</p>
            </div>
          </div>
          <div className="w-1/3 aspect-[3/4] overflow-hidden rounded-sm">
            <img 
              alt="Artisan" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8KzwHlJLAjNLxGo_XaTmAxIQTT3vWo3B0wegiwPloqIYiP0c650XnkQyPDa6g36VcerJu-gAoP7aw2JKCTvQYZ2qfYEvmqUy_W_dhFfvtoTK70qHU3OVcsCBs2ggMC0EV5iDLJsUyMM12pHQp5rnc2SuokiIWkyPRM9rgdpOWnmjixkMOr8ZZpXIcq_VqozBhn4_M2sXgZo7jTTH3QZeOx1fsGCSKHlrO1S7APeQVtt66iViI0WDaWENMjt-PP_LPhnsG2PmF9I_k"
            />
          </div>
        </div>
      </section>

      {/* 会员尊享权益 */}
      <section className="py-24 px-6 bg-[#f9f9f9]">
        <div className="text-center">
          <h3 className="text-sm font-bold tracking-[0.2em] mb-2">加入会员尊享专属权益</h3>
          <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-10">Member benefits</p>
          
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm"></div>
              <div className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm"></div>
              <div className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm"></div>
            </div>
            <div className="h-[1px] w-20 bg-gray-300"></div>
            <span className="text-2xl font-serif italic text-slate-800">VIP</span>
          </div>

          <div className="bg-white p-8 rounded shadow-sm border border-slate-100 max-w-xs mx-auto space-y-4">
            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-4">
              <span className="text-slate-500">1 件</span>
              <span className="font-bold">95 折</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-4">
              <span className="text-slate-500">2 件</span>
              <span className="font-bold">92 折</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">3 件</span>
              <span className="font-bold">90 折</span>
            </div>
            <p className="text-[9px] text-slate-400 pt-4 leading-relaxed font-light">VIP 粉丝群的限量款式以及断码清仓福利</p>
          </div>
        </div>
      </section>

      {/* 穿搭指南 */}
      <section className="py-24 px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-[1px] flex-1 bg-slate-100"></div>
          <h2 className="text-xl font-bold tracking-[0.3em] uppercase">穿搭指南</h2>
          <div className="h-[1px] flex-1 bg-slate-100"></div>
        </div>

        <div className="space-y-20">
          <GuideRow 
            title="上装" 
            products={[
              { id: 1, title: "100%绵羊毛费", price: 350.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9" },
              { id: 2, title: "100%山羊绒圆", price: 850.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV" },
              { id: 3, title: "100%羊皮白自", price: 1980.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDASneHtwVoojCyyPtB1i0HXb0LHzDoIUs53_6-nADqYNQEhDxdJ0JAEYnsAlHGUeYMFKzFdoNMSGKqF3KrHBFfAPzsfm9ZR-xx0MOB3Dh5FLZGU-mFoW34j9mD5ZjH5cL1NiuBlli3vcmB3ccSbrAwWej-uepcQPSIstC8BhezxbuzpE10QRmKoXCzx8-6y64yQao1LUfYsZRycQGSS9C3-yjTg61CbLFa4Mn8rIWuPYysmHtMROPZE1nXCNQHxOeHr2elwWvZfm1X" }
            ]}
            onNavigate={onNavigate}
          />

          <GuideRow 
            title="下装" 
            products={[
              { id: 4, title: "秋冬显腿长显瘦", price: 299.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0" },
              { id: 5, title: "100%羊皮草高", price: 1580.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTOw-ak_6Hph828TDb_ANkXWJ0GueKiD3GrdLyhUAQME2aiJ3e_CVwKXsHuZ51Idz9QmGwaCC_sZavbNGJm9Hyw_9RtNoHzwi1H_GUj1As1hfc_-VcC7wlraFfaQaN8W6qNEc7rTn-JeGlmuZ0TQhI8mFd217vhbQKpeHH6grFSlPUPUq84YXxjq3eN7wqEB5uw-JqgAjsye7a2qQCsqVXX48_BzZisjaFRHT-i7E7LxeSqZcytvR2RFEgAMf-eTlek6VUU9pjhxhZ" },
              { id: 6, title: "复古直筒裤", price: 320.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZeo4St60hBIBNh_Zfb_OqaJ05m0cQB2X4P6U2LrJb2yKibSsCYzkZcoxMH_JbCxyxw7tKgfTRarC17lfnKO8KpuShEcVKgjhCLv300vFSue8xebswzilGz2XMIzKCH4H7_7fq4HfktB7-kh6xJF8WeASxv0WJcpEg4h8QA4asclfa9POJHT9DE9S8EVmhqfaxp69Le9qWWy7_RgnIjGDnJPvcasyOu-9t3-mksXOhEhxguA11Dfee0Ij0RzSuPWWjsTCzPbjQCPip" }
            ]}
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {/* 底部品牌语 */}
      <section className="py-24 px-6 text-center bg-white border-t border-slate-50">
        <h2 className="text-xl font-bold tracking-[0.5em] mb-6">LUÒJIAWANG</h2>
        <p className="text-[10px] tracking-[0.3em] text-slate-400 mb-12 font-medium uppercase">品牌独具匠心</p>
        <div className="max-w-xs mx-auto space-y-6 text-[11px] leading-relaxed text-slate-400 font-light">
          <p>与那些对生命有着热爱和探索精神的女性而共鸣</p>
          <p>为那些对生活有着追求和精神追求的女性而存在</p>
          <div className="h-[1px] w-8 bg-slate-100 mx-auto my-4"></div>
          <p>我们甄选优质面料<br/>只为赋予每一件作品质感与舒适触感</p>
          <p>从复古经典到先锋潮流，将多元元素巧妙融合<br/>将其与现代艺术和谐相处，立品质之诺</p>
        </div>
      </section>
    </div>
  );
};

const CategoryBox: React.FC<{ label: string; sub: string; img: string; onClick: () => void }> = ({ label, sub, img, onClick }) => (
  <div 
    className="relative bg-[#f4f4f4] aspect-[3/4] p-4 flex flex-col justify-end overflow-hidden group cursor-pointer rounded-sm"
    onClick={onClick}
  >
    <img 
      alt={label} 
      className="absolute inset-0 w-full h-full object-cover p-4 opacity-90 transition-transform duration-700 group-hover:scale-105" 
      src={img}
    />
    <div className="relative z-10">
      <p className="text-xs font-bold tracking-widest">{label}</p>
      <p className="text-[8px] text-slate-400 uppercase tracking-tighter">{sub}</p>
    </div>
  </div>
);

const GuideRow: React.FC<{ title: string; products: Product[]; onNavigate: NavigateHandler }> = ({ title, products, onNavigate }) => (
  <div className="flex items-center gap-6">
    <span className="[writing-mode:vertical-rl] text-lg font-bold tracking-[0.3em] text-slate-800 uppercase">{title}</span>
    <div className="grid grid-cols-3 gap-3 flex-1">
      {products.map((p, i) => (
        <div 
          key={p.id || i} 
          className="space-y-3 cursor-pointer group"
          onClick={() => onNavigate('product', p)}
        >
          <div className="aspect-[3/4] bg-slate-50 overflow-hidden rounded-sm">
            <img src={p.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.title} />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] truncate font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">{p.title}</p>
            <p className="text-[9px] font-black font-sans">¥ {p.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Home;
