"use client"
import { useState } from "react"
import Header from "../components/Header"
import Footer from "../../components/Footer"
import { FaCar, FaUsers, FaGasPump, FaStar, FaHeart, FaPhone, FaShieldAlt } from "react-icons/fa"
import { MdAirlineSeatReclineExtra, MdLuggage } from "react-icons/md"
import Link from "next/link"
import { useUjjain } from "../../components/UjjainContext"

export default function Cars() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState([])
  const {cars} = useUjjain()
  const categories = [
    { id: "all", name: "All Cars" },
    { id: "economy", name: "Economy" },
    { id: "premium", name: "Premium" },
    { id: "luxury", name: "Luxury" },
    { id: "suv", name: "SUV" },
  ]

  const filteredCars = selectedCategory === "all" ? cars : cars.filter((car) => car.category === selectedCategory)

  const toggleFavorite = (carId) => {
    setFavorites((prev) => (prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Premium Car Rentals</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Choose from our fleet of well-maintained vehicles with experienced drivers for your Ujjain journey
          </p>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <FaShieldAlt className="text-2xl text-green-500" />
              <span className="font-semibold">Verified Drivers</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaCar className="text-2xl text-blue-500" />
              <span className="font-semibold">Well Maintained</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaPhone className="text-2xl text-orange-500" />
              <span className="font-semibold">24/7 Support</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaStar className="text-2xl text-yellow-500" />
              <span className="font-semibold">Best Prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredCars.map((car) => (
              <div key={car.id} className="card overflow-hidden">
                <div className="">
                  <div className="relative">
                    <img
                      src={car.image || "/placeholder.svg?height=200&width=300"}
                      alt={car.name}
                      className="w-full h-64 md:h-96  sm:object-cove object-contain bg-gradient-to-b from-amber-200 to-teal-600"
                    />
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
                        favorites.includes(car.id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          car.availability === "Available" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                        }`}
                      >
                        {car.availability}
                      </span>
                    </div>
                  </div>

                  <div className=" p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{car.name}</h3>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span className="font-semibold">{car.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({car.reviews})</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{car.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center">
                        <FaUsers className="text-blue-500 mr-2" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center">
                        <FaGasPump className="text-green-500 mr-2" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center">
                        <MdAirlineSeatReclineExtra className="text-purple-500 mr-2" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center">
                        <MdLuggage className="text-orange-500 mr-2" />
                        <span>Spacious</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Driver Info */}
                   {/*  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <img
                          src={car.driver.image || "/placeholder.svg"}
                          alt={car.driver.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{car.driver.name}</h4>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaStar className="text-yellow-500 mr-1" />
                            <span>
                              {car.driver.rating} • {car.driver.experience}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">Languages: {car.driver.languages.join(", ")}</div>
                    </div>
 */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">₹{car.price}</span>
                        <span className="text-gray-500">/day</span>
                        {car.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">₹{car.originalPrice}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Includes driver</div>
                        <div className="text-sm text-green-600 font-semibold">Free cancellation</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        href={`/cars/${car.id}`}
                        className="flex-1 bg-blue-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/booking?car=${car.id}`}
                        className="flex-1 bg-orange-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Cars */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Cars?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We ensure the highest standards of safety, comfort, and reliability for your sacred journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Verified Drivers</h3>
              <p className="text-gray-600">
                All our drivers are background verified, licensed, and have extensive knowledge of Ujjain temples and
                routes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCar className="text-3xl text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Well Maintained Fleet</h3>
              <p className="text-gray-600">
                Regular maintenance, cleanliness checks, and safety inspections ensure a comfortable and safe journey.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPhone className="text-3xl text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support to assist you during your journey and handle any emergencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Your Car?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Choose from our premium fleet and experienced drivers for a comfortable journey to Ujjain's sacred places
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
