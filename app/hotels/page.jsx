"use client"
import { useEffect, useState } from "react"
import { FaStar, FaHeart, FaMapMarkerAlt, FaPhone, FaShieldAlt } from "react-icons/fa"
import { MdRoomService } from "react-icons/md"
import Link from "next/link"
import { useUjjain } from "@/components/context/UjjainContext"

export default function Hotels() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState([])
  const [allHotels, setAllHotels] = useState([])
const {hotels} = useUjjain()
useEffect(()=>{
  if(hotels.length >0){
    setAllHotels(hotels)
  }
},[hotels])
  const categories = [
    { id: "all", name: "All Hotels" },
    { id: "budget", name: "Budget" },
    { id: "mid-range", name: "Mid-Range" },
    { id: "luxury", name: "Luxury" },
    { id: "heritage", name: "Heritage" },
  ]


 
  const filteredHotels =
    selectedCategory === "all" ? allHotels : allHotels.filter((hotel) => allHotels.category === selectedCategory)

  const toggleFavorite = (hotelId) => {
    setFavorites((prev) => (prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Premium Hotels in Ujjain</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Stay close to sacred temples with our handpicked hotels offering comfort, convenience, and spiritual
            ambiance
          </p>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <FaMapMarkerAlt className="text-2xl text-green-500" />
              <span className="font-semibold">Near Temples</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaShieldAlt className="text-2xl text-blue-500" />
              <span className="font-semibold">Verified Properties</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaPhone className="text-2xl text-orange-500" />
              <span className="font-semibold">24/7 Support</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FaStar className="text-2xl text-yellow-500" />
              <span className="font-semibold">Best Rates</span>
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
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="card overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-2/5 relative">
                    <img
                      src={hotel.images[0].url || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(hotel.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
                        favorites.includes(hotel.id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          hotel.availability === "Available" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                        }`}
                      >
                        {hotel.availability}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {hotel.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-3/5 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{hotel.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <FaMapMarkerAlt className="mr-1 text-orange-500" />
                          <span>{hotel.location}</span>
                        </div>
                        <div className="text-sm text-green-600 font-semibold">{hotel.distance}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="font-semibold">{hotel.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">({hotel.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">{hotel.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">+{hotel.amenities.length - 4} more</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3 mb-4">
                      <div className="text-sm text-gray-600 mb-1">Room Types Available:</div>
                      <div className="flex flex-wrap gap-2">
                        {hotel.roomTypes.map((type, index) => (
                          <span key={index} className="text-xs bg-white px-2 py-1 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">₹{hotel.price}</span>
                        <span className="text-gray-500">/night</span>
                        {hotel.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">₹{hotel.originalPrice}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Per room</div>
                        <div className="text-sm text-green-600 font-semibold">Free cancellation</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        href={`/hotels/${hotel.id}`}
                        className="flex-1 bg-green-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-300"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/booking?hotel=${hotel.id}`}
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

      {/* Why Choose Our Hotels */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Partner Hotels?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We carefully select hotels that understand the needs of pilgrims and provide exceptional hospitality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMapMarkerAlt className="text-3xl text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Prime Locations</h3>
              <p className="text-gray-600">
                All hotels are strategically located near major temples and spiritual sites for easy access to darshan.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Verified Quality</h3>
              <p className="text-gray-600">
                Regular quality checks ensure cleanliness, safety, and comfort standards are maintained.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MdRoomService className="text-3xl text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pilgrim-Friendly Service</h3>
              <p className="text-gray-600">
                Staff trained to understand and cater to the specific needs of pilgrims and spiritual travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Book Your Perfect Stay</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Choose from our curated selection of hotels and enjoy a comfortable stay during your spiritual journey
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Book Hotel
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  )
}
