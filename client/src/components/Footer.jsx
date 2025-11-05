"use client"

import { Link } from "react-router-dom"
import { Facebook, Instagram, Plus, Minus, Linkedin } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPinterest } from "@fortawesome/free-brands-svg-icons"
import { faTiktok } from "@fortawesome/free-brands-svg-icons"
import { faYoutube } from "@fortawesome/free-brands-svg-icons"
import { useState, useEffect } from "react"
import axios from "axios"
import { generateShopURL } from "../utils/urlUtils"

import config from "../config/config"
import NewsletterModal from "./NewsletterModal";

const API_BASE_URL = `${config.API_URL}`

const Footer = ({ className = "" }) => {
  // State for mobile accordion sections
  const [openSections, setOpenSections] = useState({
    categories: false,
    legal: false,
    support: false,
    connect: false,
  })
  const [categories, setCategories] = useState([])
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const [subCategories, setSubCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/categories`)
      const validCategories = data.filter((cat) => {
        const isValid =
          cat &&
          typeof cat === "object" &&
          cat.name &&
          typeof cat.name === "string" &&
          cat.name.trim() !== "" &&
          cat.isActive !== false &&
          !cat.isDeleted &&
          !cat.name.match(/^[0-9a-fA-F]{24}$/) && // Not an ID
          !cat.parentCategory // Only include parent categories
        return isValid
      })
      validCategories.sort((a, b) => a.name.localeCompare(b.name))
      setCategories(validCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/subcategories`)
      setSubCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching subcategories:", error)
    }
  }

  const getSubCategoriesForCategory = (categoryId) => {
    return subCategories.filter((sub) => sub.category?._id === categoryId)
  }

  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
  }, [])

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleNewsletterInput = (e) => setNewsletterEmail(e.target.value);
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) setShowNewsletterModal(true);
  };

  return (
    <>
      {/* Desktop Footer - Hidden on mobile */}
      <footer className={`hidden md:block bg-[#2377c1] text-white pt-8 pb-9 ${className}`}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 ml-4">
            {/* Column 1 - Newsletter Subscription */}
            <div className="md:col-span-4">
              {/* Logo and Heading */}
              <h3 className="text-2xl font-bold mb-4 w-44">
                <img src="/baitulProtein/white (2).png" alt="Logo" className="w-full h-full object-contain" />
              </h3>
              {/* Text */}
              <p className="text-white mb-2">Subscribe to our newsletter</p>
              {/* <p className="text-white/90 text-sm leading-relaxed mb-4 max-w-sm">
                Be the first to hear about new arrivals, exclusive offers, and expert tips tailored for your goals.
              </p> */}
  <ul className="mt-2 mb-4 text-white/85 text-sm space-y-2 list-disc list-inside">
                <li>Exclusive launches and limited-time deals</li>
                <li>Personalized recommendations and product guides</li>
                <li>No spam — unsubscribe anytime</li>
              </ul>
              {/* Form */}
              <form className=" p-1.5 bg-white rounded-full w-[360px]" onSubmit={handleNewsletterSubmit}>
                <div className="flex w-full">
                  {/* Search Input Div */}
                  <div className="flex-grow">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full pl-5 py-3.5 bg-white placeholder-gray-400 rounded-full border-white text-black text-base focus:outline-none focus:ring-0 focus:border-white"
                      value={newsletterEmail}
                      onChange={handleNewsletterInput}
                      required
                    />
                  </div>

                  {/* Button Div */}
                  <div>
                    <button type="submit" className="h-full bg-[#d9a82e] text-white rounded-full px-6 py-3 text-sm font-semibold">
                      Subscribe
                    </button>
                  </div>
                </div>
              </form>
              {showNewsletterModal && (
                <NewsletterModal
                  email={newsletterEmail}
                  onClose={() => setShowNewsletterModal(false)}
                />
              )}

              {/* Newsletter benefits and privacy note */}
            
  

              {/* Social Icons below subscribe - removed for a cleaner, more professional look */}

                {/* <div className="flex  pt-7 px-3 space-x-2">
              <img src="https://res.cloudinary.com/dyfhsu5v6/image/upload/v1757938965/google_pj1cxc.webp" alt="Google Play" className="rounded-lg h-12" />
            </div> */}
            </div>

            {/* Column 2 - Top Categories */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-semibold mb-4">Top Categories</h3>
              <ul className="space-y-2 text-white text-sm">
                {categories.slice(0, 6).map((category) => (
                  <li key={category._id}>
                    <Link to={generateShopURL({ parentCategory: category.name })} className="hover:text-[#d9a82e] transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
                {subCategories.slice(0, 2).map((subCategory) => (
                  <li key={`sub-${subCategory._id}`}>
                    <Link to={generateShopURL({ 
                      parentCategory: subCategory.category?.name || '', 
                      subCategory: subCategory.name 
                    })} className="hover:text-[#d9a82e] transition-colors">
                      {subCategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - More Categories */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-semibold mb-4">More Categories</h3>
              <ul className="space-y-2 text-white text-sm">
                {categories.slice(6, 14).map((category) => (
                  <li key={category._id}>
                    <Link to={generateShopURL({ parentCategory: category.name })} className="hover:text-[#d9a82e] transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
                {subCategories.slice(4, 8).map((subCategory) => (
                  <li key={`sub-${subCategory._id}`}>
                    <Link to={generateShopURL({ 
                      parentCategory: subCategory.category?.name || '', 
                      subCategory: subCategory.name 
                    })} className="hover:text-[#d9a82e] transition-colors">
                      {subCategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Support */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-white text-sm">
                <li>
                  <Link to="/refund-return" className="hover:text-[#d9a82e] transition-colors">
                    Refund and Return
                  </Link>
                </li>
                <li>
                  <Link to="/cookies-policy" className="hover:text-[#d9a82e] transition-colors">
                    Cookies Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="hover:text-[#d9a82e] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-[#d9a82e] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer-policy" className="hover:text-[#d9a82e] transition-colors">
                    Disclaimer Policy
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="hover:text-[#d9a82e] transition-colors">
                    Track Order
                  </Link>
                </li>

                <li>
                  <Link to="/voucher-terms" className="hover:text-[#d9a82e] transition-colors">
                    Voucher Terms 
                  </Link>
                </li>
             <li>
                  <Link to="/delivery-terms" className="hover:text-[#d9a82e] transition-colors">
                    Delivery Terms 
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5 - Legal */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-white text-sm">
                <li>
                  <Link to="/about" className="hover:text-[#d9a82e] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#d9a82e] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="https://blog.grabatoz.ae/"  rel="noopener noreferrer" className="hover:text-[#d9a82e] transition-colors">
  Blog
</a>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-[#d9a82e] transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#d9a82e] transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[#d9a82e] transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-[#d9a82e] transition-colors">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-[#d9a82e] transition-colors font-semibold">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Desktop Bottom Footer */}
        <section className="hidden md:block">
          <div className="bg-white border-t-2 border-[#2377c1]">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                {/* Left: Payment methods */}
                <div className="flex items-center">
                  <img src="/1.svg" alt="Payment Methods" className="h-8 w-auto" />
                </div>

                {/* Center: Social icons + Copyright */}
                <div className="flex flex-col items-center text-gray-700">
                  <div className="flex items-center justify-center space-x-4 mb-1">
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#d9a82e] transition-colors"><Facebook size={18} /></a>
                    <a href="https://x.com/GrabAtoz" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-[#d9a82e] transition-colors">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" role="img">
                        <path d="M18.25 2h3.5l-7.66 8.73L24 22h-6.87l-5.02-6.58L6.3 22H2.8l8.2-9.34L0 2h7.04l4.54 6.02L18.25 2z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#d9a82e] transition-colors"><Instagram size={18} /></a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#d9a82e] transition-colors"><Linkedin size={18} /></a>
                    <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-[#d9a82e] transition-colors"><FontAwesomeIcon icon={faPinterest} style={{ width: '16px', height: '16px' }} /></a>
                    <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-[#d9a82e] transition-colors"><FontAwesomeIcon icon={faTiktok} style={{ width: '16px', height: '16px' }} /></a>
                    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#d9a82e] transition-colors"><FontAwesomeIcon icon={faYoutube} style={{ width: '16px', height: '16px' }} /></a>
                  </div>
                  <p className="text-center text-base font-semibold text-gray-600">
                    © 2025 Baytalprotein. Developed by
                    <a href="https://techsolutionor.com" target="_blank" rel="noopener noreferrer" className="text-[#d9a82e]  text-base font-semibold"> Tech Solutionor</a>
                  </p>
                </div>

                {/* Right: Download badges */}
                <div className="flex items-center space-x-3">
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get it on Google Play"
                  >
                    <img src="/google_play.png" alt="Google Play" className="h-10 md:h-12 w-auto" />
                  </a>
                  <a
                    href="https://apps.apple.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download on the App Store"
                  >
                    <img src="/app_store.png" alt="App Store" className="h-10 md:h-12 w-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Mobile Footer - Only visible on mobile */}
      <footer className="md:hidden bg-white">
        {/* Categories Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-lg font-semibold text-gray-900">Categories</span>
            {openSections.categories ? <Minus size={20} /> : <Plus size={20} />}
          </button>
          {openSections.categories && (
            <div className="px-4 pb-4">
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link to={`/shop?parentCategory=${category._id}`} className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Legal Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("legal")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-lg font-semibold text-gray-900">Legal</span>
            {openSections.legal ? <Minus size={20} /> : <Plus size={20} />}
          </button>
          {openSections.legal && (
            <div className="px-4 pb-4">
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                   <a href="https://blog.grabatoz.ae/" rel="noopener noreferrer" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
    Blog
  </a>
                </li>
                <li>
                  <Link to="/shop" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("support")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-lg font-semibold text-gray-900">Support</span>
            {openSections.support ? <Minus size={20} /> : <Plus size={20} />}
          </button>
          {openSections.support && (
            <div className="px-4 pb-4">
              <ul className="space-y-3">
                <li>
                  <Link to="/refund-return" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Refund and Return
                  </Link>
                </li>
                <li>
                  <Link to="/cookies-policy" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Cookies Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer-policy" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Disclaimer Policy
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="text-gray-700 hover:text-[#d9a82e] transition-colors">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-gray-700 hover:text-[#d9a82e] transition-colors font-semibold">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Connect Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("connect")}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-lg font-semibold text-gray-900">Connect</span>
            {openSections.connect ? <Minus size={20} /> : <Plus size={20} />}
          </button>
          {openSections.connect && (
            <div className="px-4 pb-4">
              <div className="mb-4">
                {/* <h4 className="text-sm font-semibold text-gray-900 mb-3">Connect With Us</h4> */}
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 hover:text-[#d9a82e] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} className="text-[#1877F2] hover:text-[#d9a82e] transition-colors" />
                  </a>
                  <a
                    href="https://x.com/"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 hover:text-[#d9a82e] transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-black hover:text-[#d9a82e] transition-colors fill-current" role="img">
                      <path d="M18.25 2h3.5l-7.66 8.73L24 22h-6.87l-5.02-6.58L6.3 22H2.8l8.2-9.34L0 2h7.04l4.54 6.02L18.25 2z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 hover:text-[#d9a82e] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} className="text-[#E4405F] hover:text-[#d9a82e] transition-colors" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 hover:text-[#d9a82e] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} className="text-[#0A66C2] hover:text-[#d9a82e] transition-colors" />
                  </a>
                  <a
                    href="https://www.pinterest.com/"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 hover:text-[#d9a82e] transition-colors"
                    aria-label="Pinterest"
                  >
                    <FontAwesomeIcon icon={faPinterest} style={{width: '20px', height: '20px'}} className="text-[#E60023] hover:text-[#d9a82e] transition-colors" />
                  </a>
                  <a
                    href="https://www.tiktok.com/"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 hover:text-[#d9a82e] transition-colors"
                    aria-label="TikTok"
                  >
                    <FontAwesomeIcon icon={faTiktok} style={{width: '20px', height: '20px'}} className="text-black hover:text-[#d9a82e] transition-colors" />
                  </a>
                  <a
                    href="https://www.youtube.com/"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 hover:text-[#d9a82e] transition-colors"
                    aria-label="YouTube"
                  >
                    <FontAwesomeIcon icon={faYoutube} style={{width: '20px', height: '20px'}} className="text-[#FF0000] hover:text-[#d9a82e] transition-colors" />
                  </a>
                </div>


            
              </div>
            </div>
          )}
        </div>

        {/* Shop On The Go Section - Always Visible */}
        <div className="bg-[#2377c1] text-white p-6">
          <h3 className="text-xl font-bold text-center mb-4">Shop On The Go</h3>
          <div className="flex justify-center space-x-4 mb-6 ">
            <img src="/google_play.png" alt="Google Play" className="h-8" />
            <img src="/app_store.png" alt="App Store" className="h-8" />
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center mb-4">
            <img src="/1.svg" alt="Payment Methods" className="h-8 w-auto" />
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-300">
            <p> 2025 Grabatoz powered by Crown Excel.</p>
            <p className="mt-1">Develop By <a href="https://techsolutionor.com" target="_blank" rel="noopener noreferrer">Tech Solutionor</a></p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer