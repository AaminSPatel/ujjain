"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaCar, FaHotel, FaUsers, FaClock, FaPhone, FaCheckCircle, FaStar, FaTruck } from "react-icons/fa"
import SEOHead from "@/components/SEOHead"
import { useUjjain } from "@/components/context/UjjainContext"

export default function Booking() {
  const { addBooking, cars, hotels, logistics } = useUjjain()
  const [bookingType, setBookingType] = useState("cab")
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    serviceType: "cab",
    service: "",
    startDate: "",
    endDate: "",
    pickupLocation: {
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    dropoffLocation: {
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    guests: 2,
    rooms: 1,
    personalInfo: {
      fullname: "",
      email: "",
      mobile: "",
      address: "",
    },
    specialRequests: "",
    payment: {
      amount: 0,
      method: "credit_card",
    },
  })

  const [availableServices, setAvailableServices] = useState([])

  useEffect(() => {
    if (bookingType === "cab" && cars) {
      setAvailableServices(cars)
    } else if (bookingType === "hotel" && hotels) {
      setAvailableServices(hotels)
    } else if (bookingType === "logistics" && logistics) {
      setAvailableServices(logistics)
    }
  }, [bookingType, cars, hotels, logistics])

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
    setBookingData((prev) => ({
      ...prev,
      service: service._id,
      serviceType: bookingType,
      payment: {
        ...prev.payment,
        amount: service.price || service.pricePerDay || service.pricePerNight || 0,
      },
    }))
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const booking = {
      ...bookingData,
      user: "current_user_id", // This should come from auth context
      status: "pending",
      isPaid: false,
      isCancelled: false,
    }
    addBooking(booking)
    setStep(4)
  }

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Service</h2>
        <div className="flex justify-center space-x-4 flex-wrap gap-2">
          <button
            onClick={() => setBookingType("cab")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              bookingType === "cab" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"
            }`}
          >
            <FaCar />
            <span>Book Car</span>
          </button>
          <button
            onClick={() => setBookingType("hotel")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              bookingType === "hotel" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-green-100"
            }`}
          >
            <FaHotel />
            <span>Book Hotel</span>
          </button>
          <button
            onClick={() => setBookingType("logistics")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              bookingType === "logistics" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-purple-100"
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
              {service.images && service.images.length > 0 ? (
                <img
                  src={service.images[0] || "/placeholder.svg"}
                  alt={service.name || service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  {bookingType === "cab" && <FaCar className="text-4xl text-gray-500" />}
                  {bookingType === "hotel" && <FaHotel className="text-4xl text-gray-500" />}
                  {bookingType === "logistics" && <FaTruck className="text-4xl text-gray-500" />}
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
                <h3 className="font-bold text-gray-800 text-lg">{service.name || service.title}</h3>
              </div>

              {service.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>}

              {bookingType === "cab" && service.capacity && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaUsers className="mr-2" />
                  <span>{service.capacity} Seats</span>
                </div>
              )}

              {bookingType === "hotel" && service.rating && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span>{service.rating} Rating</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-orange-500">
                  ₹{service.price || service.pricePerDay || service.pricePerNight || 0}
                  <span className="text-sm text-gray-500">
                    /{bookingType === "hotel" ? "night" : bookingType === "logistics" ? "trip" : "day"}
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

      {availableServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {bookingType === "cab" && <FaCar className="text-6xl mx-auto" />}
            {bookingType === "hotel" && <FaHotel className="text-6xl mx-auto" />}
            {bookingType === "logistics" && <FaTruck className="text-6xl mx-auto" />}
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No services available</h3>
          <p className="text-gray-500">Please check back later or contact support.</p>
        </div>
      )}
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Select Dates & Details</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookingType === "cab" ? "Pickup Date" : bookingType === "hotel" ? "Check-in Date" : "Service Date"} *
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
              {bookingType === "cab" ? "Return Date" : bookingType === "hotel" ? "Check-out Date" : "End Date"}
            </label>
            <input
              type="date"
              name="endDate"
              value={bookingData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {bookingType === "cab" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
                <input
                  type="text"
                  name="pickupLocation.address"
                  value={bookingData.pickupLocation.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter pickup address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
                <input
                  type="text"
                  name="dropoffLocation.address"
                  value={bookingData.dropoffLocation.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter drop-off address"
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookingType === "cab"
                ? "Number of Passengers"
                : bookingType === "hotel"
                  ? "Number of Guests"
                  : "Number of People"}{" "}
              *
            </label>
            <select
              name="guests"
              value={bookingData.guests}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {bookingType === "cab" ? "Passenger" : bookingType === "hotel" ? "Guest" : "Person"}
                  {num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {bookingType === "hotel" && (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              name="payment.method"
              value={bookingData.payment.method}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="credit_card">Credit Card</option>
              <option value="wallet">Digital Wallet</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

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
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
        >
          Continue
        </button>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="personalInfo.fullname"
              value={bookingData.personalInfo.fullname}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              name="personalInfo.email"
              value={bookingData.personalInfo.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
            <input
              type="tel"
              name="personalInfo.mobile"
              value={bookingData.personalInfo.mobile}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
            <input
              type="text"
              name="personalInfo.address"
              value={bookingData.personalInfo.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Your address"
            />
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Service Type:</span>
              <span className="font-semibold capitalize">{bookingData.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">
                {bookingData.startDate} {bookingData.endDate && `to ${bookingData.endDate}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {bookingType === "cab" ? "Passengers:" : bookingType === "hotel" ? "Guests:" : "People:"}
              </span>
              <span className="font-semibold">{bookingData.guests}</span>
            </div>
            {bookingType === "hotel" && (
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
            className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </motion.div>
  )

  const renderStep4 = () => (
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
          Thank you for choosing Safar Sathi. Your booking has been confirmed.
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-6 max-w-md mx-auto">
        <h3 className="font-bold text-gray-800 mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-3" />
            <span className="text-gray-700">Confirmation email sent</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-blue-500 mr-3" />
            <span className="text-gray-700">Our team will call you within 30 minutes</span>
          </div>
          <div className="flex items-center">
            <FaClock className="text-orange-500 mr-3" />
            <span className="text-gray-700">Service details will be shared via SMS</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            setStep(1)
            setBookingData({
              serviceType: "cab",
              service: "",
              startDate: "",
              endDate: "",
              pickupLocation: { address: "", coordinates: { lat: 0, lng: 0 } },
              dropoffLocation: { address: "", coordinates: { lat: 0, lng: 0 } },
              guests: 2,
              rooms: 1,
              personalInfo: { fullname: "", email: "", mobile: "", address: "" },
              specialRequests: "",
              payment: { amount: 0, method: "credit_card" },
            })
          }}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
        >
          Book Another Service
        </button>
        <a
          href="tel:+919876543210"
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
        title="Book Car & Hotel - Ujjain Travel"
        description="Book premium cars and hotels for your Ujjain journey. Easy online booking with instant confirmation."
        keywords="ujjain car booking, ujjain hotel booking, car rental ujjain, hotel reservation ujjain"
      />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Book Your Journey</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Secure your car and accommodation for a comfortable spiritual journey to Ujjain
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= stepNum ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNum ? <FaCheckCircle /> : stepNum}
                </div>
                {stepNum < 4 && (
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
                Step {step} of 4:{" "}
                {step === 1
                  ? "Choose Service"
                  : step === 2
                    ? "Select Dates"
                    : step === 3
                      ? "Personal Info"
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
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
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
              <FaPhone className="inline mr-2" />
              Call: +91-9876543210
            </a>
            <a
              href="https://wa.me/919876543210"
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
