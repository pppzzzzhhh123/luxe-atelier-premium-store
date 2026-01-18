const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { Product, NavigateHandler } from '../types';

interface ProductDetailProps {
  product: Product | null;
  onBack: () => void;
  onNavigate: NavigateHandler;
  onAddToCart?: (product: Product, spec: string, quantity: number) => void;
  cartCount?: number;
  showFeedback?: (message: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onNavigate, onAddToCart, cartCount = 0, showFeedback }) => {
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState('常规色');
  const [mainImage, setMainImage] = useState('');
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState<'cart' | 'buy'>('cart');
  const [showComments, setShowComments] = useState(false);
  const [showPurchaseRecords, setShowPurchaseRecords] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const salesData = {
    sold: 1286,
    stock: 234,
    totalStock: 1520,
  };

  const comments = [
    {
      id: 1,
      user: '张**',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      content: '质量非常好，面料很舒服，版型也很好看！',
      images: [product?.img || ''],
      time: '2024-01-15',
      spec: '常规色 / M',
    },
    {
      id: 2,
      user: '李**',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      rating: 5,
      content: '超级喜欢，已经回购第二件了，强烈推荐！',
      images: [],
      time: '2024-01-14',
      spec: '经典黑 / S',
    },
  ];

  const purchaseRecords = [
    { user: '王**', time: '5分钟前', spec: '常规色 / M' },
    { user: '刘**', time: '12分钟前', spec: '经典黑 / L' },
    { user: '陈**', time: '25分钟前', spec: '米咖色 / S' },
    { user: '赵**', time: '1小时前', spec: '常规色 / M' },
    { user: '孙**', time: '2小时前', spec: '经典黑 / M' },
  ];

  useEffect(() => {
    if (product && product.img) {
      setMainImage(product.img);
    }
  }, [product]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollOffset(prev => (prev + 1) % purchaseRecords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const recommendedProducts = [
    {
      id: 101,
      title: '羊绒混纺大衣',
      price: 2899,
      originalPrice: 3999,
      img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 102,
      title: '真丝衬衫',
      price: 1299,
      originalPrice: 1899,
      img: 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 103,
      title: '羊毛针织开衫',
      price: 1599,
      originalPrice: 2299,
      img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 104,
      title: '高腰阔腿裤',
      price: 899,
      originalPrice: 1299,
      img: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=400&q=80',
    },
  ];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <span className="material-symbols-outlined text-gray-200 text-6xl mb-4">inventory_2</span>
        <p className="text-gray-400 text-sm">未找到商品信息</p>
        <button onClick={onBack} className="mt-6 px-8 py-2 border border-black text-xs font-bold uppercase tracking-widest">返回</button>
      </div>
    );
  }

  const thumbs = [
    product.img,
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1554412930-c74f63719b16?auto=format&fit=crop&w=400&q=80"
  ];

  const handleOpenSelection = (type: 'cart' | 'buy') => {
    setActionType(type);
    setIsSelectionOpen(true);
  };

  const handleConfirmAction = () => {
    if (!product) return;
    const spec = \`\${selectedColor}, \${selectedSize}\`;
    if (actionType === 'cart') {
      if (onAddToCart) {
        onAddToCart(product, spec, quantity);
      }
      setIsSelectionOpen(false);
    } else {
      onNavigate('checkout', { ...product, spec, count: quantity });
    }
  };

  const toggleCommentExpand = (commentId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 flex items-center justify-between px-4 py-4 max-w-[480px] pointer-events-none">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md pointer-events-auto shadow-sm active:scale-90 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md pointer-events-auto shadow-sm active:scale-90 transition-transform">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </header>

      <main>
        <section className="relative w-full">
          <div className="h-[60vh] w-full overflow-hidden">
            <img alt="Product" className="w-full h-full object-cover transition-opacity duration-500" src={mainImage || product.img} />
          </div>
          <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar bg-white">
            {thumbs.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={\`w-14 h-14 flex-shrink-0 cursor-pointer border transition-all \${mainImage === img ? 'border-black' : 'border-gray-100'}\`}
              >
                <img className="w-full h-full object-cover" src={img} alt={\`thumb-\${idx}\`} />
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pt-4 pb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-semibold font-serif">
              ¥{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-300 line-through">
                ¥{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <h1 className="mt-4 font-serif text-xl font-medium leading-tight text-slate-900">{product.title}</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-sans">Premium Minimalist Collection</p>
          
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">已售</span>
              <span className="font-bold text-gray-700">{salesData.sold}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">剩余</span>
              <span className="font-bold text-orange-500">{salesData.stock}</span>
            </div>
            <div className="flex-1">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                  style={{ width: \`\${(salesData.sold / salesData.totalStock) * 100}%\` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-2">
            <span className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 border border-slate-100">顺丰包邮</span>
            <span className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 border border-slate-100">7天无理由退换</span>
          </div>
        </section>

        <div className="h-2 bg-slate-50"></div>
`;

fs.writeFileSync('components/ProductDetail.tsx', content, 'utf8');
console.log('ProductDetail.tsx part 1 created successfully');
