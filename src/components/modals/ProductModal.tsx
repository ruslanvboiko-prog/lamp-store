import { useEffect } from 'react';
import { products } from '../../data/products';
import { useUIStore } from '../../store/useUIStore';
import { useCartStore } from '../../store/useCartStore';
import { useFilterStore } from '../../store/useFilterStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProductModal() {
  const modalProductId = useUIStore(s => s.modalProductId);
  const setModalProductId = useUIStore(s => s.setModalProductId);

  const addToCart = useCartStore(s => s.addToCart);
  const getProductTemp = useFilterStore(s => s.getProductTemp);

  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const setAuthModalOpen = useAuthStore(s => s.setAuthModalOpen);

  const showToast = useUIStore(s => s.showToast);

  // We find the product by ID
  const product = modalProductId
    ? products.find(p => p.id === modalProductId) ?? null
    : null;

  // Closing on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalProductId(null);
    };
    if (modalProductId) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [modalProductId, setModalProductId]);

  // We block the body scroll when the modal is open
  useEffect(() => {
    document.body.style.overflow = modalProductId ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalProductId]);

  if (!product) return null;

  const temp = getProductTemp(product.id);

  // Наша нова логіка перевірки авторизації
  const handleAddToCartClick = () => {
    if (isLoggedIn) {
      addToCart(product.id, temp);
      showToast(product.id);
      setModalProductId(null);
    } else {
      setModalProductId(null);
      setAuthModalOpen(true); 
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setModalProductId(null)}
    >
      <div
        className="bg-[#14151C] border border-neutral-800 w-full max-w-3xl rounded-3xl p-6 md:p-8 relative shadow-2xl flex flex-col md:flex-row gap-6"
        onClick={e => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={() => setModalProductId(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1F202B] text-neutral-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* PHOTO */}
        <div className="w-full md:w-1/2 aspect-square rounded-2xl bg-[#1B1C26] overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#15161E] p-6 text-center">
              <svg className="w-12 h-12 text-amber-500/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="font-space text-lg font-bold text-neutral-300">LOONARI</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Architectural Series</span>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 inline-block">
              {product.category}
            </span>
            <h2 className="font-space text-2xl font-bold text-white">{product.title}</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">{product.desc}</p>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <span className="font-space text-2xl font-bold text-amber-500">${product.price}</span>
            <button
              onClick={handleAddToCartClick}
              className="p-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}