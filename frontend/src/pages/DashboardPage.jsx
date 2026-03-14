import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import VesselMap from "../components/maps/VesselMap"
import vesselService from "../services/vesselService"

export default function DashboardPage() {
  const user = useSelector((state) => state.auth?.user)
  const role = user?.role || "viewer"

  const [stats, setStats] = useState({
    totalVessels: 0,
    safeVessels: 0,
    dangerVessels: 0,
    activeAlerts: 0,
    loading: true,
  })

  useEffect(() => {
    let cancelled = false

    const fetchDashboardData = async () => {
      try {
        const [vesselsRes, alertsRes, analyticsRes] = await Promise.allSettled([
          vesselService.getVessels(),
          vesselService.getSafetyAlerts(),
          vesselService.getPortAnalytics(),
        ])

        if (cancelled) return

        const vessels = vesselsRes.status === "fulfilled" ? vesselsRes.value?.data ?? [] : []
        const alerts = alertsRes.status === "fulfilled" ? alertsRes.value?.data ?? [] : []
        const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value?.data ?? [] : []

        const totalVessels = Array.isArray(vessels) ? vessels.length : 0
        const alertVesselNames = new Set(
          (Array.isArray(alerts) ? alerts : []).map((a) => a.vessel?.toLowerCase?.() ?? a.vessel)
        )
        let dangerVessels = 0
        if (Array.isArray(vessels)) {
          vessels.forEach((v) => {
            const name = (v.vessel_name || v.name || "").toLowerCase()
            if (name && alertVesselNames.has(name)) dangerVessels += 1
          })
        }
        const safeVessels = Math.max(0, totalVessels - dangerVessels)
        const activeAlerts = Array.isArray(alerts) ? alerts.length : 0

        setStats({
          totalVessels,
          safeVessels,
          dangerVessels,
          activeAlerts,
          loading: false,
        })
      } catch (_) {
        if (!cancelled) {
          setStats((s) => ({ ...s, loading: false }))
        }
      }
    }

    fetchDashboardData()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="p-6 bg-slate-100 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome,{" "}
        <span className="font-semibold">{user?.username || user?.name || "Maritime User"}</span> (
        {role})
      </p>

      {/* Summary cards from backend analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white px-4 py-5 rounded-xl shadow border-l-4 border-blue-500 flex flex-col items-center justify-center text-center min-h-[92px]">
          <h2 className="font-bold text-gray-700 text-sm md:text-base leading-snug">Total Vessels</h2>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2 leading-none">
            {stats.loading ? "…" : stats.totalVessels}
          </p>
        </div>
        <div className="bg-white px-4 py-5 rounded-xl shadow border-l-4 border-green-500 flex flex-col items-center justify-center text-center min-h-[92px]">
          <h2 className="font-bold text-gray-700 text-sm md:text-base leading-snug">Safe Vessels</h2>
          <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2 leading-none">
            {stats.loading ? "…" : stats.safeVessels}
          </p>
        </div>
        <div className="bg-white px-4 py-5 rounded-xl shadow border-l-4 border-red-500 flex flex-col items-center justify-center text-center min-h-[92px]">
          <h2 className="font-bold text-gray-700 text-sm md:text-base leading-snug">Danger Vessels</h2>
          <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2 leading-none">
            {stats.loading ? "…" : stats.dangerVessels}
          </p>
        </div>
        <div className="bg-white px-4 py-5 rounded-xl shadow border-l-4 border-amber-500 flex flex-col items-center justify-center text-center min-h-[92px]">
          <h2 className="font-bold text-gray-700 text-sm md:text-base leading-snug">Active Alerts</h2>
          <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-2 leading-none">
            {stats.loading ? "…" : stats.activeAlerts}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow flex flex-col flex-1 min-h-0">
        <h2 className="text-xl font-bold mb-4">Live Vessel Tracking</h2>
        <div className="flex-1 min-h-[520px] w-full h-full">
          <VesselMap />
        </div>
      </div>
    </div>
  )
}
