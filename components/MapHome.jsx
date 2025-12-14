"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoadScript } from "@react-google-maps/api"
import {
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api"
import { FaMap, FaChevronDown, FaLocationArrow, FaCar, FaMotorcycle, FaBus } from "react-icons/fa"
import { MdMyLocation, MdElectricRickshaw } from "react-icons/md"

// Google Maps constants
const containerStyle = {
  width: "100%",
  height: "256px",
}

const center = {
  lat: 23.1765,
  lng: 75.7885, // Ujjain coordinates
}

const libraries = ["places"]

// Icon mapping based on your schema's category field
const categoryIcons = {
  car: <FaCar className="text-2xl" />,
  cab: <FaCar className="text-2xl" />,
  bike: <FaMotorcycle className="text-2xl" />,
  bus: <FaBus className="text-2xl" />,
  e_rikshaw: <MdElectricRickshaw className="text-2xl" />,
}

// Colors mapping based on category
const categoryColors = {
  car: { color: "bg-blue-500", textColor: "text-blue-500", borderColor: "border-blue-200" },
  cab: { color: "bg-blue-500", textColor: "text-blue-500", borderColor: "border-blue-200" },
  bike: { color: "bg-green-500", textColor: "text-green-500", borderColor: "border-green-200" },
  bus: { color: "bg-purple-500", textColor: "text-purple-500", borderColor: "border-purple-200" },
  rikshaw: { color: "bg-yellow-500", textColor: "text-yellow-500", borderColor: "border-yellow-200" },
  e_rikshaw: { color: "bg-violet-500", textColor: "text-yellow-500", borderColor: "border-yellow-200" },
}

// Display names for categories
const categoryDisplayNames = {
  car: "Car",
  cab: "Cab",
  bike: "Bike",
  bus: "Bus",
  rikshaw: "Rickshaw",
  e_rikshaw: "E-Rickshaw",
}

// Custom SVG Marker icons
const createPickupIcon = () => {
  const svg = `
    <svg width="30" height="35" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Location pin - Blue for pickup -->
      <path d="M15 2C8.1 2 2.5 7.6 2.5 14.5C2.5 21.5 15 38 15 38C15 38 27.5 21.5 27.5 14.5C27.5 7.6 21.9 2 15 2Z" fill="#3B82F6"/>
      <circle cx="15" cy="14" r="6" fill="white"/>
      <text x="15" y="14" text-anchor="middle" fill="#3B82F6" font-size="8" font-weight="bold" dy=".3em">P</text>
    </svg>
  `
  
  const icon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  }

  // Only add google.maps properties if window.google exists
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    icon.scaledSize = new window.google.maps.Size(30, 35)
    icon.anchor = new window.google.maps.Point(15, 35)
  }

  return icon
}

const createDestinationIcon = () => {
  const svg = `
    <svg width="30" height="35" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Location pin - Red for destination -->
      <path d="M15 2C8.1 2 2.5 7.6 2.5 14.5C2.5 21.5 15 38 15 38C15 38 27.5 21.5 27.5 14.5C27.5 7.6 21.9 2 15 2Z" fill="#dc2626"/>
      <circle cx="15" cy="14" r="6" fill="white"/>
      <text x="15" y="14" text-anchor="middle" fill="#dc2626" font-size="8" font-weight="bold" dy=".3em">D</text>
    </svg>
  `
  
  const icon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  }

  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    icon.scaledSize = new window.google.maps.Size(30, 35)
    icon.anchor = new window.google.maps.Point(15, 35)
  }

  return icon
}

