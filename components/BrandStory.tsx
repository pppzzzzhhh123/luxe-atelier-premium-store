
import React from 'react';

const BrandStory: React.FC = () => {
  return (
    <div className="pb-32 bg-white">
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoBF3A_MNe0MJD2_H8pVVFFxRMdZ2_t_kaSOE4SRYilv7XJpPJ64UkLzZSGmOhwQjM5HgqgyFNVlJvO1h34fboP3rGo3szqnhcFufUdBRCfvD-nQdm-ZHnriC24gf76qBjDHOvdZJsmqrkM5JKXw_D9Je6crs6zHlUKcY4uRGs8TPQZL6iWdHRDro8EWZdz4U7yj3Lr9ChpYgVm2c5aRB8XLdsKnpbCyIdIePvdxIBPfCz9MMQjKLYrW0Fe8xgI0jbnLn2S_tRHZIf")' }}
        />
        <div className="relative z-10 text-center text-white px-8">
          <span className="text-[10px] tracking-[0.5em] uppercase mb-6 block font-light">始于 1924</span>
          <h1 className="text-4xl font-serif font-light mb-8 tracking-[0.1em] leading-tight">跨越世纪的优雅叙事</h1>
        </div>
      </section>

      <section className="py-24 px-8 flex flex-col items-center">
        <div className="w-12 h-px bg-brand-gold mb-16"></div>
        <h2 className="text-3xl font-light mb-12 tracking-widest text-center font-serif">源起匠心</h2>
        
        <div className="space-y-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJKLWNxNfR3yv1RElBNsJjTQTHB5N-4p_g7Jutn1-kP-_4-Ab72sw-kLcgBqfkS56ybC7fXoESf6eHEeqrskGIjBKOw30zn_2SOTvS2rZThfyItboCT1q-CBnHH3n4v8nvLL7yIH1LLYuYyKBhKlf7yTqtwAl8rN_I_mdIEOUVf18fN68VSOq2rq870HBeueK4rnu5fU--bBRCIecApz_u_bhOC5uokh6oOfCzVUfCIViQJDcdv5Pgl9jVyJlsAXNELeuMRTq8dhzY"
              className="w-full h-full object-cover"
              alt="Artisan"
            />
          </div>
          
          <div className="space-y-6 text-gray-600 font-light text-justify leading-relaxed">
            <p>在我们的工坊核心，每一根丝线、每一寸皮革都承载着关于专注的深刻叙述。我们坚信真正的奢华并不在于浮夸的外表，而在于那些往往被视而不见的细微之处。</p>
            <p>从最初的选材到最终的反复打磨，每一道程序都倾注了手工艺人的体温与灵魂。这种对品质近乎苛求的坚持，构成了品牌百年来屹立不倒的基石。</p>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-50 py-24 px-8 text-center">
        <span className="material-symbols-outlined text-brand-gold text-4xl mb-8 opacity-60">format_quote</span>
        <blockquote className="text-2xl font-serif italic leading-relaxed mb-10 tracking-wide text-gray-800">
          “奢华并非繁复的堆砌，而是剥离冗余后，那份由内而外的纯粹与坚定。”
        </blockquote>
        <cite className="text-[10px] uppercase tracking-[0.5em] text-gray-400 not-italic">— 品牌创始人自述</cite>
      </section>
    </div>
  );
};

export default BrandStory;
