"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { LogOut, User, ChevronDown } from "lucide-react"

const AdminHeader = ({ title }) => {
  const { admin, adminLogout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const location = useLocation()

  const deriveTitle = () => {
    if (title) return title
    const path = location.pathname || ""
    // Simple mapping for common admin routes; defaults to last segment capitalized
    const map = {
      "/admin/dashboard": "Dashboard",
      "/admin/orders": "Orders",
      "/admin/products": "Products",
      "/admin/users": "Users",
      "/admin/banners": "Banners",
    }
    if (map[path]) return map[path]
    const seg = path.split("/").filter(Boolean).pop() || "Admin"
    return seg
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
  const pageTitle = deriveTitle()

  const handleLogout = () => {
    adminLogout()
    navigate("/grabiansadmin/login")
  }

  return (
    <header className="h-20 pt-5 flex items-center justify-between px-6 ml-64 top-0 right-0 left-64 z-40">
      <div className="flex items-center">
        <h1 className="text-xl bg-white text-gray-900 px-5 py-2 rounded font-bold">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Admin User Info */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-[#2377c1] text-white hover:bg-[#1f6bad] transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-[#d9a82e]  rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{admin?.name || "Admin User"}</p>
              <p className="text-xs text-white/80">{admin?.email || "admin@grabatoz.ae"}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{admin?.name || "Admin User"}</p>
                <p className="text-xs text-gray-500">{admin?.email || "admin@grabatoz.ae"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
