import { useEffect, useState, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, LayerGroup } from "react-leaflet"
import L from "leaflet"
import vesselService from "../../services/vesselService"

const POLL_INTERVAL_MS = 30000

function createIcon(color) {
  return L.divIcon({
    className: "vessel-marker",
    html: `<div style="
      width: 20px; height: 20px; border-radius: 50%;
      background-color: ${color}; border: 2px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

const greenIcon = createIcon("#22c55e")
const redIcon = createIcon("#ef4444")

export default function VesselMap() {
  const [vessels, setVessels] = useState([])
  const [safetyZones, setSafetyZones] = useState([])
  const [safetyAlerts, setSafetyAlerts] = useState([])
  const [showStormZones, setShowStormZones] = useState(true)
  const [showPiracyZones, setShowPiracyZones] = useState(true)
  const [showAccidentZones, setShowAccidentZones] = useState(true)
  const [loading, setLoading] = useState(true)

  const dangerSet = useMemo(() => {
    const names = new Set(
      (Array.isArray(safetyAlerts) ? safetyAlerts : [])
        .map((a) => (a.vessel || "").toLowerCase())
        .filter(Boolean)
    )
    return names
  }, [safetyAlerts])

  const fetchData = () => {
    Promise.all([
      vesselService.getVessels().then((r) => r.data),
      vesselService.getSafetyZones().then((r) => r.data).catch(() => []),
      vesselService.getSafetyAlerts().then((r) => r.data).catch(() => []),
    ])
      .then(([vesselList, zones, alerts]) => {
        setVessels(Array.isArray(vesselList) ? vesselList : [])
        setSafetyZones(Array.isArray(zones) ? zones : [])
        setSafetyAlerts(Array.isArray(alerts) ? alerts : [])
      })
      .catch((err) => {
        console.error("VesselMap fetch error", err)
        setVessels([])
        setSafetyZones([])
        setSafetyAlerts([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  const zonesWithType = useMemo(() => {
    return safetyZones.map((z) => ({
      ...z,
      lat: z.latitude ?? z.lat,
      lon: z.longitude ?? z.lon,
      radiusKm: z.radius_km ?? z.radiusKm ?? 100,
      type: z.name?.toLowerCase().includes("storm")
        ? "Storm"
        : z.name?.toLowerCase().includes("piracy")
          ? "Piracy"
          : "Accident",
    }))
  }, [safetyZones])

  if (loading && vessels.length === 0) {
    return (
      <div className="w-full h-full min-h-[520px] rounded-lg bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading map and vessels…</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[520px] rounded-lg shadow overflow-hidden">
      <div className="bg-white/90 p-3 flex flex-wrap gap-4 text-sm rounded-t-lg border-b border-gray-200">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showStormZones}
            onChange={(e) => setShowStormZones(e.target.checked)}
          />
          Show Storm Zones
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPiracyZones}
            onChange={(e) => setShowPiracyZones(e.target.checked)}
          />
          Show Piracy Zones
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showAccidentZones}
            onChange={(e) => setShowAccidentZones(e.target.checked)}
          />
          Show Accident Areas
        </label>
      </div>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={4}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", minHeight: 480 }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayerGroup>
          {zonesWithType
            .filter((z) => z.type === "Storm" && showStormZones)
            .map((z, i) => (
              <Circle
                key={`storm-${z.id ?? i}`}
                center={[z.lat, z.lon]}
                radius={(z.radiusKm || 100) * 1000}
                pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.2 }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-red-600">Storm Zone</h3>
                    <p>{z.name}</p>
                    <p>Radius: {z.radiusKm} km</p>
                  </div>
                </Popup>
              </Circle>
            ))}
          {zonesWithType
            .filter((z) => z.type === "Piracy" && showPiracyZones)
            .map((z, i) => (
              <Circle
                key={`piracy-${z.id ?? i}`}
                center={[z.lat, z.lon]}
                radius={(z.radiusKm || 100) * 1000}
                pathOptions={{ color: "gold", fillColor: "gold", fillOpacity: 0.15 }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-yellow-600">Piracy Risk Zone</h3>
                    <p>{z.name}</p>
                    <p>Radius: {z.radiusKm} km</p>
                  </div>
                </Popup>
              </Circle>
            ))}
          {zonesWithType
            .filter((z) => z.type === "Accident" && showAccidentZones)
            .map((z, i) => (
              <Circle
                key={`accident-${z.id ?? i}`}
                center={[z.lat, z.lon]}
                radius={(z.radiusKm || 100) * 1000}
                pathOptions={{ color: "orange", fillColor: "orange", fillOpacity: 0.15 }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-orange-600">Accident Area</h3>
                    <p>{z.name}</p>
                    <p>Radius: {z.radiusKm} km</p>
                  </div>
                </Popup>
              </Circle>
            ))}
        </LayerGroup>

        {vessels
          .filter((v) => v.latitude != null && v.longitude != null)
          .map((vessel) => {
            const name = (vessel.vessel_name || vessel.name || "").toLowerCase()
            const isDanger = name && dangerSet.has(name)
            return (
              <Marker
                key={vessel.id ?? vessel.mmsi}
                position={[vessel.latitude, vessel.longitude]}
                icon={isDanger ? redIcon : greenIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {vessel.vessel_name || vessel.name || "Vessel"}
                    </h3>
                    <p>MMSI: {vessel.mmsi ?? "—"}</p>
                    <p>IMO: {vessel.imo_number ?? "—"}</p>
                    <p>Lat: {Number(vessel.latitude).toFixed(4)}</p>
                    <p>Lon: {Number(vessel.longitude).toFixed(4)}</p>
                    <p>Speed: {vessel.speed != null ? vessel.speed : "—"} kn</p>
                    <p
                      className={
                        isDanger ? "text-red-600 font-semibold" : "text-green-600 font-semibold"
                      }
                    >
                      ● {isDanger ? "DANGER" : "SAFE"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>
    </div>
  )
}
