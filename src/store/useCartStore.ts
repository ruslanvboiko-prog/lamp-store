import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartItem, ColorTemp } from '../types';
import { products } from '../data/products';

interface CartState {
  cart: CartItem[];
  addToCart: (id: number, temp: ColorTemp) => void;
  updateQuantity: (id: number, temp: ColorTemp, delta: number) => void;
  removeFromCart: (id: number, temp: ColorTemp) => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(           // ← autosave to localStorage
    immer((set, get) => ({  // ←  immer: you can "mutate" state directly
      cart: [],

      addToCart: (id, temp) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        set(state => {
          const existing = state.cart.find(
            item => item.id === id && item.temp === temp
          );
          if (existing) {
            existing.qty += 1; // ← immer allows you to write it this way!
          } else {
            state.cart.push({ ...product, qty: 1, temp });
          }
        });
      },

      updateQuantity: (id, temp, delta) => {
        set(state => {
          const item = state.cart.find(
            i => i.id === id && i.temp === temp
          );
          if (!item) return;
          item.qty += delta;
          if (item.qty <= 0) {
            state.cart = state.cart.filter(
              i => !(i.id === id && i.temp === temp)
            );
          }
        });
      },

      removeFromCart: (id, temp) => {
        set(state => {
          state.cart = state.cart.filter(
            i => !(i.id === id && i.temp === temp)
          );
        });
      },

      // Getters — functions that calculate derived values
      cartTotal: () =>
        get().cart.reduce((acc, item) => acc + item.price * item.qty, 0),

      cartCount: () =>
        get().cart.reduce((acc, item) => acc + item.qty, 0),
    })),
    { name: 'loonari_cart' } // ← localStorage has the key
  )
);