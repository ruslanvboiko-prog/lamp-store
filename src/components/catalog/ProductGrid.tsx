import { useMemo } from 'react';
import { products } from '../../data/products';
import { useFilterStore } from '../../store/useFilterStore';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const activeCategory = useFilterStore(s => s.activeCategory);
  const activeTempFilter = useFilterStore(s => s.activeTempFilter);
  const maxPrice = useFilterStore(s => s.maxPrice);
  const searchQuery = useFilterStore(s => s.searchQuery);
  const productTempState = useFilterStore(s => s.productTempState);

	const currentPage = useFilterStore(s => s.currentPage);
	const setCurrentPage = useFilterStore(s => s.setCurrentPage);
	const ITEMS_PER_PAGE = 6;

  // useMemo — we list the list only when the filters have changed
  // Without useMemo — filtering is performed for each re-render
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const matchesPrice = p.price <= maxPrice;
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Color temperature selected for this product (default: '2700K')
      const pTemp = productTempState[p.id] ?? '2700K';
      const matchesTemp = activeTempFilter === 'All' || pTemp === activeTempFilter;

      return matchesCat && matchesPrice && matchesSearch && matchesTemp;
    });
  }, [activeCategory, activeTempFilter, maxPrice, searchQuery, productTempState]);

	// Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="flex-grow">
      {/* HEADER + COUNTER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-space text-xl font-bold text-white">Architectural Catalog</h2>
        <span className="text-xs text-neutral-400 bg-[#14151C] px-3 py-1.5 rounded-lg border border-neutral-800">
          Showing {filtered.length} masterpieces
        </span>
      </div>

      {/* PRODUCT GRID */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        // Empty state
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-12 h-12 text-neutral-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z"
            />
          </svg>
          <p className="font-space text-sm font-bold text-neutral-500">No products found</p>
          <p className="text-xs text-neutral-600 mt-1">Try adjusting your filters</p>
        </div>
      )}
        {/* Pagination (displayed only if there are more than 1 pages) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-space text-white bg-[#1A1A24] border border-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-600 transition-colors"
            >
              Prev
            </button>
            
            <span className="px-4 py-2 text-sm text-neutral-400">
              Сторінка {currentPage} з {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-space text-white bg-[#1A1A24] border border-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}
    </section>
  );
}