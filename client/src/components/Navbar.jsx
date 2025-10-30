"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { Search, Heart, User, ShoppingCart, Menu, X, Home, Grid3X3, UserCircle, HelpCircle, Package, Truck } from "lucide-react"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlist } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const profileRef = useRef(null)
  const profileButtonRef = useRef(null)
  const mobileSearchInputRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  if (location.pathname.startsWith("/admin")) return null

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsProfileOpen(false)
  }

  const handleMobileSearchOpen = () => setIsMobileSearchOpen(true)
  const handleMobileSearchClose = () => setIsMobileSearchOpen(false)
  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleSearchGo = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    setIsMobileSearchOpen(false)
  }

  return (
    <>
      {/* Desktop announcement bar + top navbar */}
      <div className="hidden md:block sticky top-0 z-50">
        <div className="bg-[#2377c1] text-white text-xs tracking-wide border-b border-[#c0af9b]">
          <div className="max-w-7xl mx-auto px-4 overflow-hidden relative">
            <div style={{ whiteSpace: "nowrap", animation: "marquee 18s linear infinite" }} className="py-2">
              <span className="mx-6">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-6">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-6">• Enjoy Free Shipping on Orders Over 500 AED!</span>
              <span className="mx-6">• Enjoy Free Shipping on Orders Over 500 AED!</span>
            </div>
          </div>
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

        <header className="bg-white h-[95px] border-b border-[#c0af9b]/40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-3 items-center h-20">
              <nav className="flex items-center gap-8 text-gray-800 text-sm uppercase tracking-wide">
                <Link to="/" className="hover:text-[#d9a82e]">Home</Link>
                {/* <Link to="/shop" className="hover:text-[#d9a82e]">Catalog</Link> */}
                <Link to="/shop" className="hover:text-[#d9a82e]">Products</Link>
                <Link to="/contact" className="hover:text-[#d9a82e]">Contact Us</Link>
              </nav>

              <div className="flex items-center justify-center">
                <Link to="/" className="block">
                  <div className="w-44 h-28 rounded-full overflow-hidden">
                    <img src="/baitulProtein/Baitullogo.webp" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                </Link>
              </div>

              <div className="flex items-center justify-end gap-5 text-gray-800">
                <button onClick={handleMobileSearchOpen} aria-label="Open search" className="w-10 h-10 flex items-center justify-center">
                  <Search size={22} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((s) => !s)}
                    className="w-10 h-10 flex items-center justify-center"
                    ref={profileButtonRef}
                    aria-label="Account"
                  >
                    <User size={22} />
                  </button>
                  {isProfileOpen && (
                    <div ref={profileRef} className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-20 border">
                      {isAuthenticated ? (
                        <>
                          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                          <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>My Orders</Link>
                          <Link to="/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Track Order</Link>
                          <hr className="my-1" />
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Login</Link>
                          <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Register</Link>
                          <Link to="/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Track Order</Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center" aria-label="Cart">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-1 -right-1 bg-[#d9a82e] text-white text-[10px] leading-none rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile navbar */}
      <header className="md:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={toggleMobileMenu} className="p-2">
            <Menu size={24} className="text-gray-700" />
          </button>
          <Link to="/" className="flex items-center">
            <img src="/baitulProtein/Baitullogo.webp" alt="Logo" className="h-8" />
          </Link>
          <button className="p-2" onClick={handleMobileSearchOpen} aria-label="Open search">
            <Search size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(192,175,155,0.5)]">
          <div className="w-full bg-white p-4 shadow-md relative">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearchGo} className="flex-1 relative">
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#d9a82e]" autoFocus ref={mobileSearchInputRef} />
                  <button type="submit" className="px-4 py-2 bg-[#d9a82e] text-white rounded hover:bg-[#c99720]">
                    <Search size={18} />
                  </button>
                </div>
              </form>
              <button onClick={handleMobileSearchClose} className="ml-2 p-2" aria-label="Close search">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-[rgba(192,175,155,0.5)]" onClick={closeMobileMenu}></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 bg-[#d9a82e] text-white">
              <div className="flex items-center">
                <UserCircle size={24} className="text-white mr-2" />
                {isAuthenticated ? (
                  <span className="text-white">{`Hello, ${user?.name || "User"}`}</span>
                ) : (
                  <button onClick={() => { closeMobileMenu(); navigate("/login") }} className="text-white font-medium hover:text-white/90 transition-colors">
                    Hello, <span className="underline">Sign in</span>
                  </button>
                )}
              </div>
              <button onClick={closeMobileMenu} className="p-1">
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-6">
                <Link to="/orders" className="flex items-center py-3 text-gray-700 hover:bg-gray-50 rounded-lg px-2" onClick={closeMobileMenu}>
                  <Package size={20} className="mr-3" />
                  <strong>My Orders</strong>
                </Link>
                <Link to="/track-order" className="flex items-center py-3 text-gray-700 hover:bg-gray-50 rounded-lg px-2" onClick={closeMobileMenu}>
                  <Truck size={20} className="mr-3" />
                  <strong>Track Order</strong>
                </Link>
                <Link to="/help" className="flex items-center py-3 text-gray-700 hover:bg-gray-50 rounded-lg px-2" onClick={closeMobileMenu}>
                  <HelpCircle size={20} className="mr-3" />
                  <strong>Help Center</strong>
                </Link>
              </div>

              <div className="space-y-2">
                <Link to="/" className="block py-3 px-2 rounded hover:bg-gray-50" onClick={closeMobileMenu}>Home</Link>
                <Link to="/shop" className="block py-3 px-2 rounded hover:bg-gray-50" onClick={closeMobileMenu}>Catalog</Link>
                <Link to="/shop" className="block py-3 px-2 rounded hover:bg-gray-50" onClick={closeMobileMenu}>Products</Link>
                <Link to="/contact" className="block py-3 px-2 rounded hover:bg-gray-50" onClick={closeMobileMenu}>Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-[#d9a82e]">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-[#d9a82e]">
            <Grid3X3 size={20} />
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-[#d9a82e] relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>
          {/* <Link to="/wishlist" className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-[#d9a82e] relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{wishlist.length}</span>
            )}
            <span className="text-xs mt-1">WishList</span>
          </Link> */}
          <Link to={isAuthenticated ? "/profile" : "/login"} className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-[#d9a82e]">
            <UserCircle size={20} />
            <span className="text-xs mt-1">Account</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar

