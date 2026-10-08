import type { Product, ColorTemp } from '../../types';
import { useFilterStore } from '../../store/useFilterStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ProductCardProps {
  product: Product;
}

// Placeholder if there is no photo
function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#15161E] p-4 text-center">
      <svg className="w-10 h-10 text-amber-500/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <span className="font-space text-sm font-bold text-neutral-300">LOONARI</span>
      <span className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">No Image Available</span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, title, category, price, image, desc, sale, bestseller } = product;

  // Each store is a separate selector
  const temp = useFilterStore(s => s.getProductTemp(id));
  const setProductTemp = useFilterStore(s => s.setProductTemp);

  const isFav = useWishlistStore(s => s.isInWishlist(id));
  const toggleWishlist = useWishlistStore(s => s.toggleWishlist);

  const addToCart = useCartStore(s => s.addToCart);

  const setModalProductId = useUIStore(s => s.setModalProductId);

  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const setAuthModalOpen = useAuthStore(s => s.setAuthModalOpen);

  const isWarm = temp === '2700K';

	const showToast = useUIStore(s => s.showToast);

    const handleWishlistClick = () => {
    if (isLoggedIn) {
      toggleWishlist(id);
    } else {
      setAuthModalOpen(true); // Якщо не залогінений - відкриваємо модалку
    }
  };

  const handleAddToCartClick = () => {
    if (isLoggedIn) {
      addToCart(id, temp);
      showToast(id);
    } else {
      setAuthModalOpen(true); // Якщо не залогінений - відкриваємо модалку
    }
  };

  return (
    <div className="bg-[#14151C] rounded-2xl border border-neutral-800 p-4 flex flex-col justify-between group hover:border-amber-500/30 transition-all duration-300">
      <div>
        {/* IMAGE */}
        <div className="relative aspect-square bg-[#1B1C26] rounded-xl overflow-hidden mb-4 flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${isWarm ? 'warm-glow' : ''}`}
            />
          ) : (
            <ImagePlaceholder />
          )}

          {/* WISHLIST BUTTON */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 backdrop-blur-md text-white hover:text-red-500 transition-all active:scale-125"
          >
            <svg
              className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'fill-none'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* BADGES Sale / Bestseller */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {sale && (
              <span className="text-[9px] font-bold uppercase bg-red-500 text-white px-2 py-0.5 rounded">
                Sale
              </span>
            )}
            {bestseller && (
              <span className="text-[9px] font-bold uppercase bg-amber-500 text-black px-2 py-0.5 rounded">
                Bestseller
              </span>
            )}
          </div>
        </div>

        {/* CATEGORY + TEMPERATURE TOGGLE */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
            {category}
          </span>

          <div className="flex gap-1 bg-[#0F1015] p-1 rounded-md border border-neutral-800 text-[9px]">
            {(['2700K', '4000K'] as ColorTemp[]).map(t => (
              <button
                key={t}
                onClick={() => setProductTemp(id, t)}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  temp === t ? 'bg-amber-500 text-black font-bold' : 'text-neutral-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* TITLE + DESCRIPTION */}
        <h4
          onClick={() => setModalProductId(id)}
          className="font-space text-base font-bold text-white mt-2 cursor-pointer hover:text-amber-500 transition-colors"
        >
          {title}
        </h4>
        <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{desc}</p>
      </div>

      {/* PRICE + ADD TO CART BUTTON */}
      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
        <span className="font-space text-lg font-bold text-white">${price}</span>
        <button
          onClick={handleAddToCartClick}
          className="p-2.5 bg-[#1E202B] hover:bg-amber-500 hover:text-black text-amber-500 rounded-xl border border-neutral-700/60 transition-all flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}