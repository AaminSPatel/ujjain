"use client"
import { useState, useCallback, useRef } from "react"
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api"
import { MapPin, Navigation } from "lucide-react"

const containerStyle = {
  width: "100%",
  height: "320px",
}

const center = {
  lat: 22.7196, // Default center: Indore
  lng: 75.8577,
}

const libraries = ["places"]

function LocationMarker({ value, onChange, map }) {
  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    // Reverse geocode using Google Maps Geocoding API
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        onChange({
          address: results[0].formatted_address,
          coordinates: { lat, lng },
        })
      } else {
        console.error("Reverse geocoding failed:", status)
        onChange({
          address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
          coordinates: { lat, lng },
        })
      }
    })
  }, [onChange])

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={value.coordinates.lat !== 0 ? value.coordinates : center}
        zoom={12}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {value.coordinates.lat !== 0 && (
          <Marker
            position={value.coordinates}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="3"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40),
            }}
          />
        )}
      </GoogleMap>
    </>
  )
}

export default function MapPicker({ label, value, onChange }) {
  const [loadingLocation, setLoadingLocation] = useState(false)
  const autocompleteRef = useRef(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        // Reverse geocode the current location using Google Maps
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === "OK" && results[0]) {
            onChange({
              address: results[0].formatted_address,
              coordinates: { lat: latitude, lng: longitude },
            })
          } else {
            console.error("Reverse geocoding failed:", status)
            onChange({
              address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
              coordinates: { lat: latitude, lng: longitude },
            })
          }
          setLoadingLocation(false)
        })
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to retrieve your location")
        setLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace()
    if (place.geometry) {
      onChange({
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      })
    }
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          {label}
        </label>

        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "in" },
            }}
          >
            <input
              type="text"
              value={value.address}
              onChange={(e) => onChange({ ...value, address: e.target.value })}
              placeholder="Type address or select on map"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </Autocomplete>

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

        <div className="rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-colors shadow-sm overflow-hidden">
          <LocationMarker value={value} onChange={onChange} />
        </div>

        <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
          <span className="text-blue-600 font-semibold">Tip:</span>
          <span>Click anywhere on the map to select a location or use the current location button</span>
        </p>
      </div>
    </LoadScript>
  )
}
