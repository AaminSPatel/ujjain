"use client"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { FaCar, FaHotel, FaUsers, FaClock, FaPhone, FaCheckCircle, FaStar, FaTruck, FaMotorcycle, FaBus } from "react-icons/fa"
import { MdElectricRickshaw } from "react-icons/md"
import SEOHead from "@/components/SEOHead"
import { useUjjain } from "@/components/context/UjjainContext"
import dynamic from "next/dynamic";
import { haversineDistance } from "@/components/utils/distance";
import safeStorage from "@/components/utils/safeStorage";

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});

// Transportation options data (same as home page)
const transportOptions = [
  {
    id: "cab",
    name: "Cab",
    icon: <FaCar className="text-2xl" />,
    baseFare: 40,
    perKm: 12,
    capacity: "4 passengers",
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  {
    id: "bike",
    name: "Bike",
    icon: <FaMotorcycle className="text-2xl" />,
    baseFare: 20,
    perKm: 8,
    capacity: "1 passenger",
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  {
    id: "rickshaw",
    name: "Auto Rickshaw",
    icon: <MdElectricRickshaw className="text-2xl" />,
    baseFare: 30,
    perKm: 10,
    capacity: "3 passengers",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  {
    id: "bus",
    name: "Bus",
    icon: <FaBus className="text-2xl" />,
    baseFare: 15,
    perKm: 5,
    capacity: "40+ passengers",
    color: "bg-purple-500",
    textColor: "text-purple-500",
  }
]

function BookingContent() {
  const {brand, addBooking, cars, hotels, logistics, user } = useUjjain()
  const searchParams = useSearchParams()
  const [bookingType, setBookingType] = useState("Car")
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [maxRooms, setMaxRooms] = useState(5)
  const [maxPassengers, setMaxPassengers] = useState(8)

  const [bookingId, setBookingId] = useState(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [isInstantBooking, setIsInstantBooking] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState("cab")
  const [selectedVehicleId, setSelectedVehicleId] = useState("")
  const [selectedRoom, setSelectedRoom] = useState(null)

  const [bookingData, setBookingData] = useState(() => {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      serviceType: "Car",
      service: "",
      startDate: today,
      endDate: tomorrow,
      dates: [new Date(today), new Date(tomorrow)],
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      },
      rooms: 1,
      pickupLocation: {
        address: "",
        coordinates: { lat: 0, lng: 0 },
      },
      dropoffLocation: {
        address: "",
        coordinates: { lat: 0, lng: 0 },
      },
      personalInfo: {
        fullname: "",
        email: "",
        mobile: "",
        address: "",
      },
      specialRequests: "",
      payment: {
        method: "cash_on_drop",
        amount: 0,
        status: "pending"
      },
      pricing: {
        basePrice: 0,
        discount: 0,
        tax: 0,
        totalPrice: 0
      }
    }
  })

  const [availableServices, setAvailableServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    const pickupParam = searchParams.get("pickup")
    const pickupLat = searchParams.get("pickupLat")
    const pickupLng = searchParams.get("pickupLng")
    const destinationParam = searchParams.get("destination")
    const destinationLat = searchParams.get("destLat")
    const destinationLng = searchParams.get("destLng")
    const transportParam = searchParams.get("transport")
    const fareParam = searchParams.get("fare")
    const bookingTypeParam = searchParams.get("bookingType")
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")
    const v_id = searchParams.get("_id")

    console.log('Vehicle ID from URL:', v_id);

    // Set current date and next date as default
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (pickupParam) {
      setPickup(pickupParam)
      setBookingData(prev => ({
        ...prev,
        pickupLocation: {
          address: pickupParam,
          coordinates: {
            lat: parseFloat(pickupLat) || 0,
            lng: parseFloat(pickupLng) || 0
          },
        },
        dropoffLocation: {
          address: destinationParam || "",
          coordinates: {
            lat: parseFloat(destinationLat) || 0,
            lng: parseFloat(destinationLng) || 0
          },
        },
        startDate: startDateParam || today,
        endDate: endDateParam || tomorrow,
        dates: [
          new Date(startDateParam || today),
          new Date(endDateParam || tomorrow)
        ],
        serviceType: 'Car',
        service: v_id || "",
      }))
    } else {
      // Set default dates even if no pickup param
      setBookingData(prev => ({
        ...prev,
        startDate: startDateParam || today,
        endDate: endDateParam || tomorrow,
        dates: [
          new Date(startDateParam || today),
          new Date(endDateParam || tomorrow)
        ],
        serviceType: 'Car',
        service: v_id || "",
      }))
    }

    if (destinationParam) setDestination(destinationParam)

    if (transportParam) {
      setSelectedTransport(transportParam)
      setSelectedVehicleId(v_id)
      setBookingType("Car")
    }

    if (fareParam) {
      const fareAmount = parseFloat(fareParam) || 0
      setBookingData(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          amount: fareAmount,
        },
        pricing: {
          basePrice: fareAmount,
          discount: 0,
          tax: 0,
          totalPrice: fareAmount
        }
      }))
    }

    if (bookingTypeParam === "instant") {
      setIsInstantBooking(true)
      setStep(2) // Skip vehicle selection for instant booking
    }
  }, [searchParams])

  // Prefill user data in booking form
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        personalInfo: {
          fullname: user.fullName || '',
          email: user.email || '',
          mobile: user.mobile || '',
          address: user.address?.street + " " +  user.address?.city + " " + user.address?.state + " " +  user.address?.country + " " + user.address?.postalCode || '',
        }
      }));
    }
  }, [user])

  // Handle URL parameters for pre-selecting service
  useEffect(() => {
    const serviceType = searchParams.get('serviceType') || searchParams.get('type')
    const serviceId = searchParams.get('_id') || searchParams.get('service') || searchParams.get('hotel') || searchParams.get('car') || searchParams.get('logistics')
    const roomId = searchParams.get('room')

    // Determine service type from parameter if not explicitly provided
    let detectedType = serviceType;
    if (!detectedType) {
      if (searchParams.get('hotel')) detectedType = "Hotel";
      else if (searchParams.get('car')) detectedType = "Car";
      else if (searchParams.get('logistics')) detectedType = "Logistics";
    }

    if (detectedType && !isInstantBooking) {
      setBookingType(detectedType)
      setBookingData(prev => ({
        ...prev,
        serviceType: detectedType,
        service: serviceId || "",
        room: roomId || ""
      }))
    }

    if (serviceId && !isInstantBooking) {
      setBookingData(prev => ({
        ...prev,
        service: serviceId,
        room: roomId || ""
      }))
      setStep(2)
    }

    // Set selected room if roomId is provided
    if (roomId && !isInstantBooking) {
      setSelectedRoom(roomId)
    }
  }, [searchParams, isInstantBooking])

  useEffect(() => {
    if (isInstantBooking) {
      // For instant booking, we don't need to load specific vehicles
      setAvailableServices([])
      const transport = transportOptions.find(t => t.id === selectedTransport)

      // Use fare from URL if available, otherwise calculate based on distance
      let calculatedPrice = bookingData.payment.amount > 0 ? bookingData.payment.amount : 0
      if (calculatedPrice === 0 && transport && bookingData.pickupLocation.coordinates.lat && bookingData.pickupLocation.coordinates.lng &&
          bookingData.dropoffLocation.coordinates.lat && bookingData.dropoffLocation.coordinates.lng) {
        const distance = haversineDistance(
          bookingData.pickupLocation.coordinates,
          bookingData.dropoffLocation.coordinates
        )
        calculatedPrice = transport.baseFare + (distance * transport.perKm)
        calculatedPrice = Math.round(calculatedPrice) // Round to nearest rupee
      }

      setSelectedService({
        _id: selectedVehicleId,
        name: transport?.name || "Car",
        type: "instant",
        capacity: transport?.capacity || "",
        price: calculatedPrice
      })

      // Update booking data with calculated price
      setBookingData(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          amount: calculatedPrice,
        },
        pricing: {
          basePrice: calculatedPrice,
          discount: 0,
          tax: 0,
          totalPrice: calculatedPrice
        }
      }))
    } else if (bookingType === "Car" && cars) {
      setAvailableServices(cars)
      if (bookingData.service) {
        const service = cars.find(car => car._id === bookingData.service)
        if (service) {
          setSelectedService(service)
          // Calculate fare based on days for car rentals
          const days = Math.max(1, Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)))
          const price = (service.pricePerDay || 0) * days
          setBookingData(prev => ({
            ...prev,
            payment: {
              ...prev.payment,
              amount: price,
            },
            pricing: {
              basePrice: price,
              discount: 0,
              tax: 0,
              totalPrice: price
            }
          }))
        }
      }
    } else if (bookingType === "Hotel" && hotels) {
      setAvailableServices(hotels)
      if (bookingData.service) {
        const service = hotels.find(hotel => hotel._id === bookingData.service)
        if (service) {
          setSelectedService(service)
          // Calculate hotel price based on days and rooms
          const days = Math.max(1, Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)))
          const price = (service.pricePerNight || service.price || 0) * days * bookingData.rooms
          setBookingData(prev => ({
            ...prev,
            payment: {
              ...prev.payment,
              amount: price,
            },
            pricing: {
              basePrice: price,
              discount: 0,
              tax: 0,
              totalPrice: price
            }
          }))
        }
      }
    } else if (bookingType === "Logistics" && logistics) {
      setAvailableServices(logistics)
      if (bookingData.service) {
        const service = logistics.find(logistic => logistic._id === bookingData.service)
        if (service) {
          setSelectedService(service)
          const price = service.price || service.pricePerDay || service.pricePerNight || service.priceRange?.max || 0
          setBookingData(prev => ({
            ...prev,
            payment: {
              ...prev.payment,
              amount: price,
            },
            pricing: {
              basePrice: price,
              discount: 0,
              tax: 0,
              totalPrice: price
            }
          }))
        }
      }
    }
  }, [bookingType, cars, hotels, logistics, bookingData.service, isInstantBooking, selectedTransport, selectedVehicleId, bookingData.pickupLocation.coordinates, bookingData.dropoffLocation.coordinates, bookingData.startDate, bookingData.endDate, bookingData.rooms])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const keys = name.split(".")
      setBookingData((prev) => {
        const updated = { ...prev }
        let current = updated
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        return updated
      })
    } else {
      setBookingData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    const price = service.price || service.pricePerDay || service.pricePerNight || (service.priceRange?.max ?? 0)
    
    setBookingData((prev) => ({
      ...prev,
      service: service._id,
      serviceType: bookingType,
      payment: {
        ...prev.payment,
        amount: price,
      },
      pricing: {
        basePrice: price,
        discount: 0,
        tax: 0,
        totalPrice: price
      }
    }))
    setStep(2)
  }

  const handleTransportSelect = (transportId) => {
    setSelectedTransport(transportId)
    const transport = transportOptions.find(t => t.id === transportId)
    if (transport) {
      setSelectedService({
        _id: `instant-${transportId}`,
        name: transport.name,
        type: "instant",
        capacity: transport.capacity,
        price: bookingData.payment.amount
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessingPayment(true)

    try {
      // Check if user is logged in
      if (!user || !user._id) {
        alert('Please sign in to continue with your booking.')
        window.location.href = '/auth/signin'
        setIsProcessingPayment(false)
        return
      }

      // Update user profile with personal information
     /*  try {
        const { UserService } = await import('@/components/apiService')
        await UserService.updateProfile({
          fullName: bookingData.personalInfo.fullname,
          email: bookingData.personalInfo.email,
          mobile: bookingData.personalInfo.mobile,
          address: bookingData.personalInfo.address
        })
        console.log('User profile updated successfully')
      } catch (profileError) {
        console.error('Failed to update user profile:', profileError)
        // Continue with booking even if profile update fails
      } */

      // Prepare booking data according to your schema (without personal info)
      const bookingPayload = {
        serviceType: isInstantBooking ? "Car" : bookingData.serviceType,
        service: isInstantBooking ? selectedVehicleId : bookingData.service,
        startDate: new Date(bookingData.startDate),
        endDate: bookingData.endDate ? new Date(bookingData.endDate) : undefined,
        dates: bookingData.endDate
          ? [new Date(bookingData.startDate), new Date(bookingData.endDate)]
          : [new Date(bookingData.startDate)],

        // Passenger details
        passengers: bookingData.passengers,

        // Hotel specific
        rooms: bookingType === "Hotel" ? bookingData.rooms : undefined,
        room: bookingData.room || undefined,

        // Location details
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,

        // Payment and pricing
        payment: {
          method: bookingData.payment.method,
          amount: bookingData.payment.amount,
          status: "pending"
        },
        pricing: bookingData.pricing,

        // Additional fields
        specialRequests: bookingData.specialRequests,
        status: "pending",
        isPaid: false,
        isCancelled: false,
        user: user._id,

        // Instant booking flag
        isInstantBooking: isInstantBooking,
        bookingType: isInstantBooking ? 'instant' : 'normal',
        transportType: isInstantBooking ? selectedTransport : undefined
      }

     // console.log('Submitting booking data:', bookingPayload)

      const result = await addBooking(bookingPayload)
      if (result && result._id) {
        setBookingId(result._id)

        // Save booking data to localStorage
        safeStorage.set('lastBooking', {
          bookingId: result._id,
          bookingData: bookingPayload,
          timestamp: new Date().toISOString()
        })

        // If online payment, handle payment, else go to confirmation
        if (bookingData.payment.method === "razorpay") {
          await handleRazorpayPayment(result._id)
        } else {
          setStep(5) // Go to confirmation
        }
      } else {
        console.error('Booking creation failed')
       // alert('Failed to create booking. Please try again.')
      }
    } catch (error) {
      console.error('Booking submission error:', error)

      // Check for authentication errors
      if (error.status === 401 || error.message?.includes('401') || error.message?.includes('unauthorized')) {
        alert('Your session has expired. Please sign in again.')
        // Redirect to signin
        window.location.href = '/auth/signin'
        return
      }

      // Show specific error message if available
      const errorMessage = error.message || error.error || 'An error occurred while creating your booking. Please try again.'
      alert(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Service</h2>
        <div className="flex justify-center space-x-4 flex-wrap gap-2">
          <button
            onClick={() => setBookingType("Car")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              bookingType === "Car" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"
            }`}
          >
            <FaCar />
            <span>Book Car</span>
          </button>
          <button
            onClick={() => setBookingType("Hotel")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              bookingType === "Hotel" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-green-100"
            }`}
          >
            <FaHotel />
            <span>Book Hotel</span>
          </button>
          <button
            onClick={() => setBookingType("Logistics")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              bookingType === "Logistics" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-purple-100"
            }`}
          >
            <FaTruck />
            <span>Book Logistics</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableServices.map((service) => (
          <motion.div
            key={service._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleServiceSelect(service)}
            className="card overflow-hidden cursor-pointer group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              { (service?.image?.url) || (service?.images?.length > 0)  ? (
                <img
                  src={
                    bookingType === "Logistics"
                      ? service?.image?.url
                      : service?.images[0]?.url || "/placeholder.svg"
                  }
                  alt={service.name || service.model || service.serviceName}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  {bookingType === "Car" && <FaCar className="text-4xl text-gray-500" />}
                  {bookingType === "Hotel" && <FaHotel className="text-4xl text-gray-500" />}
                  {bookingType === "Logistics" && <FaTruck className="text-4xl text-gray-500" />}
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {service.category || service.type || "Standard"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-lg">{service.name || service.serviceName || service.model}</h3>
              </div>

              {(service.description || service.detail) && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description || service.detail}</p>}

              {bookingType === "Car" && service.seats && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaUsers className="mr-2" />
                  <span>{service.seats} Seats</span>
                </div>
              )}

              {bookingType === "Hotel" && service.rating && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span>{service.rating} Rating</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-orange-500">
                  ₹{service.price || service.pricePerDay || service.pricePerNight || service.priceRange?.max || 0}
                  <span className="text-sm text-gray-500">
                    /{bookingType === "Hotel" ? "night" : bookingType === "Logistics" ? "trip" : "day"}
                  </span>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300">
                  Select
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
        >
          Continue to Details
        </button>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {isInstantBooking ? "Transport Booking Details" : "Booking Details"}
        </h2>
        
               {selectedService && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-md mx-auto">
            <p className="text-blue-800 font-medium">
              <span className="text-amber-500 font-semibold">
                {isInstantBooking ? "Transport" : bookingType}
              </span> 
            </p>
            <p className="text-blue-800 font-medium">
              {isInstantBooking 
                ? `Instant ${transportOptions.find(t => t.id === selectedTransport)?.name} Booking`
                : `Booking: ${selectedService.name || selectedService.serviceName || selectedService.model}`
              }
            </p>
            <p className="text-blue-600">
              ₹{bookingData.payment.amount}
              {isInstantBooking ? "" : bookingType === "Hotel" ? " total" : `/${bookingType === "Logistics" ? "trip" : "day"}`}
            </p>
            {isInstantBooking && (
              <p className="text-blue-600 text-sm mt-1">
                {transportOptions.find(t => t.id === selectedTransport)?.capacity}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {!isInstantBooking && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {bookingType === "Car" ? "Pickup Date" : bookingType === "Hotel" ? "Check-in Date" : "Service Date"} *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {bookingType === "Car" ? "Return Date" : bookingType === "Hotel" ? "Check-out Date" : "End Date"}
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </>
          )}

          {((bookingType === "Car" || bookingType === "Logistics") && !isInstantBooking )&&(
            <>
              <MapPicker
                label="Pickup Location *"
                value={bookingData.pickupLocation}
                onChange={(val) =>
                  setBookingData((prev) => ({ ...prev, pickupLocation: val }))
                }
              />

              <MapPicker
                label="Drop-off Location"
                value={bookingData.dropoffLocation}
                onChange={(val) =>
                  setBookingData((prev) => ({ ...prev, dropoffLocation: val }))
                }
              />
            </>
          )}
        </div>

        <div className="space-y-4">
          {(bookingType === "Car" || bookingType === "Hotel" || isInstantBooking) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passengers *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Adults</label>
                  <select
                    name="passengers.adults"
                    value={bookingData.passengers.adults}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {[1,2,3,4,5,6,7,8].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Children</label>
                  <select
                    name="passengers.children"
                    value={bookingData.passengers.children}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {[0,1,2,3,4,5,6,7,8].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Infants</label>
                  <select
                    name="passengers.infants"
                    value={bookingData.passengers.infants}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {[0,1,2,3,4,5,6,7,8].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {bookingType === "Hotel" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms *</label>
              <select
                name="rooms"
                value={bookingData.rooms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Room{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
{/* 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              name="payment.method"
              value={bookingData.payment.method}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="razorpay">Online Payment</option>
             <option value="credit_card">Credit Card</option>
              <option value="upi">UPI</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option> 
            </select>
          </div>
 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
            <textarea
              name="specialRequests"
              value={bookingData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Any special requirements or requests..."
            />
          </div>
        </div>
      </div>



      <div className="flex justify-between">
        {!isInstantBooking && (
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-300"
          >
            Back
          </button>
        )}
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300 ml-auto"
        >
          Continue
        </button>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Summary</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 ">
     
        {/* Payment Method Selection */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-orange-300 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={bookingData.payment.method === "cash"}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  payment: { ...prev.payment, method: e.target.value }
                }))}
                className="text-orange-500 focus:ring-orange-500"
              />
              <div className="ml-3 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">₹</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Cash Payment</p>
                  <p className="text-sm text-gray-600">Pay directly to the driver</p>
                </div>
              </div>
            </label>

           
            <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-orange-300 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={bookingData.payment.method === "razorpay"}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  payment: { ...prev.payment, method: e.target.value }
                }))}
                className="text-orange-500 focus:ring-orange-500"
              />
              <div className="ml-3 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Online Payment</p>
                  <p className="text-sm text-gray-600">Secure payment via Razorpay</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Service Type:</span>
              <span className="font-semibold capitalize">
                {isInstantBooking ? `Instant ${transportOptions.find(t => t.id === selectedTransport)?.name}` : bookingData.serviceType}
              </span>
            </div>
            {!isInstantBooking && (
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">
                  {bookingData.startDate} {bookingData.endDate && `to ${bookingData.endDate}`}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Passengers:</span>
              <span className="font-semibold">
                {bookingData.passengers.adults} Adult{bookingData.passengers.adults !== 1 ? 's' : ''}, {bookingData.passengers.children} Child{bookingData.passengers.children !== 1 ? 'ren' : ''}, {bookingData.passengers.infants} Infant{bookingData.passengers.infants !== 1 ? 's' : ''}
              </span>
            </div>
            {bookingType === "Hotel" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Rooms:</span>
                <span className="font-semibold">{bookingData.rooms}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold capitalize">{bookingData.payment.method.replace("_", " ")}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-orange-500">₹{bookingData.payment.amount}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isProcessingPayment}
            className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50"
          >
            {isProcessingPayment ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </motion.div>
  )

  const handleRazorpayPayment = async (booking_id) => {
    try {
      setIsProcessingPayment(true)

      // Load Razorpay script if not loaded
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please try again.')
        setIsProcessingPayment(false)
        return
      }

      // Create Razorpay order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bookingId: booking_id,
          amount: bookingData.payment.amount , // Convert to paisa
        }),
      })

      if (!response.ok) {
        // Check for authentication errors
        if (response.status === 401) {
          alert('Your session has expired. Please sign in again.')
          window.location.href = '/auth/signin'
          return
        }
        throw new Error('Failed to create payment order')
      }

      const orderData = await response.json()

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // You'll need to add this to your env
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Safar Sathi',
        description: `Payment for ${isInstantBooking ? `Instant ${bookingData?.service?.name || bookingData?.service?.model || bookingData?.service?.serviceName}` : bookingData.serviceType + ' : '+ bookingData?.service?.name || bookingData?.service?.model || bookingData?.service?.serviceName} Booking`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Handle successful payment
        //  console.log('Razorpay success response:', response);

          // Validate that we have the payment_id (required field)
          if (!response.razorpay_payment_id) {
          //  console.error('Missing required Razorpay payment_id:', response);
          //  alert('Payment response incomplete. Please contact support.');
            setIsProcessingPayment(false);
            return;
          }

          try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.orderId || null,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || null,
                bookingId: bookingId || booking_id,
                method:'razorpay'
              }),
            });

           // console.log('Verify payment response status:', verifyResponse.status);

            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
            //  console.log('Payment verification successful:', verifyData);
              setIsPaymentCompleted(true);
              setStep(5); // Go to confirmation
            } else {
              const errorData = await verifyResponse.json();
            //  console.error('Payment verification failed:', errorData);

              // Check for authentication errors in verification
              if (verifyResponse.status === 401) {
            //    alert('Your session has expired. Please sign in again.');
                window.location.href = '/auth/signin';
                return;
              }

             // alert(`Payment verification failed: ${errorData.error || 'Please contact support.'}`);
            }
          } catch (error) {
            console.error('Payment verification error:', error);

            // Check for authentication errors in verification
            if (error.status === 401 || error.message?.includes('401') || error.message?.includes('unauthorized')) {
              alert('Your session has expired. Please sign in again.');
              window.location.href = '/auth/signin';
              return;
            }

            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: bookingData.personalInfo.fullname,
          email: bookingData.personalInfo.email,
          contact: bookingData.personalInfo.mobile,
        },
        theme: {
          color: '#f97316', // Orange color
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Razorpay payment error:', error)

      // Check for authentication errors
      if (error.status === 401 || error.message?.includes('401') || error.message?.includes('unauthorized')) {
        alert('Your session has expired. Please sign in again.')
        window.location.href = '/auth/signin'
        return
      }

      // Show specific error message if available
      const errorMessage = error.message || 'Payment failed. Please try again.'
      alert(errorMessage)
      setIsProcessingPayment(false)
    }
  }

  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment</h2>
        <p className="text-gray-600">Complete your payment to confirm the booking</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold">
                {isInstantBooking ? `Instant ${transportOptions.find(t => t.id === selectedTransport)?.name}` : bookingData.serviceType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold capitalize">{bookingData.payment.method.replace("_", " ")}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-orange-500">₹{bookingData.payment.amount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {bookingData.payment.method === "razorpay" && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Secure payment powered by Razorpay</p>
              <p className="text-sm text-gray-500 mb-6">
                You will be redirected to Razorpay's secure payment gateway
              </p>
              <button
                onClick={handleRazorpayPayment}
                disabled={isProcessingPayment}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${bookingData.payment.amount} with Razorpay`
                )}
              </button>
            </div>
          )}

     {/*      {bookingData.payment.method === "credit_card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength="19"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
          )}

          {bookingData.payment.method === "wallet" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Wallet *</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="paytm">Paytm</option>
                  <option value="gpay">Google Pay</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="amazonpay">Amazon Pay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {bookingData.payment.method === "paypal" && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment</p>
              <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl inline-block">
                PayPal
              </div>
            </div>
          )}

          {bookingData.payment.method === "bank_transfer" && (
            <div className="bg-gray-50 p-4 rounded-2xl">
              <h4 className="font-semibold text-gray-800 mb-2">Bank Transfer Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Account Name:</strong> Safar Sathi Services</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>IFSC Code:</strong> SBIN0001234</p>
                <p><strong>Bank:</strong> State Bank of India</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please include your booking ID ({bookingId}) in the transfer remarks
              </p>
            </div>
          )}
 */}
          {bookingData.payment.method === "cash" && (
            <div className="text-center py-8">
              <p className="text-gray-600">Cash payment will be collected at the time of service</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(3)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-300"
          >
            Back
          </button>
          {bookingData.payment.method !== "razorpay" && (
            <button
              onClick={() => {
                // Simulate payment processing
                setIsProcessingPayment(true)
                setTimeout(() => {
                  setIsProcessingPayment(false)
                  setStep(5) // Go to confirmation
                }, 2000)
              }}
              disabled={isProcessingPayment}
              className="px-6 py-3 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
            >
              {isProcessingPayment ? "Processing..." : `Pay ₹${bookingData.payment.amount}`}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )

  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <FaCheckCircle className="text-4xl text-green-500" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
        <p className="text-xl text-gray-600 mb-6">
          {isInstantBooking
            ? `Your ${transportOptions.find(t => t.id === selectedTransport)?.name} has been booked successfully!`
            : "Thank you for choosing Safar Sathi. Your booking has been confirmed."
          }
        </p>
        {isInstantBooking && (
          <p className="text-lg text-green-600 font-semibold">
            Driver will arrive at your pickup location shortly!
          </p>
        )}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-6 max-w-md mx-auto">
        <h3 className="font-bold text-gray-800 mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-3" />
            <span className="text-gray-700">Confirmation {isInstantBooking ? 'SMS' : 'email'} sent</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-blue-500 mr-3" />
            <span className="text-gray-700">
              {isInstantBooking
                ? 'Driver will call you for exact location'
                : 'Our team will call you within 30 minutes'
              }
            </span>
          </div>
          <div className="flex items-center">
            <FaClock className="text-orange-500 mr-3" />
            <span className="text-gray-700">
              {isInstantBooking
                ? 'Vehicle will arrive in 5-15 minutes'
                : 'Service details will be shared via SMS'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            setStep(1)
            setBookingData({
              serviceType: "Car",
              service: "",
              startDate: today,
              endDate: tomorrow,
              dates: [new Date(today), new Date(tomorrow)],
              pickupLocation: { address: "", coordinates: { lat: 0, lng: 0 } },
              dropoffLocation: { address: "", coordinates: { lat: 0, lng: 0 } },
              passengers: { adults: 1, children: 0, infants: 0 },
              rooms: 1,
              personalInfo: { fullname: "", email: "", mobile: "", address: "" },
              specialRequests: "",
              payment: { method: "razorpay", amount: 0, status: "pending" },
              pricing: { basePrice: 0, discount: 0, tax: 0, totalPrice: 0 }
            })
            setIsInstantBooking(false)
            setSelectedTransport("cab")
            setSelectedVehicleId("")
          }}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
        >
          Book Another Service
        </button>
        <a
          href={`tel:+91${brand.mobile}`}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-300"
        >
          Call Support
        </a>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <SEOHead
        title="Book Car & Hotel - Safar Sathi"
        description="Book premium cars and hotels for your travel. Easy online booking with instant confirmation."
        keywords="safar sathi car booking, safar sathi hotel booking, car rental, hotel reservation"
      />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-blue-600 text-white bg-cover" style={{backgroundImage:`url('./bg4.png')`}}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {isInstantBooking ? "Instant Transport Booking" : "Book Your Journey"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            {isInstantBooking 
              ? "Get immediate transportation service for your Ujjain journey"
              : "Secure your car and accommodation for a comfortable spiritual journey to Ujjain"
            }
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= stepNum ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNum ? <FaCheckCircle /> : stepNum}
                </div>
                {stepNum < 5 && (
                  <div
                    className={`w-8 md:w-16 h-1 transition-all duration-300 ${
                      step > stepNum ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Step {step} of {totalSteps}:{" "}
                {step === 1
                  ? "Choose Service"
                  : step === 2
                    ? isInstantBooking ? "Transport Details" : "Select Dates"
                    : step === 3
                      ? "Booking Summary"
                      : step === 4
                        ? "Payment"
                        : "Confirmation"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {step === 1 && !isInstantBooking && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help with Booking?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our 24/7 support team is here to assist you with any questions or special requirements
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Call: +91-{brand.mobile}
            </a>
            <a
              href={`https://wa.me/${brand.mobile}`}
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

// Loading component for Suspense fallback
function BookingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading booking page...</p>
      </div>
    </div>
  )
}

// Main export with Suspense boundary
export default function Booking() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingContent />
    </Suspense>
  )
}