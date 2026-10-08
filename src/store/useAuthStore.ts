import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  isAuthModalOpen: boolean;
  login: (name: string) => void;
  logout: () => void;
  setAuthModalOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      username: null,
      isAuthModalOpen: false,
      
      login: (name) => set({ isLoggedIn: true, username: name, isAuthModalOpen: false }),
      logout: () => set({ isLoggedIn: false, username: null }),
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
    }),
    {
      name: 'loonari-auth', 
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, username: state.username }),
    }
  )
);