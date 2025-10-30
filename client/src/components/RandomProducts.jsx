import React, { useEffect, useMemo, useRef, useState } from 'react'
import UnifiedProductCard from './UnifiedProductCard'
import { apiRequest } from '../services/api'

// Small util - in-place Fisher-Yates shuffle clone
const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Generate a set of dummy products to show when no real products are available
const generateDummyProducts = (count = 24) =>
  Array.from({ length: count }).map((_, i) => {
    const idx = i + 1
    return {
      _id: `dummy-${idx}`,
      name: `Sample Product ${idx}`,
      price: 99 + (idx % 7) * 10,
      offerPrice: idx % 3 === 0 ? 79 + (idx % 5) * 10 : 0,
      image: `https://via.placeholder.com/600x450.png?text=Product+${idx}`,
    }
  })

// (Price helpers removed; handled inside UnifiedProductCard)

// Use UnifiedProductCard to ensure consistent visuals across pages

function RandomProducts() {
  const [pool, setPool] = useState([]) // all fetched products (unique)
  const [visibleCount, setVisibleCount] = useState(8)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  // Global pagination state
  const pageRef = useRef(1)
  const hasMoreRef = useRef(true)
  const seenIdsRef = useRef(new Set())

  const PAGE_SIZE = 24

  const visibleProducts = useMemo(() => pool.slice(0, visibleCount), [pool, visibleCount])

  // Fetch helpers
  const fetchGlobalPage = async (page) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
    const data = await apiRequest(`/api/products/paginated?${qs.toString()}`)
    try {
      console.log('[RandomProducts] fetchGlobalPage', {
        page,
        limit: PAGE_SIZE,
        returned: Array.isArray(data?.products) ? data.products.length : 0,
        hasMore: Boolean(data?.hasMore),
      })
    } catch {}
    return { products: Array.isArray(data?.products) ? data.products : [], hasMore: Boolean(data?.hasMore) }
  }

  const bootstrap = async () => {
    setLoading(true)
    setError('')
    try {
      // Reset seen set at the start to handle dev double-invocation cleanly
      seenIdsRef.current = new Set()
      try { console.log('[RandomProducts] bootstrap:start') } catch {}
      // Global pagination bootstrap
      pageRef.current = 1
      hasMoreRef.current = true
      const merged = []
      const seen = seenIdsRef.current
      const first = await fetchGlobalPage(pageRef.current)
      hasMoreRef.current = first.hasMore
      for (const p of first.products || []) {
        if (p?._id && !seen.has(p._id)) {
          seen.add(p._id)
          merged.push(p)
        }
      }
      try { console.log('[RandomProducts] initial merged unique products', { count: merged.length }) } catch {}
      if (merged.length === 0) {
        // No real products available: fall back to dummy products
        const dummies = generateDummyProducts(24)
        dummies.forEach((d) => seen.add(d._id))
        // Only set dummies if we don't already have real products
        setPool((prev) => (prev.length === 0 ? dummies : prev))
      } else {
        // Ensure at least 8 items initially by fetching subsequent pages if needed
        while (merged.length < 8 && hasMoreRef.current) {
          pageRef.current += 1
          const next = await fetchGlobalPage(pageRef.current)
          hasMoreRef.current = next.hasMore
          for (const p2 of next.products || []) {
            if (p2?._id && !seen.has(p2._id)) {
              seen.add(p2._id)
              merged.push(p2)
            }
          }
        }
        setPool(shuffle(merged))
      }
    } catch (e) {
      console.error(e)
      setError(e?.message || 'Failed to load random products')
    } finally {
      setLoading(false)
    }
  }

  // StrictMode guard: prevent double bootstrap in development
  const bootedRef = useRef(false)
  useEffect(() => {
    if (bootedRef.current) return
    bootedRef.current = true
    bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = async () => {
    // If we already have enough items for next 8, just increase the visible slice
    if (pool.length >= visibleCount + 8) {
      setVisibleCount((c) => c + 8)
      return
    }

    // If no more pages, just reveal whatever remains (even if < 8)
    if (!hasMoreRef.current) {
      setVisibleCount((c) => Math.min(c + 8, pool.length))
      return
    }

    setLoadingMore(true)
    setError('')
    try {
      pageRef.current += 1
      const next = await fetchGlobalPage(pageRef.current)
      hasMoreRef.current = next.hasMore
      const seen = seenIdsRef.current
      const added = []
      for (const p of next.products || []) {
        if (p?._id && !seen.has(p._id)) {
          seen.add(p._id)
          added.push(p)
        }
      }
      if (added.length > 0) {
        setPool((prev) => [...prev, ...added])
      }
      // Increase visibleCount by up to 8, but don't wait for a full 8 to show new items
      setVisibleCount((c) => Math.min(c + 8, pool.length + added.length))
    } catch (e) {
      console.error(e)
      setError(e?.message || 'Failed to load more products')
    } finally {
      setLoadingMore(false)
    }
  }

  // Collapse back to initial 8 items
  const showLess = () => {
    setVisibleCount((c) => Math.min(8, pool.length))
  }

  if (loading) {
    return (
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-40 bg-gray-800 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-[#0f0f0f] border border-[#222] p-4 animate-pulse">
                <div className="aspect-[4/3] bg-[#1a1a1a] rounded mb-3" />
                <div className="h-4 bg-[#1a1a1a] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#1a1a1a] rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-red-400">{error}</div>
        </div>
      </section>
    )
  }

  if (pool.length === 0) return null

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-center text-black mb-8">
        Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {visibleProducts.map((p) => (
            <UnifiedProductCard key={p._id} product={p} />
          ))}
        </div>

        {/* More / Less */}
        <div className="mt-8 text-center">
          {(() => {
            const allShown = !hasMoreRef.current && visibleCount >= pool.length
            if (allShown && pool.length > 8) {
              return (
                <button
                  onClick={showLess}
                  className="inline-flex bg-[#d4af37] items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black hover:bg-[#d4af37]"
                >
                  Less
                </button>
              )
            }
            if (visibleCount < pool.length || hasMoreRef.current) {
              return (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex bg-[#d4af37] items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black hover:bg-[#d4af37] disabled:opacity-60"
                >
                  {loadingMore ? 'Loading…' : 'More'}
                </button>
              )
            }
            return null
          })()}
        </div>
      </div>
    </section>
  )
}

export default RandomProducts
