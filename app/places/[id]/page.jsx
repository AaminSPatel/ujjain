"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaCamera,
  FaHeart,
  FaShare,
  FaPhone,
  FaRoute,
  FaCalendar,
} from "react-icons/fa"
import { MdTempleHindu } from "react-icons/md"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import BottomTabBar from "../../components/BottomTabBar"
import RecommendedSection from "../../components/RecommendedSection"
import ReviewModal from "../../components/ReviewModal"
import SEOHead from "../../components/SEOHead"
import { useUjjain } from "../../components/UjjainContext"

export default function PlaceDetail({ params }) {
  const { addToFavorites, removeFromFavorites, favorites, reviews } = useUjjain()
  const [place, setPlace] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [recommendedCars, setRecommendedCars] = useState([])
  const [recommendedHotels, setRecommendedHotels] = useState([])

  // Mock place data
  const placeData = {
    1: {
      id: 1,
      name: "Mahakaleshwar Temple",
      category: "temples",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      rating: 4.9,
      reviews: 2847,
      description:
        "One of the twelve Jyotirlingas, this ancient temple is dedicated to Lord Shiva and is the most sacred site in Ujjain. The temple is famous for its unique Bhasma Aarti performed early morning.",
      timings: "4:00 AM - 11:00 PM",
      entryFee: "Free",
      bestTime: "Early morning for Bhasma Aarti",
      highlights: ["Bhasma Aarti", "Jyotirlinga Darshan", "Evening Aarti", "Sacred Architecture"],
      location: "Mahakaleshwar Temple Road, Ujjain",
      coordinates: { lat: 23.1765, lng: 75.7685 },
      history:
        "The Mahakaleshwar Temple has a rich history dating back to ancient times. According to Hindu scriptures, the Jyotirlinga at Mahakaleshwar is swayambhu (self-manifested), making it extremely sacred.",
      architecture:
        "The temple showcases magnificent Maratha architecture with intricate carvings and beautiful sculptures. The main sanctum houses the Jyotirlinga in a underground chamber.",
      festivals: ["Mahashivratri", "Shravan Month", "Nag Panchami", "Kartik Purnima"],
      nearbyAttractions: ["Ram Ghat", "Kal Bhairav Temple", "Harsiddhi Temple"],
      travelCount: 15420,
      photoCount: 3240,
    },
  }

  useEffect(() => {
    const currentPlace = placeData[params.id]
    if (currentPlace) {
      setPlace(currentPlace)
      setIsLiked(favorites.some((fav) => fav.id === currentPlace.id && fav.type === "place"))
    }

    // Mock recommended data
    setRecommendedCars([
      {
        id: 1,
        name: "Maruti Swift Dzire",
        image: "/placeholder.svg",
        rating: 4.8,
        price: 1200,
        description: "Perfect for temple visits",
      },
      {
        id: 2,
        name: "Toyota Innova",
        image: "/placeholder.svg",
        rating: 4.9,
        price: 2500,
        description: "Spacious family car",
      },
    ])

    setRecommendedHotels([
      {
        id: 1,
        name: "Hotel Mahakal Palace",
        image: "/placeholder.svg",
        rating: 4.8,
        price: 3500,
        description: "Luxury hotel near temple",
      },
      {
        id: 2,
        name: "Temple View Lodge",
        image: "/placeholder.svg",
        rating: 4.2,
        price: 900,
        description: "Budget accommodation",
      },
    ])
  }, [params.id, favorites])

  const handleLike = () => {
    if (isLiked) {
      removeFromFavorites(place.id)
    } else {
      addToFavorites({ ...place, type: "place" })
    }
    setIsLiked(!isLiked)
  }

  const placeReviews = reviews.filter((review) => review.itemId === place?.id && review.type === "place")

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading place details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${place.name} - Sacred Places in Ujjain | Ujjain Travel`}
        description={place.description}
        keywords={`${place.name}, ujjain temples, ${place.category}, ujjain tourism`}
        image={place.images[0]}
      />

      <Header />

      {/* Image Gallery */}
      <section className="relative">
        <div className="h-96 md:h-[500px] relative overflow-hidden">
          <img
            src={place.images[selectedImageIndex] || "/placeholder.svg"}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">{place.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-semibold">{place.rating}</span>
                      <span className="ml-1">({place.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <FaCamera className="mr-1" />
                      <span>{place.photoCount} photos</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isLiked ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-red-500"
                    }`}
                  >
                    <FaHeart />
                  </motion.button>
                  <button className="p-3 bg-white/20 text-white rounded-full hover:bg-blue-500 transition-all duration-300">
                    <FaShare />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Thumbnails */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {place.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  selectedImageIndex === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-6 bg-gradient-to-r from-orange-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{place.travelCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Travelers Visited</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{place.rating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{place.reviews}</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{place.photoCount}</div>
              <div className="text-sm text-gray-600">Photos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About {place.name}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{place.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Essential Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaClock className="text-orange-500 mr-3" />
                        <div>
                          <div className="font-medium">Timings</div>
                          <div className="text-sm text-gray-600">{place.timings}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-gray-600">{place.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MdTempleHindu className="text-purple-500 mr-3" />
                        <div>
                          <div className="font-medium">Entry Fee</div>
                          <div className="text-sm text-gray-600">{place.entryFee}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {place.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* History & Architecture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">History & Architecture</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Historical Significance</h3>
                    <p className="text-gray-700 leading-relaxed">{place.history}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Architecture</h3>
                    <p className="text-gray-700 leading-relaxed">{place.architecture}</p>
                  </div>
                </div>
              </motion.div>

              {/* Festivals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Major Festivals</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {place.festivals.map((festival, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl text-center"
                    >
                      <FaCalendar className="text-purple-500 mx-auto mb-2" />
                      <div className="font-semibold text-gray-800">{festival}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Reviews ({placeReviews.length})</h2>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-orange-500 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
                  >
                    Write Review
                  </button>
                </div>

                <div className="space-y-6">
                  {placeReviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-800">{review.name}</div>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-500 text-sm" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Actions */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Plan Your Visit</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300">
                      <FaRoute className="inline mr-2" />
                      Get Directions
                    </button>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-colors duration-300">
                      <FaPhone className="inline mr-2" />
                      Call for Info
                    </button>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="w-full bg-green-500 text-white py-3 rounded-2xl font-semibold hover:bg-green-600 transition-colors duration-300"
                    >
                      Write Review
                    </button>
                  </div>
                </div>

                {/* Best Time to Visit */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Best Time to Visit</h3>
                  <p className="text-gray-700 mb-4">{place.bestTime}</p>
                  <div className="bg-orange-50 p-4 rounded-2xl">
                    <div className="font-semibold text-orange-600 mb-2">Pro Tip</div>
                    <p className="text-sm text-orange-700">
                      Visit early morning for a peaceful darshan experience and to witness the beautiful sunrise.
                    </p>
                  </div>
                </div>

                {/* Nearby Attractions */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Nearby Attractions</h3>
                  <div className="space-y-3">
                    {place.nearbyAttractions.map((attraction, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                      >
                        <FaMapMarkerAlt className="text-orange-500 mr-3" />
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Cars */}
      <RecommendedSection type="cars" title="Recommended Cars for Your Visit" items={recommendedCars} />

      {/* Recommended Hotels */}
      <RecommendedSection type="hotels" title="Stay Near {place.name}" items={recommendedHotels} />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        type="place"
        itemId={place.id}
        itemName={place.name}
      />

      <Footer />
      <BottomTabBar />
    </div>
  )
}
