import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

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

  return (

    <div className="w-full h-full min-h-[520px] rounded-lg shadow overflow-hidden">

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
