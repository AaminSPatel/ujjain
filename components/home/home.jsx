"use client"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  FaCar,
  FaStar,
  FaPhone,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaFilter,
  FaChevronDown,
  FaLocationArrow,
  FaMotorcycle,
  FaBus,
} from "react-icons/fa"
import { MdPlace, MdHotel, MdElectricRickshaw } from "react-icons/md"
import { BiTab } from "react-icons/bi"
import { useUjjain } from "../context/UjjainContext"
import Link from "next/link"
import { haversineDistance } from "@/components/utils/distance"
import AdCarousel from "../AdCarousel"
import MapPicker from "../MapHome"

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

// Local transport options configuration with icons, colors, etc.
const transportConfig = {
  "cab": {
    icon: <FaCar className="text-2xl" />,
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-200",
    baseFare: 40,
    perKm: 12,
  },
  "bike": {
    icon: <FaMotorcycle className="text-2xl" />,
    color: "bg-green-500",
    textColor: "text-green-500",
    borderColor: "border-green-200",
    baseFare: 20,
    perKm: 8,
  },
  "e_ricksha": {
    icon: <MdElectricRickshaw className="text-2xl" />,
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-200",
    baseFare: 30,
    perKm: 8,
  },
  "bus": {
    icon: <FaBus className="text-2xl" />,
    color: "bg-purple-500",
    textColor: "text-purple-500",
    borderColor: "border-purple-200",
    baseFare: 10,
    perKm: 5,
  },
  "rickshaw": {
    icon: <MdElectricRickshaw className="text-2xl" />,
    color: "bg-amber-500",
    textColor: "text-indigo-500",
    borderColor: "border-red-200",
    baseFare: 20,
    perKm: 10,
  }, 
  "default": {
    icon: <FaCar className="text-2xl" />,
    color: "bg-gray-500",
    textColor: "text-gray-500",
    borderColor: "border-gray-200",
    baseFare: 40,
    perKm: 12,
  }
}
 
