import { useEffect, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';

const searchTags = ['Pendant', 'Minimalist', 'Chandelier', 'Floor Lamp', 'Brass'];

export default function SearchModal() {
  const isOpen = useUIStore(s => s.isSearchOpen);
  const setSearchOpen = useUIStore(s => s.setSearchOpen);

  const searchQuery = useFilterStore(s => s.searchQuery);
  const setSearchQuery = useFilterStore(s => s.setSearchQuery);

  // Ref for autofocus on input when opening
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on search input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Delay needed — modal is still animating
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Closing on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [setSearchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false); // closing — ProductGrid already reacts to searchQuery
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    inputRef.current?.focus();
  };

  // Do not render the DOM at all if it is closed
  if (!isOpen) return null;

  return (
    // Overlay — clicking on the background closes the modal
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={() => setSearchOpen(false)}
    >
      {/* Content — stopping click propagation */}
      <div
        className="bg-[#14151C] border border-neutral-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={() => setSearchOpen(false)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="font-space text-lg font-bold text-white">Search Catalog</h3>

        {/* SEARCH FORM */}
        <form onSubmit={handleSubmit} className="relative flex gap-2">
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search minimal pendants, chandeliers, smart lights..."
              className="w-full bg-[#1B1C26] border border-neutral-700/80 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            <svg className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z" />
            </svg>
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shrink-0"
          >
            Search
          </button>
        </form>

        {/* POPULAR TAGS */}
        <div className="space-y-2">
          <span className="text-xs text-neutral-400 block font-medium">Popular Searches:</span>
          <div className="flex flex-wrap gap-2">
            {searchTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                  searchQuery === tag
                    ? 'bg-amber-500 text-black border-amber-500 font-bold'
                    : 'bg-[#1D1E28] hover:bg-amber-500 hover:text-black border-neutral-700/60 text-neutral-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}