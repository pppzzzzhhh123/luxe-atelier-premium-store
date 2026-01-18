import React from 'react';
import { NavigateHandler } from '../types';
import CommentSection from './CommentSection';

interface PostDetailProps {
  onBack: () => void;
  onNavigate: NavigateHandler;
  post: {
    id: number;
    title: string;
    img: string;
    author: string;
    authorImg: string;
    likes: string;
    content?: string;
  };
}

const PostDetail: React.FC<PostDetailProps> = ({ onBack, onNavigate, post }) => {
  const [liked, setLiked] = React.useState(false);
  const [collected, setCollected] = React.useState(false);
  const [followed, setFollowed] = React.useState(false);
  const [showShareMenu, setShowShareMenu] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const handleFollow = () => {
    setFollowed(!followed);
  };

  const handleShare = () => {
    setShowShareMenu(true);
  };

  const handleShareTo = (platform: string) => {
    alert(`分享到${platform}`);
    setShowShareMenu(false);
  };

  const handleComment = () => {
    setShowComments(true);
  };

  // 如果显示评论，渲染评论组件
  if (showComments) {
    return <CommentSection postId={post.id} onClose={() => setShowComments(false)} />;
  }

  // 模拟文章内容
  const articleContent = post.content || `
    <p>在这个快节奏的时代，我们更需要慢下来，感受服装带来的美好体验。</p>
    
    <h2>关于面料</h2>
    <p>我们精选来自意大利的顶级羊绒面料，每一根纤维都经过严格筛选。柔软、轻盈、保暖，这是大自然赋予我们的珍贵礼物。</p>
    
    <h2>设计理念</h2>
    <p>极简主义不是简单，而是在复杂中提炼出最本质的美。我们相信，真正的优雅来自于对细节的执着追求。</p>
    
    <h2>穿搭建议</h2>
    <p>这件单品可以轻松驾驭多种场合：</p>
    <ul>
      <li>搭配西装裤，打造职场干练形象</li>
      <li>配合牛仔裤，展现休闲随性风格</li>
      <li>叠穿衬衫，营造层次感</li>
    </ul>
    
    <h2>保养建议</h2>
    <p>羊绒制品需要细心呵护。建议干洗，避免阳光直射，平铺晾干。用心对待，它会陪伴你很多年。</p>
  `;

  // 推荐商品
  const relatedProducts = [
    {
      id: 1,
      title: '100%羊绒针织衫',
      price: 2980.00,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsipaDTL7kYncN-meK30dDxrgq4qGYxjocy3Nmg03wsrwE3Vai-MwIBSR5LE3kpb0D8jZNKNrxY_lmaCy-cvBCwzgcgF7lqKOgkE1ovxJrbtdracQTOt6J7OcVzM4iuH4_p22IeZM1-6ixqyQxn16ZUStPPRLLscnpXPjowuBmn4v5MSnuzeVsGvn-Il3EFLeosJsx6hSpXBorDHzOYlW8UW7hZ8XdHzOFeLgbULlEk8IZEqr6QY-h0QdCQKoJl52wRJ5weoJj3el9'
    },
    {
      id: 2,
      title: '廓形羊毛大衣',
      price: 4280.00,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY5XopWpAdEgMyNYRUKbtfEH2S1JVsAPUoEzBiSG-fY0TaMdbVVhaZOkaSWjdG8ilkJh3Mg5dHfw0kBVqP-80zzKprVRTgheVQyX37u9Mu2ZAq4xZ0nxIAC5_-p8SReRtGS6g0uXQZHN7vHtnWKHj-3aZmM--8Klrs3YayRQxhRO4MwckI0WFEAxyDvPYsIdQZ_3XYrxJtljSNQIM02fYx5vkjLSh2YqKkaRCoo4JzZbgdXYt9sKm79-woGhzph8PxSWiMXhEUy4tV'
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主图 */}
      <div className="w-full aspect-[4/5] bg-gray-100">
        <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* 文章信息 */}
      <div className="px-6 py-6">
        {/* 作者信息 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={post.authorImg} alt={post.author} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
            <div>
              <p className="text-sm font-bold">{post.author}</p>
              <p className="text-xs text-gray-400">2小时前</p>
            </div>
          </div>
          <button 
            onClick={handleFollow}
            className={`px-4 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-all ${
              followed 
                ? 'bg-gray-100 text-gray-600' 
                : 'bg-black text-white'
            }`}
          >
            {followed ? '已关注' : '关注'}
          </button>
        </div>

        {/* 标题 */}
        <h1 className="text-xl font-bold leading-relaxed mb-4">{post.title}</h1>

        {/* 互动数据 */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined text-lg">visibility</span>
            <span className="text-xs">1.2k</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined text-lg">favorite</span>
            <span className="text-xs">{post.likes}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            <span className="text-xs">128</span>
          </div>
        </div>

        {/* 文章内容 */}
        <div 
          className="prose prose-sm max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: articleContent }}
          style={{
            lineHeight: '1.8',
            color: '#333'
          }}
        />

        {/* 相关商品 */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            文中同款
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {relatedProducts.map(product => (
              <div
                key={product.id}
                onClick={() => onNavigate('product', product)}
                className="cursor-pointer group"
              >
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xs font-medium line-clamp-2 mb-1">{product.title}</h4>
                <p className="text-sm font-bold">¥{product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between max-w-[480px] mx-auto">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <span className={`material-symbols-outlined text-2xl ${liked ? 'text-red-500' : 'text-gray-400'}`} style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
            <span className="text-[10px] text-gray-400">{liked ? '已赞' : '点赞'}</span>
          </button>
          <button 
            onClick={() => setCollected(!collected)}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <span className={`material-symbols-outlined text-2xl ${collected ? 'text-amber-500' : 'text-gray-400'}`} style={{ fontVariationSettings: collected ? "'FILL' 1" : "'FILL' 0" }}>
              star
            </span>
            <span className="text-[10px] text-gray-400">{collected ? '已收藏' : '收藏'}</span>
          </button>
          <button onClick={handleComment} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-2xl text-gray-400">chat_bubble</span>
            <span className="text-[10px] text-gray-400">评论</span>
          </button>
        </div>
        <button onClick={handleShare} className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold active:scale-95 transition-transform">
          分享
        </button>
      </div>

      {/* 分享菜单 */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShareMenu(false)}></div>
          
          <div className="relative w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 p-6">
            <h3 className="text-lg font-bold mb-6 text-center">分享到</h3>
            
            <div className="grid grid-cols-4 gap-6 mb-6">
              <button onClick={() => handleShareTo('微信')} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  微
                </div>
                <span className="text-xs text-gray-600">微信</span>
              </button>
              
              <button onClick={() => handleShareTo('朋友圈')} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  圈
                </div>
                <span className="text-xs text-gray-600">朋友圈</span>
              </button>
              
              <button onClick={() => handleShareTo('微博')} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  微
                </div>
                <span className="text-xs text-gray-600">微博</span>
              </button>
              
              <button onClick={() => handleShareTo('复制链接')} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                <div className="w-14 h-14 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">link</span>
                </div>
                <span className="text-xs text-gray-600">复制链接</span>
              </button>
            </div>
            
            <button 
              onClick={() => setShowShareMenu(false)}
              className="w-full py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 active:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
