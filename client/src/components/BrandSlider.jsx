
// import React, { useState, useEffect, useRef } from "react";

// const BrandSlider = ({ brands = [], onBrandClick, initialIndex = 0 }) => {
//   const [brandIndex, setBrandIndex] = useState(initialIndex);
//   const [visibleCount, setVisibleCount] = useState(8);
//   const sliderRef = useRef(null);
//   const isDragging = useRef(false);
//   const startX = useRef(0);
//   const scrollLeft = useRef(0);

//   // Responsive count update
//   useEffect(() => {
//     const updateVisible = () => {
//       if (window.innerWidth < 768) setVisibleCount(3);
//       else if (window.innerWidth < 1024) setVisibleCount(6);
//       else if (window.innerWidth < 1536) setVisibleCount(8);
//       else setVisibleCount(10); // 10 logos on 2XL screens (1536px and above)
//     };
//     updateVisible();
//     window.addEventListener("resize", updateVisible);
//     return () => window.removeEventListener("resize", updateVisible);
//   }, []);

//   // Auto-scroll
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBrandIndex((prev) => (prev + 1) % brands.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [brands.length]);

//   // Get visible brands in infinite loop
//   const getVisibleBrands = () => {
//     let visible = [];
//     for (let i = 0; i < visibleCount; i++) {
//       visible.push(brands[(brandIndex + i) % brands.length]);
//     }
//     return visible;
//   };

//   // Dragging handlers
//   const handleMouseDown = (e) => {
//     isDragging.current = true;
//     startX.current = e.pageX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };

//   const handleMouseLeave = () => {
//     isDragging.current = false;
//   };

//   const handleMouseUp = () => {
//     isDragging.current = false;
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging.current) return;
//     e.preventDefault();
//     const x = e.pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   const handleTouchStart = (e) => {
//     isDragging.current = true;
//     startX.current = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };

//   const handleTouchMove = (e) => {
//     if (!isDragging.current) return;
//     const x = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   const handleTouchEnd = () => {
//     isDragging.current = false;
//   };

//   return (
//     <section className="bg-white py-8">
//       <div className="max-w-8xl mx-auto">
//         <div className="relative mb-6">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">Featured Brands</h2>
//         </div>
//         <div className="relative mx-3 md:mx-5">
//           <div
//             className="flex overflow-x-hidden no-scrollbar space-x-2"
//             ref={sliderRef}
//             onMouseDown={handleMouseDown}
//             onMouseLeave={handleMouseLeave}
//             onMouseUp={handleMouseUp}
//             onMouseMove={handleMouseMove}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           >
//             {getVisibleBrands().map((brand, index) => (
//               <div
//                 key={`${brand._id}-${index}`}
//                 className="flex-shrink-0"
//                 style={{ width: "180px" }}
//               >
//                 <div className="px-2 md:px-3">
//                   <button
//                     onClick={() => onBrandClick && onBrandClick(brand.name)}
//                     className="flex flex-col items-center group transition-all duration-300 w-full"
//                   >
//                     <div className="w-22 h-22 md:w-26 md:h-26 lg:w-40 lg:h-40 overflow-hidden flex items-center justify-center ">
//                       <img
//                         src={brand.logo || "/placeholder.svg"}
//                         alt={brand.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BrandSlider;


// =============

// import React, { useState, useEffect, useRef } from "react";

// const BrandSlider = ({ brands = [], onBrandClick, initialIndex = 0 }) => {
//   const [brandIndex, setBrandIndex] = useState(initialIndex);
//   const [visibleCount, setVisibleCount] = useState(8);
//   const [isMobile, setIsMobile] = useState(false);
//   const sliderRef = useRef(null);
//   const isDragging = useRef(false);
//   const startX = useRef(0);
//   const scrollLeft = useRef(0);

//   // Update visible count + isMobile on resize
//   useEffect(() => {
//     const updateVisible = () => {
//       const width = window.innerWidth;
//       if (width < 768) {
//         setVisibleCount(brands.length); // Show all on mobile
//         setIsMobile(true);
//       } else {
//         setIsMobile(false);
//         if (width < 1024) setVisibleCount(6);
//         else if (width < 1536) setVisibleCount(8);
//         else setVisibleCount(10);
//       }
//     };
//     updateVisible();
//     window.addEventListener("resize", updateVisible);
//     return () => window.removeEventListener("resize", updateVisible);
//   }, [brands.length]);

//   // Auto-scroll effect (mobile scrollLeft / desktop brandIndex)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isMobile && sliderRef.current) {
//         const container = sliderRef.current;
//         const scrollAmount = 180 + 8; // card width + spacing

