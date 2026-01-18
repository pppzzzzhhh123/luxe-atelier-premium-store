import React, { useState, useEffect } from 'react';
import { Product, NavigateHandler } from '../types';

interface SearchProps {
  onClose: () => void;
  onNavigate: NavigateHandler;
}

const Search: React.FC<SearchProps> = ({ onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 模拟商品数据
  const allProducts: Product[] = [
    { id: 1, title: '100%绵羊毛费尔岛提花针织衫', price: 350.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9', category: '上装' },
    { id: 2, title: '100%山羊绒圆领针织衫', price: 850.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV', category: '上装' },
    { id: 3, title: '100%羊皮白色皮衣外套', price: 1980.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDASneHtwVoojCyyPtB1i0HXb0LHzDoIUs53_6-nADqYNQEhDxdJ0JAEYnsAlHGUeYMFKzFdoNMSGKqF3KrHBFfAPzsfm9ZR-xx0MOB3Dh5FLZGU-mFoW34j9mD5ZjH5cL1NiuBlli3vcmB3ccSbrAwWej-uepcQPSIstC8BhezxbuzpE10QRmKoXCzx8-6y64yQao1LUfYsZRycQGSS9C3-yjTg61CbLFa4Mn8rIWuPYysmHtMROPZE1nXCNQHxOeHr2elwWvZfm1X', category: '上装' },
    { id: 4, title: '秋冬显腿长显瘦直筒裤', price: 299.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYlJJ3B-TI4dOTSFVIb8gLboUHzlNvHsKxNQF308Xnkee9CcLgpDcZ7XDZr8Sx_3Hvi-5scoeLwgFQokMmu_pyl5hSf7VBvKhuxHy1jllZifJ6Uaty8YB8Xd5Cp4IV65x1gUO_GQDmI0LFSuy5L_oE_dV0pkOA65zUILinXSfCa9BUcviyl_ltkrR0LuEtepvrQCQf0X56g34catdnT_Jq0AAfpMJsKjBq5cqzu2cirIViKn2WMs4wjr4NEPFkL1RiuXpRyEIYI0', category: '下装' },
    { id: 5, title: '100%羊皮草高腰半身裙', price: 1580.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTOw-ak_6Hph828TDb_ANkXWJ0GueKiD3GrdLyhUAQME2aiJ3e_CVwKXsHuZ51Idz9QmGwaCC_sZavbNGJm9Hyw_9RtNoHzwi1H_GUj1As1hfc_-VcC7wlraFfaQaN8W6qNEc7rTn-JeGlmuZ0TQhI8mFd217vhbQKpeHH6grFSlPUPUq84YXxjq3eN7wqEB5uw-JqgAjsye7a2qQCsqVXX48_BzZisjaFRHT-i7E7LxeSqZcytvR2RFEgAMf-eTlek6VUU9pjhxhZ', category: '下装' },
    { id: 6, title: '复古直筒牛仔裤', price: 320.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZeo4St60hBIBNh_Zfb_OqaJ05m0cQB2X4P6U2LrJb2yKibSsCYzkZcoxMH_JbCxyxw7tKgfTRarC17lfnKO8KpuShEcVKgjhCLv300vFSue8xebswzilGz2XMIzKCH4H7_7fq4HfktB7-kh6xJF8WeASxv0WJcpEg4h8QA4asclfa9POJHT9DE9S8EVmhqfaxp69Le9qWWy7_RgnIjGDnJPvcasyOu-9t3-mksXOhEhxguA11Dfee0Ij0RzSuPWWjsTCzPbjQCPip', category: '下装' },
    { id: 7, title: '廓形羊绒针织衫', price: 2325.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQIv_L4pQkIHnjKOrIO7GxaQm8NB0_2l1MsAZ4LqF7wxJPhCJ1Jy0VhGa_7TkEARqkPHWF3vQRAr0Kg741FhS9bo23IbcSqZ_Mjt2Ilkra9lox2owV1bfEqwadc181BnJG6fXKu9-7x_ZpbQX__5J6C4cDm1erT75JDhdPWUUV55qHB-flD3O8SRwl3FWDZL6Cy8ufNIafHZxq11A5WKnOkSpb7FmQ85ATxyAIxrwiisdfSa5A5KGLjSq-yJNL679W6Tu_4xW0oj4w', category: '上装' },
  ];

  useEffect(() => {
    // 加载搜索历史
    try {
      const saved = localStorage.getItem('luxe-search-history');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  useEffect(() => {
    // 实时搜索
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const results = allProducts.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // 保存到搜索历史
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    try {
      localStorage.setItem('luxe-search-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('luxe-search-history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const handleProductClick = (product: Product) => {
    onNavigate('product', product);
    onClose();
  };

  const hotSearches = ['羊绒', '针织衫', '连衣裙', '外套', '裤子'];

  return (
    <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-top-4 duration-300">
      {/* 搜索栏 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            placeholder="搜索商品..."
            autoFocus
            className="w-full h-10 pl-10 pr-10 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
            >
              <span className="material-symbols-outlined text-white text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {/* 搜索结果 */}
        {searchQuery && (
          <div className="p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">找到 {searchResults.length} 个结果</p>
                <div className="grid grid-cols-2 gap-4">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
                        <img
                          src={product.img}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-xs font-medium line-clamp-2 mb-1">{product.title}</h3>
                      <p className="text-sm font-bold">¥{product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <span className="material-symbols-outlined text-gray-200 text-6xl mb-4">search_off</span>
                <p className="text-gray-400 text-sm">未找到相关商品</p>
              </div>
            )}
          </div>
        )}

        {/* 搜索历史和热门搜索 */}
        {!searchQuery && (
          <div className="p-4 space-y-6">
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">搜索历史</h3>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    清空
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(item)}
                      className="px-4 py-2 bg-gray-50 rounded-full text-sm hover:bg-gray-100 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            <div>
              <h3 className="text-sm font-bold mb-3">热门搜索</h3>
              <div className="flex flex-wrap gap-2">
                {hotSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(item)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 rounded-full text-sm font-medium hover:shadow-md transition-all"
                  >
                    <span className="mr-1">🔥</span>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
