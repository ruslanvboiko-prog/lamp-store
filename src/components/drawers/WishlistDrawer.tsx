import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';
import { products } from '../../data/products';
import type { Product } from '../../types';

function WishlistItemRow({ product }: { product: Product }) {
  const toggleWishlist = useWishlistStore(s => s.toggleWishlist);
  const addToCart = useCartStore(s => s.addToCart);
  const getProductTemp = useFilterStore(s => s.getProductTemp);
  const setModalProductId = useUIStore(s => s.setModalProductId);
  const setWishlistOpen = useUIStore(s => s.setWishlistOpen);

  const temp = getProductTemp(product.id);

	const showToast = useUIStore(s => s.showToast);

  const handleOpenModal = () => {
    setWishlistOpen(false); // close wishlist drawer
    setModalProductId(product.id); // open modal
  };

  return (
    <div className="flex items-center gap-3 bg-[#1B1C26] p-3 rounded-xl border border-neutral-800">
      {/* PHOTO */}
      <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-amber-500">
            LOONARI
          </div>
        )}
      </div>

      {/* TITLE + PRICE */}
      <div className="flex-grow min-w-0">
        <h5
          onClick={handleOpenModal}
          className="text-xs font-bold text-white cursor-pointer hover:text-amber-500 transition-colors truncate"
        >
          {product.title}
        </h5>
        <span className="text-xs text-amber-500 font-bold">${product.price}</span>
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Add to Cart */}
        <button
          onClick={() => {addToCart(product.id, temp);showToast(product.id);}}
          className="p-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black rounded-lg border border-amber-500/20 transition-all"
          title="Add to Cart"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        {/* Remove from Favorites */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          title="Remove from Favorites"
        >
          <svg className="w-4 h-4 fill-red-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function WishlistDrawer() {
  const isOpen = useUIStore(s => s.isWishlistOpen);
  const setWishlistOpen = useUIStore(s => s.setWishlistOpen);

  const wishlist = useWishlistStore(s => s.wishlist);

  // We filter the products array to get only the products that are in the wishlist
  const favProducts = products.filter(p => wishlist.includes(p.id));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      onClick={() => setWishlistOpen(false)}
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#14151C] border-l border-neutral-800 p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        {/* TITLE */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Favorites
            {favProducts.length > 0 && (
              <span className="text-xs font-normal text-neutral-400">({favProducts.length})</span>
            )}
          </h3>
          <button
            onClick={() => setWishlistOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ITEM LIST */}
        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-grow">
          {favProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-12 h-12 text-neutral-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-sm font-bold text-neutral-500">Your wishlist is empty</p>
              <p className="text-xs text-neutral-600 mt-1">Click ♥ on any product</p>
            </div>
          ) : (
            favProducts.map(product => (
              <WishlistItemRow key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}