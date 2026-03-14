import { useEffect, useState } from "react"
import { Bell, CheckCircle, AlertCircle } from "lucide-react"
import vesselService from "../services/vesselService"

const NOTIFICATIONS_POLL_MS = 15000

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNotifications = () => {
    vesselService
      .getNotifications()
      .then((r) => {
        setNotifications(Array.isArray(r.data) ? r.data : [])
        setError(null)
      })
      .catch((err) => {
        setError(err.response?.status === 401 ? "Please log in again." : "Failed to load notifications.")
        setNotifications([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, NOTIFICATIONS_POLL_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100">
          <Bell className="text-blue-600" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 text-sm">
            Alerts when vessels enter danger zones. Auto-refreshes every 15s.
          </p>
        </div>
      </div>

      {loading && notifications.length === 0 && (
        <p className="text-gray-500">Loading notifications…</p>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
          <p>No notifications yet.</p>
          <p className="text-sm mt-1">You will see alerts here when vessels trigger safety events.</p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`bg-white rounded-xl shadow border-l-4 overflow-hidden ${
                n.is_read ? "border-gray-300 opacity-90" : "border-amber-500"
              }`}
            >
              <div className="p-4">
                <p className="font-medium text-gray-800">{n.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {n.created_at && new Date(n.created_at).toLocaleString()}
                </p>
                {n.vessel_event && (
                  <p className="text-xs text-gray-400 mt-1">
                    Event: {typeof n.vessel_event === "object" ? n.vessel_event.event_type : n.vessel_event}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
