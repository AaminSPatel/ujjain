"use client"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useState } from "react"
import { MapPin, Navigation } from "lucide-react"

// Fix default marker issue in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})
L.Marker.prototype.options.icon = DefaultIcon

function LocationMarker({ value, onChange }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng

      // Call Nominatim Reverse Geocoding API
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()

        onChange({
          address: data.display_name || `Lat: ${lat}, Lng: ${lng}`,
          coordinates: { lat, lng },
        })
      } catch (error) {
        console.error("Reverse geocoding failed:", error)
        onChange({
          address: `Lat: ${lat}, Lng: ${lng}`,
          coordinates: { lat, lng },
        })
      }
    },
  })

  return value.coordinates.lat !== 0 ? <Marker position={[value.coordinates.lat, value.coordinates.lng]} /> : null
}

export default function MapPicker({ label, value, onChange }) {
  const [position, setPosition] = useState([22.7196, 75.8577]) // Default center: Indore
  const [loadingLocation, setLoadingLocation] = useState(false)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Update map center
        setPosition([latitude, longitude])

        // Reverse geocode the current location
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          )
          const data = await res.json()

          onChange({
            address: data.display_name || `Lat: ${latitude}, Lng: ${longitude}`,
            coordinates: { lat: latitude, lng: longitude },
          })
        } catch (error) {
          console.error("Reverse geocoding failed:", error)
          onChange({
            address: `Lat: ${latitude}, Lng: ${longitude}`,
            coordinates: { lat: latitude, lng: longitude },
          })
        }
        setLoadingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to retrieve your location")
        setLoadingLocation(false)
      },
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          placeholder="Type address or select on map"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />

        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loadingLocation}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed whitespace-nowrap text-sm sm:text-base font-medium shadow-sm"
        >
          <Navigation className={`w-4 h-4 ${loadingLocation ? "animate-spin" : ""}`} />
          {loadingLocation ? "Getting..." : "Current Location"}
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={12}
        className="h-64 sm:h-72 md:h-80 w-full rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-colors shadow-sm"
        key={`${position[0]}-${position[1]}`}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker value={value} onChange={onChange} />
      </MapContainer>

      <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
        <span className="text-blue-600 font-semibold">Tip:</span>
        <span>Click anywhere on the map to select a location or use the current location button</span>
      </p>
    </div>
  )
}