function LocationMarker({ 
  pickupCoords, 
  destinationCoords, 
  onPickupChange, 
  onDestinationChange, 
  selectionMode, 
  mapCenter,
  selectionModeActive 
}) {
  const [map, setMap] = useState(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance)
    setIsMapLoaded(true)
  }, [])

  const handleMapClick = useCallback(async (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    // Reverse geocode using Nominatim (OpenStreetMap)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      )
      const data = await response.json()
      const address = data.display_name || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
      if (selectionMode === "pickup") {
        onPickupChange({ address, coordinates: { lat, lng } })
      } else if (selectionMode === "destination") {
        onDestinationChange({ address, coordinates: { lat, lng } })
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
      if (selectionMode === "pickup") {
        onPickupChange({ address, coordinates: { lat, lng } })
      } else if (selectionMode === "destination") {
        onDestinationChange({ address, coordinates: { lat, lng } })
      }
    }
  }, [onPickupChange, onDestinationChange, selectionMode])

  // Center map when coordinates change
  useEffect(() => {
    if (map && selectionModeActive && isMapLoaded) {
      const coords = selectionMode === "pickup" && pickupCoords.lat !== 0 
        ? pickupCoords 
        : selectionMode === "destination" && destinationCoords.lat !== 0 
          ? destinationCoords 
          : null
      
      if (coords) {
        map.panTo(coords)
        map.setZoom(15) // Zoom in when selecting location
      }
    }
  }, [map, selectionMode, pickupCoords, destinationCoords, selectionModeActive, isMapLoaded])

  const createSelectionIcon = (isPickup) => {
    const color = isPickup ? "#3B82F6" : "#dc2626"
    const text = isPickup ? "P" : "D"
    
    const svg = `
      <svg width="40" height="45" viewBox="0 0 40 45" xmlns="http://www.w3.org/2000/svg">
        <!-- Animated selection pin -->
        <path d="M20 2C11.7 2 5 8.7 5 17C5 25.5 20 43 20 43C20 43 35 25.5 35 17C35 8.7 28.3 2 20 2Z" fill="${color}" opacity="0.8"/>
        <circle cx="20" cy="17" r="8" fill="white"/>
        <text x="20" y="17" text-anchor="middle" fill="${color}" font-size="10" font-weight="bold" dy=".3em">${text}</text>
        
        <!-- Pulsing ring effect -->
        <circle cx="20" cy="17" r="15" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="2,2" opacity="0.6">
          <animate attributeName="r" from="10" to="20" dur="2s" begin="0s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.8" to="0" dur="2s" begin="0s" repeatCount="indefinite"/>
        </circle>
        <circle cx="20" cy="17" r="12" fill="none" stroke="white" stroke-width="1" opacity="0.4">
          <animate attributeName="r" from="8" to="15" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `
    
    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    }

    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      icon.scaledSize = new window.google.maps.Size(40, 45)
      icon.anchor = new window.google.maps.Point(20, 45)
    }

    return icon
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={
        selectionMode === "pickup" && pickupCoords.lat !== 0
          ? pickupCoords
          : selectionMode === "destination" && destinationCoords.lat !== 0
          ? destinationCoords
          : mapCenter
      }
      zoom={13}
      onClick={selectionModeActive ? handleMapClick : undefined}
      onLoad={onLoad}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        clickableIcons: false,
      }}
    >
      {/* Pickup Marker with custom SVG */}
      {pickupCoords.lat !== 0 && (
        <Marker
          position={pickupCoords}
          icon={createPickupIcon()}
          title="Pickup Location"
          zIndex={1000}
        />
      )}

      {/* Destination Marker with custom SVG */}
      {destinationCoords.lat !== 0 && (
        <Marker
          position={destinationCoords}
          icon={createDestinationIcon()}
          title="Destination Location"
          zIndex={900}
        />
      )}

      {/* Selection Mode Indicator with animated SVG */}
      {selectionModeActive && (
        <Marker
          position={
            selectionMode === "pickup" && pickupCoords.lat !== 0
              ? pickupCoords
              : selectionMode === "destination" && destinationCoords.lat !== 0
              ? destinationCoords
              : mapCenter
          }
          icon={createSelectionIcon(selectionMode === "pickup")}
          title={`Click to set ${selectionMode === "pickup" ? "pickup" : "destination"} location`}
          zIndex={1100}
        />
      )}
    </GoogleMap>
  )
}

