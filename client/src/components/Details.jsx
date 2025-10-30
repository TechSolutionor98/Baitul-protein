import React, { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Minus, Plus } from "lucide-react"

import config from "../config/config"
import { useCart } from "../context/CartContext"
import { generateShopURL } from "../utils/urlUtils"

const API_BASE_URL = `${config.API_URL}`

function Details() {
  const { addToCart } = useCart()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [allProducts, setAllProducts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomBgPos, setZoomBgPos] = useState("50% 50%")
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const mainImgRef = useRef(null)
  const rotateRef = useRef(null)

  useEffect(() => {
    let mounted = true
    async function fetchList() {
      try {
        setLoading(true)
        setError("")
        // Fetch a page of products once
        const res = await axios
          .get(`${API_BASE_URL}/api/products/paginated`, { params: { limit: 50 } })
          .catch(() => ({ data: [] }))

        const products = Array.isArray(res?.data?.products)
          ? res.data.products
          : Array.isArray(res?.data)
            ? res.data
            : []

        if (!products.length) {
          throw new Error("No products available")
        }

        if (mounted) {
          setAllProducts(products)
          // Start at first product (simple deterministic order)
          setCurrentIndex(0)
        }
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load product")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchList()
    return () => {
      mounted = false
    }
  }, [])

  // Keep product derived from allProducts + currentIndex
  useEffect(() => {
    const p = allProducts && allProducts.length ? allProducts[currentIndex % allProducts.length] : null
    setProduct(p || null)
    if (p) {
      const primary = getPrimaryImage(p)
      setSelectedImage(primary || p.image || "")
      setQuantity(1)
      setIsZooming(false)
    }
  }, [allProducts, currentIndex])

  // Auto-rotate by index every 7 seconds (pause while zooming)
  useEffect(() => {
    if (loading || error) return
    if (!allProducts || allProducts.length <= 1) return
    rotateRef.current = setInterval(() => {
      if (!isZooming) {
        setCurrentIndex((i) => (i + 1) % allProducts.length)
      }
    }, 7000)

    return () => {
      if (rotateRef.current) clearInterval(rotateRef.current)
    }
  }, [loading, error, isZooming, allProducts])

  const images = useMemo(() => normalizeImages(product), [product])
  const { hasOffer, priceToShow, basePrice, discountPct } = useMemo(() => priceInfo(product), [product])
  const categoryNames = useMemo(() => getCategoryNames(product), [product])
  const stock = useMemo(() => getStockInfo(product), [product])
  const productUrl = useMemo(() => (product ? `/product/${product.slug || product._id}` : "#"), [product])



  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">Loading product…</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-red-500">{error || "Product not found"}</p>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image gallery */}
          <div className="lg:col-span-7">
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden sm:flex sm:flex-col gap-3 w-16">
                {/* Current product (highlighted, non-clickable) */}
                {product && (
                  <button
                    key={`current-${currentIndex}`}
                    className="border rounded-md overflow-hidden aspect-square bg-white ring-2 ring-[#d9a82e] cursor-default"
                    aria-current="true"
                    title="Currently viewing"
                    disabled
                  >
                    <img
                      src={getPrimaryImage(product)}
                      alt={product?.name || `Current product`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                )}
                {getUpcomingThumbs(allProducts, currentIndex, 5).map((item, idx) => (
                  <button
                    key={`${item.index}-${idx}`}
                    onClick={() => setCurrentIndex(item.index)}
                    className="border rounded-md overflow-hidden aspect-square bg-white hover:opacity-90 transition"
                    aria-label={`Next: ${item.product?.name || `Product ${item.index + 1}`}`}
                    title={`Next: ${item.product?.name || `Product ${item.index + 1}`}`}
                  >
                    <img src={item.src} alt={item.product?.name || `Product ${item.index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div
                ref={mainImgRef}
                className="flex-1 border rounded-lg p-4 bg-white h-[220px] md:h-[420px] lg:h-[400px] flex items-center justify-center relative"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={(e) => {
                  if (!mainImgRef.current) return
                  const rect = mainImgRef.current.getBoundingClientRect()
                  const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width)
                  const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height)

                  const percentX = (x / rect.width) * 100
                  const percentY = (y / rect.height) * 100
                  setZoomBgPos(`${percentX}% ${percentY}%`)

                  const LENS_SIZE = 140
                  const lensX = Math.min(Math.max(0, x - LENS_SIZE / 2), rect.width - LENS_SIZE)
                  const lensY = Math.min(Math.max(0, y - LENS_SIZE / 2), rect.height - LENS_SIZE)
                  setLensPos({ x: lensX, y: lensY })
                }}
              >
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
                {isZooming && (
                  <div
                    className="pointer-events-none absolute rounded-md border"
                    style={{
                      left: lensPos.x,
                      top: lensPos.y,
                      width: 140,
                      height: 140,
                      borderColor: "#d9a82e",
                      background: "rgba(192,175,155,0.25)",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Product info */}
          <div className="lg:col-span-5">
            {isZooming ? (
              <div className="relative h-[220px] md:h-[420px] lg:h-[400px] border rounded-lg bg-white overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${selectedImage || product.image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "200% 200%",
                    backgroundPosition: zoomBgPos,
                  }}
                />
              </div>
            ) : (
              <>
              
                <div className="flex items-start gap-3 mb-2">
                  {!!discountPct && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-red-100 text-red-600">
                      -{discountPct}%
                    </span>
                  )}
                  {stock?.label && (
                    <span className={stock.badgeClass}>{stock.label}</span>
                  )}
                  {/* <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1> */}
                </div>
                <h1
                  className="text-xl md:text-2xl font-bold text-gray-900 leading-snug overflow-hidden break-words"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.375,
                    minHeight: "calc(3 * 1em * 1.375)",
                  }}
                  title={product.name}
                >
                  {product.name}
                </h1>
                {/* Category chips */}
                <div className="mt-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">Category:</span>
                  {categoryNames && categoryNames.length > 0 ? (
                    <span className="ml-2 inline-flex flex-wrap gap-2 align-middle">
                      {categoryNames.map((name) => (
                        <Link
                          key={name}
                          to={generateShopURL({ parentCategory: name })}
                          className="inline-block text-xs md:text-sm rounded-full px-2 py-0.5 border border-[#d9a82e]/30 bg-[#d9a82e]/10 text-gray-900 hover:text-[#d9a82e] transition-colors"
                          title={`View ${name}`}
                        >
                          {name}
                        </Link>
                      ))}
                    </span>
                  ) : (
                    <span className="ml-2 text-sm text-gray-500">N/A</span>
                  )}
                </div>
                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  {hasOffer && (

                    <div className="text-red-600 text-xl font-semibold">{formatCurrency(priceToShow)} AED</div>
                  )}
                  <div className="text-gray-400 line-through font-medium">{formatCurrency(basePrice)} AED</div>
                </div>




                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center border rounded-full px-2 h-10">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 disabled:opacity-50"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 min-w-[2ch] text-center">{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} className="p-2" aria-label="Increase quantity">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-10 rounded-full bg-[#d9a82e] hover:bg-[#c99720] text-white font-semibold tracking-wide transition"
                  >
                    ADD TO CART
                  </button>

                  <button
                    className="h-10 w-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                    aria-label="Secondary action"
                  >
                    ×
                  </button>
                </div>

                {/* Payment quick action */}
                <div className="mb-2">
                  <Link
                    to={productUrl}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white text-gray-800 font-medium flex items-center justify-center"
                    aria-label={`View details for ${product?.name || "product"}`}
                  >
                    View Product Details
                  </Link>
                  <div className="mt-1">
                    <button className="text-xs text-gray-600 underline">More payment options</button>
                  </div>
                </div>

                {/* Safe checkout strip (placeholder logos) */}
                <div className="mt-4">
                  <div className="text-sm text-gray-700 font-medium mb-2">Guaranteed Safe Checkout</div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {["VISA", "Mastercard", "tabby", "AMEX", "Apple Pay", "Google Pay"].map((name) => (
                      <span
                        key={name}
                        className="text-[11px] px-2 py-1 rounded border border-gray-300 bg-white text-gray-700"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function normalizeImages(p) {
  if (!p) return []
  const imgs = []
  if (Array.isArray(p.galleryImages)) imgs.push(...p.galleryImages.filter(Boolean))
  if (p.image) imgs.unshift(p.image)
  // Ensure unique
  return Array.from(new Set(imgs))
}

function getPrimaryImage(p) {
  if (!p) return ""
  const imgs = normalizeImages(p)
  return imgs[0] || p.image || ""
}

function getUpcomingThumbs(list, currentIndex, count = 6) {
  if (!Array.isArray(list) || list.length === 0) return []
  const items = []
  const len = list.length
  for (let i = 1; i <= Math.min(count, len - 1); i++) {
    const idx = (currentIndex + i) % len
    const prod = list[idx]
    const src = getPrimaryImage(prod)
    if (src) items.push({ index: idx, src, product: prod })
  }
  return items
}

function getCategoryNames(p) {
  if (!p) return []
  const names = []
  // single category fields
  const c = p.category ?? p.parentCategory
  if (c) {
    if (typeof c === "string") names.push(c)
    else if (typeof c === "object") names.push(c.name || c.title || c.slug || "")
  }
  // array field
  if (Array.isArray(p.categories)) {
    for (const it of p.categories) {
      if (!it) continue
      if (typeof it === "string") names.push(it)
      else if (typeof it === "object") names.push(it.name || it.title || it.slug || "")
    }
  }
  return Array.from(new Set(names.filter(Boolean)))
}

function priceInfo(p) {
  if (!p) return { hasOffer: false, priceToShow: 0, basePrice: 0, discountPct: 0 }
  const basePrice = Number(p.price) || 0
  const offerPrice = Number(p.offerPrice) || 0
  const hasOffer = offerPrice > 0 && basePrice > 0 && offerPrice < basePrice
  const priceToShow = hasOffer ? offerPrice : basePrice || offerPrice || 0
  let discountPct = 0
  if (hasOffer && basePrice > 0) {
    discountPct = Math.round(((basePrice - offerPrice) / basePrice) * 100)
  } else if (p.discount) {
    discountPct = Math.round(Number(p.discount))
  }
  return { hasOffer, priceToShow, basePrice, discountPct }
}

function formatCurrency(n) {
  const value = Number(n) || 0
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default Details

// Helpers
function getStockInfo(p) {
  if (!p) return { label: "", badgeClass: "" }
  // Prefer explicit stockStatus from backend when present
  const rawStatus = typeof p.stockStatus === "string" ? p.stockStatus.trim().toLowerCase() : ""
  if (rawStatus) {
    if (rawStatus === "out of stock") {
      return {
        label: "Out of Stock",
        badgeClass:
          "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-gray-200 text-gray-700",
      }
    }
    if (rawStatus === "preorder" || rawStatus === "pre-order" || rawStatus === "pre order") {
      return {
        label: "Pre-order",
        badgeClass:
          "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-[#d9a82e]/15 text-[#d9a82e]",
      }
    }
    // Any other valid value means purchasable/available
    return {
      label: "In Stock",
      badgeClass:
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-green-100 text-green-700",
    }
  }

  // Otherwise, try common fields: countInStock, stock, quantity, isInStock
  const count =
    typeof p.countInStock === "number"
      ? p.countInStock
      : typeof p.stock === "number"
      ? p.stock
      : typeof p.quantity === "number"
      ? p.quantity
      : undefined

  const boolInStock =
    typeof p.isInStock === "boolean"
      ? p.isInStock
      : typeof p.inStock === "boolean"
      ? p.inStock
      : count !== undefined
      ? count > 0
      : true

  let label = boolInStock ? "In Stock" : "Out of Stock"
  if (boolInStock && typeof count === "number") {
    if (count === 0) label = "Out of Stock"
    else if (count <= 3) label = `Only ${count} left`
  }

  const badgeClass = boolInStock
    ? "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-green-100 text-green-700"
    : "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-gray-200 text-gray-700"

  return { label, badgeClass }
}
