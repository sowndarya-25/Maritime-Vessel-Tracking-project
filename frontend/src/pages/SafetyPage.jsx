import React, { useEffect, useState } from "react"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Ship,
  Activity,
  MapPin,
} from "lucide-react"
import vesselService from "../services/vesselService"

export default function SafetyPage() {
  const [zones, setZones] = useState([])
  const [alerts, setAlerts] = useState([])
  const [vessels, setVessels] = useState([])
  const [loadingZones, setLoadingZones] = useState(true)
  const [loadingAlerts, setLoadingAlerts] = useState(true)

  useEffect(() => {
    vesselService
      .getSafetyZones()
      .then((r) => setZones(Array.isArray(r.data) ? r.data : []))
      .catch(() => setZones([]))
      .finally(() => setLoadingZones(false))
  }, [])

  useEffect(() => {
    setLoadingAlerts(true)
    Promise.all([
      vesselService.getSafetyAlerts().then((r) => r.data).catch(() => []),
      vesselService.getVessels().then((r) => r.data).catch(() => []),
    ])
      .then(([alertsData, vesselsData]) => {
        setAlerts(Array.isArray(alertsData) ? alertsData : [])
        setVessels(Array.isArray(vesselsData) ? vesselsData : [])
      })
      .finally(() => setLoadingAlerts(false))
  }, [])

  const dangerSet = new Set(alerts.map((a) => (a.vessel || "").toLowerCase()))
  const dangerCount = vessels.filter((v) =>
    dangerSet.has((v.vessel_name || "").toLowerCase())
  ).length
  const safeCount = Math.max(0, vessels.length - dangerCount)

  const safetyStats = [
    {
      title: "Total Vessels Monitored",
      value: vessels.length,
      icon: Ship,
      color: "bg-blue-500",
    },
    {
      title: "Active Alerts",
      value: alerts.length,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "Safe Vessels",
      value: safeCount,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Vessels in Danger",
      value: dangerCount,
      icon: Shield,
      color: "bg-amber-500",
    },
  ]

  const getSeverityColor = (severity) => {
    if (severity === "High") return "text-red-600 bg-red-100"
    if (severity === "Medium") return "text-yellow-600 bg-yellow-100"
    return "text-green-600 bg-green-100"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Safety Monitoring</h1>
        <p className="text-gray-500">
          Monitor vessel safety, alerts, and risk zones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {safetyStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h2 className="text-xl font-bold mt-1">{stat.value}</h2>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="text-white" size={22} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Safety Zones List */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Safety Zones
        </h2>
        {loadingZones && (
          <p className="text-gray-500 text-sm">Loading zones…</p>
        )}
        {!loadingZones && zones.length === 0 && (
          <p className="text-gray-500 text-sm">No safety zones configured.</p>
        )}
        {!loadingZones && zones.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-600 text-sm">
                  <th className="py-3">Name</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Radius (km)</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{zone.name}</td>
                    <td>{zone.latitude}</td>
                    <td>{zone.longitude}</td>
                    <td>{zone.radius_km}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live Risk Alerts */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} />
          Live Risk Alerts
        </h2>
        {loadingAlerts && (
          <p className="text-gray-500 text-sm">Loading alerts…</p>
        )}
        {!loadingAlerts && alerts.length === 0 && (
          <p className="text-gray-500 text-sm">No active risk alerts.</p>
        )}
        {!loadingAlerts && alerts.length > 0 && (
          <ul className="space-y-2">
            {alerts.map((alert, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between border rounded-lg px-3 py-2 bg-slate-50"
              >
                <div>
                  <p className="font-semibold">Vessel: {alert.vessel}</p>
                  <p className="text-sm text-gray-600">Risk: {alert.risk || alert.zone}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                    alert.severity || "High"
                  )}`}
                >
                  {alert.severity || "High"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
