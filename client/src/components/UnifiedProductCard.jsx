import React from "react"
import { Link } from "react-router-dom"
import { getImageUrl } from "../utils/imageUtils"

// Price helpers (kept local to this component)
const formatAEDValue = (value) => `Rs. ${Number(value || 0).toFixed(2)} AED`

// Render price with mobile-only hidden .00
const PriceText = ({ value }) => {
  const num = Number(value || 0)
  const fixed = num.toFixed(2)
  const [intPart, decPart] = fixed.split(".")
  const showDecimalOnMobile = decPart !== "00"
  return (
    <>
      Rs. {intPart}
      <span className={showDecimalOnMobile ? "" : "hidden md:inline"}>.{decPart}</span> AED
    </>
  )
}
const getPriceInfo = (p) => {
  const price = Number(p?.price) || 0
  const offer = Number(p?.offerPrice) || 0
  const hasDiscount = offer > 0 && offer < price
  const current = hasDiscount ? offer : price
  const old = hasDiscount ? price : 0
  return { current, old, hasDiscount }
}

const UnifiedProductCard = ({ product }) => {
  const href = product?.slug || product?._id ? `/product/${product.slug || product._id}` : "#"

  // Prices
  const { current, old, hasDiscount } = getPriceInfo(product)

  // Rating data (optional). Supports product.rating/averageRating and reviewCount/numReviews
  const rating = Number(product?.averageRating ?? product?.rating ?? 0) || 0
  const reviewCount = Number(product?.reviewCount ?? product?.numReviews ?? 0) || 0

  const Star = ({ filled }) => (
    <svg
      viewBox="0 0 20 20"
      className={`w-3.5 h-3.5 ${filled ? "fill-yellow-400" : "fill-gray-300"}`}
      aria-hidden="true"
    >
      <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
    </svg>
  )

  return (
    <article className="group text-left md:text-center">
      <Link to={href} className="block">
        <div className="relative flex items-center justify-center bg-white">
          <div className="aspect-[4/3] w-full max-w-[260px] mx-auto flex items-center justify-center">
            <img
              src={getImageUrl(product)}
              alt={product?.name || "Product"}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=150&width=150"
              }}
            />
          </div>
        </div>
      </Link>

  {/* Reviews row above product name */}
  <div className="mt-2 px-4 md:px-10 flex items-center justify-start md:justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < Math.round(rating)} />
        ))}
        <span className="ml-1 text-xs text-gray-600">({reviewCount})</span>
      </div>

      <div className="mt-2 text-[13px]  md:px-10 md:text-sm font-semibold text-black leading-snug line-clamp-2 min-h-[40px] text-left md:text-center">
        {product?.name || "Product"}
      </div>

      {/* Price row: current + crossed old price if discounted */}
      <div className="mt-1 text-[13px] flex items-center justify-start md:justify-center gap-2">
        <span className="text-red-600 font-semibold whitespace-nowrap"><PriceText value={current} /></span>
        {hasDiscount && (
          <span className="text-gray-500 line-through whitespace-nowrap"><PriceText value={old} /></span>
        )}
      </div>

      <div className="mt-4 flex justify-start md:justify-center">
        <Link
          to={href}
          className="inline-flex items-center justify-center rounded-full bg-[#d4af37] text-black px-6 py-2 md:px-7 md:py-2.5 text-sm font-semibold shadow-sm hover:brightness-95 transition"
        >
          Choose options
        </Link>
      </div>
    </article>
  )
}

export default UnifiedProductCard