export default function MapPicker({ 
  pickupLocation, 
  destinationLocation, 
  onPickupChange, 
  onDestinationChange,
  selectedTransport,
  onTransportSelect,
  distance,
  calculateFare,
  onBookNow,
  getCurrentLocation,
  locationPermission,
  isLocating,
  instantVehicles = []
}) {
  const [showMap, setShowMap] = useState(false)
  const [selectionMode, setSelectionMode] = useState("pickup")
  const [selectionModeActive, setSelectionModeActive] = useState(false)
  const [pickupCoords, setPickupCoords] = useState({ lat: 0, lng: 0 })
  const [destinationCoords, setDestinationCoords] = useState({ lat: 0, lng: 0 })
  const [mapCenter, setMapCenter] = useState(center)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [transportOptions, setTransportOptions] = useState([])
  
  const pickupAutocompleteRef = useRef(null)
  const destinationAutocompleteRef = useRef(null)

  // Process instant vehicles from database
  useEffect(() => {
    if (instantVehicles && instantVehicles.length > 0) {
      const options = instantVehicles.map(vehicle => {
        const category = vehicle.category || 'car'
        const displayName = vehicle.model || categoryDisplayNames[category] || 'Vehicle'
        const icon = categoryIcons[category] || <FaCar className="text-2xl" />
        const colors = categoryColors[category] || categoryColors.car

        // Use basePrice as baseFare, fallback to pricePerDay for calculation
        const baseFare = vehicle.basePrice || vehicle.pricePerDay || 0
        const perKm = vehicle.pricePerKm || 10

        return {
          id: vehicle._id,
          name: displayName,
          icon,
          baseFare,
          perKm,
          capacity: vehicle.seats ? `${vehicle.seats} passengers` : '2-4 passengers',
          ...colors,
          category: category,
          vehicle: vehicle // Store the actual vehicle data
        }
      })

      setTransportOptions(options)

      // Set default selected transport if not already set
      if (!selectedTransport && options.length > 0) {
        onTransportSelect(options[0])
      }
    }
  }, [instantVehicles, selectedTransport, onTransportSelect])

  // Update coordinates when location changes
  useEffect(() => {
    if (pickupLocation?.coordinates?.lat !== 0 && pickupLocation?.coordinates?.lng !== 0) {
      setPickupCoords(pickupLocation.coordinates)
    }
  }, [pickupLocation])

  useEffect(() => {
    if (destinationLocation?.coordinates?.lat !== 0 && destinationLocation?.coordinates?.lng !== 0) {
      setDestinationCoords(destinationLocation.coordinates)
    }
  }, [destinationLocation])

  const handlePickupChange = (locationData) => {
    setPickupCoords(locationData.coordinates)
    onPickupChange(locationData)
  }

  const handleDestinationChange = (locationData) => {
    setDestinationCoords(locationData.coordinates)
    onDestinationChange(locationData)
  }

  const handleCurrentLocationClick = () => {
    if (getCurrentLocation) {
      getCurrentLocation()
    }
  }

  const onLoadPickup = (autocomplete) => {
    pickupAutocompleteRef.current = autocomplete
  }

  const onPlaceChangedPickup = () => {
    if (pickupAutocompleteRef.current) {
      const place = pickupAutocompleteRef.current.getPlace()
      if (place && place.geometry) {
        const address = place.formatted_address || place.name
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        handlePickupChange({ address, coordinates: { lat, lng } })
      }
    }
  }

  const onLoadDestination = (autocomplete) => {
    destinationAutocompleteRef.current = autocomplete
  }

  const onPlaceChangedDestination = () => {
    if (destinationAutocompleteRef.current) {
      const place = destinationAutocompleteRef.current.getPlace()
      if (place && place.geometry) {
        const address = place.formatted_address || place.name
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        handleDestinationChange({ address, coordinates: { lat, lng } })
      }
    }
  }

  const handleTransportSelection = (transport) => {
    console.log('maphome', transport);
    
    onTransportSelect(transport)
  }

  const handlePickupFocus = () => {
    setSelectionMode("pickup")
    setSelectionModeActive(true)
  }

  const handleDestinationFocus = () => {
    setSelectionMode("destination")
    setSelectionModeActive(true)
  }

  const handleMapToggle = () => {
    const newShowMap = !showMap
    setShowMap(newShowMap)
    
    // If showing map and selection mode is active, center on selected location
    if (newShowMap && selectionModeActive) {
      const coords = selectionMode === "pickup" && pickupCoords.lat !== 0 
        ? pickupCoords 
        : selectionMode === "destination" && destinationCoords.lat !== 0 
          ? destinationCoords 
          : mapCenter
      
      setMapCenter(coords)
    }
  }

  const handleLoadError = (error) => {
    console.error("Error loading Google Maps:", error)
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
      onLoad={() => setIsGoogleLoaded(true)}
      onError={handleLoadError}
    >
      <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
        {/* Ride Booking Interface */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1 relative">
            <div className="relative">
              {isGoogleLoaded ? (
                <Autocomplete 
                  onLoad={onLoadPickup} 
                  onPlaceChanged={onPlaceChangedPickup}
                >
                  <input
                    type="text"
                    placeholder="Current location"
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={pickupLocation?.address || ""}
                    onChange={(e) => {
                      handlePickupChange({ address: e.target.value, coordinates: { lat: 0, lng: 0 } })
                    }}
                    onFocus={handlePickupFocus}
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  placeholder="Current location"
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={pickupLocation?.address || ""}
                  onChange={(e) => {
                    handlePickupChange({ address: e.target.value, coordinates: { lat: 0, lng: 0 } })
                  }}
                  onFocus={handlePickupFocus}
                  disabled
                />
              )}
              <button
                onClick={handleCurrentLocationClick}
                disabled={isLocating || !isGoogleLoaded}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
              >
                {isLocating ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <MdMyLocation className="text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="flex-1">
            {isGoogleLoaded ? (
              <Autocomplete 
                onLoad={onLoadDestination} 
                onPlaceChanged={onPlaceChangedDestination}
              >
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={destinationLocation?.address || ""}
                  onChange={(e) => {
                    handleDestinationChange({ address: e.target.value, coordinates: { lat: 0, lng: 0 } })
                  }}
                  onFocus={handleDestinationFocus}
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                placeholder="Where to?"
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={destinationLocation?.address || ""}
                onChange={(e) => {
                  handleDestinationChange({ address: e.target.value, coordinates: { lat: 0, lng: 0 } })
                }}
                onFocus={handleDestinationFocus}
                disabled
              />
            )}
          </div>
        </div>

        {/* Map Toggle Button */}
        <button
          onClick={handleMapToggle}
          disabled={!isGoogleLoaded}
          className="w-full py-2 mb-3 rounded-lg font-medium transition-all bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaMap className="text-sm" />
          <span>{showMap ? "Hide Map" : "Select on Map"}</span>
          <FaChevronDown className={`text-xs transition-transform ${showMap ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showMap && isGoogleLoaded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              {/* Selection Mode Controls */}
              <div className="bg-blue-50 rounded-lg p-3 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {selectionModeActive 
                      ? `Select ${selectionMode === "pickup" ? "Pickup" : "Destination"} Location`
                      : "Select Location:"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectionMode("pickup")
                        setSelectionModeActive(true)
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectionMode === "pickup" && selectionModeActive
                          ? "bg-blue-500 text-white shadow-md"
                          : pickupCoords.lat !== 0
                          ? "bg-blue-100 text-blue-600 border border-blue-300"
                          : "bg-white text-blue-600 border border-blue-200"
                      }`}
                    >
                      {pickupCoords.lat !== 0 ? "📍 Pickup" : "Pickup"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectionMode("destination")
                        setSelectionModeActive(true)
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectionMode === "destination" && selectionModeActive
                          ? "bg-red-500 text-white shadow-md"
                          : destinationCoords.lat !== 0
                          ? "bg-red-100 text-red-600 border border-red-300"
                          : "bg-white text-red-600 border border-red-200"
                      }`}
                    >
                      {destinationCoords.lat !== 0 ? "📍 Destination" : "Destination"}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {selectionModeActive 
                    ? `Tap on the map to set your ${selectionMode === "pickup" ? "pickup" : "destination"} location`
                    : "Select pickup or destination above, then tap on map"}
                </p>
              </div>

              {/* Map Container */}
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                <LocationMarker
                  pickupCoords={pickupCoords}
                  destinationCoords={destinationCoords}
                  onPickupChange={handlePickupChange}
                  onDestinationChange={handleDestinationChange}
                  selectionMode={selectionMode}
                  mapCenter={mapCenter}
                  selectionModeActive={selectionModeActive}
                />
                
                {/* Current Selection Indicator */}
                {selectionModeActive && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg ${
                      selectionMode === "pickup" ? "bg-blue-500" : "bg-red-500"
                    }`}>
                      {selectionMode === "pickup" ? "📌 Selecting Pickup" : "📌 Selecting Destination"}
                    </div>
                  </div>
                )}
              </div>

              {/* Map Legend */}
              <div className="flex items-center justify-center space-x-6 mt-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <svg width="16" height="18" viewBox="0 0 30 40" className="inline-block">
                      <path d="M15 2C8.1 2 2.5 7.6 2.5 14.5C2.5 21.5 15 38 15 38C15 38 27.5 21.5 27.5 14.5C27.5 7.6 21.9 2 15 2Z" fill="#3B82F6"/>
                      <circle cx="15" cy="14" r="6" fill="white"/>
                    </svg>
                    <span className="text-gray-600">Pickup</span>
                  </div>
                  {pickupCoords.lat !== 0 && (
                    <span className="text-gray-500 text-[10px]">📍 Set</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <svg width="16" height="18" viewBox="0 0 30 40" className="inline-block">
                      <path d="M15 2C8.1 2 2.5 7.6 2.5 14.5C2.5 21.5 15 38 15 38C15 38 27.5 21.5 27.5 14.5C27.5 7.6 21.9 2 15 2Z" fill="#dc2626"/>
                      <circle cx="15" cy="14" r="6" fill="white"/>
                    </svg>
                    <span className="text-gray-600">Destination</span>
                  </div>
                  {destinationCoords.lat !== 0 && (
                    <span className="text-gray-500 text-[10px]">📍 Set</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transportation Options */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Choose your ride:</h3>
          <div className="grid grid-cols-4 gap-2">
            {transportOptions.length > 0 ? (
              transportOptions.map((transport) => (
                <motion.button
                  key={transport.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTransportSelection(transport)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedTransport?.id === transport.id
                      ? `${transport.borderColor} ${transport.color} text-white shadow-md`
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-1">{transport.icon}</div>
                    <span className="text-xs font-medium">{transport.name}</span>
                    {pickupLocation?.address && destinationLocation?.address && (
                      <span className="text-xs font-bold mt-1">
                        ₹{calculateFare ? calculateFare(transport) : 0}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))
            ) : (
              // Show loading skeleton if no vehicles
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl border-2 border-gray-200 bg-gray-100 animate-pulse"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-1 w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="h-3 w-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fare Estimate */}
        {pickupLocation?.address && destinationLocation?.address && selectedTransport && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 rounded-lg p-3 mb-3"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-gray-700 font-medium">Estimated Fare:</span>
                <span className="text-xs text-gray-500 ml-2">
                  {selectedTransport.capacity}
                </span>
              </div>
              <span className="text-orange-600 font-bold text-lg">
                ₹{calculateFare ? calculateFare(selectedTransport) : 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {selectedTransport.name} • {distance || 0}km • Approximate distance 
            </p>
            
            {/* Vehicle Info */}
            {selectedTransport.vehicle && (
              <div className="flex items-center space-x-1 mt-2 pt-2 border-t border-orange-100">
                <span className="text-xs text-gray-600">
                  {selectedTransport.vehicle.model || selectedTransport.name} - {selectedTransport.vehicle.seats || '2-4'} passengers
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Book Now Button */}
        <button
          onClick={onBookNow}
          disabled={!pickupLocation?.address || !destinationLocation?.address || !selectedTransport || transportOptions.length === 0}
          className={`w-full py-3 capitalize rounded-lg font-semibold transition-all ${
            pickupLocation?.address && destinationLocation?.address && selectedTransport && transportOptions.length > 0
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {!pickupLocation?.address && !destinationLocation?.address
            ? "Enter Locations"
            : !pickupLocation?.address
            ? "Enter Pickup"
            : !destinationLocation?.address
            ? "Enter Destination"
            : transportOptions.length === 0
            ? "No Instant Vehicles Available"
            : selectedTransport
            ? `Book ${selectedTransport?.name || 'Vehicle'}`
            : "Select Vehicle"}
        </button>
      </div>
    </LoadScript>
  )
}