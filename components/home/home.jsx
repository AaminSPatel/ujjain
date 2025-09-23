"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaCar,
  FaStar,
  FaPhone,
  FaFilter,
  FaChevronDown,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";
import { MdPlace, MdHotel } from "react-icons/md";
import { BiTab, BiTour } from "react-icons/bi";
import { useUjjain } from "../context/UjjainContext";
import Link from "next/link";

// Loading Skeleton Components
const LoadingCard = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    className="bg-card md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border"
  >
    <div className="w-full h-20 md:h-48 bg-gray-300 animate-pulse"></div>
    <div className="md:p-6 p-1">
      <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-300 rounded mb-3 animate-pulse"></div>
      <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
      <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
    </div>
  </motion.div>
);

const LoadingReview = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    className="bg-muted/30 rounded-xl p-4 md:p-6 border border-border"
  >
    <div className="flex items-start space-x-3 md:space-x-4">
      <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);

const LoadingSearchResult = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    className="bg-card rounded-xl p-4 shadow-sm border border-border"
  >
    <div className="flex items-start space-x-4">
      <div className="w-20 h-20 bg-gray-300 rounded-lg animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);

export default function MobileHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("cars");
  const [showFilters, setShowFilters] = useState(false);
  const [budget, setBudget] = useState("");
  const [passengers, setPassengers] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { cars, places, hotels, reviews, getAverageRating } = useUjjain();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getFilteredResults = () => {
    if (!searchTerm) return [];

    const allResults = [
      ...cars.map((item) => ({ ...item, type: "car" })),
      ...hotels.map((item) => ({ ...item, type: "hotel" })),
      ...places.map((item) => ({ ...item, type: "place" })),
    ];

    return allResults
      .filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item?.model?.toLowerCase().includes(searchLower) ||
          item?.name?.toLowerCase().includes(searchLower) ||
          item?.title?.toLowerCase().includes(searchLower) ||
          item?.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchLower)
          ) ||
          item?.description?.toLowerCase().includes(searchLower) ||
          item?.location?.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 8);
  };

  useEffect(() => {
    if (searchTerm) {
      const results = getFilteredResults();
      if (activeTab !== "cars") {
        const filtered = results.filter(
          (item) => item.type === activeTab.slice(0, -1)
        );
        setFilteredResults(filtered);
      } else {
        setFilteredResults(results);
      }
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm, activeTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (searchTerm) {
      if (tabId === "cars") {
        setFilteredResults(getFilteredResults());
      } else {
        const filtered = getFilteredResults().filter(
          (item) => item.type === tabId.slice(0, -1)
        );
        setFilteredResults(filtered);
      }
    }
  };

  const stats = [
    {value: '100+', details:'Places Traveled'},
    {value: '500+', details:'Happy Pilgrims'},
    {value: '50+', details:'Cars Added'}
  ]
  const tabs = [
    { id: "cars", label: "Cars", icon: <FaCar /> },
    { id: "hotels", label: "Hotels", icon: <MdHotel /> },
    { id: "places", label: "Places", icon: <MdPlace /> },
    { id: "tours", label: "Tours", icon: <BiTab /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="hero-gradient relative overflow-hidden">
        {/* Hero Content */}
        <div className="relative z-10 px-4 py-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance"
          >
            Your Spiritual Journey to Ujjain Starts Here
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto text-pretty"
          >
            Discover sacred temples, comfortable stays, and reliable transport
            for your pilgrimage to the holy city of Ujjain
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-4"
          >
            {stats.map((item) => (
              <div key={item.details} className="glass-effect rounded-lg p-3">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-sm text-white/80">{item.details}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Search Section */}
        <div className="relative z-10 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-effect rounded-2xl p-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-start gap-2 mb-2">
                <div className="relative w-full sm:flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search temples, hotels, cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-white/40 backdrop-blur-sm text-sm sm:text-base"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center w-full sm:w-auto px-3 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm mt-2 sm:mt-0 sm:min-w-[120px]"
                >
                  <FaFilter className="mr-2 text-sm" />
                  <span className="text-sm">Filters</span>
                  <FaChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap items-center gap-3 mb-4 overflow-hidden"
                  >
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm backdrop-blur-sm flex-1 min-w-[120px]"
                    >
                      <option className="text-gray-800" value="">Budget</option>
                      <option className="text-gray-800" value="low">Under ₹500</option>
                      <option className="text-gray-800" value="mid">₹500-₹1000</option>
                      <option className="text-gray-800" value="high">Above ₹1000</option>
                    </select>

                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm backdrop-blur-sm flex-1 min-w-[120px]"
                    >
                      <option value="" className="text-gray-800">Passengers</option>
                      <option value="2"className="text-gray-800" >2 People</option>
                      <option value="4"className="text-gray-800" >4 People</option>
                      <option value="6"className="text-gray-800" >6+ People</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tab Navigation */}
              <div className="grid grid-cols-4 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex flex-col items-center justify-center py-2 sm:py-3 px-1 sm:px-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-orange-500 shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="text-base sm:text-lg mb-1">{tab.icon}</div>
                    <span className="text-xs">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchTerm && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 py-6 max-w-6xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((item) => (
                <motion.div
                  key={`${item.type}-${item._id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={
                        item.image?.url ||
                        item.images[0]?.url ||
                        "/placeholder.svg"
                      }
                      alt={item.model || item.name || item.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate">
                        {item.model || item.name || item.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <FaStar className="text-orange-500 text-sm mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {getAverageRating(item?.reviews)}
                        </span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {item.type}
                        </span>
                      </div>
                      {item.price && (
                        <div className="text-orange-600 font-bold mt-2">
                          {item.price}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Car Rentals */}
      <div className="md:px-4 px-2 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Popular Car Rentals
          </h2>
         <Link href={'/cars'}> <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
            <FaArrowRight />
          </button></Link>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : (
            cars.slice(0, 6).map((car, index) => (
              <motion.div
                key={car._id}
                variants={itemVariants}
                className="bg-card md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <img
                  src={car.images[0]?.url || "/placeholder.svg"}
                  alt={car.model}
                  className="w-full h-20 md:h-48 md:object-cover object-contain"
                />
                <div className="md:p-6 p-1">
                  <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                    {car.model}
                  </h3>
                  <div className="flex items-center md:mb-3 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`md:text-sm text-xs ${
                            i < Math.floor(getAverageRating(car.reviews))
                              ? "text-orange-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {getAverageRating(car.reviews)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between md:mb-4 mb-1">
                    <div>
                      <div className="md:text-2xl text-gray-700 text-sm md:font-bold font-semibold text-card-foreground flex items-center">
                        <FaRupeeSign className="text-xs md:text-base" />{" "}
                        {car.pricePerDay}
                      </div>
                      <div className="text-sm text-muted-foreground hidden md:block">
                        per day
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="text-sm text-muted-foreground">
                        {car.seats} seats • {car.fueltype}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {car.geartype}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Link href={`/booking?car=${car._id}`}>
                      <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base">
                        Book Now
                      </button>
                      
                      </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Top Hotels */}
      <div className="md:px-4 px-2 py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Top Hotels
            </h2>
           <Link href={'/hotels'}> <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
            <FaArrowRight />
          </button></Link>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4"
          >
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : (
              hotels.slice(0, 6).map((hotel) => (
                <motion.div
                  key={hotel._id}
                  variants={itemVariants}
                  className="bg-card md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={hotel.images[0]?.url || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-20 md:h-48 rounded-md object-cover text-xs"
                  />
                  <div className="md:p-6 p-1">
                    <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center md:mb-3 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`md:text-sm text-[9px] ${
                              i < Math.floor(getAverageRating(hotel.reviews))
                                ? "text-orange-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="md:text-sm text-xs text-muted-foreground capitalize ml-1">
                        {hotel.category}
                      </span>
                    </div>
                    <div className="flex items-center md:mb-4 mb-1">
                      <FaMapMarkerAlt className="text-muted-foreground mr-1 text-xs md:text-sm" />
                      <span className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                        {hotel.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between md:mb-4 mb-1">
                      <div>
                        <div className="md:text-2xl text-gray-700 text-sm md:font-bold font-semibold flex items-center">
                          <FaRupeeSign className="text-xs md:text-base" />{" "}
                          {hotel.price}
                        </div>
                        <div className="text-sm text-muted-foreground hidden md:block">
                          per night
                        </div>
                      </div>
                      <div className="hidden md:flex items-start gap-0.5">
                        {hotel.amenities.slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="text-xs px-1 py-0.5 whitespace-nowrap bg-sky-300 rounded-full flex items-center justify-center"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Link href={`/booking?hotel=${hotel._id}`}>
                      <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base">
                        Book Now
                      </button>
                      
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Sacred Places to Visit */}
      <div className="md:px-4 px-2 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Sacred Places to Visit
          </h2>
          <Link href={'/places'}> <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
            <FaArrowRight />
          </button></Link>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center items-center flex-wrap md:grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : (
            <>
              <div className="bg-card md:hidden md:rounded-xl flex max-w-[100%] rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow">
                <img
                  src={places[0]?.images[0]?.url || "/placeholder.svg"}
                  alt={places[0]?.title}
                  className="max-w-[50%] h-48 md:object-cover object-cover rounded-md"
                />
                <div className="md:p-6 p-5 flex flex-col justify-between">
                  <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                    {places[0]?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground md:mb-4 mb-1 line-clamp-2 flex items-start gap-1">
                    <FaMapMarkerAlt className="mt-1 text-amber-600" />
                    {places[0]?.location}
                  </p>
                  <p className="text-xs text-muted-foreground md:mb-4 mb-1 line-clamp-4">
                    {places[0]?.description}
                  </p>
                  <div className="flex items-center md:mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`md:text-sm text-xs ${
                            i < Math.floor(getAverageRating(places[0]?.reviews))
                              ? "text-orange-500"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {getAverageRating(places[0]?.reviews)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                   <Link href={`/places/${places[0]._id}`}>
                   <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base w-full">
                      Learn More
                    </button>
                   </Link> 
                  </div>
                </div>
              </div>
              {places.slice(0, 6).map((place) => (
                <motion.div
                  key={place._id}
                  variants={itemVariants}
                  className="bg-card w-[31%] md:w-auto md:rounded-xl rounded-sm shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={place.images[0]?.url || "/placeholder.svg"}
                    alt={place.title}
                    className="w-full h-20 md:h-48 md:object-cover object-cover rounded-md"
                  />
                  <div className="md:p-6 p-1">
                    <h3 className="md:font-bold font-semibold md:text-xl line-clamp-1 text-sm text-card-foreground">
                      {place.title}
                    </h3>
                    <div className="flex items-center md:mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`md:text-sm text-xs ${
                              i < Math.floor(getAverageRating(place.reviews))
                                ? "text-orange-500"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {getAverageRating(place.reviews)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground md:mb-4 mb-1 line-clamp-2">
                      {place.description}
                    </p>
                    <div className="flex items-center justify-center">
                      <Link href={`/places/${place._id}`}>
                      <button className="px-2 mb-1 md:py-3 py-0.5 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-semibold transition-colors text-xs md:text-base w-full">
                        Learn More
                      </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </div>

      {/* What Travelers Say */}
      <div className="md:px-4 px-2 py-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
              What Travelers Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto hidden md:block">
              Read reviews from pilgrims who experienced Ujjain with our
              services
            </p>
            {/* <button className="bg-orange-500 text-white px-8 py-3 rounded-lg mt-6 font-semibold hover:bg-orange-600 transition-colors">
              View All Reviews
            </button> */}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <LoadingReview key={index} />
              ))
            ) : (
              reviews.slice(0, 6).map((review) => (
                <motion.div
                  key={review._id}
                  variants={itemVariants}
                  className="bg-muted/30 rounded-xl p-4 md:p-6 border border-border"
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm md:text-lg">
                        {review?.user?.fullName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <h4 className="font-bold text-card-foreground text-sm md:text-base line-clamp-1">
                          {review?.user?.fullName || "User"}
                        </h4>
                      </div>
                      <div className="flex items-center mb-2 md:mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-orange-500 ${
                                i < review.rating
                                  ? "text-orange-500"
                                  : "text-muted"
                              } text-xs md:text-sm`}
                            />
                          ))}
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground ml-2 line-clamp-1">
                          {review.location || "Ujjain"}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs md:text-sm line-clamp-3">
                        "{review.comment}"
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <img src={review.reviewedItem?.images[0]?.url || review?.reviewedItem?.image?.url} alt={review.reviewedItem.model || review.reviewedItem.name || review.reviewedItem.title|| review.reviewedItem.serviceName} className="h-18 w-18 text-xs rounded-md"/>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* 24/7 Help Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-orange-500 text-white py-4 md:py-6 px-4"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left space-y-2 md:space-y-0 md:space-x-6">
          <div className="flex items-center">
            <FaPhone className="text-lg md:text-2xl animate-pulse mr-2 md:mr-3" />
            <div>
              <div className="text-sm md:text-lg font-semibold">
                24/7 Help Available
              </div>
              <div className="text-white/90 text-xs md:text-base">
                Call: +91-9876543210
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-base md:text-xl mr-2 md:mr-3" />
            <div>
              <div className="font-semibold text-sm md:text-base">
                Book Your Journey
              </div>
              <div className="text-white/90 text-xs md:text-base">
                Plan your spiritual trip today
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}