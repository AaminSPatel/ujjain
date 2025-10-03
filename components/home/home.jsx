"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaCar,
  FaStar,
  FaPhone,
  FaFilter,
  FaChevronDown,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaLocationArrow,
  FaMap,
} from "react-icons/fa"
import { MdPlace, MdHotel, MdMyLocation } from "react-icons/md"
import { BiTab } from "react-icons/bi"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useUjjain } from "../context/UjjainContext"
import Link from "next/link"

// Fix default marker issue in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Custom blue marker for pickup
const PickupIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="width: 10px; height: 10px; background: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);"></div></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

// Custom red marker for destination
const DestinationIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color: #EF4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="width: 10px; height: 10px; background: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);"></div></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

L.Marker.prototype.options.icon = DefaultIcon

// Map interaction component
function LocationMarker({ pickupCoords, destinationCoords, onPickupChange, onDestinationChange, selectionMode }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        const address = data.display_name || `Lat: ${lat}, Lng: ${lng}`

        if (selectionMode === "pickup") {
          onPickupChange({ address, coordinates: { lat, lng } })
        } else if (selectionMode === "destination") {
          onDestinationChange({ address, coordinates: { lat, lng } })
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error)
        const address = `Lat: ${lat}, Lng: ${lng}`
        if (selectionMode === "pickup") {
          onPickupChange({ address, coordinates: { lat, lng } })
        } else if (selectionMode === "destination") {
          onDestinationChange({ address, coordinates: { lat, lng } })
        }
      }
    },
  })

  return (
    <>
      {pickupCoords.lat !== 0 && <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PickupIcon} />}
      {destinationCoords.lat !== 0 && (
        <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={DestinationIcon} />
      )}
    </>
  )
}

// Loading Skeleton Components
const LoadingCard = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
    className="bg-card md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border"
  >
    <div className="w-full h-20 md:h-48 bg-gray-300 animate-pulse"></div>
    <div className="md:p-6 p-1">
      <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-300 rounded mb-3 animate-pulse"></div>
      <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
      <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
    </div>
  </motion.div>
)

const LoadingReview = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
    className="bg-muted/30 rounded-xl p-4 md:p-6 border border-border"
  >
    <div className="flex items-start space-x-3 md:space-x-4">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  </motion.div>
)

const LoadingSearchResult = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
    className="bg-card rounded-xl p-4 shadow-sm border border-border"
  >
    <div className="flex items-start space-x-4">
      <div className="w-20 h-20 bg-gray-300 rounded-lg animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  </motion.div>
)

