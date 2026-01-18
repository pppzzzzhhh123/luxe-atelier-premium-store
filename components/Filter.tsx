import React, { useState } from 'react';

interface FilterProps {
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category: string[];
  priceRange: [number, number];
  sortBy: string;
  inStock: boolean;
}

const Filter: React.FC<FilterProps> = ({ onClose, onApply }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('default');
  const [inStock, setInStock] = useState(false);

  const categories = [
    { id: 'tops', name: '上装' },
    { id: 'bottoms', name: '下装' },
    { id: 'dresses', name: '连衣裙' },
    { id: 'accessories', name: '配饰' },
    { id: 'outerwear', name: '外套' },
    { id: 'knitwear', name: '针织' },
  ];

  const sortOptions = [
    { id: 'default', name: '默认排序' },
    { id: 'price-asc', name: '价格从低到高' },
    { id: 'price-desc', name: '价格从高到低' },
    { id: 'newest', name: '最新上架' },
    { id: 'popular', name: '最受欢迎' },
  ];

  const priceRanges = [
    { label: '全部', range: [0, 10000] as [number, number] },
    { label: '0-500', range: [0, 500] as [number, number] },
    { label: '500-1000', range: [500, 1000] as [number, number] },
    { label: '1000-2000', range: [1000, 2000] as [number, number] },
    { label: '2000以上', range: [2000, 10000] as [number, number] },
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSortBy('default');
    setInStock(false);
  };

  const handleApply = () => {
    onApply({
      category: selectedCategories,
      priceRange,
      sortBy,
      inStock,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">筛选</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-400">close</span>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 分类 */}
          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">category</span>
              商品分类
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 价格区间 */}
          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">payments</span>
              价格区间
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => setPriceRange(range.range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    priceRange[0] === range.range[0] && priceRange[1] === range.range[1]
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ¥{range.label}
                </button>
              ))}
            </div>
            
            {/* 自定义价格范围 */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-3">自定义价格范围</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="最低价"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="最高价"
                />
              </div>
            </div>
          </div>

          {/* 排序方式 */}
          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">sort</span>
              排序方式
            </h3>
            <div className="space-y-2">
              {sortOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-all flex items-center justify-between ${
                    sortBy === option.id
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.name}
                  {sortBy === option.id && (
                    <span className="material-symbols-outlined text-lg">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 其他选项 */}
          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">tune</span>
              其他选项
            </h3>
            <button
              onClick={() => setInStock(!inStock)}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-all flex items-center justify-between ${
                inStock
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>仅显示有货商品</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${inStock ? 'bg-white/20' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${inStock ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 h-12 border-2 border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
          <button
            onClick={handleApply}
            className="flex-1 h-12 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors active:scale-95"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
