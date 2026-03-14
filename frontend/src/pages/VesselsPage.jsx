import { useEffect, useState, useMemo } from "react"
import vesselService from "../services/vesselService"

export default function VesselsPage() {
  const [vessels, setVessels] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      vesselService.getVessels().then((r) => r.data),
      vesselService.getSafetyAlerts().then((r) => r.data).catch(() => []),
    ])
      .then(([data, alertsData]) => {
        setVessels(Array.isArray(data) ? data : [])
        setAlerts(Array.isArray(alertsData) ? alertsData : [])
      })
      .catch((err) => {
        console.error("Failed to fetch vessels", err)
        setError("Unable to load vessels from backend.")
      })
      .finally(() => setLoading(false))
  }, [])

  const dangerSet = useMemo(
    () => new Set(alerts.map((a) => (a.vessel || "").toLowerCase())),
    [alerts]
  )

  return (

    <div className="space-y-6 max-w-6xl mx-auto">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          <span className="text-blue-700">Vessels</span> Overview
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Live list of vessels coming from the backend `vessels` service.
        </p>
      </div>

      {loading && (
        <p className="text-slate-500">
          Loading vessels...
        </p>
      )}

      {error && !loading && (
        <p className="text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && vessels.length === 0 && (
        <p className="text-slate-500">
          No vessels found.
        </p>
      )}

      {!loading && !error && vessels.length > 0 && (
        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">

          <div className="w-full overflow-x-auto px-4 pb-4">
            <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-x-4">
              <colgroup>
                <col className="w-[16%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[14%]" />
                <col className="w-[10%]" />
                <col className="w-[14%]" />
              </colgroup>

              <thead className="bg-slate-900 text-white">

                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Vessel Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    MMSI
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    IMO
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Flag
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Speed (kn)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200">

                {vessels.map((vessel, idx) => (

                  <tr
                    key={vessel.id || vessel.mmsi || idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >

                    <td className="px-6 py-4 text-base font-semibold text-slate-900 whitespace-nowrap">
                      {vessel.vessel_name}
                    </td>

                    <td className="px-6 py-4 text-base font-mono text-slate-700 whitespace-nowrap">
                      {vessel.mmsi}
                    </td>

                    <td className="px-6 py-4 text-base font-mono text-slate-700 whitespace-nowrap">
                      {vessel.imo_number}
                    </td>

                    <td className="px-6 py-4 text-base text-slate-700 whitespace-nowrap">
                      {vessel.vessel_type || "-"}
                    </td>

                    <td className="px-6 py-4 text-base text-slate-700 whitespace-nowrap">
                      {vessel.flag || "-"}
                    </td>

                    <td className="px-6 py-4 text-base text-slate-700 whitespace-nowrap">
                      {vessel.latitude?.toFixed
                        ? vessel.latitude.toFixed(3)
                        : vessel.latitude}
                      {" / "}
                      {vessel.longitude?.toFixed
                        ? vessel.longitude.toFixed(3)
                        : vessel.longitude}
                    </td>

                    <td className="px-6 py-4 text-base text-slate-700 whitespace-nowrap">
                      {vessel.speed != null ? vessel.speed : "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {dangerSet.has((vessel.vessel_name || "").toLowerCase()) ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                          DANGER
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                          SAFE
                        </span>
                      )}
                    </td>
                  </tr>

                ))}

              </tbody>

            </table>
          </div>

        </div>
      )}

    </div>
  )
}

