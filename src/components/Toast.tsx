import { useEffect, useState } from 'react';
import { products } from '../data/products';
import { useUIStore } from '../store/useUIStore';

export default function Toast() {
  const toastProductId = useUIStore(s => s.toastProductId);
  const hideToast = useUIStore(s => s.hideToast);
  const setCartOpen = useUIStore(s => s.setCartOpen);

  // Local state for animation visibility
  const [isVisible, setIsVisible] = useState(false);

  // We find the product by ID
  const product = toastProductId
    ? products.find(p => p.id === toastProductId) ?? null
    : null;

  useEffect(() => {
    if (toastProductId) {
      // 1. First, we show the element (smoothly leaves)
      // A small delay is needed so that the browser has time to render the initial state
      const showTimer = setTimeout(() => setIsVisible(true), 10);

      // 2. After 3 seconds, we hide the element (smoothly enters)
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        
        // 3. Ще через 300мс (час анімації) повністю видаляємо з DOM
        setTimeout(hideToast, 300);
      }, 3000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [toastProductId, hideToast]);

  // If ID is not present or product is not found — we don't render anything
  if (!toastProductId || !product) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="bg-[#1B1C26] border border-amber-500/40 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 border-l-4 border-l-amber-500">
        
        {/* MINI-PHOTO */}
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[6px] font-bold text-amber-500">
              LOONARI
            </div>
          )}
        </div>

        {/* TEXT */}
        <div>
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Added to Cart
          </p>
          <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">
            {product.title}
          </p>
        </div>

        {/* BUTTON VIEW CART */}
        <button
          onClick={() => {
            hideToast(); // Ховаємо тост
            setCartOpen(true); // Відкриваємо кошик
          }}
          className="ml-2 text-xs text-amber-500 font-bold hover:underline whitespace-nowrap"
        >
          View Cart
        </button>

      </div>
    </div>
  );
}