//         // If end reached, scroll back to start
//         if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 1) {
//           container.scrollTo({ left: 0, behavior: "smooth" });
//         } else {
//           container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//         }
//       } else {
//         // Desktop: use brandIndex logic
//         setBrandIndex((prev) => (prev + 1) % brands.length);
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [brands.length, isMobile]);

//   // Get visible brands for desktop only
//   const getVisibleBrands = () => {
//     const visible = [];
//     for (let i = 0; i < visibleCount; i++) {
//       visible.push(brands[(brandIndex + i) % brands.length]);
//     }
//     return visible;
//   };

//   // Mouse drag (desktop)
//   const handleMouseDown = (e) => {
//     isDragging.current = true;
//     startX.current = e.pageX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };
//   const handleMouseLeave = () => (isDragging.current = false);
//   const handleMouseUp = () => (isDragging.current = false);
//   const handleMouseMove = (e) => {
//     if (!isDragging.current) return;
//     e.preventDefault();
//     const x = e.pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   // Touch drag (mobile)
//   const handleTouchStart = (e) => {
//     if (!isMobile) return;
//     isDragging.current = true;
//     startX.current = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     scrollLeft.current = sliderRef.current.scrollLeft;
//   };

//   const handleTouchMove = (e) => {
//     if (!isMobile || !isDragging.current) return;
//     const x = e.touches[0].clientX - sliderRef.current.offsetLeft;
//     const walk = (x - startX.current) * 1.2;
//     sliderRef.current.scrollLeft = scrollLeft.current - walk;
//   };

//   const handleTouchEnd = () => {
//     isDragging.current = false;
//   };

//   return (
//     <section className="bg-white py-8">
//       <div className="max-w-8xl mx-auto">
//         <div className="relative mb-6">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
//             Featured Brands
//           </h2>
//         </div>
//         <div className="relative mx-3 md:mx-5">
//           <div
//             className="flex overflow-x-hidden no-scrollbar space-x-2"
//             ref={sliderRef}
//             onMouseDown={handleMouseDown}
//             onMouseLeave={handleMouseLeave}
//             onMouseUp={handleMouseUp}
//             onMouseMove={handleMouseMove}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           >
//             {(isMobile ? brands : getVisibleBrands()).map((brand, index) => (
//               <div
//                 key={`${brand._id}-${index}`}
//                 className="flex-shrink-0"
//                 style={{ width: "180px" }}
//               >
//                 <div className="px-2 md:px-3">
//                   <button
//                     onClick={() => onBrandClick && onBrandClick(brand.name)}
//                     className="flex flex-col items-center group transition-all duration-300 w-full"
//                   >
//                     <div className="w-22 h-22 md:w-26 md:h-26 lg:w-40 lg:h-40 overflow-hidden flex items-center justify-center">
//                       <img
//                         src={brand.logo || "/placeholder.svg"}
//                         alt={brand.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BrandSlider;


// =================


import React, { useState, useEffect, useRef } from "react";

