import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';

// SVG icons are rendered as separate components — cleaner JSX
const SunIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z"
    />
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-red-500' : 'text-neutral-400'}`}
    fill={filled ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

// ============ MAIN COMPONENT ============
export default function Header() {
  // Selector — we take only what is needed
  // cartCount() is a getter function in our story
  const cartCount = useCartStore(s => s.cartCount());
  const wishlistCount = useWishlistStore(s => s.wishlist.length);

  const setSearchOpen = useUIStore(s => s.setSearchOpen);
  const setCartOpen = useUIStore(s => s.setCartOpen);
  const setWishlistOpen = useUIStore(s => s.setWishlistOpen);

  return (
    <header className="w-full sticky top-0 z-40 bg-[#0B0C10]/90 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
            <SunIcon />
          </div>
          <div>
            <span className="font-space text-lg font-bold tracking-wider text-white block leading-none">
              LOONARI
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-1 block">
              Architectural Lighting
            </span>
          </div>
        </a>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* SEARCH */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2.5 rounded-xl bg-[#181920] border border-neutral-800 hover:border-amber-500/50 hover:text-amber-500 text-neutral-300 transition-all duration-300 flex items-center gap-2"
          >
            <SearchIcon />
          </button>

          {/* WISHLIST */}
          <button
            onClick={() => setWishlistOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#181920] border border-neutral-800 hover:border-amber-500/50 hover:text-amber-500 text-neutral-300 transition-all duration-300 flex items-center gap-2"
          >
            <HeartIcon />
            <span className="font-space text-xs font-bold text-white uppercase hidden sm:inline">
              Favorites
            </span>
            {/* Badge — we show it only if there are products */}
            <Badge count={wishlistCount} color="red" />
          </button>

          {/* CART */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#181920] border border-neutral-800 hover:border-amber-500/50 hover:text-amber-500 text-neutral-300 transition-all duration-300 flex items-center gap-2"
          >
            <CartIcon />
            <span className="font-space text-xs font-bold text-white uppercase hidden sm:inline">
              Cart
            </span>
            <Badge count={cartCount} color="amber" />
          </button>

        </div>
      </div>
    </header>
  );
}

// ============ AUXILIARY COMPONENT ============
// Badge — a separate component because it's used twice
interface BadgeProps {
  count: number;
  color: 'red' | 'amber';
}

function Badge({ count, color }: BadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const baseClass = color === 'amber'
    ? 'bg-amber-500 text-black'
    : 'bg-red-500 text-white';

  const animClass = isAnimating 
    ? 'scale-125 bg-white text-black' 
    : baseClass;

  return (
    <span className={`${animClass} text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300`}>
      {count}
    </span>
  );
}