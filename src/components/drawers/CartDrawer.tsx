import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import type { CartItem } from '../../types';

// One item in the cart
function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeFromCart = useCartStore(s => s.removeFromCart);

  return (
    <div className="flex items-center gap-3 bg-[#1B1C26] p-3 rounded-xl border border-neutral-800">
      {/* PHOTO */}
      <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-amber-500">
            LOONARI
          </div>
        )}
      </div>

      {/* TITLE + PRICE + TEMPERATURE */}
      <div className="flex-grow min-w-0">
        <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-amber-500 font-bold">${item.price}</span>
          <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
            {item.temp}
          </span>
        </div>
      </div>

      {/* QUANTITY + REMOVE */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => updateQuantity(item.id, item.temp, -1)}
          className="w-6 h-6 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white text-xs flex items-center justify-center transition-colors"
        >
          −
        </button>
        <span className="text-xs font-bold text-white w-5 text-center">{item.qty}</span>
        <button
          onClick={() => updateQuantity(item.id, item.temp, 1)}
          className="w-6 h-6 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white text-xs flex items-center justify-center transition-colors"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item.id, item.temp)}
          className="ml-1 p-1.5 text-neutral-500 hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function CartDrawer() {
  const isOpen = useUIStore(s => s.isCartOpen);
  const setCartOpen = useUIStore(s => s.setCartOpen);

  const cart = useCartStore(s => s.cart);
  const cartTotal = useCartStore(s => s.cartTotal());
  const cartCount = useCartStore(s => s.cartCount());

  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      onClick={() => setCartOpen(false)}
    >
      {/* Panel — stopping click propagation */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#14151C] border-l border-neutral-800 p-6 flex flex-col justify-between"
        onClick={e => e.stopPropagation()}
      >
        {/* TOP PART */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* TITLE */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
            <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
              Your Shopping Cart
              {cartCount > 0 && (
                <span className="text-xs font-normal text-neutral-400">({cartCount} items)</span>
              )}
            </h3>
            <button
              onClick={() => setCartOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ITEM LIST */}
          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-grow">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-12 h-12 text-neutral-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-sm font-bold text-neutral-500">Your cart is empty</p>
                <p className="text-xs text-neutral-600 mt-1">Add some masterpieces!</p>
              </div>
            ) : (
              cart.map(item => (
                // item.id + item.temp — unique key because one product can have different temps
                <CartItemRow key={`${item.id}-${item.temp}`} item={item} />
              ))
            )}
          </div>
        </div>

        {/* BOTTOM PART — SUMMARY */}
        {cart.length > 0 && (
          <div className="pt-6 border-t border-neutral-800 space-y-4 shrink-0">
            <div className="flex justify-between items-center font-space text-lg font-bold">
              <span className="text-neutral-300">Total:</span>
              <span className="text-amber-500">${cartTotal}</span>
            </div>
            <button
              onClick={() => alert('Checkout — coming soon!')}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}