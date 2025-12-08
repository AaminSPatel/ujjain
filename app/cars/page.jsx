"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaCar,
  FaUsers,
  FaGasPump,
  FaStar,
  FaHeart,
  FaPhone,
  FaShieldAlt,
  FaFilter,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa"
import { MdAirlineSeatReclineExtra, MdLuggage } from "react-icons/md"
import Link from "next/link"
import Image from "next/image"
import { useUjjain } from "@/components/context/UjjainContext"
import Head from "next/head"

export default function Cars() {
 const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { cars ,getAverageRating,brand} = useUjjain()
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    carType: "all",
    gearType: "all",
    seats: "all",
    availability: "all",
  })

  // Calculate categories count based on current cars data
  const categories = useMemo(() => [
    { id: "all", name: "All Vehicles", count: cars.length },
    { id: "car", name: "Car", count: cars.filter((car) => car.category === "car").length },
    { id: "bike", name: "Bike", count: cars.filter((car) => car.category === "bike").length },
    { id: "bus", name: "Bus", count: cars.filter((car) => car.category === "bus").length },
    { id: "riksha", name: "Riksha", count: cars.filter((car) => car.category === "riksha").length },
    { id: "cab", name: "Cab", count: cars.filter((car) => car.category === "cab").length },
  ], [cars])

  // Filter cars based on all criteria
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesCategory = selectedCategory === "all" || car.category === selectedCategory
      const matchesSearch =
        car.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.detail?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = 
        car.pricePerDay >= filters.priceRange[0] && 
        car.pricePerDay <= filters.priceRange[1]
      const matchesCarType = filters.carType === "all" || car.type === filters.carType
      const matchesGearType = filters.gearType === "all" || car.geartype === filters.gearType
      const matchesSeats = filters.seats === "all" || car.seats.toString() === filters.seats
      const matchesAvailability = filters.availability === "all" || 
        (filters.availability ? car.availability : !car.availability)

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice &&
        matchesCarType &&
        matchesGearType &&
        matchesSeats &&
        matchesAvailability
      )
    })
  }, [cars, selectedCategory, searchQuery, filters])

  const toggleFavorite = (carId) => {
    setFavorites((prev) => (prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId])
    )}

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      carType: "all",
      gearType: "all",
      seats: "all",
      availability: "all",
    })
    setSearchQuery("")
    setSelectedCategory("all")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}


    <Head>
      {/* Primary Meta Tags */}
      <title>Safar Sathi - Premium Car Rentals & Taxi Services in Dewas, Indore, Ujjain | Best Cab Booking</title>
      <meta name="title" content="Safar Sathi - Premium Car Rentals & Taxi Services in Dewas, Indore, Ujjain | Best Cab Booking" />
      <meta name="description" content="Book premium car rentals & taxi services in Dewas, Indore, Ujjain. 24/7 cab booking for local rides, airport transfers, outstation trips. AC/Non-AC cars with verified drivers. Affordable prices, instant booking, safe rides for families & business travelers." />
      
      {/* Keywords */}
      <meta name="keywords" content="car rental Dewas, taxi service Indore, cab booking Ujjain, car hire MP, 24/7 taxi service, airport taxi, outstation cab, local taxi, AC car rental, premium cab service, affordable taxi, online cab booking, verified drivers, safe taxi service, family cab, business travel taxi, temple tour taxi, corporate cab, one-way taxi, round-trip cab, SUV rental, sedan car hire, Indore airport taxi, Dewas to Indore taxi, Ujjain to Dewas cab, MP tourism taxi, religious tour cab, business travel MP, Madhya Pradesh car rental, Central India taxi service, reliable cab operator, instant taxi booking, cheapest cab service, luxury car rental, budget taxi, group travel cab, wedding cab service, event transportation, hourly car rental, daily car hire, monthly car rental, long term cab service, short distance taxi, intercity travel cab, highway taxi service, verified taxi drivers, GPS enabled cabs, cashless payment taxi, online taxi booking app, car rental near me, taxi service nearby, cab booking app, Safar Sathi cars, Safar Sathi taxi booking, Safar Sathi car rental" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${brand.link}/cars`} />
      <meta property="og:title" content="Safar Sathi - Premium Car Rentals & Taxi Services in Dewas, Indore, Ujjain" />
      <meta property="og:description" content="Book 24/7 reliable car rentals & taxi services in Dewas, Indore, Ujjain. AC/Non-AC cabs for local rides, airport transfers, outstation trips with verified drivers." />
      <meta property="og:image" content={`${brand.link}/bg2.png`} />
      <meta property="og:site_name" content="Safar Sathi" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${brand.link}/cars`} />
      <meta property="twitter:title" content="Safar Sathi - Premium Car Rentals & Taxi Services" />
      <meta property="twitter:description" content="Book reliable 24/7 taxi services in Dewas, Indore, Ujjain. AC cars for local rides, airport transfers, outstation trips with verified drivers." />
      <meta property="twitter:image" content={`${brand.link}/bg2.png`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${brand.link}/cars`}  />
      
      {/* Alternate Languages - if you plan to add regional languages */}
      <link rel="alternate" href={`${brand.link}/cars`}  hrefLang="en-in" />
      <link rel="alternate" href={`${brand.link}/cars`}  hrefLang="en" />
      
      {/* Robots Meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Google Specific Meta */}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="google" content="nositelinkssearchbox" />
      <meta name="google" content="notranslate" />
      
      {/* Verification Meta - Add when you have these */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="facebook-domain-verification" content="your-verification-code" /> */}
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Safar Sathi" />
      <meta name="publisher" content="Safar Sathi" />
      <meta name="copyright" content="Safar Sathi" />
      <meta name="classification" content="Travel, Transportation, Car Rental, Taxi Service" />
      <meta name="category" content="travel, transport" />
      <meta name="coverage" content="India, Madhya Pradesh, Dewas, Indore, Ujjain" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="referrer" content="origin" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="robots" content="all" />
      
      {/* Mobile Specific */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      
      {/* Dublin Core Metadata */}
      <meta name="DC.title" content="Safar Sathi - Premium Car Rentals & Taxi Services" />
      <meta name="DC.creator" content="Safar Sathi" />
      <meta name="DC.subject" content="Car Rental, Taxi Service, Cab Booking, Transportation" />
      <meta name="DC.description" content="Premium car rentals and taxi services in Dewas, Indore, Ujjain for local and outstation travel" />
      <meta name="DC.publisher" content="Safar Sathi" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="en-IN" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Dewas, Indore, Ujjain, Madhya Pradesh" />
     {/*  <meta name="geo.position" content="22.9658;76.0550" />
      <meta name="ICBM" content="22.9658, 76.0550" />
      */} 
      {/* Site Links Search Box */}
      <meta name="google" content="nositelinkssearchbox" />
      
      {/* App Links */}
    {/*   <meta property="al:android:url" content="safarsathi://cars" />
      <meta property="al:android:app_name" content="Safar Sathi" />
      <meta property="al:android:package" content="com.safarsathi.app" /> */}
      <meta property="al:web:url" content={`${brand.link}/cars`}  />
      
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutomotiveBusiness",
            "name": "Safar Sathi",
            "description": "Premium car rental and taxi service provider in Dewas, Indore, Ujjain and surrounding areas",
            "url": `${brand.link}/cars` ,
            "telephone": `+91 ${brand.mobile}` ,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ujjain",
              "addressRegion": "Madhya Pradesh",
              "postalCode": "456001",
              "addressCountry": "IN"
            },
            
            "areaServed": ["Dewas", "Indore", "Ujjain", "Madhya Pradesh"],
            "serviceType": [
              "Taxi Service",
              "Car Rental",
              "Airport Transfer",
              "Outstation Taxi",
              "Local Cab Service"
            ],
            "offers": {
              "@type": "Offer",
              "description": "Affordable and premium car rental services"
            },
            
          })
        }}
      />
      
      {/* Additional Local Business Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Safar Sathi Car Rentals",
            "image": `${brand.link}/logo.png`,
            "@id": `${brand.link}/cars` ,
            "url": `${brand.link}/cars`,
            "telephone": `+91 ${brand.mobile}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Main Road",
              "addressLocality": "Ujjain",
              "addressRegion": "MP",
              "postalCode": "456001",
              "addressCountry": "IN"
            },
            
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            },
            "sameAs": [
              `${brand.link}/cars`
            ]
          })
        }}
      />
      
      {/* Service Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Car Rental & Taxi Service",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Safar Sathi"
            },
            "areaServed": {
              "@type": "State",
              "name": "Madhya Pradesh"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Taxi Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Local Taxi Service"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Outstation Taxi Service"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Airport Transfer Service"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Temple Tour Service"
                  }
                }
              ]
            }
          })
        }}
      />
      
      {/* Preload and Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* RSS Feed - if you have blog */}
      {/* <link rel="alternate" type="application/rss+xml" href="/rss.xml" title="Safar Sathi Blog" /> */}
    </Head>
  

      <section className="relative py-10 bg-black text-white overflow-hidden bg-cover" style={{backgroundImage:`url('./bg1.png')`}}>
        <div className="absolute inset-0  bg-gradient-to-t from-gray-800/90 to-sky-600/30 backdrop-opacity-20 text-white"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Premium Car Rentals
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose from our fleet of well-maintained vehicles with experienced drivers for your Ujjain journey
          </motion.p>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { icon: FaShieldAlt, text: "Verified Drivers", color: "text-green-500" },
              { icon: FaCar, text: "Well Maintained", color: "text-orange-500" },
              { icon: FaPhone, text: "24/7 Support", color: "text-orange-500" },
              { icon: FaStar, text: "Best Prices", color: "text-orange-500" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <item.icon className={`text-2xl ${item.color}`} />
                <span className="font-semibold text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 items-center justify-between">
            {/* Search Bar */}
           <div className="flex gap-2">
  <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars by name or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-white px-2 py-2 rounded-xl font-semibold transition-all duration-300"
            >
             {/*  <FaFilter /> */}
              <span>Filters</span>
              <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FaChevronDown />
              </motion.div>
            </button>
           </div>
          

            {/* Results Count */}
            <div className="text-gray-600 font-medium flex ">{filteredCars.length} cars found</div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 bg-gray-50 rounded-xl p-6 overflow-hidden"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={filters.priceRange[1]}
                        onChange={(e) => updateFilter("priceRange", [0, Number.parseInt(e.target.value)])}
                        className="w-full accent-amber-500"
                      />
                      <div className="text-sm text-gray-600">₹0 - ₹{filters.priceRange[1]}</div>
                    </div>
                  </div>

                  {/* Car Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Car Type</label>
                    <select
                      value={filters.carType}
                      onChange={(e) => updateFilter("carType", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                    </select>
                  </div>

                  {/* Gear Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                    <select
                      value={filters.gearType}
                      onChange={(e) => updateFilter("gearType", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seats</label>
                    <select
                      value={filters.seats}
                      onChange={(e) => updateFilter("seats", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Seats</option>
                      <option value="4">4 Seats</option>
                      <option value="5">5 Seats</option>
                      <option value="7">7 Seats</option>
                      <option value="8">8 Seats</option>
                    </select>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                    <select
                      value={filters.availability}
                      onChange={(e) => updateFilter("availability", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
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
                className={`px-3 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? "bg-amber-500 text-black shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category.name}</span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">{category.count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredCars?.length === 0 ? (
            <motion.div className="text-center py-16" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
              <FaCar className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No cars found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={clearFilters}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Car Image with Gradient */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-amber-50 to-sky-50">
                    <Image
                      src={car?.images[0]?.url || "/placeholder.svg?height=300&width=400"}
                      alt={car?.model}
                      width={400}
                      height={300}
                      className="w-full h-full object-contain relative z-10 mix-blend-multipl"
                    />

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(car._id)}
                      className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 z-20 ${
                        favorites.includes(car._id)
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-white bg-opacity-90 text-gray-600 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      <FaHeart />
                    </button>

                    {/* Availability Badge */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${
                          car.availability ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        <FaCheckCircle className="text-xs" />
                        <span>{car.availability}</span>
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-black bg-opacity-70 text-sm text-white px-2 py-1 rounded-full flex items-center justify-center space-x-1">
                        <FaMapMarkerAlt className="text-xs" />
                        <span className="truncate max-w-32">{car?.location|| 'Ujjain'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-black mb-1">{car.model}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-1" />
                          <span>Available 24/7</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <FaStar className="text-orange-500 mr-1" />
                          <span className="font-semibold">{getAverageRating(car?.reviews)}</span>
                        {car.reviews?.length &&<span className="text-gray-500 text-sm">({car?.reviews.length})</span>}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">{car.detail}</p>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <FaUsers className="text-orange-500" />
                        <span className="text-gray-700">{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FaGasPump className="text-orange-500" />
                        <span className="text-gray-700">{car.fueltype}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MdAirlineSeatReclineExtra className="text-orange-500" />
                        <span className="text-gray-700">{car.geartype}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MdLuggage className="text-orange-500" />
                        <span className="text-gray-700">Spacious</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
                          +{car.features.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-black">₹{car.pricePerKm} per Km</span>
                          <span className="text-gray-500">/day</span>
                        </div>
                        {car.pricePerKm && (
                          <span className="text-sm text-gray-500 line-through">₹{car.pricePerDay} per Day</span>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-600">Includes driver</div>
                        <div className="text-green-600 font-semibold">Free cancellation</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        href={`/cars/${car._id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/booking?car=${car._id}&serviceType=Car`}
                        className={`flex-1 text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                          car.availability
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {car.availability  ? "Book Now" : "Not Available"}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Cars */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose Our Vehicles?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We ensure the highest standards of safety, comfort, and reliability for your sacred journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "Verified Drivers",
                description:
                  "All our drivers are background verified, licensed, and have extensive knowledge of Ujjain temples and routes.",
                color: "bg-green-100 text-green-500",
              },
              {
                icon: FaCar,
                title: "Well Maintained Fleet",
                description:
                  "Regular maintenance, cleanliness checks, and safety inspections ensure a comfortable and safe journey.",
                color: "bg-orange-100 text-orange-500",
              },
              {
                icon: FaPhone,
                title: "24/7 Support",
                description:
                  "Round-the-clock customer support to assist you during your journey and handle any emergencies.",
                color: "bg-orange-100 text-orange-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${item.color}`}>
                  <item.icon className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
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
            Ready to Book Your Vehicle?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Choose from our premium fleet and experienced drivers for a comfortable journey to Ujjain's sacred places
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
              Book Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Quote
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
