"use client"
import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { FaStar, FaMapMarkerAlt, FaClock, FaCamera, FaHeart, FaShare, FaRoute } from "react-icons/fa"
import { MdTempleHindu } from "react-icons/md"
import Link from "next/link"
import { useUjjain } from "../components/UjjainContext"

export default function Places() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState([])
  const {places} = useUjjain()
  const categories = [
    { id: "all", name: "All Places", icon: <MdTempleHindu /> },
    { id: "temples", name: "Temples", icon: <MdTempleHindu /> },
    { id: "ghats", name: "Ghats", icon: <FaMapMarkerAlt /> },
    { id: "historical", name: "Historical", icon: <FaCamera /> },
    { id: "cultural", name: "Cultural", icon: <FaRoute /> },
  ]


  const filteredPlaces =
    selectedCategory === "all" ? places : places.filter((place) => place.category === selectedCategory)

  const toggleFavorite = (placeId) => {
    setFavorites((prev) => (prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Sacred Places of Ujjain</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Discover the divine temples, holy ghats, and historical sites that make Ujjain a spiritual destination
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="card overflow-hidden group">
                <div className="relative">
                  <img
                    src={place.image[0] || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(place.id)}
                      className={`p-2 rounded-full transition-colors duration-300 ${
                        favorites.includes(place.id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <button className="p-2 bg-white text-gray-600 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300">
                      <FaShare />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                      {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 ">{place.name}</h3>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-semibold">{place.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({place.reviews})</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-4">{place.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="mr-2 text-orange-500" />
                      <span>{place.timings}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-orange-500" />
                      <span>{place.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.highlights.slice(0, 2).map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold h-7"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      href={`/places/${place.id}`}
                      className="flex-1 bg-orange-500 text-white text-center py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/booking"
                      className="flex-1 bg-blue-500 text-white text-center py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
                    >
                      Book Tour
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Plan Your Sacred Journey</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Let us help you create a personalized itinerary to explore all the sacred places of Ujjain
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Book Complete Tour
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-300"
            >
              Get Custom Plan
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
