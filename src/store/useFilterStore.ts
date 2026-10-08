import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ColorTemp } from '../types';

interface FilterState {
  // Filters for the catalog
  activeCategory: string;
  activeTempFilter: ColorTemp | 'All';
  maxPrice: number;
  searchQuery: string;

	currentPage: number;
  setCurrentPage: (page: number) => void;

  // Color temperature for each product card
  productTempState: Record<number, ColorTemp>;

  // Filter methods
  setCategory: (cat: string) => void;
  setTempFilter: (temp: ColorTemp | 'All') => void;
  setMaxPrice: (price: number) => void;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;

  // Method for setting product temperature
  setProductTemp: (id: number, temp: ColorTemp) => void;
  getProductTemp: (id: number) => ColorTemp;
}


export const useFilterStore = create<FilterState>()(
  immer((set, get) => ({
    activeCategory: 'All',
    activeTempFilter: 'All',
    maxPrice: 1200,
    searchQuery: '',
    currentPage: 1,
    productTempState: {},

    setCategory: (cat) => set(s => { s.activeCategory = cat; s.currentPage = 1; }),
		setTempFilter: (temp) => set(s => { s.activeTempFilter = temp; s.currentPage = 1; }),
		setMaxPrice: (price) => set(s => { s.maxPrice = price; s.currentPage = 1; }),
		setSearchQuery: (q) => set(s => { s.searchQuery = q; s.currentPage = 1; }),
    setCurrentPage: (page) => set(s => { s.currentPage = page; }),

    resetFilters: () => set(s => {
      s.activeCategory = 'All';
      s.activeTempFilter = 'All';
      s.maxPrice = 1200;
      s.searchQuery = '';
      s.currentPage = 1;
    }),

    setProductTemp: (id, temp) => set(s => {
      s.productTempState[id] = temp;
    }),

    // Getter with default value '2700K'
    getProductTemp: (id) => get().productTempState[id] ?? '2700K',
  }))
);