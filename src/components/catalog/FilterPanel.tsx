import { products } from '../../data/products';
import { useFilterStore } from '../../store/useFilterStore';
import type { ColorTemp } from '../../types';

// We dynamically extract unique categories from the array of products
const categories = ['All', ...new Set(products.map(p => p.category))];
const tempOptions: Array<ColorTemp | 'All'> = ['All', '2700K', '4000K'];

const FilterIcon = () => (
  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

export default function FilterPanel() {
  // We extract the state and methods from the store
  const activeCategory = useFilterStore(s => s.activeCategory);
  const activeTempFilter = useFilterStore(s => s.activeTempFilter);
  const maxPrice = useFilterStore(s => s.maxPrice);

  const setCategory = useFilterStore(s => s.setCategory);
  const setTempFilter = useFilterStore(s => s.setTempFilter);
  const setMaxPrice = useFilterStore(s => s.setMaxPrice);
  const resetFilters = useFilterStore(s => s.resetFilters);

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="bg-[#14151C] p-6 rounded-2xl border border-neutral-800">

        {/* TITLE */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
          <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FilterIcon />
            Filters
          </h3>
          <button
            onClick={resetFilters}
            className="text-xs text-neutral-400 hover:text-amber-500 transition-colors"
          >
            Reset All
          </button>
        </div>

        {/* CATEGORIES */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
            Categories
          </span>
          <div className="space-y-1.5 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-[#1B1C26]'
                }`}
              >
                <span>{cat === 'All' ? 'All Masterpieces' : cat}</span>
                {/* Active dot */}
                {cat === activeCategory && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* COLOR TEMPERATURE */}
        <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
            Color Temp
          </span>
          <div className="grid grid-cols-3 gap-1.5 bg-[#0F1015] p-1.5 rounded-xl border border-neutral-800 text-xs">
            {tempOptions.map(temp => (
              <button
                key={temp}
                onClick={() => setTempFilter(temp)}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  activeTempFilter === temp
                    ? 'bg-amber-500 text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {temp}
              </button>
            ))}
          </div>
        </div>

        {/* MAXIMUM PRICE */}
        <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-neutral-400">Max Price</span>
            <span className="text-amber-500 font-bold">${maxPrice}</span>
          </div>
          <input
            type="range"
            min={100}
            max={1200}
            step={50}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer h-1.5"
          />
        </div>

      </div>
    </aside>
  );
}