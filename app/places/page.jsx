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
import Image from "next/image"
import { useUjjain } from "@/components/context/UjjainContext"
import Head from "next/head"

export default function Places() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [imageIndexes, setImageIndexes] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { places ,brand} = useUjjain()

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

    <Head>
      {/* Primary Meta Tags */}
      <title>Explore Top Places in Indore, Ujjain, Dewas, Bhopal, Dhar | Tourist Guide - Safar Sathi</title>
      <meta name="title" content="Explore Top Places in Indore, Ujjain, Dewas, Bhopal, Dhar | Tourist Guide - Safar Sathi" />
      <meta name="description" content="Complete travel guide to best places in Indore, Ujjain, Dewas, Bhopal, Dhar, Mahu, Rau, Mandaw. Discover temples, historical sites, tourist attractions, shopping areas, food streets with detailed information, timings, entry fees and travel tips." />
      
      {/* Keywords */}
      <meta name="keywords" content="places to visit in Indore, Ujjain tourist places, Dewas attractions, Bhopal tourism, Dhar historical sites, Mahu places, Rau attractions, Mandaw tourism, Mahakal Temple Ujjain, Rajwada Indore, Khajrana Temple, Bhimbetka Bhopal, Sanchi Stupa, Omkareshwar, Mandu Fort, Patalpani Waterfall, Indore food tour, Sarafa Bazaar, Chappan Dukan, Lal Bagh Palace, Kanch Mandir, Gomatgiri, Pipliyapala Park, Treasure Island Mall, Indore zoo, Ujjain temples, Dewas Mata Temple, Kalideh Palace, Bhopal lakes, Upper Lake, Lower Lake, Taj-ul-Masajid, Van Vihar, MP tourism, Central India travel, Madhya Pradesh attractions, religious places MP, historical sites MP, weekend getaways, family tourist spots, pilgrimage sites, adventure tourism, cultural heritage, sightseeing tours, local guides, travel information, tourist maps, best time to visit, entry fees, timings, photography spots, nearby hotels, transportation guide, Safar Sathi places, travel companion MP" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${brand.link}/places`} />
      <meta property="og:title" content="Explore Top Tourist Places in Indore, Ujjain, Dewas, Bhopal, Dhar | Travel Guide" />
      <meta property="og:description" content="Complete travel guide to best places in Indore, Ujjain, Dewas, Bhopal, Dhar. Discover temples, historical sites, tourist attractions with detailed information and travel tips." />
      <meta property="og:image" content={`${brand.link}/bg1.png`} />
      <meta property="og:site_name" content="Safar Sathi" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${brand.link}/places`} />
      <meta property="twitter:title" content="Explore Top Places in Indore, Ujjain, Dewas, Bhopal | Travel Guide" />
      <meta property="twitter:description" content="Complete travel guide to best tourist places in Indore, Ujjain, Dewas, Bhopal, Dhar with detailed information and travel tips." />
      <meta property="twitter:image" content={`${brand.link}/bg1.png`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${brand.link}/places`} />
      
      {/* Alternate Languages */}
      <link rel="alternate" href={`${brand.link}/places`} hrefLang="en-in" />
      <link rel="alternate" href={`${brand.link}/places`} hrefLang="en" />
      <link rel="alternate" href={`${brand.link}/places`} hrefLang="hi" />
      
      {/* Robots Meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Google Specific Meta */}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="google" content="nositelinkssearchbox" />
      <meta name="google" content="notranslate" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Safar Sathi" />
      <meta name="publisher" content="Safar Sathi" />
      <meta name="copyright" content="Safar Sathi" />
      <meta name="classification" content="Travel, Tourism, Places, Attractions, Guide" />
      <meta name="category" content="travel, tourism, places" />
      <meta name="coverage" content="India, Madhya Pradesh, Indore, Ujjain, Dewas, Bhopal, Dhar" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="referrer" content="origin" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      
      {/* Mobile Specific */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#8B5CF6" />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      
      {/* Dublin Core Metadata */}
      <meta name="DC.title" content="Tourist Places in Indore, Ujjain, Dewas, Bhopal - Safar Sathi" />
      <meta name="DC.creator" content="Safar Sathi" />
      <meta name="DC.subject" content="Tourism, Travel, Places, Attractions, Guide" />
      <meta name="DC.description" content="Comprehensive guide to tourist places in Indore, Ujjain, Dewas, Bhopal, Dhar and surrounding areas in Madhya Pradesh" />
      <meta name="DC.publisher" content="Safar Sathi" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="en-IN" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Indore, Ujjain, Dewas, Bhopal, Dhar, Madhya Pradesh" />
      <meta name="ICBM" content="22.7196, 75.8577" />
      
      {/* Site Links Search Box */}
      <meta name="google" content="nositelinkssearchbox" />
      
      {/* App Links */}
      <meta property="al:web:url" content={`${brand.link}/places`} />
      
      {/* Structured Data - JSON-LD for Tourist Guide */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Guide",
            "name": "Safar Sathi Travel Guide - Madhya Pradesh",
            "description": "Comprehensive travel guide to tourist places in Indore, Ujjain, Dewas, Bhopal, Dhar and surrounding areas in Madhya Pradesh",
            "url": `${brand.link}/places`,
            "about": {
              "@type": "Place",
              "name": "Madhya Pradesh",
              "containsPlace": [
                {"@type": "Place", "name": "Indore"},
                {"@type": "Place", "name": "Ujjain"},
                {"@type": "Place", "name": "Dewas"},
                {"@type": "Place", "name": "Bhopal"},
                {"@type": "Place", "name": "Dhar"},
                {"@type": "Place", "name": "Mahu"},
                {"@type": "Place", "name": "Rau"},
                {"@type": "Place", "name": "Mandaw"}
              ]
            },
            "hasPart": [
              {
                "@type": "Guide",
                "name": "Indore Tourist Places Guide",
                "description": "Complete guide to places in Indore including Rajwada, Khajrana Temple, Sarafa Bazaar and more"
              },
              {
                "@type": "Guide",
                "name": "Ujjain Pilgrimage Guide",
                "description": "Guide to religious places in Ujjain including Mahakal Temple and other sacred sites"
              },
              {
                "@type": "Guide",
                "name": "Bhopal Tourism Guide",
                "description": "Guide to lakes, historical sites and attractions in Bhopal"
              }
            ]
          })
        }}
      />
      
      {/* Local Business Structured Data for Travel Guide */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Safar Sathi Travel Guide Services",
            "description": "Professional travel guide and tourism information service for Madhya Pradesh covering Indore, Ujjain, Dewas, Bhopal and surrounding areas",
            "url": `${brand.link}/places`,
            "telephone": `+91 ${brand.mobile}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ujjain",
              "addressRegion": "Madhya Pradesh",
              "postalCode": "456001",
              "addressCountry": "IN"
            },
            "areaServed": ["Indore", "Ujjain", "Dewas", "Bhopal", "Dhar", "Mahu", "Rau", "Mandaw", "Madhya Pradesh"],
            "openingHours": "Mo-Su 00:00-23:59",
            "sameAs": [
              `${brand.link}/places`
            ]
          })
        }}
      />
      
      {/* Tourist Attractions Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "TouristAttraction",
                "name": "Mahakaleshwar Temple",
                "description": "One of the 12 Jyotirlingas dedicated to Lord Shiva, located in Ujjain",
                "url": `${brand.link}/places`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Ujjain",
                  "addressRegion": "Madhya Pradesh"
                },
                "publicAccess": true,
                "openingHours": "Mo-Su 04:00-23:00"
              },
              {
                "@type": "TouristAttraction",
                "name": "Rajwada Palace",
                "description": "Historical palace of the Holkar dynasty in Indore, showcasing Maratha architecture",
                "url": `${brand.link}/places`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Indore",
                  "addressRegion": "Madhya Pradesh"
                },
                "publicAccess": true
              },
              {
                "@type": "TouristAttraction",
                "name": "Khajrana Ganesh Temple",
                "description": "Famous temple dedicated to Lord Ganesha in Indore, known for wish fulfillment",
                "url": `${brand.link}/places`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Indore",
                  "addressRegion": "Madhya Pradesh"
                },
                "publicAccess": true
              },
              {
                "@type": "TouristAttraction",
                "name": "Bhimbetka Rock Shelters",
                "description": "UNESCO World Heritage Site with prehistoric rock paintings near Bhopal",
                "url": `${brand.link}/places`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Bhopal",
                  "addressRegion": "Madhya Pradesh"
                },
                "publicAccess": true
              },
              {
                "@type": "TouristAttraction",
                "name": "Sanchi Stupa",
                "description": "Ancient Buddhist complex and UNESCO World Heritage Site near Bhopal",
                "url": `${brand.link}/places`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Sanchi",
                  "addressRegion": "Madhya Pradesh"
                },
                "publicAccess": true
              },
              {
                "@type": "TouristAttraction",
                "name": "Mandu Fort",
                "description": "Historical fort city with Afghan architecture near Dhar",
                "url": `${brand.link}/places`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Mandu",
                  "addressRegion": "Madhya Pradesh"
                },
                "publicAccess": true
              }
            ]
          })
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": brand.link
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Places",
                "item": `${brand.link}/places`
              },{
                "@type": "ListItem",
                "position": 3,
                "name": "Cars",
                "item": `${brand.link}/cars`
              },{
                "@type": "ListItem",
                "position": 4,
                "name": "Hotels",
                "item": `${brand.link}/hotels`
              }
            ]
          })
        }}
      />
      
      {/* FAQ Structured Data for Places */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What are the must-visit places in Indore?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Top places in Indore include Rajwada Palace, Khajrana Ganesh Temple, Sarafa Bazaar for street food, Chappan Dukan, Lal Bagh Palace, Kanch Mandir, and Pipliyapala Regional Park for family outings."
                }
              },
              {
                "@type": "Question",
                "name": "Which religious places should I visit in Ujjain?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Must-visit religious places in Ujjain are Mahakaleshwar Temple (Jyotirlinga), Kal Bhairav Temple, Harsiddhi Temple, Mangalnath Temple, and Ram Ghat for evening aarti."
                }
              },
              {
                "@type": "Question",
                "name": "What are the best historical sites in Bhopal?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Top historical sites in Bhopal include Bhimbetka Rock Shelters (UNESCO), Sanchi Stupa (UNESCO), Taj-ul-Masajid, Shaukat Mahal, and the old city with its blend of Hindu and Islamic architecture."
                }
              },
              {
                "@type": "Question",
                "name": "Are there any adventure tourism spots near these cities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can visit Patalpani Waterfall near Indore for trekking, various water sports at Bhopal lakes, wildlife spotting at Van Vihar, and explore the caves at Bhimbetka."
                }
              },
              {
                "@type": "Question",
                "name": "What is the best time to visit these places in Madhya Pradesh?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The best time to visit most places in Madhya Pradesh is from October to March when the weather is pleasant. Avoid summer months (April-June) as temperatures can be very high."
                }
              },
              {
                "@type": "Question",
                "name": "Do these places have entry fees?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most temples are free to enter, but some may have special darshan fees. Historical sites and museums usually have nominal entry fees. National parks and UNESCO sites have separate ticket charges."
                }
              }
            ]
          })
        }}
      />
      
      {/* ItemList Structured Data for Top Places */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Top 20 Must-Visit Places in Madhya Pradesh",
            "description": "List of most popular tourist attractions in Indore, Ujjain, Dewas, Bhopal and surrounding areas",
            "numberOfItems": 20,
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Place",
                  "name": "Mahakaleshwar Temple, Ujjain",
                  "description": "One of the 12 Jyotirlingas of Lord Shiva"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "Place",
                  "name": "Rajwada Palace, Indore",
                  "description": "Historic palace of Holkar dynasty"
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "Place",
                  "name": "Bhimbetka Rock Shelters, Bhopal",
                  "description": "UNESCO World Heritage Site with prehistoric art"
                }
              },
              {
                "@type": "ListItem",
                "position": 4,
                "item": {
                  "@type": "Place",
                  "name": "Sanchi Stupa, Sanchi",
                  "description": "Ancient Buddhist monument and UNESCO site"
                }
              },
              {
                "@type": "ListItem",
                "position": 5,
                "item": {
                  "@type": "Place",
                  "name": "Mandu Fort, Dhar",
                  "description": "Fortress city with Afghan architecture"
                }
              }
            ]
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
    </Head>


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
                        <motion.div
                          key={imageIndexes[place._id] || 0}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            src={place.images?.[imageIndexes[place._id] || 0]?.url || "/placeholder.svg"}
                            alt={place.title}
                            width={400}
                            height={256}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
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