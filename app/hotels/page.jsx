"use client"
import { useEffect, useState } from "react"
import { FaStar, FaHeart, FaMapMarkerAlt, FaPhone, FaShieldAlt } from "react-icons/fa"
import { MdRoomService } from "react-icons/md"
import Link from "next/link"
import { useUjjain } from "@/components/context/UjjainContext"
import Head from "next/head"

export default function Hotels() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState([])
  const [allHotels, setAllHotels] = useState([])
const {hotels,getAverageRating ,brand} = useUjjain()
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

    <Head>
      {/* Primary Meta Tags */}
      <title>Safar Sathi - Best Hotel Booking in Ujjain, Dewas, Indore | Budget to Luxury Stays</title>
      <meta name="title" content="Safar Sathi - Best Hotel Booking in Ujjain, Dewas, Indore | Budget to Luxury Stays" />
      <meta name="description" content="Book best hotels in Ujjain, Dewas, Indore with Safar Sathi. Affordable to luxury accommodations near Mahakal Temple, railway station, bus stand. AC/Non-AC rooms with free WiFi, breakfast, and best deals for pilgrims, tourists & business travelers." />
      
      {/* Keywords */}
      <meta name="keywords" content="hotel booking Ujjain, hotels in Ujjain, budget hotels Ujjain, luxury hotels Ujjain, Mahakal Temple hotels, Ujjain accommodation, hotel near Mahakal, Ujjain stay, Dewas hotels, Indore hotels, hotel booking MP, affordable hotels Ujjain, pilgrimage stay Ujjain, business hotels Indore, family hotels Dewas, online hotel booking, best hotels near temple, cheap hotels Ujjain, 3 star hotels Ujjain, hotel with parking Ujjain, hotel near railway station Ujjain, hotel near bus stand Ujjain, group accommodation Ujjain, wedding hotels Dewas, corporate hotels Indore, weekend stay Ujjain, hotel deals Ujjain, last minute hotel booking, hotel packages Ujjain, religious stay Ujjain, tourist hotels MP, MP tourism hotels, Ujjain darshan stay, hotel with AC Ujjain, budget accommodation Indore, luxury stay Dewas, hotel booking app, online hotel reservation, hotel discounts Ujjain, seasonal offers hotels, hotel near airport Indore, hotel for family Ujjain, business stay Indore, pilgrimage accommodation, temple visit stay, Ujjain tour packages, MP hotel booking, Central India hotels, Safar Sathi hotels, Safar Sathi hotel booking, hotel booking Safar Sathi" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${brand.link}/hotels`} />
      <meta property="og:title" content="Safar Sathi - Best Hotel Booking in Ujjain, Dewas, Indore | Pilgrimage & Business Stays" />
      <meta property="og:description" content="Book best hotels in Ujjain near Mahakal Temple, Dewas & Indore. Budget to luxury accommodations with free WiFi, breakfast, parking. Perfect for pilgrims, tourists & business travelers." />
      <meta property="og:image" content={`${brand.link}/bg2.png`} />
      <meta property="og:site_name" content="Safar Sathi" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${brand.link}/hotels`} />
      <meta property="twitter:title" content="Safar Sathi - Best Hotel Booking in Ujjain, Dewas, Indore" />
      <meta property="twitter:description" content="Book budget to luxury hotels in Ujjain near Mahakal Temple. AC rooms, free WiFi, breakfast. Perfect for pilgrims & tourists with best deals & discounts." />
      <meta property="twitter:image" content={`${brand.link}/bg2.png`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${brand.link}/hotels`} />
      
      {/* Alternate Languages */}
      <link rel="alternate" href={`${brand.link}/hotels`} hrefLang="en-in" />
      <link rel="alternate" href={`${brand.link}/hotels`} hrefLang="en" />
      <link rel="alternate" href={`${brand.link}/hotels`} hrefLang="hi" />
      
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
      <meta name="classification" content="Travel, Hospitality, Hotel Booking, Accommodation" />
      <meta name="category" content="travel, hospitality, hotels" />
      <meta name="coverage" content="India, Madhya Pradesh, Ujjain, Dewas, Indore" />
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
      <meta name="theme-color" content="#10B981" />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      
      {/* Dublin Core Metadata */}
      <meta name="DC.title" content="Safar Sathi - Hotel Booking in Ujjain, Dewas, Indore" />
      <meta name="DC.creator" content="Safar Sathi" />
      <meta name="DC.subject" content="Hotel Booking, Accommodation, Travel Stay, Hospitality" />
      <meta name="DC.description" content="Best hotel booking service in Ujjain, Dewas, Indore for pilgrims, tourists and business travelers" />
      <meta name="DC.publisher" content="Safar Sathi" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="en-IN" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content="Ujjain, Dewas, Indore, Madhya Pradesh" />
      
      {/* Site Links Search Box */}
      <meta name="google" content="nositelinkssearchbox" />
      
      {/* App Links */}
      <meta property="al:web:url" content={`${brand.link}/hotels`} />
      
      {/* Structured Data - JSON-LD for Hotel Booking Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Safar Sathi Hotel Booking",
            "description": "Premium hotel booking service in Ujjain, Dewas, Indore for pilgrims, tourists and business travelers",
            "url": `${brand.link}/hotels`,
            "telephone": `+91 ${brand.mobile}`,
            "areaServed": {
              "@type": "State",
              "name": "Madhya Pradesh"
            },
            "serviceType": "Hotel Booking Service",
            "provider": {
              "@type": "Organization",
              "name": "Safar Sathi",
              "url": brand.link
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Hotel Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Budget Hotel Booking",
                    "description": "Affordable hotel accommodations in Ujjain, Dewas, Indore"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Luxury Hotel Booking",
                    "description": "Premium and luxury hotel stays in Ujjain, Dewas, Indore"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Pilgrimage Stay Booking",
                    "description": "Hotels near Mahakal Temple and other religious sites in Ujjain"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Business Hotel Booking",
                    "description": "Corporate hotels in Indore and Dewas for business travelers"
                  }
                }
              ]
            }
          })
        }}
      />
      
      {/* Local Business Structured Data for Hotels */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Safar Sathi Hotel Booking Services",
            "description": "Trusted hotel booking partner in Ujjain, Dewas, Indore offering best accommodations for pilgrims, tourists and business travelers",
            "url": `${brand.link}/hotels`,
            "telephone": `+91 ${brand.mobile}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ujjain",
              "addressRegion": "Madhya Pradesh",
              "postalCode": "456001",
              "addressCountry": "IN"
            },
            "areaServed": ["Ujjain", "Dewas", "Indore", "Madhya Pradesh"],
            "openingHours": "Mo-Su 00:00-23:59",
            "sameAs": [
              `${brand.link}/hotels`
            ]
          })
        }}
      />
      
      {/* Aggregate Rating for Hotel Booking Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AggregateRating",
            "itemReviewed": {
              "@type": "Service",
              "name": "Safar Sathi Hotel Booking"
            },
            "ratingValue": "4.5",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "150"
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
                "name": "Hotels",
                "item": `${brand.link}/hotels`
              }
            ]
          })
        }}
      />
      
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What areas do you cover for hotel bookings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide hotel booking services in Ujjain, Dewas, Indore and surrounding areas in Madhya Pradesh, with special focus on accommodations near Mahakal Temple and other religious sites."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer budget hotel options?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we offer a wide range of budget to luxury hotels starting from affordable accommodations to premium stays with all modern amenities."
                }
              },
              {
                "@type": "Question",
                "name": "Can I book hotels for pilgrimage purposes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! We specialize in pilgrimage stays with hotels near Mahakal Temple and other religious sites in Ujjain, offering convenient access for devotees."
                }
              },
              {
                "@type": "Question",
                "name": "Do you provide corporate hotel bookings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we offer corporate hotel bookings in Indore and Dewas with business-friendly amenities and convenient locations for business travelers."
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
      <section className="relative  text-white bg-cover" style={{backgroundImage:`url('./bg2.png')`}}>
        <div className="container mx-auto px-2 py-12 text-center bg-gradient-to-t from-slate-900/40 to-slate-900/40">
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
                key={category.name}
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
              <div key={hotel._id} className="card overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-2/5 relative">
                    <img
                      src={hotel?.images[0]?.url || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(hotel.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
                        favorites.includes(hotel._id)
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
                          <span className="font-semibold">{getAverageRating(hotel.reviews)}</span>
                          {hotel.reviews?.length &&<span className="text-gray-500 text-sm ml-1">({hotel.reviews?.length})</span>}
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
                        href={`/hotels/${hotel._id}`}
                        className="flex-1 bg-green-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-300"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/booking?hotel=${hotel._id}`}
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