export default function MobileHome() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("cars")
  const [showFilters, setShowFilters] = useState(false)
  const [budget, setBudget] = useState([0, 5000])
  const [passengers, setPassengers] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Location states
  const [currentLocation, setCurrentLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationPermission, setLocationPermission] = useState(false)

  const [showMap, setShowMap] = useState(false)
  const [selectionMode, setSelectionMode] = useState("pickup") // 'pickup' or 'destination'
  const [pickupCoords, setPickupCoords] = useState({ lat: 0, lng: 0 })
  const [destinationCoords, setDestinationCoords] = useState({ lat: 0, lng: 0 })
  const [mapCenter, setMapCenter] = useState([23.1765, 75.7885]) // Ujjain coordinates

  const { cars, places, hotels, reviews, getAverageRating } = useUjjain()

  const pickupInputRef = useRef(null)
  const destinationInputRef = useRef(null)

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = initializeAutocomplete
        document.head.appendChild(script)
      } else {
        initializeAutocomplete()
      }
    }

    loadGoogleMaps()
  }, [])

  const initializeAutocomplete = () => {
    if (window.google && pickupInputRef.current && destinationInputRef.current) {
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "in" },
      })

      const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInputRef.current, {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "in" },
      })

      pickupAutocomplete.addListener("place_changed", () => {
        const place = pickupAutocomplete.getPlace()
        setCurrentLocation(place.formatted_address || "")
        if (place.geometry) {
          setPickupCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          })
        }
      })

      destinationAutocomplete.addListener("place_changed", () => {
        const place = destinationAutocomplete.getPlace()
        setDestination(place.formatted_address || "")
        if (place.geometry) {
          setDestinationCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          })
        }
      })
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        setPickupCoords({ lat: latitude, lng: longitude })
        setMapCenter([latitude, longitude])

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          )
          const data = await response.json()

          if (data.display_name) {
            setCurrentLocation(data.display_name)
            setLocationPermission(true)
          }
        } catch (error) {
          console.error("Error getting address:", error)
          setCurrentLocation(`Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        }

        setIsLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setIsLocating(false)
        alert("Unable to get your location. Please enable location permissions.")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const handlePickupChange = (locationData) => {
    setCurrentLocation(locationData.address)
    setPickupCoords(locationData.coordinates)
  }

  const handleDestinationChange = (locationData) => {
    setDestination(locationData.address)
    setDestinationCoords(locationData.coordinates)
  }

  const calculateFare = () => {
    const baseFare = 40
    const perKm = 12
    const estimatedDistance = 5
    return baseFare + estimatedDistance * perKm
  }

  const getFilteredResults = () => {
    if (!searchTerm) return []

    const allResults = [
      ...cars.map((item) => ({ ...item, type: "car" })),
      ...hotels.map((item) => ({ ...item, type: "hotel" })),
      ...places.map((item) => ({ ...item, type: "place" })),
    ]

    return allResults
      .filter((item) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          item?.model?.toLowerCase().includes(searchLower) ||
          item?.name?.toLowerCase().includes(searchLower) ||
          item?.title?.toLowerCase().includes(searchLower) ||
          item?.keywords?.some((keyword) => keyword.toLowerCase().includes(searchLower)) ||
          item?.description?.toLowerCase().includes(searchLower) ||
          item?.location?.toLowerCase().includes(searchLower)
        )
      })
      .filter((item) => {
        if (!budget) return true
        const price = Number.parseInt(item.pricePerDay) || Number.parseInt(item.price) || 0
        return price >= budget[0] && price <= budget[1]
      })
      .filter((item) => {
        if (!passengers || item.type !== "car") return true
        const seats = item.seats || 0
        if (passengers === "2") return seats <= 2
        if (passengers === "4") return seats <= 4
        if (passengers === "6") return seats >= 6
        return true
      })
      .slice(0, 8)
  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    if (searchTerm) {
      if (tabId === "cars") {
        setFilteredResults(getFilteredResults())
      } else {
        const filtered = getFilteredResults().filter((item) => item.type === tabId.slice(0, -1))
        setFilteredResults(filtered)
      }
    }
  }

  const stats = [
    { value: "100+", details: "Places Traveled" },
    { value: "500+", details: "Happy Pilgrims" },
    { value: "50+", details: "Cars Added" },
  ]

  const tabs = [
    { id: "cars", label: "Cars", icon: <FaCar /> },
    { id: "hotels", label: "Hotels", icon: <MdHotel /> },
    { id: "places", label: "Places", icon: <MdPlace /> },
    { id: "tours", label: "Tours", icon: <BiTab /> },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const parseNumber = (val) => {
    if (val == null) return 0
    if (typeof val === "number") return val
    const cleaned = String(val).replace(/[^\d.-]/g, "")
    return Number(cleaned) || 0
  }

  useEffect(() => {
    if (searchTerm) {
      const results = getFilteredResults()
      if (activeTab !== "cars") {
        setFilteredResults(results.filter((i) => i.type === activeTab.slice(0, -1)))
      } else {
        setFilteredResults(results)
      }
    } else {
      setFilteredResults([])
    }
  }, [searchTerm, activeTab, budget, passengers, cars, hotels, places])

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section with Map Picker */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Explore Ujjain</h1>
          <p className="text-orange-100 mb-6">Your spiritual journey begins here</p>

          {/* Ride Booking Interface */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 relative">
                <input
                  ref={pickupInputRef}
                  type="text"
                  placeholder="Current location"
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  onFocus={() => setSelectionMode("pickup")}
                />
                <button
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                >
                  {isLocating ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MdMyLocation className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <input
                  ref={destinationInputRef}
                  type="text"
                  placeholder="Where to?"
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setSelectionMode("destination")}
                />
              </div>
            </div>

            <button
              onClick={() => setShowMap(!showMap)}
              className="w-full py-2 mb-3 rounded-lg font-medium transition-all bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 flex items-center justify-center space-x-2"
            >
              <FaMap className="text-sm" />
              <span>{showMap ? "Hide Map" : "Select on Map"}</span>
              <FaChevronDown className={`text-xs transition-transform ${showMap ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="bg-blue-50 rounded-lg p-3 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Select Location:</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectionMode("pickup")}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            selectionMode === "pickup"
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-white text-blue-600 border border-blue-200"
                          }`}
                        >
                          Pickup
                        </button>
                        <button
                          onClick={() => setSelectionMode("destination")}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            selectionMode === "destination"
                              ? "bg-red-500 text-white shadow-md"
                              : "bg-white text-red-600 border border-red-200"
                          }`}
                        >
                          Destination
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      Tap on the map to set your {selectionMode === "pickup" ? "pickup" : "destination"} location
                    </p>
                  </div>

                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    className="h-64 w-full rounded-xl border-2 border-blue-200 shadow-md"
                    style={{ zIndex: 1 }}
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                      pickupCoords={pickupCoords}
                      destinationCoords={destinationCoords}
                      onPickupChange={handlePickupChange}
                      onDestinationChange={handleDestinationChange}
                      selectionMode={selectionMode}
                    />
                  </MapContainer>

                  {/* Map Legend */}
                  <div className="flex items-center justify-center space-x-4 mt-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                      <span className="text-gray-600">Pickup</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow"></div>
                      <span className="text-gray-600">Destination</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {currentLocation && destination && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 rounded-lg p-3 mb-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Estimated Fare:</span>
                  <span className="text-orange-600 font-bold text-lg">₹{calculateFare()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Approximate cost for this trip</p>
              </motion.div>
            )}

            <button
              onClick={() => {
                if (currentLocation && destination) {
                  alert(`Booking ride from ${currentLocation} to ${destination}`)
                } else {
                  alert("Please enter both pickup and destination locations")
                }
              }}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                currentLocation && destination
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentLocation && destination ? "Book Ride" : "Enter Locations"}
            </button>
          </div>

          {/* Quick Location Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["Mahakal Temple", "Ram Ghat", "Ujjain Railway Station", "Airport"].map((place) => (
              <button
                key={place}
                onClick={() => setDestination(place)}
                className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
              >
                {place}
              </button>
            ))}
          </div>

          {/* Location Permission Status */}
          {locationPermission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-sm bg-white/20 backdrop-blur-sm p-2 rounded-lg"
            >
              <FaLocationArrow className="text-green-400" />
              <span>Location access granted</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex justify-around mt-4 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-orange-500 border-b-2 border-orange-500" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-sm text-muted-foreground"
        >
          <FaFilter />
          <span>Filters</span>
          <FaChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Budget Range: ₹{budget[0]} - ₹{budget[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={budget[0]}
                  onChange={(e) => setBudget([Number.parseInt(e.target.value), budget[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={budget[1]}
                  onChange={(e) => setBudget([budget[0], Number.parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹10,000</span>
              </div>
            </div>

            {activeTab === "cars" && (
              <div>
                <label className="block text-sm font-medium mb-2">Passengers</label>
                <div className="flex space-x-2">
                  {["2", "4", "6", "Any"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setPassengers(option === "Any" ? "" : option)}
                      className={`flex-1 py-2 rounded-lg border transition-colors ${
                        passengers === (option === "Any" ? "" : option)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-card border-border text-muted-foreground"
                      }`}
                    >
                      {option === "Any" ? "Any" : `${option}+`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {searchTerm && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 py-6 max-w-6xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((item) => (
                <motion.div
                  key={`${item.type}-${item._id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image?.url || item.images?.[0]?.url || "/placeholder.svg"}
                      alt={item.model || item.name || item.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate">
                        {item.model || item.name || item.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <FaStar className="text-orange-500 text-sm mr-1" />
                        <span className="text-sm text-muted-foreground">{getAverageRating(item?.reviews)}</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground capitalize">{item.type}</span>
                      </div>
                      {(item.price || item.pricePerDay || item.entryFee) && (
                        <div className="text-orange-600 font-bold mt-2">
                          <FaRupeeSign className="inline mr-1 text-xs" />
                          {parseNumber(item.pricePerDay ?? item.price ?? item.entryFee)}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="md:px-4 px-2 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Popular Car Rentals</h2>
          <Link href={"/cars"}>
            <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
              <FaArrowRight />
            </button>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
            : cars.slice(0, 6).map((car, index) => (
                <motion.div
                  key={car._id}
                  variants={itemVariants}
                  className="bg-card md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={car.images?.[0]?.url || car.image?.url || "/placeholder.svg" || "/placeholder.svg"}
                    alt={car.model}
                    className="w-full h-20 md:h-48 md:object-cover object-contain"
                  />
                  <div className="md:p-6 p-1">
                    <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                      {car.model}
                    </h3>
                    <div className="flex items-center md:mb-3 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`md:text-sm text-xs ${
                              i < Math.floor(getAverageRating(car.reviews)) ? "text-orange-500" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">{getAverageRating(car.reviews)}</span>
                    </div>
                    <div className="flex items-center justify-between md:mb-4 mb-1">
                      <div>
                        <div className="md:text-2xl text-gray-700 text-sm md:font-bold font-semibold text-card-foreground flex items-center">
                          <FaRupeeSign className="text-xs md:text-base" /> {car.pricePerDay}
                        </div>
                        <div className="text-sm text-muted-foreground hidden md:block">per day</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-sm text-muted-foreground">
                          {car.seats} seats • {car.fueltype}
                        </div>
                        <div className="text-sm text-muted-foreground">{car.geartype}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Link href={`/booking?car=${car._id}`}>
                        <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </div>

      <div className="md:px-4 px-2 py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Top Hotels</h2>
            <Link href={"/hotels"}>
              <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                <FaArrowRight />
              </button>
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4"
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
              : hotels.slice(0, 6).map((hotel) => (
                  <motion.div
                    key={hotel._id}
                    variants={itemVariants}
                    className="bg-card md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={hotel.images?.[0]?.url || hotel.image?.url || "/placeholder.svg" || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-20 md:h-48 rounded-md object-cover text-xs"
                    />
                    <div className="md:p-6 p-1">
                      <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center md:mb-3 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`md:text-sm text-[9px] ${
                                i < Math.floor(getAverageRating(hotel.reviews)) ? "text-orange-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="md:text-sm text-xs text-muted-foreground capitalize ml-1">
                          {hotel.category}
                        </span>
                      </div>
                      <div className="flex items-center md:mb-4 mb-1">
                        <FaMapMarkerAlt className="text-muted-foreground mr-1 text-xs md:text-sm" />
                        <span className="text-xs md:text-sm text-muted-foreground line-clamp-1">{hotel.location}</span>
                      </div>
                      <div className="flex items-center justify-between md:mb-4 mb-1">
                        <div>
                          <div className="md:text-2xl text-gray-700 text-sm md:font-bold font-semibold flex items-center">
                            <FaRupeeSign className="text-xs md:text-base" /> {hotel.price}
                          </div>
                          <div className="text-sm text-muted-foreground hidden md:block">per night</div>
                        </div>
                        <div className="hidden md:flex items-start gap-0.5">
                          {hotel.amenities.slice(0, 3).map((item, index) => (
                            <span
                              key={index}
                              className="text-xs px-1 py-0.5 whitespace-nowrap bg-sky-300 rounded-full flex items-center justify-center"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <Link href={`/booking?hotel=${hotel._id}`}>
                          <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base">
                            Book Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </div>

      <div className="md:px-4 px-2 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Sacred Places to Visit</h2>
          <Link href={"/places"}>
            <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
              <FaArrowRight />
            </button>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center items-center flex-wrap md:grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
          ) : (
            <>
              <div className="bg-card md:hidden md:rounded-xl flex max-w-[100%] rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow">
                <img
                  src={places[0]?.images?.[0]?.url || places[0]?.image?.url || "/placeholder.svg" || "/placeholder.svg"}
                  alt={places[0]?.title}
                  className="max-w-[50%] h-48 md:object-cover object-cover rounded-md"
                />
                <div className="md:p-6 p-5 flex flex-col justify-between">
                  <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                    {places[0]?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground md:mb-4 mb-1 line-clamp-2 flex items-start gap-1">
                    <FaMapMarkerAlt className="mt-1 text-amber-600" />
                    {places[0]?.location}
                  </p>
                  <p className="text-xs text-muted-foreground md:mb-4 mb-1 line-clamp-4">{places[0]?.description}</p>
                  <div className="flex items-center md:mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`md:text-sm text-xs ${
                            i < Math.floor(getAverageRating(places[0]?.reviews)) ? "text-orange-500" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">{getAverageRating(places[0]?.reviews)}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Link href={`/places/${places[0]?._id}`}>
                      <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base w-full">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              {places?.slice(0, 6).map((place) => (
                <motion.div
                  key={place?._id}
                  variants={itemVariants}
                  className="bg-card w-[31%] md:w-auto md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={place?.images?.[0]?.url || place?.image?.url || "/placeholder.svg" || "/placeholder.svg"}
                    alt={place?.title}
                    className="w-full h-20 md:h-48 md:object-cover object-cover rounded-md"
                  />
                  <div className="md:p-6 p-1">
                    <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                      {place?.title}
                    </h3>
                    <div className="flex items-center md:mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`md:text-sm text-xs ${
                              i < Math.floor(getAverageRating(place.reviews)) ? "text-orange-500" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">{getAverageRating(place.reviews)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground md:mb-4 mb-1 line-clamp-2">{place.description}</p>
                    <div className="flex items-center justify-center">
                      <Link href={`/places/${place._id}`}>
                        <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base w-full">
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </div>

      <div className="md:px-4 px-2 py-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">What Travelers Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto hidden md:block">
              Read reviews from pilgrims who experienced Ujjain with our services
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => <LoadingReview key={index} />)
              : reviews.slice(0, 6).map((review) => (
                  <motion.div
                    key={review._id}
                    variants={itemVariants}
                    className="bg-muted/30 rounded-xl p-4 md:p-6 border border-border"
                  >
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm md:text-lg">
                          {review?.user?.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <h4 className="font-bold text-card-foreground text-sm md:text-base line-clamp-1">
                            {review?.user?.fullName || "User"}
                          </h4>
                        </div>
                        <div className="flex items-center mb-2 md:mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-orange-500 ${
                                  i < review.rating ? "text-orange-500" : "text-muted"
                                } text-xs md:text-sm`}
                              />
                            ))}
                          </div>
                          <span className="text-xs md:text-sm text-muted-foreground ml-2 line-clamp-1">
                            {review.location || "Ujjain"}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs md:text-sm line-clamp-3">"{review.comment}"</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <img
                          src={
                            review.reviewedItem?.images?.[0]?.url ||
                            review?.reviewedItem?.image?.url ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={
                            review.reviewedItem?.model ||
                            review.reviewedItem?.name ||
                            review.reviewedItem?.title ||
                            review.reviewedItem?.serviceName ||
                            "Review item"
                          }
                          className="h-18 w-18 text-xs rounded-md"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-orange-500 text-white py-4 md:py-6 px-4"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left space-y-2 md:space-y-0 md:space-x-6">
          <div className="flex items-center">
            <FaPhone className="text-lg md:text-2xl animate-pulse mr-2 md:mr-3" />
            <div>
              <div className="text-sm md:text-lg font-semibold">24/7 Help Available</div>
              <div className="text-white/90 text-xs md:text-base">Call: +91-9876543210</div>
            </div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-base md:text-xl mr-2 md:mr-3" />
            <div>
              <div className="font-semibold text-sm md:text-base">Book Your Journey</div>
              <div className="text-white/90 text-xs md:text-base">Plan your spiritual trip today</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
