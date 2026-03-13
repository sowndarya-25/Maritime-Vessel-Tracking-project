import React, { useEffect, useState } from "react"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Ship,
  Activity
} from "lucide-react"
import api from "../api/axios"

export default function SafetyPage() {

  // Dummy safety data (replace later with API)
  const safetyStats = [
    {
      title: "Total Vessels Monitored",
      value: "128",
      icon: Ship,
      color: "bg-blue-500"
    },
    {
      title: "Active Alerts",
      value: "6",
      icon: AlertTriangle,
      color: "bg-red-500"
    },
    {
      title: "Safe Vessels",
      value: "110",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Risk Level",
      value: "Moderate",
      icon: Shield,
      color: "bg-yellow-500"
    }
  ]

  const alerts = [
    {
      id: 1,
      vessel: "MV Ocean Star",
      type: "Speed Violation",
      location: "Chennai Port",
      severity: "High",
      time: "10 min ago"
    },
    {
      id: 2,
      vessel: "MT Blue Whale",
      type: "Restricted Area Entry",
      location: "Mumbai Port",
      severity: "Medium",
      time: "25 min ago"
    },
    {
      id: 3,
      vessel: "MV Sea Explorer",
      type: "Signal Lost",
      location: "Kolkata Port",
      severity: "Low",
      time: "1 hr ago"
    }
  ]

  const [riskAlerts, setRiskAlerts] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(false)

  useEffect(() => {

    setLoadingAlerts(true)

    api.get("vessels/safety/alerts/")
      .then((res) => {
        setRiskAlerts(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => {
        console.error("Failed to load live safety alerts from backend", err)
      })
      .finally(() => {
        setLoadingAlerts(false)
      })

  }, [])

  const getSeverityColor = (severity) => {
    if (severity === "High") return "text-red-600 bg-red-100"
    if (severity === "Medium") return "text-yellow-600 bg-yellow-100"
    return "text-green-600 bg-green-100"
  }

  return (
    <div className="p-6 space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Safety Monitoring
        </h1>
        <p className="text-gray-500">
          Monitor vessel safety, alerts, and risk levels
        </p>
      </div>

      {/* Safety Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {safetyStats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">
                  {stat.title}
                </p>

                <h2 className="text-xl font-bold mt-1">
                  {stat.value}
                </h2>
              </div>

              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="text-white" size={22} />
              </div>
            </div>
          )
        })}

      </div>

      {/* Alerts Table */}
      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} />
          Recent Safety Alerts
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b text-gray-600 text-sm">
                <th className="py-3">Vessel</th>
                <th>Alert Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>

              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b hover:bg-gray-50">

                  <td className="py-3 font-medium">
                    {alert.vessel}
                  </td>

                  <td>
                    {alert.type}
                  </td>

                  <td>
                    {alert.location}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td className="text-gray-500 text-sm">
                    {alert.time}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Live backend-driven risk alerts */}
      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} />
          Live Risk Alerts (Backend)
        </h2>

        {loadingAlerts && (
          <p className="text-gray-500 text-sm">
            Loading alerts from backend...
          </p>
        )}

        {!loadingAlerts && riskAlerts.length === 0 && (
          <p className="text-gray-500 text-sm">
            No active risk alerts from backend.
          </p>
        )}

        {!loadingAlerts && riskAlerts.length > 0 && (
          <ul className="space-y-2">
            {riskAlerts.map((alert, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between border rounded-lg px-3 py-2 bg-slate-50"
              >
                <div>
                  <p className="font-semibold">
                    Vessel: {alert.vessel}
                  </p>
                  <p className="text-sm text-gray-600">
                    Risk: {alert.risk || alert.zone}
                  </p>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
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
