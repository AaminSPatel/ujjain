"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaCamera,
  FaHeart,
  FaShare,
  FaRoute,
  FaFilter,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from "react-icons/fa"
import { MdTempleHindu, MdWaves } from "react-icons/md"
import Link from "next/link"
import { useUjjain } from "@/components/context/UjjainContext"

export default function Places() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [imageIndexes, setImageIndexes] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { places} = useUjjain()

  // Updated filter states to match schema
  const [filters, setFilters] = useState({
    rating: 0,
    price: "all",
    cleaness: "all",
    bestTime: "all",
  })

  const placesPerPage = 9

  // State for derived data
  const [categories, setCategories] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [currentPlaces, setCurrentPlaces] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  const [allPlaces, setAllPlaces] = useState([])

  useEffect(() => {
    if (places) {
      if (places.length > 0) {
        setAllPlaces(places)
       // setCurrentPlaces(contextPlaces)
        setIsLoading(false)
        setError(null)
      } else {
        setError("No places data available")
        setIsLoading(false)
      }
    }
  }, [places])

  // Calculate categories when places change
  useEffect(() => {
    if (!places || places.length === 0) {
      setCategories([])
      return
    }
    
    const newCategories = [
      { id: "all", name: "All Places", icon: <MdTempleHindu />, count: places.length },
      {
        id: "temples",
        name: "Temples",
        icon: <MdTempleHindu />,
        count: places.filter((p) => p.category === "temples").length,
      },
      { id: "ghats", name: "Ghats", icon: <MdWaves />, count: places.filter((p) => p.category === "ghats").length },
      {
        id: "historical",
        name: "Historical",
        icon: <FaCamera />,
        count: places.filter((p) => p.category === "historical").length,
      },
      {
        id: "cultural",
        name: "Cultural",
        icon: <FaRoute />,
        count: places.filter((p) => p.category === "cultural").length,
      },
    ]
    
    setCategories(newCategories)
  }, [places])

  // Auto-change images for each place
  useEffect(() => {
    if (places.length === 0) return
    
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const newIndexes = { ...prev }
        allPlaces.forEach((place) => {
          if (place.images && place.images.length > 1) {
            const currentIndex = newIndexes[place._id] || 0
            newIndexes[place._id] = (currentIndex + 1) % place.images.length
          }
        })
        return newIndexes
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [places])

  // Filter places and handle pagination
  useEffect(() => {
    if (!places || places.length === 0) {
      setFilteredPlaces([])
      setCurrentPlaces([])
      setTotalPages(0)
      return
    }
    
    // Updated filter logic to match schema
    const newFilteredPlaces = places.filter((place) => {
      if (!place || typeof place !== 'object') return false
      
      const matchesCategory = selectedCategory === "all" || 
        (place.category && place.category === selectedCategory)
      
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        (place.title && place.title.toLowerCase().includes(searchLower)) ||
        (place.description && place.description.toLowerCase().includes(searchLower)) ||
        (place.location && place.location.toLowerCase().includes(searchLower))
      
      const matchesRating = place.rating && place.rating >= filters.rating
      const matchesPrice = filters.price === "all" || 
        (place.entryFee && (
          (filters.price === "free" && place.entryFee === 0) ||
          (filters.price === "paid" && place.entryFee > 0) ||
          (filters.price === "premium" && place.entryFee > 100)
        ))
      const matchesCleaness = filters.cleaness === "all" || 
        (place.cleaness && place.cleaness >= Number(filters.cleaness))
      const matchesBestTime = filters.bestTime === "all" || 
        (place.bestTimeToVisit && place.bestTimeToVisit.toLowerCase().includes(filters.bestTime))

      return (
        matchesCategory && 
        matchesSearch && 
        matchesRating && 
        matchesPrice && 
        matchesCleaness &&
        matchesBestTime
      )
    })

    setFilteredPlaces(newFilteredPlaces)
    
    // Pagination logic
    const newTotalPages = Math.ceil(newFilteredPlaces.length / placesPerPage)
    setTotalPages(newTotalPages)
    
    // Reset to first page if current page exceeds new total pages
    const safePage = currentPage > newTotalPages ? 1 : currentPage
    if (currentPage !== safePage) {
      setCurrentPage(safePage)
    } else {
      const startIndex = (safePage - 1) * placesPerPage
      const endIndex = startIndex + placesPerPage
      setCurrentPlaces(newFilteredPlaces.slice(startIndex, endIndex))
    }
  }, [ selectedCategory, searchQuery, filters, currentPage, placesPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, filters])

  const toggleFavorite = (placeId) => {
    setFavorites((prev) => (prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]))
  }

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      rating: 0,
      price: "all",
      cleaness: "all",
      bestTime: "all",
    })
    setSearchQuery("")
    setSelectedCategory("all")
  }

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sacred places...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Error Loading Places</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 text-white"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Sacred Places of Ujjain
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover the divine temples, holy ghats, and historical sites that make Ujjain a spiritual destination
          </motion.p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search places by title, description or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <FaFilter />
              <span>Filters</span>
              <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FaChevronDown />
              </motion.div>
            </button>

            {/* Results Count */}
            <div className="text-gray-600 font-medium">{filteredPlaces.length} places found</div>
          </div>

          {/* Expandable Filters - Updated to match schema */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 bg-white rounded-xl p-6 shadow-lg overflow-hidden"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => updateFilter("rating", Number.parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value={0}>All Ratings</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Fee</label>
                    <select
                      value={filters.price}
                      onChange={(e) => updateFilter("price", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Prices</option>
                      <option value="free">Free Entry</option>
                      <option value="paid">Paid Entry</option>
                      <option value="premium">Premium (100+)</option>
                    </select>
                  </div>

                  {/* Cleanliness Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cleanliness</label>
                    <select
                      value={filters.cleaness}
                      onChange={(e) => updateFilter("cleaness", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Levels</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>

                  {/* Best Time to Visit Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Best Time to Visit</label>
                    <select
                      value={filters.bestTime}
                      onChange={(e) => updateFilter("bestTime", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="all">Any Time</option>
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end md:col-span-2 lg:col-span-4">
                    <button
                      onClick={clearFilters}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <FaTimes />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                <span>{category.name}</span>
                <span className="bg-white text-black bg-opacity-20 px-2 py-1 rounded-full text-xs">{category.count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {currentPlaces.length === 0 ? (
            <motion.div className="text-center py-16" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
              <MdTempleHindu className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No places found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentPlaces.map((place, index) => (
                  <motion.div
                    key={place._id || index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Place Image with Auto-change */}
                    <div className="relative h-64 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={imageIndexes[place._id] || 0}
                          src={place.images?.[imageIndexes[place._id] || 0]?.url || "/placeholder.svg"}
                          alt={place.title}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                        />
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={() => toggleFavorite(place._id)}
                          className={`p-3 rounded-full transition-all duration-300 ${
                            favorites.includes(place._id)
                              ? "bg-red-500 text-white shadow-lg"
                              : "bg-white bg-opacity-90 text-gray-600 hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          <FaHeart />
                        </button>
                        <button className="p-3 bg-white bg-opacity-90 text-gray-600 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300">
                          <FaShare />
                        </button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 backdrop-blur-sm">
                          {place.category?.charAt(0).toUpperCase() + place.category?.slice(1) || "Place"}
                        </span>
                      </div>

                      {/* Image Counter */}
                      {place.images?.length > 1 && (
                        <div className="absolute bottom-4 right-4">
                          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <FaCamera />
                            <span>
                              {(imageIndexes[place._id] || 0) + 1}/{place.images.length}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Place Details - Updated to match schema */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-black mb-1 line-clamp-1">{place.title}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaMapMarkerAlt className="mr-1" />
                            <span>{place.location}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center">
                            <FaStar className="text-orange-500 mr-1" />
                            <span className="font-semibold">{place.rating || 0}</span>
                          </div>
                          <span className="text-gray-500 text-sm">({place.visitors || 0} visitors)</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">{place.description}</p>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaClock className="mr-2 text-orange-500 flex-shrink-0" />
                          <span className="truncate">{place.openingHours || "Timings not specified"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaEye className="mr-2 text-orange-500 flex-shrink-0" />
                          <span className="truncate">Best time: {place.bestTimeToVisit || "Any time"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2 text-orange-500 flex-shrink-0">₹</span>
                          <span className="truncate">
                            {place.entryFee === 0 ? "Free entry" : `Entry fee: ₹${place.entryFee}`}
                          </span>
                        </div>
                      </div>

                      {/* Cleanliness Rating */}
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">Cleanliness:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${
                                  i < (place.cleaness || 0) ? "text-orange-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Link
                          href={`/places/${place._id}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          View Details
                        </Link>
                        <Link
                          href="/booking"
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          Book Tour
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex justify-center items-center space-x-2 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Previous Button */}
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-orange-500 hover:text-white shadow-md"
                }`}
              >
                <FaChevronLeft />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    currentPage === page
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-orange-100 shadow-md"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-orange-500 hover:text-white shadow-md"
                }`}
              >
                <FaChevronRight />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 text-white relative"
        style={{
          backgroundImage: `url('/placeholder.svg?height=400&width=1200')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Plan Your Sacred Journey
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Let us help you create a personalized itinerary to explore all the sacred places of Ujjain
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              href="/booking"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Book Complete Tour
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Custom Plan
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}