export default function MobileHome() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("cars")
  const [showFilters, setShowFilters] = useState(false)
  const [budget, setBudget] = useState([0, 5000])
  const [passengers, setPassengers] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [transportOptions, setTransportOptions] = useState([])

  // Location states
  const [pickupLocation, setPickupLocation] = useState({ address: "", coordinates: { lat: 0, lng: 0 } })
  const [destinationLocation, setDestinationLocation] = useState({ address: "", coordinates: { lat: 0, lng: 0 } })
  const [distance, setDistance] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationPermission, setLocationPermission] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState(transportOptions[0])

  const { cars, brand, places,verifiedHotels:hotels, reviews, getAverageRating } = useUjjain()
 // console.log('home hotels verified', verifiedHotels.length,'all hotels :', hotels);
    const [transport_id, setTransport_id] = useState("")



  // Process transport options from database and merge with local config
  useEffect(() => {
    if (cars.length) {
      const instantCars = cars.filter((item) => item.bookingType === 'instant')
      
      const processedTransports = instantCars.map(car => {
        // Get the transport type from model or use default
        const transportType = car.model?.toLowerCase() || "default"
        const config = transportConfig[transportType] || transportConfig.default
        
        return {
          ...car,
          icon: config.icon,
          color: config.color,
          textColor: config.textColor,
          borderColor: config.borderColor,
          baseFare: config.baseFare,
          
        }
      })
   //   console.log('all instant vehicles', processedTransports);
      
      setTransportOptions(processedTransports)
      
      // Set default selected transport
      if (processedTransports.length > 0 && !transport_id) {
        setSelectedTransport(processedTransports[0].model?.toLowerCase() || "cab")
        setTransport_id(processedTransports[0]._id)
      }
    }
  }, [cars, transport_id])


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
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Calculate distance when coordinates change
  useEffect(() => {
    if (pickupLocation.coordinates.lat !== 0 && destinationLocation.coordinates.lat !== 0) {
      const dist = haversineDistance(pickupLocation.coordinates, destinationLocation.coordinates)
      setDistance(Math.floor(dist))
    }
  }, [pickupLocation.coordinates, destinationLocation.coordinates])

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

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          )
          const data = await response.json()

          if (data.display_name) {
            setPickupLocation({ 
              address: data.display_name, 
              coordinates: { lat: latitude, lng: longitude } 
            })
            setLocationPermission(true)
          }
        } catch (error) {
          console.error("Error getting address:", error)
          setPickupLocation({ 
            address: `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            coordinates: { lat: latitude, lng: longitude } 
          })
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
  
  const calculateFare = useCallback((transportType = selectedTransport, dist = distance || 0) => {
    if (!transportType) return 0
    //console.log('transportType', transportType);

    if (typeof transportType === 'object') {
      // transportType is an object from MapHome
      return Math.floor(transportType.baseFare + dist * transportType.perKm)
    } else {
      // transportType is a string (selectedTransport)
      const transport = transportOptions.find(option =>
        option.model?.toLowerCase() === transportType
      )
      console.log('transport', transport);
      return Math.floor((transport?.baseFare + dist * transport?.pricePerKm) || 0)
    }
  }, [selectedTransport, distance, transportOptions])

  const handleBookNow = () => {
    if (pickupLocation.address && destinationLocation.address && selectedTransport) {
      const today = new Date().toISOString().split('T')[0]
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const fare = calculateFare()

      // Handle both string and object types for selectedTransport
      let transportCategory = ''
      let transportId = ''

      if (typeof selectedTransport === 'object') {
        transportCategory = selectedTransport.category || selectedTransport.name || 'cab'
        transportId = selectedTransport.id || selectedTransport._id || ''
      } else {
        // selectedTransport is a string, find the corresponding transport object
        const transport = transportOptions.find(option =>
          option.model?.toLowerCase() === selectedTransport
        )
        transportCategory = transport?.category || transport?.model?.toLowerCase() || 'cab'
        transportId = transport?._id || ''
      }

      const bookingUrl = `/booking?pickup=${encodeURIComponent(pickupLocation.address)}&pickupLat=${pickupLocation.coordinates.lat}&pickupLng=${pickupLocation.coordinates.lng}&destination=${encodeURIComponent(destinationLocation.address)}&destLat=${destinationLocation.coordinates.lat}&destLng=${destinationLocation.coordinates.lng}&transportType=${transportCategory}&fare=${fare}&bookingType=instant&startDate=${today}&endDate=${tomorrow}&_id=${transportId}`

      window.location.href = bookingUrl
    }
  }


  
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section with Map Picker */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-white/30 rounded w-48 mb-2"></div>
              <div className="h-4 bg-white/30 rounded w-64 mb-6"></div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
              <p className="text-orange-100 mb-6">{brand.description}</p>
            </>
          )}

          {/* MapPicker Component */}
          <MapPicker
            pickupLocation={pickupLocation}
            destinationLocation={destinationLocation}
            onPickupChange={setPickupLocation}
            instantVehicles={transportOptions}
            onDestinationChange={setDestinationLocation}
            selectedTransport={selectedTransport}
            onTransportSelect={setSelectedTransport}
            distance={distance}
            calculateFare={calculateFare}
            onBookNow={handleBookNow}
            getCurrentLocation={getCurrentLocation}
            locationPermission={locationPermission}
            isLocating={isLocating}
          />

          {/* Quick Location Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm animate-pulse">
                  <div className="h-3 w-16 bg-white/30 rounded"></div>
                </div>
              ))
            ) : (
              ["Mahakal Temple", "Ram Ghat", "Ujjain Railway Station", "Airport"].map((place) => (
                <button
                  key={place}
                  onClick={() => setDestinationLocation({ 
                    address: place, 
                    coordinates: { lat: 0, lng: 0 } 
                  })}
                  className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
                >
                  {place}
                </button>
              ))
            )}
          </div>

          {/* Location Permission Status */}
          {locationPermission && !isLoading && (
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

      {/* Ad Carousel */}
      <div className="md:px-4 px-2 py-4">
        <AdCarousel />
      </div>

    
      {/* Popular Car Rentals */}
      {!searchTerm && (
  <div className="md:px-4 px-2 py-6 md:py-8 max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Popular Car Rentals</h2>
      <Link href={"/cars"}>
        <button className="bg-orange-500 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
          <FaArrowRight className="text-sm md:text-base" />
        </button>
      </Link>
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4"
    >
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => <LoadingCard key={index} />)
        : cars.slice(0, 8).map((car) => (
            <motion.div
              key={car._id}
              variants={itemVariants}
              className="bg-card rounded-lg md:rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-md md:hover:shadow-lg transition-shadow"
            >
              {/* Image Container */}
              <div className="relative w-full pt-[60%] md:pt-[75%] overflow-hidden">
                <img
                  src={car.images?.[0]?.url || car.image?.url || "/placeholder.svg"}
                  alt={car.model}
                  className="absolute top-0 left-0 w-full h-full object-contain p-2 md:p-0"
                />
              </div>
              
              <div className="p-2 md:p-4">
                {/* Car Model */}
                <h3 className="font-bold text-xs md:text-sm lg:text-base text-card-foreground line-clamp-1 mb-1">
                  {car.model}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-1 md:mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${i < Math.floor(getAverageRating(car.reviews)) ? "text-orange-500" : "text-muted"} text-[10px] md:text-xs`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] md:text-xs text-muted-foreground ml-1">
                    {getAverageRating(car.reviews)}
                  </span>
                </div>
                
                {/* Price and Details Row */}
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div>
                    <div className="text-sm md:text-lg lg:text-xl font-bold text-card-foreground flex items-center">
                      <FaRupeeSign className="text-[10px] md:text-sm" /> 
                      <span className="ml-0.5">{car.pricePerDay}</span>
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">per day</div>
                  </div>
                  
                  {/* Car Details - Hidden on mobile, shown on tablet+ */}
                  <div className="hidden md:block text-right">
                    <div className="text-xs text-muted-foreground">
                      {car.seats} seats • {car.fueltype}
                    </div>
                    <div className="text-xs text-muted-foreground">{car.geartype}</div>
                  </div>
                  
                  {/* Mobile Badge for details */}
                  <div className="md:hidden">
                    <div className="flex items-center space-x-1">
                      <span className="text-[8px] px-1 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {car.seats} seats
                      </span>
                      <span className="text-[8px] px-1 py-0.5 bg-green-100 text-green-800 rounded">
                        {car.fueltype.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Book Now Button */}
                <div className="flex justify-center">
                  <Link href={`/booking?car=${car._id}`}>
                    <button className="w-full px-1 py-1 md:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded md:rounded-lg font-semibold transition-colors text-xs md:text-sm">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
    </motion.div>
  </div>
)}

      {/* Top Hotels */}
      { (
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
                : hotels.slice(0, 6).map((hotel) => (
                    <motion.div
                      key={hotel._id}
                      variants={itemVariants}
                      className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={hotel.images?.[0]?.url || hotel.image?.url || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-card-foreground line-clamp-1">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center my-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(getAverageRating(hotel.reviews)) ? "text-orange-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground capitalize ml-2">
                            {hotel.category}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          <FaMapMarkerAlt className="text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground line-clamp-1">{hotel.location}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-xl font-bold flex items-center">
                              <FaRupeeSign className="text-base" /> {hotel.price}
                            </div>
                            <div className="text-sm text-muted-foreground">per night</div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {hotel.amenities.slice(0, 3).map((item, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-sky-300 rounded-full"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Link href={`/booking?hotel=${hotel._id}`}>
                            <button className="w-full px-1 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
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
      )}

      {/* Sacred Places to Visit */}
      {!searchTerm && (
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
              : places.slice(0, 6).map((place) => (
                  <motion.div
                    key={place._id}
                    variants={itemVariants}
                    className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={place.images?.[0]?.url || place.image?.url || "/placeholder.svg"}
                      alt={place.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-card-foreground line-clamp-1">
                        {place.title}
                      </h3>
                      <div className="flex items-center my-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(getAverageRating(place.reviews)) ? "text-orange-500" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">{getAverageRating(place.reviews)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{place.description}</p>
                      <div className="flex justify-center">
                        <Link href={`/places/${place._id}`}>
                          <button className="w-full px-1 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
                            Learn More
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      )}

      {/* What Travelers Say */}
      {!searchTerm && (
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => <LoadingReview key={index} />)
                : reviews.slice(0, 6).map((review) => (
                    <motion.div
                      key={review._id}
                      variants={itemVariants}
                      className="bg-muted/30 rounded-xl p-6 border border-border"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {review?.user?.fullName?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <h4 className="font-bold text-card-foreground text-base capitalize line-clamp-1">
                              {review?.user?.fullName || "User"}
                            </h4>
                          </div>
                          <div className="flex items-center mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-orange-500 ${
                                    i < review.rating ? "text-orange-500" : "text-muted"
                                  } text-sm`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground ml-2 line-clamp-1">
                              {review.location || "Ujjain"}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-3">"{review.comment}"</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <img
                            src={
                              review.reviewedItem?.image?.url ||
                              review?.reviewedItem?.images?.[0]?.url ||
                              "/placeholder.svg"
                            }
                            alt={
                              review.reviewedItem?.model ||
                              review.reviewedItem?.name ||
                              review.reviewedItem?.title ||
                              review.reviewedItem?.serviceName ||
                              "Review item"
                            }
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-orange-500 text-white py-6 px-4"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center">
            <FaPhone className="text-2xl animate-pulse mr-3" />
            <div>
              <div className="text-lg font-semibold">24/7 Help Available</div>
              <div className="text-white/90">Call: +91-{brand.mobile}</div>
            </div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-xl mr-3" />
            <div>
              <div className="font-semibold">Book Your Journey</div>
              <div className="text-white/90">Plan your spiritual trip today</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}