"use client"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

import { motion, AnimatePresence } from "framer-motion"
import {
  FaPhone,
  FaCar,
  FaQuoteLeft,
  FaArrowRight,
  FaStar,
  FaClock,
  FaUserTie,
  FaCalendarAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaGasPump,
  FaCogs,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaBed,
  FaMapMarkerAlt,
  FaAirFreshener,
} from "react-icons/fa"
import { MdPlace, MdRateReview,  MdRoomService } from "react-icons/md"
import { BiBookReader } from "react-icons/bi"
import Link from "next/link"
import { useUjjain } from "../components/context/UjjainContext"

export default function ModernHome() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentReview, setCurrentReview] = useState(0)
   const {places, cars, logistics, hotels} = useUjjain()
  const brand = {
    name: "Sacred Ujjain Tours",
  }
/*  */
  /* const places = [
    {
      title: "Discover Sacred Ujjain",
      subtitle: "Experience the spiritual heart of India",
      description: "Explore ancient temples, sacred ghats, and divine experiences in the holy city of Ujjain",
      images: [{ url: "/mandu2.jpeg" }],
      reviews: 4.9,
    },
    {
      title: "Mahakaleshwar Temple",
      subtitle: "One of the 12 Jyotirlingas",
      description: "Visit the most sacred temple dedicated to Lord Shiva in the heart of Ujjain",
      images: [{ url: "/tower1.jpeg" }],
      reviews: 4.8,
    },
    {
      title: "Kumbh Mela Experience",
      subtitle: "Witness the grand spiritual gathering",
      description: "Be part of the worlds largest religious gathering at the sacred Shipra River",
      images: [{ url: "/mandu2.jpeg" }],
      reviews: 4.9,
    },
  ] */

  const features = [
    {
      icon: <FaCar className="text-4xl text-orange-500" />,
      title: "Premium Car Rentals",
      description: "Comfortable and reliable vehicles for your Ujjain journey",
      link: "/cars",
    },
    {
      icon: <FaUserTie className="text-4xl text-orange-500" />,
      title: "Expert Guides",
      description: "Knowledgeable local guides for authentic spiritual experiences",
      link: "/guides",
    },
    {
      icon: <FaStar className="text-4xl text-orange-500" />,
      title: "Sacred Places",
      description: "Detailed guides to all holy sites and temples in Ujjain",
      link: "/places",
    },
    {
      icon: <FaClock className="text-4xl text-orange-500" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your travel needs",
      link: "/contact",
    },
  ]

  const premiumCars = [
    {
      name: "Toyota Innova Crysta",
      image: "/placeholder.svg?height=300&width=400",
      type: "SUV",
      seating: "7+1",
      fuel: "Diesel",
      transmission: "Automatic",
      price: "₹3,500/day",
      features: ["AC", "GPS", "Music System", "Comfortable Seats"],
      rating: 4.8,
      available: true,
    },
    {
      name: "Maruti Swift Dzire",
      image: "/placeholder.svg?height=300&width=400",
      type: "Sedan",
      seating: "4+1",
      fuel: "Petrol",
      transmission: "Manual",
      price: "₹2,200/day",
      features: ["AC", "Music System", "Power Steering", "Central Lock"],
      rating: 4.6,
      available: true,
    },
    {
      name: "Mahindra Scorpio",
      image: "/placeholder.svg?height=300&width=400",
      type: "SUV",
      seating: "7+1",
      fuel: "Diesel",
      transmission: "Manual",
      price: "₹3,200/day",
      features: ["AC", "4WD", "Music System", "Spacious"],
      rating: 4.7,
      available: true,
    },
    {
      name: "Honda City",
      image: "/placeholder.svg?height=300&width=400",
      type: "Sedan",
      seating: "4+1",
      fuel: "Petrol",
      transmission: "CVT",
      price: "₹2,800/day",
      features: ["AC", "Sunroof", "Premium Interior", "Safety Features"],
      rating: 4.9,
      available: false,
    },
    {
      name: "Tata Safari",
      image: "/placeholder.svg?height=300&width=400",
      type: "SUV",
      seating: "6+1",
      fuel: "Diesel",
      transmission: "Automatic",
      price: "₹4,200/day",
      features: ["AC", "Premium Seats", "Infotainment", "Safety Tech"],
      rating: 4.8,
      available: true,
    },
  ]

  const premiumHotels = [
    {
      name: "Hotel Mahakal Palace",
      image: "/placeholder.svg?height=300&width=400",
      category: "Luxury",
      location: "Near Mahakaleshwar Temple",
      distance: "0.2 km from temple",
      price: "₹3,500/night",
      rating: 4.8,
      reviews: 342,
      amenities: ["Free WiFi", "AC", "Restaurant", "Room Service", "Swimming Pool"],
      roomTypes: ["Deluxe", "Suite", "Premium"],
      description: "Luxury hotel with stunning temple views and premium amenities for a comfortable stay.",
    },
    {
      name: "Ujjain Heritage Resort",
      image: "/placeholder.svg?height=300&width=400",
      category: "Heritage",
      location: "Ram Ghat Road",
      distance: "0.5 km from Mahakaleshwar",
      price: "₹4,200/night",
      rating: 4.7,
      reviews: 289,
      amenities: ["Free WiFi", "AC", "Restaurant", "Swimming Pool", "Cultural Programs"],
      roomTypes: ["Heritage Room", "Royal Suite"],
      description: "Experience traditional hospitality in this beautifully designed heritage property.",
    },
    {
      name: "Sacred Stay Inn",
      image: "/placeholder.svg?height=300&width=400",
      category: "Mid-Range",
      location: "Temple Street",
      distance: "0.3 km from temple",
      price: "₹2,200/night",
      rating: 4.6,
      reviews: 156,
      amenities: ["Free WiFi", "AC", "Restaurant", "24/7 Service"],
      roomTypes: ["Standard", "Deluxe"],
      description: "Comfortable accommodation with modern amenities and spiritual ambiance.",
    },
    {
      name: "Spiritual Suites",
      image: "/placeholder.svg?height=300&width=400",
      category: "Boutique",
      location: "Kal Bhairav Road",
      distance: "0.4 km from temple",
      price: "₹3,800/night",
      rating: 4.9,
      reviews: 198,
      amenities: ["Free WiFi", "AC", "Meditation Hall", "Yoga Classes", "Organic Restaurant"],
      roomTypes: ["Meditation Suite", "Spiritual Deluxe"],
      description: "Unique boutique hotel designed for spiritual seekers with meditation facilities.",
    },
    {
      name: "Temple View Lodge",
      image: "/placeholder.svg?height=300&width=400",
      category: "Budget",
      location: "Market Square",
      distance: "0.6 km from temple",
      price: "₹1,500/night",
      rating: 4.4,
      reviews: 124,
      amenities: ["Free WiFi", "AC", "Restaurant", "Temple View"],
      roomTypes: ["Standard", "Family Room"],
      description: "Budget-friendly accommodation with great temple views and essential amenities.",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment:
        "Amazing service! The car was clean and the driver was very knowledgeable about Ujjain temples. Our guide made the experience truly spiritual.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment:
        "Perfect guidance throughout our journey. The local guide shared incredible stories about each temple. Highly recommended for spiritual seekers!",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad",
      rating: 5,
      comment:
        "Excellent 24/7 support. They helped us plan the perfect darshan schedule during Kumbh Mela. The guide was exceptional!",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Sunita Devi",
      location: "Jaipur",
      rating: 5,
      comment:
        "The most authentic spiritual experience. Our guide knew every detail about the temples and their significance. Truly blessed journey!",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Vikram Singh",
      location: "Indore",
      rating: 5,
      comment:
        "Professional service with deep spiritual knowledge. The guide made our pilgrimage meaningful and memorable. Will definitely return!",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const popularPlaces = [
    {
      title: "Mahakaleshwar Temple",
      images: [{ url: "/placeholder.svg?height=300&width=400" }],
      description: "Sacred Jyotirlinga temple",
      reviews: 4.9,
    },
    {
      title: "Ram Ghat",
      images: [{ url: "/placeholder.svg?height=300&width=400" }],
      description: "Holy bathing ghat on Shipra",
      reviews: 4.8,
    },
    {
      title: "Kal Bhairav Temple",
      images: [{ url: "/placeholder.svg?height=300&width=400" }],
      description: "Ancient temple of Lord Bhairav",
      reviews: 4.7,
    },
    {
      title: "Vedh Shala",
      images: [{ url: "/placeholder.svg?height=300&width=400" }],
      description: "Historic astronomical observatory",
      reviews: 4.6,
    },
    {
      title: "Chintaman Ganesh",
      images: [{ url: "/placeholder.svg?height=300&width=400" }],
      description: "Revered Ganesh temple",
      reviews: 4.8,
    },
    {
      title: "Sandipani Ashram",
      images: [{ url: "/placeholder.svg?height=300&width=400" }],
      description: "Krishna's ancient gurukul",
      reviews: 4.7,
    },
  ]

  const blogs = [
    {
      title: "Complete Guide to Mahakaleshwar Temple Darshan",
      excerpt:
        "Everything you need to know about visiting the sacred Jyotirlinga temple, including timings, rituals, and best practices.",
      image: "/placeholder.svg?height=200&width=300",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      views: "2.5k",
    },
    {
      title: "Kumbh Mela 2025: A Pilgrim's Complete Guide",
      excerpt:
        "Prepare for the grand spiritual gathering with our comprehensive guide covering dates, accommodations, and sacred rituals.",
      image: "/placeholder.svg?height=200&width=300",
      date: "Dec 10, 2024",
      readTime: "8 min read",
      views: "4.2k",
    },
    {
      title: "Hidden Gems: Lesser Known Temples of Ujjain",
      excerpt:
        "Discover the spiritual treasures beyond the famous temples, including ancient shrines with fascinating histories.",
      image: "/placeholder.svg?height=200&width=300",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      views: "1.8k",
    },
  ]

  // Auto-advance reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % testimonials.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Swiper */}
      <section className="relative sm:h-screen h-[80vh]">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="h-full max-h-screen"
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        >
          {places.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <img
                  src={slide?.images[0]?.url || "/mandu2.jpeg"}
                  alt={slide?.title}
                  className="w-full sm:max-h-screen sm:h-screen h-[70vh] object-cover"
                />
                <div className="absolute inset-0 bg-[#0000009e]">
                  <div className="container mx-auto px-4 h-full flex items-center">
                    <motion.div
                      className="text-white max-w-2xl"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        {slide?.title}
                      </motion.h1>
                      <motion.h2
                        className="text-2xl hidden md:text-3xl mb-6 text-orange-400"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        {slide?.subtitle}
                      </motion.h2>
                      <motion.p
                        className="text-xl mb-8 leading-relaxed line-clamp-2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        {slide.description}
                      </motion.p>
                      <motion.div
                        className="flex flex-wrap gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      >
                        <Link
                          href="/cars"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center"
                        >
                          Book Car <FaCar className="ml-2" />
                        </Link>
                        <Link
                          href="/hotels"
                          className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center"
                        >
                          Book Hotel <FaBed className="ml-2" />
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 24/7 Help Banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white py-4 z-10">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <FaPhone className="mr-3 text-xl animate-pulse" />
            <span className="text-lg font-semibold">24/7 Help Available - Call: +91-9876543210</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Why Choose {brand.name}?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive travel services to make your spiritual journey to Ujjain memorable and
              hassle-free
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Link href={feature.link}>
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <div className="flex items-center justify-center text-orange-500 font-semibold">
                      Learn More <FaArrowRight className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* Cars */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Premium Car Rentals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our fleet of well-maintained vehicles for a comfortable journey to Ujjain's sacred sites
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1000}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="cars-swiper"
          >
            {cars.map((car, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  whileHover={{ y: -8 }}
                >
                  <div className="relative">
                    <img
                      src={car.images[0].url || "./bol.png"}
                      alt={car.model}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${car.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {car.available ? "Available" : "Booked"}
                    </div>
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {car.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-black mb-2">{car.model}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaUsers className="mr-2 text-orange-500" />
                        <span>{car.seating} Seater</span>
                      </div>
                      <div className="flex items-center">
                        <FaGasPump className="mr-2 text-orange-500" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center">
                        <FaCogs className="mr-2 text-orange-500" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="mr-1 text-orange-500" />
                        <span>{car.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-orange-600">{car.price}</div>
                      <Link
                        href="/cars"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center"
                      >
                        Book Now <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/cars"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center shadow-lg"
            >
              View All Cars <FaCar className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
{/* Hotels */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Premium Hotels in Ujjain</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay close to sacred temples with our handpicked hotels offering comfort, convenience, and spiritual
              ambiance
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
            loop={true}
            speed={1000}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="hotels-swiper"
          >
            {hotels.map((hotel, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group h-full"
                  whileHover={{ y: -8 }}
                >
                  <div className="relative">
                    <img
                      src={hotel.images[0].url || "/hotel2.jpeg"}
                      alt={hotel.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {hotel.category}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {hotel.distance}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-black mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-3 flex items-center">
                      <MdPlace className="mr-2 text-orange-500" />
                      {hotel.location}
                    </p>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">{hotel.description}</p>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-4">
                        <FaStar className="text-orange-500 mr-1" />
                        <span className="font-semibold">{hotel.rating}</span>
                        <span className="text-gray-500 ml-1">({hotel.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center"
                        >
                          {amenity === "Free WiFi" && <FaWifi className="mr-1" />}
                          {amenity === "AC" && <FaAirFreshener className="mr-1" />}
                          {amenity === "Restaurant" && <FaUtensils className="mr-1" />}
                          {amenity === "Swimming Pool" && <FaSwimmingPool className="mr-1" />}
                          {amenity === "Room Service" && <MdRoomService className="mr-1" />}
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Room Types:</p>
                          <p className="text-sm font-medium">{hotel.roomTypes.join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600">{hotel.price}</div>
                        <Link
                          href="/hotels"
                          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center"
                        >
                          Book Now <FaArrowRight className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/hotels"
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center shadow-lg"
            >
              View All Hotels <FaBed className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Popular Places Section with Smooth Slider */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Popular Sacred Places</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most revered temples and holy sites in Ujjain
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              reverseDirection: false,
            }}
            loop={true}
            speed={1000}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="places-swiper"
          >
            {places.map((place, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={place?.images[0]?.url || "/tower1.jpeg"}
                    alt={place.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-2">{place.title}</h3>
                    <p className="text-gray-600 mb-4">{place.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaStar className="text-orange-500 mr-1" />
                        <span className="font-semibold">{place.reviews}</span>
                      </div>
                      <Link
                        href="/places"
                        className="text-orange-500 font-semibold hover:text-orange-600 flex items-center"
                      >
                        Explore <FaArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/places"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center"
            >
              View All Places <MdPlace className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-20 bg-white hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Latest Travel Insights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read our expert guides and tips for the perfect spiritual journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FaCalendarAlt className="mr-2" />
                    <span>{blog.date}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.readTime}</span>
                    <span className="mx-2">•</span>
                    <FaEye className="mr-1" />
                    <span>{blog.views}</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                  <Link href="/blogs" className="text-orange-500 font-semibold hover:text-orange-600 flex items-center">
                    Read More <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/blogs"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center"
            >
              View All Blogs <BiBookReader className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Reviews Section with Unique Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">What Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read reviews from pilgrims who experienced Ujjain with our services
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Main Review Display */}
            <div className="relative h-80 overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-center"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonials[currentReview].image || "/placeholder.svg"}
                      alt={testimonials[currentReview].name}
                      className="w-20 h-20 rounded-full mr-6 border-4 border-orange-500"
                    />
                    <div>
                      <h4 className="font-bold text-xl text-black">{testimonials[currentReview].name}</h4>
                      <p className="text-gray-600 text-lg">{testimonials[currentReview].location}</p>
                      <div className="flex mt-2">
                        {[...Array(testimonials[currentReview].rating)].map((_, i) => (
                          <FaStar key={i} className="text-orange-500 text-lg" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <FaQuoteLeft className="text-orange-500 text-3xl mb-4" />
                    <p className="text-gray-700 text-lg italic leading-relaxed">
                      {testimonials[currentReview].comment}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevReview}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
            >
              <FaChevronRight />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentReview ? "bg-orange-500 w-8" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail Reviews */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {testimonials.map((testimonial, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    index === currentReview
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-orange-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-black truncate">{testimonial.name}</p>
                  <div className="flex justify-center mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-orange-500 text-xs" />
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/reviews"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 inline-flex items-center"
            >
              Read More Reviews <MdRateReview className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section
        className="py-20 text-white relative"
        style={{
          backgroundImage: `url('/placeholder.svg?height=600&width=1200')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Explore Sacred Ujjain?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Book your car and hotel now for an unforgettable spiritual journey to the holy city of Ujjain
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              href="/cars"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Book Car Now
            </Link>
            <Link
              href="/hotels"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Book Hotel Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
