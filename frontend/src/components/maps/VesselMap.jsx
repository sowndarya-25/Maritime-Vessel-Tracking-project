import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, LayerGroup } from "react-leaflet"
import api from "../../api/axios"

export default function VesselMap() {

  // Initial vessel positions (India)
  const [vessels, setVessels] = useState([
    {
      id: 1,
      name: "Mumbai Vessel",
      lat: 19.0760,
      lng: 72.8777,
      speed: 0.02
    },
    {
      id: 2,
      name: "Chennai Vessel",
      lat: 13.0827,
      lng: 80.2707,
      speed: 0.015
    },
    {
      id: 3,
      name: "Kolkata Vessel",
      lat: 22.5726,
      lng: 88.3639,
      speed: 0.01
    },
    {
      id: 4,
      name: "Kochi Vessel",
      lat: 9.9312,
      lng: 76.2673,
      speed: 0.018
    }
  ])

  const [safetyZones, setSafetyZones] = useState([])
  const [showStormZones, setShowStormZones] = useState(true)
  const [showPiracyZones, setShowPiracyZones] = useState(true)
  const [showAccidentZones, setShowAccidentZones] = useState(true)

  // Animate vessels every second
  useEffect(() => {

    const interval = setInterval(() => {

      setVessels(prev =>
        prev.map(vessel => ({

          ...vessel,

          lat: vessel.lat + (Math.random() - 0.5) * vessel.speed,
          lng: vessel.lng + (Math.random() - 0.5) * vessel.speed

        }))
      )

    }, 1000)

    return () => clearInterval(interval)

  }, [])

  // Fetch safety zones from backend (or fall back to defaults)
  useEffect(() => {

    api.get("vessels/safety/alerts/")
      .then(() => {
        // In this milestone we simulate zones on frontend;
        // backend call above validates connectivity.
      })
      .catch((err) => {
        console.error("Safety alerts endpoint not reachable yet", err)
      })

    // Static example zones for map overlays
    setSafetyZones([
      {
        id: 1,
        type: "Storm",
        lat: 18.4,
        lon: 72.2,
        radiusKm: 200,
        severity: "High"
      },
      {
        id: 2,
        type: "Piracy",
        lat: 15.5,
        lon: 70.0,
        radiusKm: 150,
        severity: "Medium"
      },
      {
        id: 3,
        type: "Accident",
        lat: 13.5,
        lon: 80.5,
        radiusKm: 100,
        severity: "Low"
      }
    ])

  }, [])

  return (

    <div className="w-full h-full min-h-[520px] rounded-lg shadow overflow-hidden">

      {/* Overlay controls */}
      <div className="bg-white/90 p-3 flex gap-4 text-sm rounded-t-lg border-b border-gray-200">
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
        zoom={5}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", minHeight: 520 }}
      >

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Safety overlays */}
        <LayerGroup>
          {safetyZones
            .filter(
              (z) =>
                z.type === "Storm" &&
                showStormZones
            )
            .map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lon]}
                radius={zone.radiusKm * 1000}
                pathOptions={{ color: "red", fillOpacity: 0.2 }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-red-600">
                      Storm Zone
                    </h3>
                    <p>Severity: {zone.severity}</p>
                    <p>Radius: {zone.radiusKm} km</p>
                  </div>
                </Popup>
              </Circle>
            ))}

          {safetyZones
            .filter(
              (z) =>
                z.type === "Piracy" &&
                showPiracyZones
            )
            .map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lon]}
                radius={zone.radiusKm * 1000}
                pathOptions={{ color: "gold", fillOpacity: 0.15 }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-yellow-600">
                      Piracy Risk Zone
                    </h3>
                    <p>Severity: {zone.severity}</p>
                    <p>Radius: {zone.radiusKm} km</p>
                  </div>
                </Popup>
              </Circle>
            ))}

          {safetyZones
            .filter(
              (z) =>
                z.type === "Accident" &&
                showAccidentZones
            )
            .map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lon]}
                radius={zone.radiusKm * 1000}
                pathOptions={{ color: "orange", fillOpacity: 0.15 }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-orange-600">
                      Accident Area
                    </h3>
                    <p>Severity: {zone.severity}</p>
                    <p>Radius: {zone.radiusKm} km</p>
                  </div>
                </Popup>
              </Circle>
            ))}
        </LayerGroup>

        {vessels.map(vessel => (

          <Marker
            key={vessel.id}
            position={[vessel.lat, vessel.lng]}
          >

            <Popup>

              <div>
                <h3 className="font-bold text-blue-600">
                  🚢 {vessel.name}
                </h3>

                <p>Latitude: {vessel.lat.toFixed(4)}</p>
                <p>Longitude: {vessel.lng.toFixed(4)}</p>

                <p className="text-green-600 font-semibold">
                  ● Moving
                </p>

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  )

}