const BrandSlider = ({ brands = [], onBrandClick, initialIndex = 0 }) => {
  const [brandIndex, setBrandIndex] = useState(initialIndex);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Ensure we never operate on undefined items
  const safeBrands = Array.isArray(brands) ? brands.filter(Boolean) : [];
  const duplicatedBrands = [...safeBrands, ...safeBrands]; // for infinite scroll

  // Update visible count + isMobile
  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCount(safeBrands.length);
        setIsMobile(true);
      } else {
        setIsMobile(false);
        if (width < 1024) setVisibleCount(6);
        else if (width < 1536) setVisibleCount(8);
        else setVisibleCount(10);
      }
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, [brands.length]);

  // Autoplay with pause on hover/drag
  useEffect(() => {
    if (isHovered || dragging) return;
    const interval = setInterval(() => {
      if (isMobile && sliderRef.current) {
        const container = sliderRef.current;
        const scrollAmount = container.clientWidth; // move by exactly one viewport (2 cards)
        const midpoint = container.scrollWidth / 2 - container.offsetWidth;
        if (container.scrollLeft >= midpoint) {
          container.scrollLeft = 0;
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (safeBrands.length > 0) {
          setBrandIndex((prev) => (prev + 1) % safeBrands.length);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, isHovered, dragging, safeBrands.length]);

  // Progress: desktop tied to index
  useEffect(() => {
    if (isMobile) return;
    const len = safeBrands.length || 1;
    setProgressPercent(((brandIndex % len) / len) * 100);
  }, [brandIndex, isMobile, safeBrands.length]);

  // Progress: mobile tied to scroll position
  useEffect(() => {
    const container = sliderRef.current;
    if (!isMobile || !container) return;
    const handleScroll = () => {
      const halfScrollable = Math.max(1, container.scrollWidth / 2 - container.offsetWidth);
      const pct = Math.min(100, Math.max(0, (container.scrollLeft / halfScrollable) * 100));
      setProgressPercent(pct);
    };
    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Get visible brands for desktop
  const getVisibleBrands = () => {
    if (!safeBrands.length) return [];
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(safeBrands[(brandIndex + i) % safeBrands.length]);
    }
    return visible.filter(Boolean);
  };

  // Mouse (desktop) scroll
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    setDragging(true);
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
    setDragging(false);
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    setDragging(false);
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Touch (mobile) scroll
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    isDragging.current = true;
    startX.current = e.touches[0].clientX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging.current) return;
    const x = e.touches[0].clientX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    setDragging(false);
  };

  // Helpers for arrows/keyboard
  const scrollByAmount = (amount) => {
    const container = sliderRef.current;
    if (!container) return;
    container.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (isMobile && sliderRef.current) scrollByAmount(sliderRef.current.clientWidth);
    else if (safeBrands.length) setBrandIndex((prev) => (prev + 1) % safeBrands.length);
  };
  const handlePrev = () => {
    if (isMobile && sliderRef.current) scrollByAmount(-sliderRef.current.clientWidth);
    else if (safeBrands.length) setBrandIndex((prev) => (prev - 1 + safeBrands.length) % safeBrands.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  // Compute items to render safely
  const items = (isMobile ? duplicatedBrands : getVisibleBrands()).filter(Boolean);

  if (!items.length) {
    // Nothing to render yet (e.g., still loading brands)
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-white to-[#faf7ef] py-10">
      {/* Scoped style to hide horizontal scrollbar across browsers */}
      <style>
        {`
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .hide-scrollbar::-webkit-scrollbar { display: none; width: 0; height: 0; background: transparent; }
        `}
      </style>
      <div className="max-w-8xl mx-auto">
        <div className="relative mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">Featured Brands</h2>
        </div>
        <div
          className="relative mx-3 md:mx-5 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex overflow-x-auto no-scrollbar hide-scrollbar gap-2 outline-none ${isMobile ? 'snap-x snap-mandatory' : ''}`}
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Brand logos"
            aria-live="polite"
          >
            {items.map((brand, index) => (
              <div
                key={`${brand?._id || index}-${index}`}
                className={`flex-shrink-0 ${isMobile ? 'snap-start' : ''}`}
                style={{ width: isMobile ? "calc((100% - 0.5rem)/2)" : "180px" }}
              >
                <div className="px-2 md:px-3">
                  <button
                    onClick={() => onBrandClick && brand?.name && onBrandClick(brand.name)}
                    className="flex flex-col items-center group/item transition-all duration-300 w-full focus:outline-none focus-visible:outline-none"
                    aria-label={brand?.name ? `View ${brand.name}` : 'View brand'}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <div className="w-22 h-22 md:w-26 md:h-26 lg:w-40 lg:h-40 flex items-center justify-center">
                      <div
                        className="relative w-full h-full rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                        style={{ boxShadow: '0 10px 25px -12px rgba(0,0,0,0.2)' }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: '#d9a82e' }} />
                        <img
                          src={(brand && brand.logo) ? brand.logo : "/placeholder.svg"}
                          alt={brand?.name || "Brand"}
                          loading="lazy"
                          className="w-[80%] h-[80%] object-contain transition-all duration-300 filter grayscale opacity-80 group-hover/item:grayscale-0 group-hover/item:opacity-100 group-hover/item:scale-105 outline-none focus:outline-none focus-visible:outline-none"
                          tabIndex={-1}
                        />
                      </div>
                    </div>
                    <div
                      className="mt-3 px-3 py-1 rounded-full text-xs md:text-sm font-medium text-black shadow"
                      style={{ backgroundColor: '#d9a82e', boxShadow: '0 8px 22px -12px rgba(217,168,46,0.45)' }}
                    >
                      {brand?.name || 'Brand'}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Overlay arrows */}
          {!isMobile && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 text-black rounded-full w-10 h-10 flex items-center justify-center shadow-xl opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto hover:brightness-95"
                style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
                aria-label="Previous brands"
              >
                {/* Using simple chevrons with unicode to avoid new deps */}
                <span className="text-lg">‹</span>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-black rounded-full w-10 h-10 flex items-center justify-center shadow-xl opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto hover:brightness-95"
                style={{ backgroundColor: '#d9a82e', boxShadow: '0 10px 25px -10px rgba(217,168,46,0.5)' }}
                aria-label="Next brands"
              >
                <span className="text-lg">›</span>
              </button>
            </>
          )}

          {/* Progress bar */}
          {/* <div className="mt-6 mx-auto w-[85%] max-w-[980px] h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: '#d9a82e' }}
              aria-hidden="true"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;
