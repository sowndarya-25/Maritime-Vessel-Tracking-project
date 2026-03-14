import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Bell, User, LogOut, Home } from "lucide-react"
import { logout } from "../../stores/slices/authSlice"

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth?.user)
  const [open, setOpen] = useState(false)

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard"
      case "/home":
        return "Home"
      case "/admin":
        return "Admin Panel"
      case "/tracking":
        return "Live Tracking"
      case "/vessels":
        return "Vessels"
      case "/notifications":
        return "Notifications"
      case "/alerts":
        return "Alerts"
      case "/analytics":
        return "Port Analytics"
      case "/safety":
        return "Safety Zones"
      case "/voyages":
        return "Voyage History"
      case "/profile":
        return "Profile"
      case "/reports":
        return "Reports"
      case "/settings":
        return "Settings"
      default:
        return "Maritime Platform"
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    dispatch(logout())
    navigate("/")
  }

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">

      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800">
        {getTitle()}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">
        {/* ✅ Home Icon */}
        <div
          onClick={() => navigate("/home")}
          className="cursor-pointer p-2 rounded-full hover:bg-blue-100"
          title="Home"
        >
          <Home size={20} className="text-gray-600 hover:text-blue-600" />
        </div>

        {/* Notification Icon */}
<div
  onClick={() => navigate("/notifications")}
  className="relative cursor-pointer p-2 rounded-full hover:bg-blue-100"
  title="Notifications"
>
  <Bell size={20} className="text-gray-600 hover:text-blue-600" />
  </div>

        {/* Profile */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="text-sm text-gray-700">{user?.username || "User"}</span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-40 bg-white shadow-lg rounded border">
            <button
              onClick={() => navigate("/admin")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Admin Panel
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600 flex items-center gap-2"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
