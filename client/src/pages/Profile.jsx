import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { User, Mail, Phone, LogOut, Package, ShoppingCart } from "lucide-react"

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#d9a82e] p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-900 font-bold">Manage your account settings and preferences</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: User Info */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                <div className="bg-[#2377c1] p-3 rounded-full">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                <div className="bg-[#2377c1] p-3 rounded-full">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              {user?.phone && (
                <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                  <div className="bg-[#2377c1] p-3 rounded-full">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Right: Quick Links */}
            <section>
              <div className="bg-gray-50 rounded-lg p-5 h-full flex flex-col">
                <h2 className="text-lg font-bold bg-white p-4 rounded-lg text-black mb-4">Quick Links</h2>
                <div className="flex flex-col gap-3 items-stretch md:items-end">
                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full md:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2377c1] text-white hover:bg-[#1f6aae] transition-colors"
                  >
                    <Package size={18} />
                    <span>View My Orders</span>
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full md:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2377c1] text-white hover:bg-[#1f6aae] transition-colors"
                  >
                    <ShoppingCart size={18} />
                    <span>My Cart</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
