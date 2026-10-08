import { useState, useEffect, useRef, useCallback } from 'react';
import { heroSlides } from '../../data/products';
import { useUIStore } from '../../store/useUIStore';
import type { HeroSlide } from '../../types';

// Types for animation direction
type SlideDirection = 1 | -1;
type AnimationClass = 'slide-active' | 'slide-out-next' | 'slide-out-prev' | 'slide-in-next' | 'slide-in-prev';

// ============ AUXILIARY COMPONENTS ============

const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Content of a single slide
function SlideContent({ slide, onOpenModal }: { slide: HeroSlide; onOpenModal: (id: number) => void }) {
  return (
    <>
      {/* PHOTO */}
      <div className="md:col-span-5 h-64 md:h-72 rounded-xl overflow-hidden bg-[#111218] flex items-center justify-center relative group">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* TEXT */}
      <div className="md:col-span-7 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-md font-medium border border-amber-500/20">
            {slide.category}
          </span>
          <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
            ★ {slide.rating}
          </span>
        </div>

        <h3 className="font-space text-2xl md:text-3xl font-bold text-white tracking-tight">
          {slide.title}
        </h3>

        <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
          {slide.desc}
        </p>

        <div className="pt-2 flex items-center gap-4">
          <span className="font-space text-2xl font-bold text-amber-500">
            ${slide.price}
          </span>
          <button
            onClick={() => onOpenModal(slide.id)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-95"
          >
            Explore Details
          </button>
        </div>
      </div>
    </>
  );
}

// ============ MAIN COMPONENT ============
export default function HeroSlider() {
  const setModalProductId = useUIStore(s => s.setModalProductId);

  // Local state — animation lives here, not in the global store
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animClass, setAnimClass] = useState<AnimationClass>('slide-active');
  const [isAnimating, setIsAnimating] = useState(false);

  // useRef -does not cause re-rendering, perfect for timers
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveredRef = useRef(false);

  // useCallback — memoize the function so that useEffect does not cycle
  const transitionTo = useCallback((nextIndex: number, direction: SlideDirection) => {
    if (isAnimating || nextIndex === currentIndex) return;

    setIsAnimating(true);

    // Step 1: Animate the "exit" of the current slide
    const outClass: AnimationClass = direction > 0 ? 'slide-out-next' : 'slide-out-prev';
    const inClass: AnimationClass = direction > 0 ? 'slide-in-next' : 'slide-in-prev';

    setAnimClass(outClass);

    setTimeout(() => {
      // Step 2: Change the content and show the new slide from the side
      setCurrentIndex(nextIndex);
      setAnimClass(inClass);

      // Step 3: through requestAnimationFrame — activate slide-active
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimClass('slide-active');
          setIsAnimating(false);
        });
      });
    }, 250);
  }, [isAnimating, currentIndex]);

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isHoveredRef.current && !document.hidden) {
        // Functional update — always the most recent index
        setCurrentIndex(prev => {
          const next = (prev + 1) % heroSlides.length;
          // Trigger the transition
          transitionTo(next, 1);
          return prev; // return prev, as transitionTo will update it
        });
      }
    }, 5000);
  }, [transitionTo]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // We start autoplay when mounting + listen to the visibility of the tab
  useEffect(() => {
    startAutoplay();

    const handleVisibility = () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Cleanup is important! We stop the timer during disassembly
    return () => {
      stopAutoplay();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [startAutoplay, stopAutoplay]);

  const handlePrev = () => {
    stopAutoplay();
    startAutoplay(); // reset the time
    const next = (currentIndex - 1 + heroSlides.length) % heroSlides.length;
    transitionTo(next, -1);
  };

  const handleNext = () => {
    stopAutoplay();
    startAutoplay();
    const next = (currentIndex + 1) % heroSlides.length;
    transitionTo(next, 1);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    stopAutoplay();
    startAutoplay();
    transitionTo(index, index > currentIndex ? 1 : -1);
  };

  const slide = heroSlides[currentIndex];

  return (
    <section className="mb-12">
      <div
        className="bg-[#14151C] border border-neutral-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        {/* SLIDER HEATER */}
        <div className="flex items-center justify-between mb-6 z-10 relative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Curated Showcase
          </span>

          <div className="flex items-center gap-4">
            {/* POINTS */}
            <div className="flex gap-1.5 items-center">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? 'bg-amber-500 w-8'
                      : 'bg-neutral-700 hover:bg-neutral-500 w-2'
                  }`}
                />
              ))}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-[#1E202B] border border-neutral-700/60 hover:bg-amber-500 hover:text-black text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-[#1E202B] border border-neutral-700/60 hover:bg-amber-500 hover:text-black text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        <h2 className="font-space text-2xl md:text-3xl font-bold text-white mb-6 z-10 relative">
          Trending Architectural Masterpieces
        </h2>

        {/* SLIDE */}
        <div className="relative min-h-[320px] md:min-h-[280px] overflow-hidden">
          <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#1B1C26] p-6 rounded-2xl border border-neutral-800 hero-slide-transition ${animClass}`}>
            <SlideContent slide={slide} onOpenModal={setModalProductId} />
          </div>
        </div>
      </div>
    </section>
  );
}