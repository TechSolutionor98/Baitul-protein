import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategorySlider = ({ categories = [], onCategoryClick, loading = false }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  // Fixed visible items per breakpoint
  const [visibleCount, setVisibleCount] = useState(4); // default for desktop
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gapPx, setGapPx] = useState(40); // match gap-10 (40px), xl:gap-16 (64px)
  const [itemWidthPx, setItemWidthPx] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <section className="mb-5 bg-black">
        <div className="max-w-8xl lg:px-3">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  // Early return if no categories
  if (!categories || categories.length === 0) {
    return null;
  }

  // Touch/mouse state
  const startX = useRef(null);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragging, setDragging] = useState(false); // mirror of ref for effects
  const autoplayRef = useRef(null);

  // Update visible count and compute exact item width to remove extra spacing
  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      // visible items
      let vc = 2;
      if (w >= 1024) vc = 6; // desktop: 6
      else if (w >= 768) vc = 3; // tablet: 3
      setVisibleCount(vc);

      // gap based on class usage
      const g = w >= 1280 ? 64 : 40; // xl:gap-16 => 64px else gap-10 => 40px
      setGapPx(g);

      // compute item width so that vc items + (vc-1) gaps exactly fill container
      const container = containerRef.current;
      if (container) {
        const cw = container.offsetWidth;
        const itemW = (cw - g * (vc - 1)) / vc;
        setItemWidthPx(Math.max(0, itemW));
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Fix for passive event listener error
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeTouchMove = (e) => {
      if (isDragging.current && startX.current !== null) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchmove', handleNativeTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchmove', handleNativeTouchMove, { passive: false });
    };
  }, []);

  const handleNext = () => {
    if (categories && categories.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }
  };

  const handlePrev = () => {
    if (categories && categories.length > 0) {
      setCurrentIndex((prev) =>
        prev - 1 < 0 ? categories.length - 1 : prev - 1
      );
    }
  };

  // --- Smooth Drag Logic ---
  const getItemWidth = () => {
    if (itemWidthPx != null) return itemWidthPx;
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    return containerWidth / visibleCount;
  };

  // Helper to animate and then update index
  const animateAndSetIndex = (direction) => {
    setIsAnimating(true);
    const offset = direction === 'next' ? -getItemWidth() : getItemWidth();
    setDragOffset(offset);
    setTimeout(() => {
      setIsAnimating(false);
      setDragOffset(0);
      if (direction === 'next') handleNext();
      else handlePrev();
    }, 200);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    isDragging.current = true;
    setDragging(true);
  };
  const handleTouchMove = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const touch = e.touches[0];
    const diff = touch.clientX - startX.current;
    // Limit drag so you can't drag beyond the width of one item
    const maxDrag = getItemWidth();
    const limitedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
    setDragOffset(limitedDiff);
    // e.preventDefault(); // Removed, handled natively
  };
  const handleTouchEnd = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const touch = e.changedTouches[0];
    const diff = touch.clientX - startX.current;
    const threshold = getItemWidth() / 3;
    if (diff < -threshold) {
      animateAndSetIndex('next');
    } else if (diff > threshold) {
      animateAndSetIndex('prev');
    } else {
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 200);
    }
    isDragging.current = false;
    startX.current = null;
    setDragging(false);
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    isDragging.current = true;
    startX.current = e.clientX;
    setDragging(true);
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const diff = e.clientX - startX.current;
    setDragOffset(diff);
  };
  const handleMouseUp = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const diff = e.clientX - startX.current;
    const threshold = getItemWidth() / 3;
    if (diff < -threshold) {
      animateAndSetIndex('next');
    } else if (diff > threshold) {
      animateAndSetIndex('prev');
    } else {
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 200);
    }
    isDragging.current = false;
    startX.current = null;
    setDragging(false);
  };
  const handleMouseLeave = () => {
    if (isDragging.current) {
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 200);
    }
    isDragging.current = false;
    startX.current = null;
    setDragging(false);
  };

  // Keyboard navigation and focus pause
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      animateAndSetIndex('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      animateAndSetIndex('prev');
    }
  };

  // Autoplay with pause on hover/drag/focus
  useEffect(() => {
    const shouldAutoplay = !isHovered && !dragging && !isAnimating && (categories?.length ?? 0) > 1;
    if (shouldAutoplay) {
      autoplayRef.current = setInterval(() => {
        // advance by one item
        setCurrentIndex((prev) => (prev + 1) % (categories?.length || 1));
      }, 3000);
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isHovered, dragging, isAnimating, categories?.length]);

  // Compute visible items in order, as a loop
  const getVisibleCategories = () => {
    if (!categories || categories.length === 0) return [];
    const maxToShow = Math.min(visibleCount, categories.length);
    const visible = [];
    for (let i = 0; i < maxToShow; i++) {
      const category = categories[(currentIndex + i) % categories.length];
      if (category) {
        visible.push(category);
      }
    }
    return visible;
  };

  const visibleCategories = getVisibleCategories();

  const progressPercent = categories && categories.length > 0
    ? ((currentIndex % categories.length) / categories.length) * 100
    : 0;

  // --- Style for smooth transform ---
  const sliderStyle = {
    transform: `translateX(${dragOffset}px)`,
    transition: isDragging.current || isAnimating ? 'transform 0.2s cubic-bezier(0.4,0,0.2,1)' : 'none',
  };

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="max-w-8xl lg:px-3">
        {/* group to control hover for arrows */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex-1 overflow-hidden outline-none"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Product categories"
            aria-live="polite"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <div
              ref={trackRef}
              className="flex items-center gap-10 xl:gap-16 transition-transform duration-300 ease-in-out"
              style={sliderStyle}
            >
              {visibleCategories.map((category) => category && (
                <button
                  key={category._id || `${category?.name}-${Math.random()}`}
                  onClick={() => onCategoryClick && category?.name && onCategoryClick(category.name)}
                  className="flex flex-col items-center group/item flex-shrink-0 focus:outline-none"
                  style={{ flex: itemWidthPx != null ? `0 0 ${itemWidthPx}px` : undefined, width: itemWidthPx == null ? `${100 / visibleCount}%` : undefined }}
                >
                  <div
                    className="flex items-center justify-center w-full"
                    style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                  >
                    {category && category.image ? (
                      <div
                        className="relative p-1.5 rounded-full shadow-[0_10px_25px_-10px_rgba(217,168,46,0.5)]"
                        style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
                      >
                        <div className="rounded-full overflow-hidden w-28 h-28 md:w-40 md:h-40 lg:w-36 lg:h-36 xl:w-36 xl:h-36 bg-white">
                          <img
                            src={category.image}
                            alt={category.name || 'Category'}
                            loading="lazy"
                            className="w-full h-full object-cover transform transition-transform duration-300 ease-out group-hover/item:scale-105 group-focus-within/item:scale-105"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative p-1.5 rounded-full shadow-[0_10px_25px_-10px_rgba(217,168,46,0.5)]"
                        style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
                      >
                        <div className="rounded-full w-28 h-28 md:w-40 md:h-40 lg:w-36 lg:h-36 xl:w-36 xl:h-36 flex items-center justify-center bg-[#111] text-white transform transition-transform duration-300 ease-out group-hover/item:scale-105 group-focus-within/item:scale-105">
                          <span className="text-xl md:text-2xl">📦</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Label pill */}
                  <div
                    className="mt-5 w-[85%] max-w-[320px] rounded-full py-3 px-5 text-center shadow-lg"
                    style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.25)' }}
                  >
                    <div className="text-sm md:text-base font-semibold text-black truncate" style={{maxWidth: '140px'}}>
                      {category?.name && category.name.length > 12
                        ? category.name.slice(0, 12) + '...'
                        : category?.name || 'Category'}
                    </div>
                    {(() => {
                      const count = category?.productCount ?? category?.count ?? category?.productsCount ?? category?.totalProducts
                      if (typeof count === 'number') {
                        return <div className="text-[12px] md:text-sm text-black/70 mt-0.5">{count} Products</div>
                      }
                      return null
                    })()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Overlay arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-black rounded-full w-11 h-11 flex items-center justify-center shadow-xl opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto hover:brightness-95"
            style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black rounded-full w-11 h-11 flex items-center justify-center shadow-xl opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto hover:brightness-95"
            style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>

          {/* Progress bar */}
          <div className="mt-6 mx-auto w-[85%] max-w-[980px] h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: '#d9a82e' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;