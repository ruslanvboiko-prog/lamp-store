import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface WishlistState {
  wishlist: number[]; // product id array
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      wishlist: [],

      toggleWishlist: (id) => {
        set(state => {
          const index = state.wishlist.indexOf(id);
          if (index !== -1) {
            state.wishlist.splice(index, 1); // remove
          } else {
            state.wishlist.push(id);          // add
          }
        });
      },

      isInWishlist: (id) => get().wishlist.includes(id),
    })),
    { name: 'loonari_wishlist' }
  )
);