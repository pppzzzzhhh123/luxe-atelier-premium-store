
import React, { useState } from 'react';
import { NavigateHandler, Product } from '../types';
import Filter, { FilterOptions } from './Filter';

interface ProductListProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
}

const ProductList: React.FC<ProductListProps> = ({ onBack, onNavigate }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women'>('all');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: [],
    priceRange: [0, 10000],
    sortBy: 'default',
    inStock: false,
  });

  const allProducts: Product[] = [
    { id: 1, title: '雕塑感剪裁大衣', price: 5850.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9', category: 'women' },
    { id: 2, title: '垂感丝绸连衣裙', price: 8200.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0', category: 'women' },
    { id: 3, title: '极细羊绒开衫', price: 4200.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA55XLERjidLcdpnk3fhpUYxK5JMd_n8jUuBfUp6JbwCFfXvtPYX1-sESixfcKwNnHNZrfsM2q-Mi6bJLaye09UvnDMMeZ3xAm7Osl-UEXKwi1n3HXhh0urJe6EjrLd5tp0jhSo_KlwL1O6FauuxX5WTD3famG07nsl8C-i03cOViBgyZY6lqQ6lUCvdJzknE0usd3izSoQAKv0mIjmoK6MLqYx7WAr6rpUh5mCMHflN9BbVWMXbNOiE3BhXumHEXDiIrFdLcpN7APw', category: 'women' },
    { id: 4, title: '廓形西装外套', price: 6400.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV', category: 'men' },
    { id: 5, title: '商务休闲衬衫', price: 3200.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDASneHtwVoojCyyPtB1i0HXb0LHzDoIUs53_6-nADqYNQEhDxdJ0JAEYnsAlHGUeYMFKzFdoNMSGKqF3KrHBFfAPzsfm9ZR-xx0MOB3Dh5FLZGU-mFoW34j9mD5ZjH5cL1NiuBlli3vcmB3ccSbrAwWej-uepcQPSIstC8BhezxbuzpE10QRmKoXCzx8-6y64yQao1LUfYsZRycQGSS9C3-yjTg61CbLFa4Mn8rIWuPYysmHtMROPZE1nXCNQHxOeHr2elwWvZfm1X', category: 'men' },
    { id: 6, title: '精纺羊毛长裤', price: 4800.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAjyGk5K6qWM8sQqEfQaDBw0nvve3D4U_WWXDVTR8gD8Mo1AIWnjY4wnHVBalXFF-S37AizzJJAF1FErphrS0ithH0F0Nczci-VWXpgPyxzbNnbYny1-a3lFJT7w4_kd5UKs4ZaVmI7fxcWUfAD4rxyvx05B0HpPHm2TVfKCmRmoFs2xNoEnkQX5y9Y8Eyl3S5-v_4xLSF6WmrtG8YCZusaG6l9UUHJa0ZmL8eshvjKTPnUP2PkMfBhDlTAzxBI_51MNtIxYIVJFUk', category: 'men' },
  ];

  // 应用筛选
  const filteredProducts = allProducts.filter(product => {
    // 性别筛选
    if (genderFilter !== 'all' && product.category !== genderFilter) {
      return false;
    }
    // 价格筛选
    if (product.price < filterOptions.priceRange[0] || product.price > filterOptions.priceRange[1]) {
      return false;
    }
    return true;
  });

  // 排序
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filterOptions.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const handleApplyFilter = (options: FilterOptions) => {
    setFilterOptions(options);
  };

  return (
    <div className="pb-32 bg-white min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-50">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-[15px] font-bold tracking-wider">所有系列</h1>
          <button onClick={() => setShowFilter(true)} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-xl">filter_list</span>
          </button>
        </div>
        
        {/* 性别筛选 */}
        <div className="flex justify-center gap-8 py-3 border-t border-slate-50">
          <button 
            onClick={() => setGenderFilter('all')}
            className={`text-[12px] font-bold tracking-widest transition-all relative px-4 py-1 ${genderFilter === 'all' ? 'text-black' : 'text-slate-300'}`}
          >
            全部
            {genderFilter === 'all' && <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-black" />}
          </button>
          <button 
            onClick={() => setGenderFilter('women')}
            className={`text-[12px] font-bold tracking-widest transition-all relative px-4 py-1 ${genderFilter === 'women' ? 'text-black' : 'text-slate-300'}`}
          >
            女士
            {genderFilter === 'women' && <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-black" />}
          </button>
          <button 
            onClick={() => setGenderFilter('men')}
            className={`text-[12px] font-bold tracking-widest transition-all relative px-4 py-1 ${genderFilter === 'men' ? 'text-black' : 'text-slate-300'}`}
          >
            男士
            {genderFilter === 'men' && <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-black" />}
          </button>
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">共 {sortedProducts.length} 件商品</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="material-symbols-outlined text-sm">sort</span>
            <span>{filterOptions.sortBy === 'price-asc' ? '价格升序' : filterOptions.sortBy === 'price-desc' ? '价格降序' : '默认排序'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {sortedProducts.map((item) => (
            <div 
              key={item.id} 
              className="group cursor-pointer" 
              onClick={() => onNavigate('product', item)}
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 mb-3">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={item.title} 
                />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-base font-bold">¥{item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 筛选弹窗 */}
      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilter}
        />
      )}
    </div>
  );
};

export default ProductList;
