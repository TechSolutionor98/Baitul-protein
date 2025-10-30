"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Helpers
const formatNumber = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })
const priceParts = (p) => {
  const base = Number(p?.price) || 0
  const offer = Number(p?.offerPrice) || 0
  const hasOffer = offer > 0 && base > 0 && offer < base
  const current = hasOffer ? offer : base || offer || 0
  const pct = hasOffer && base > 0 ? Math.round(((base - offer) / base) * 100) : 0
  return { hasOffer, base, current, pct }
}

const Card = ({ product }) => {
  const href = product?.slug || product?._id ? `/product/${product.slug || product._id}` : "#"
  const { hasOffer, base, current, pct } = priceParts(product)
  // Rating data
  const rating = Number(product?.averageRating ?? product?.rating ?? 0) || 0
  const reviewCount = Number(product?.reviewCount ?? product?.numReviews ?? 0) || 0

  const Star = ({ filled }) => (
    <svg
      viewBox="0 0 20 20"
      className={`w-3.5 h-3.5 ${filled ? 'fill-[#d9a82e]' : 'fill-gray-300'}`}
      aria-hidden="true"
    >
      <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
    </svg>
  )
  return (
    <article className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <Link to={href} className="block p-4">
        <div className="relative">
          {/* Discount badge */}
          {hasOffer && pct > 0 && (
            <span className="absolute -top-2 -left-2 z-10 text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-md">
              -{pct}%
            </span>
          )}

          {/* Image area */}
          <div className="w-full h-[180px] md:h-[200px] lg:h-[220px] flex items-center justify-center bg-white rounded-md p-2">
            {product?.image ? (
              <img
                src={product.image}
                alt={product?.name || "Product"}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-[#c0af9b]/20 rounded flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {/* Rating above product name */}
        <div className="mt-1 flex items-center justify-start gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < Math.round(rating)} />
          ))}
          <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
        </div>

        <Link to={href} className="block">
          <h3 className="mt-1 text-sm font-semibold text-black leading-snug line-clamp-2 min-h-[40px]  transition-colors">
            {product?.name || "Product"}
          </h3>
        </Link>

        {/* Price: reserve space for crossed price on mobile to keep cards equal height */}
        <div className=" flex flex-col md:flex-row items-start md:items-center gap- md:gap-2">
          <div className="text-red-600 font-bold text-sm whitespace-nowrap">Rs. {formatNumber(current)} AED</div>
          {hasOffer ? (
            <div className="text-gray-500 line-through text-xs whitespace-nowrap">Rs. {formatNumber(base)} AED</div>
          ) : (
            // Invisible placeholder keeps the same vertical space when no discount price
            <div className="text-gray-500 text-xs whitespace-nowrap invisible">Rs. {formatNumber(base)} AED</div>
          )}
        </div>

        <div className="mt-1">
          <Link
            to={href}
            className="w-full inline-flex items-center justify-center rounded-full bg-[#d9a82e] hover:bg-[#c99720] text-white px-2 py-2 md:px-7 md:py-2.5 text-sm font-semibold shadow-sm transition"
          >
            Choose options
          </Link>
        </div>
      </div>
    </article>
  )
}

const BigSaleSection = ({ products = [] }) => {
  if (!products || products.length === 0) return null

  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(2)

  useEffect(() => {
    const updatePerView = () => {
      const w = window.innerWidth
      if (w >= 1024) setPerView(4)
      else if (w >= 768) setPerView(3)
      else setPerView(2)
    }
    updatePerView()
    window.addEventListener("resize", updatePerView)
    return () => window.removeEventListener("resize", updatePerView)
  }, [])

  const maxIndex = Math.max(0, products.length - perView)

  useEffect(() => {
    // Clamp index when perView or products change
    setIndex((i) => Math.min(Math.max(0, i), maxIndex))
  }, [perView, products.length])

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1))

  const translatePct = index * (100 / perView)

  return (
    <section className="py-10 bg-[#2377c1]">
      <div className="max-w-7xl mx-auto px-2">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-center text-white mb-8">Best Seller</h2>

        <div className="relative">
          {maxIndex > 0 && (
            <>
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full border bg-[#d9a82e] text-[#5a9690] border-[#5a9690] hover:bg-[#d9a82e] text-white hover:text-white transition disabled:opacity-40 disabled:pointer-events-none`}
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full border bg-[#d9a82e] text-[#5a9690] border-[#5a9690] hover:bg-[#d9a82e] text-white hover:text-white transition disabled:opacity-40 disabled:pointer-events-none`}
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div
              className="flex -mx-2 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${translatePct}%)` }}
            >
              {products.map((p) => (
                <div
                  key={p._id}
                  className="px-2 shrink-0"
                  style={{ width: `${100 / perView}%` }}
                >
                  <Card product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BigSaleSection
