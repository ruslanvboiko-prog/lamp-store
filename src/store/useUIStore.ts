import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  // What is open/closed
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  modalProductId: number | null;
  toastProductId: number | null;

  // Methods
  setSearchOpen: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
  setWishlistOpen: (v: boolean) => void;
  setModalProductId: (id: number | null) => void;
  showToast: (id: number) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    isSearchOpen: false,
    isCartOpen: false,
    isWishlistOpen: false,
    modalProductId: null,
    toastProductId: null,

    setSearchOpen: (v) => set(s => { s.isSearchOpen = v; }),
    setCartOpen: (v) => set(s => { s.isCartOpen = v; }),
    setWishlistOpen: (v) => set(s => { s.isWishlistOpen = v; }),
    setModalProductId: (id) => set(s => { s.modalProductId = id; }),
    showToast: (id) => set(s => { s.toastProductId = id; }),
    hideToast: () => set(s => { s.toastProductId = null; }),
  }))
);