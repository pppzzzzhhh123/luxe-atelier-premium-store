import React, { useState } from 'react';
import { Product, NavigateHandler } from '../types';
import Filter, { FilterOptions } from './Filter';

interface CategoryDetailProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  categoryName: string;
  categoryId: string;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ onBack, onNavigate, categoryName, categoryId }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: [],
    priceRange: [0, 10000],
    sortBy: 'default',
    inStock: false,
  });

  // 模拟商品数据
  const allProducts: Product[] = [
    { id: 101, title: '100%羊绒双面呢大衣', price: 3980.00, originalPrice: 4980.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDASneHtwVoojCyyPtB1i0HXb0LHzDoIUs53_6-nADqYNQEhDxdJ0JAEYnsAlHGUeYMFKzFdoNMSGKqF3KrHBFfAPzsfm9ZR-xx0MOB3Dh5FLZGU-mFoW34j9mD5ZjH5cL1NiuBlli3vcmB3ccSbrAwWej-uepcQPSIstC8BhezxbuzpE10QRmKoXCzx8-6y64yQao1LUfYsZRycQGSS9C3-yjTg61CbLFa4Mn8rIWuPYysmHtMROPZE1nXCNQHxOeHr2elwWvZfm1X', category: 'coat' },
    { id: 102, title: '经典款羊毛大衣', price: 2580.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV', category: 'coat' },
    { id: 103, title: '廓形羊绒大衣', price: 4280.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9', category: 'coat' },
    { id: 104, title: '意大利进口羊毛大衣', price: 5680.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQIv_L4pQkIHnjKOrIO7GxaQm8NB0_2l1MsAZ4LqF7wxJPhCJ1Jy0VhGa_7TkEARqkPHWF3vQRAr0Kg741FhS9bo23IbcSqZ_Mjt2Ilkra9lox2owV1bfEqwadc181BnJG6fXKu9-7x_ZpbQX__5J6C4cDm1erT75JDhdPWUUV55qHB-flD3O8SRwl3FWDZL6Cy8ufNIafHZxq11A5WKnOkSpb7FmQ85ATxyAIxrwiisdfSa5A5KGLjSq-yJNL679W6Tu_4xW0oj4w', category: 'coat' },
    { id: 105, title: '轻奢羊绒大衣', price: 3280.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0', category: 'coat' },
    { id: 106, title: '复古风羊毛大衣', price: 2980.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTOw-ak_6Hph828TDb_ANkXWJ0GueKiD3GrdLyhUAQME2aiJ3e_CVwKXsHuZ51Idz9QmGwaCC_sZavbNGJm9Hyw_9RtNoHzwi1H_GUj1As1hfc_-VcC7wlraFfaQaN8W6qNEc7rTn-JeGlmuZ0TQhI8mFd217vhbQKpeHH6grFSlPUPUq84YXxjq3eN7wqEB5uw-JqgAjsye7a2qQCsqVXX48_BzZisjaFRHT-i7E7LxeSqZcytvR2RFEgAMf-eTlek6VUU9pjhxhZ', category: 'coat' },
  ];

  // 应用筛选
  const filteredProducts = allProducts.filter(product => {
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
    <div className="min-h-screen bg-white pb-20">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-[15px] font-bold tracking-wider">{categoryName}</h1>
          <button onClick={() => setShowFilter(true)} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-xl">filter_list</span>
          </button>
        </div>
      </header>

      {/* 商品列表 */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">共 {sortedProducts.length} 件商品</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="material-symbols-outlined text-sm">sort</span>
            <span>{filterOptions.sortBy === 'price-asc' ? '价格升序' : filterOptions.sortBy === 'price-desc' ? '价格降序' : '默认排序'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {sortedProducts.map(product => (
            <div
              key={product.id}
              onClick={() => onNavigate('product', product)}
              className="cursor-pointer group"
            >
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold">¥{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">¥{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-gray-200 text-6xl mb-4">inventory_2</span>
            <p className="text-gray-400 text-sm">暂无商品</p>
          </div>
        )}
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

export default CategoryDetail;
