import { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { CartItem } from '../../types';

// One item in the cart
function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeFromCart = useCartStore(s => s.removeFromCart);

  return (
    <div className="flex items-center gap-3 bg-[#1B1C26] p-3 rounded-xl border border-neutral-800">
      <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-amber-500">LOONARI</div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-amber-500 font-bold">${item.price}</span>
          <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">{item.temp}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => updateQuantity(item.id, item.temp, -1)} className="w-6 h-6 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white text-xs flex items-center justify-center transition-colors">−</button>
        <span className="text-xs font-bold text-white w-5 text-center">{item.qty}</span>
        <button onClick={() => updateQuantity(item.id, item.temp, 1)} className="w-6 h-6 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white text-xs flex items-center justify-center transition-colors">+</button>
        <button onClick={() => removeFromCart(item.id, item.temp)} className="ml-1 p-1.5 text-neutral-500 hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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
  const clearCart = useCartStore(s => s.clearCart);
  
  const username = useAuthStore(s => s.username);

  // Status for navigation within the cart: 'cart' -> 'checkout' -> 'success'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
	const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  // Logic for order confirmation
  const handleConfirmOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone');
    const address = formData.get('address');

    if (!phone || !address) {
      setHasError(true);
      return;
    }

    setHasError(false);
    clearCart(); 
    setStep('success'); 
    
    setTimeout(() => {
      setStep('cart');
      setCartOpen(false);
    }, 5000);
  };

  // Logic for closing the drawer
  const handleClose = () => {
    setCartOpen(false);
    // If closed on the checkout form - return to the cart for the next time
    if (step === 'checkout') setStep('cart'); 
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" onClick={handleClose}>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#14151C] border-l border-neutral-800 p-6 flex flex-col justify-between" onClick={e => e.stopPropagation()}>
        
        {/* TOP PART */}
        <div className="flex flex-col gap-4 min-h-0 flex-grow">
          {/* TITLE */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
            <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
              {step === 'cart' && 'Your Shopping Cart'}
              {step === 'checkout' && 'Checkout Details'}
              {step === 'success' && 'Order Confirmed'}
              
              {step === 'cart' && cartCount > 0 && (
                <span className="text-xs font-normal text-neutral-400">({cartCount} items)</span>
              )}
            </h3>
            <button onClick={handleClose} className="text-neutral-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* CONTENT (depends on the step) */}
          <div className="overflow-y-auto custom-scrollbar pr-1 h-full">
            
            {/* STEP 1: CART */}
            {step === 'cart' && (
              cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
                  <svg className="w-12 h-12 text-neutral-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <p className="text-sm font-bold text-neutral-500">Your cart is empty</p>
                  <p className="text-xs text-neutral-600 mt-1">Add some masterpieces!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => <CartItemRow key={`${item.id}-${item.temp}`} item={item} />)}
                </div>
              )
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === 'checkout' && (
              <div className="animate-fade-in-up space-y-6">
                {/* Order Preview */}
                <div className="bg-[#1B1C26] p-4 rounded-xl border border-neutral-800">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Order Summary</h4>
                  <div className="flex justify-between text-sm text-white font-bold mb-1">
                    <span>{cartCount} items</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Shipping</span>
                    <span className="text-amber-500 font-bold">FREE</span>
                  </div>
                </div>

                {/* Checkout Form */}
                <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input name="name" type="text" defaultValue={username || ''} className="w-full bg-[#0B0C10] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Phone</label>
                    <input name="phone" type="tel" className={`w-full bg-[#0B0C10] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors ${hasError ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-amber-500'}`} placeholder="+380 99 123 45 67" />
                    {hasError && <p className="text-[10px] text-red-500 mt-1">Required field</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Shipping Address</label>
                    <textarea name="address" rows={3} className={`w-full bg-[#0B0C10] border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors resize-none ${hasError ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-amber-500'}`} placeholder="City, Street, Apartment..." />
                    {hasError && <p className="text-[10px] text-red-500 mt-1">Required field</p>}
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up h-full">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-space text-2xl font-bold text-white mb-2">Order Placed!</h3>
                <p className="text-sm text-neutral-400 leading-relaxed max-w-[250px]">
                  Thank you, {username}.<br/>
                  Your architectural luminaires will be shipped shortly.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="pt-6 border-t border-neutral-800 shrink-0">
          
          {step === 'cart' && cart.length > 0 && (
            <>
              <div className="flex justify-between items-center font-space text-lg font-bold mb-4">
                <span className="text-neutral-300">Total:</span>
                <span className="text-amber-500">${cartTotal}</span>
              </div>
              <button onClick={() => setStep('checkout')} className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                Proceed to Checkout
              </button>
            </>
          )}

          {step === 'checkout' && (
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep('cart')} className="px-5 py-3.5 bg-[#1B1C26] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-neutral-800">
                Back
              </button>
              <button type="submit" form="checkout-form" className="flex-grow py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20">
                Confirm Order (${cartTotal})
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}