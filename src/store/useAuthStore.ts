import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;           // Is the user logged in
  username: string | null;       // User's name
  isAuthModalOpen: boolean;      // Is the authentication modal open
  login: (name: string) => void; // Function to log in
  logout: () => void;            // Function to log out
  setAuthModalOpen: (open: boolean) => void; // Function to open/close the authentication modal
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  username: null,
  isAuthModalOpen: false,
  
  // When logging in - save the name, set the status to true and immediately close the modal
  login: (name) => set({ isLoggedIn: true, username: name, isAuthModalOpen: false }),
  
  // When logging out - reset all values
  logout: () => set({ isLoggedIn: false, username: null }),
  
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
}));