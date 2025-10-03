"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaCar,
  FaStar,
  FaFilter,
  FaChevronDown,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";
import { MdPlace, MdHotel } from "react-icons/md";
import { BiTab } from "react-icons/bi";
import { useUjjain } from "../context/UjjainContext";
import Link from "next/link";

// Skeleton loading
const LoadingCard = () => (
  <div className="bg-card rounded-xl p-4 shadow-sm border border-border animate-pulse">
    <div className="w-full h-40 bg-muted rounded-lg mb-4"></div>
    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-muted rounded w-1/2"></div>
  </div>
);

const LoadingReview = () => (
  <div className="bg-card rounded-xl p-4 shadow-sm border border-border animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-muted rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/3"></div>
      </div>
    </div>
    <div className="h-4 bg-muted rounded w-full mb-2"></div>
    <div className="h-4 bg-muted rounded w-5/6"></div>
  </div>
);

const LoadingSearchResult = () => (
  <div className="bg-card rounded-xl p-4 shadow-sm border border-border animate-pulse flex items-start space-x-4">
    <div className="w-20 h-20 bg-muted rounded-lg"></div>
    <div className="flex-1">
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
  </div>
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

  // Fake loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Helper: parse numbers from "₹1,200" → 1200
  const parseNumber = (val) => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/[^\d.-]/g, "");
    return Number(cleaned) || 0;
  };

  // Helper: safe search match
  const matchesSearch = (item, searchLower) => {
    if (!searchLower) return true;
    const fields = [item?.model, item?.name, item?.title, item?.description, item?.location];
    if (fields.some((f) => typeof f === "string" && f.toLowerCase().includes(searchLower))) return true;
    if (Array.isArray(item?.keywords) && item.keywords.some((k) => k?.toLowerCase().includes(searchLower))) return true;
    return false;
  };

  const getFilteredResults = () => {
    if (!searchTerm) return [];
    const searchLower = searchTerm.toLowerCase();

    const allResults = [
      ...cars.map((item) => ({ ...item, type: "car" })),
      ...hotels.map((item) => ({ ...item, type: "hotel" })),
      ...places.map((item) => ({ ...item, type: "place" })),
    ];

    return allResults
      .filter((item) => matchesSearch(item, searchLower))
      // ✅ Budget filter
      .filter((item) => {
        if (!budget) return true;
        const price = parseNumber(item?.pricePerDay ?? item?.price ?? item?.entryFee);
        if (budget === "low") return price < 500;
        if (budget === "mid") return price >= 500 && price <= 1000;
        if (budget === "high") return price > 1000;
        return true;
      })
      // ✅ Passengers filter (cars only)
      .filter((item) => {
        if (!passengers || item.type !== "car") return true;
        const seats = Number(item?.seats) || 0;
        return seats >= Number(passengers);
      })
      .slice(0, 8);
  };

  // Run filter whenever dependencies change
  useEffect(() => {
    if (searchTerm) {
      const results = getFilteredResults();
      if (activeTab !== "cars") {
        setFilteredResults(results.filter((i) => i.type === activeTab.slice(0, -1)));
      } else {
        setFilteredResults(results);
      }
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm, activeTab, budget, passengers, cars, hotels, places]);

  // UI Data
  const stats = [
    { value: "100+", details: "Places Traveled" },
    { value: "500+", details: "Happy Pilgrims" },
    { value: "50+", details: "Cars Added" },
  ];

  const tabs = [
    { id: "cars", label: "Cars", icon: <FaCar /> },
    { id: "hotels", label: "Hotels", icon: <MdHotel /> },
    { id: "places", label: "Places", icon: <MdPlace /> },
    { id: "tours", label: "Tours", icon: <BiTab /> },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-8 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Explore Ujjain</h1>
          <p className="text-orange-100 mb-6">Your spiritual journey begins here</p>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cars, hotels, places..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around mt-4 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-orange-500 border-b-2 border-orange-500" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4">
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 text-sm text-muted-foreground">
          <FaFilter />
          <span>Filters</span>
          <FaChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
        {showFilters && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Budget</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-card">
                <option value="">Any</option>
                <option value="low">Low (&lt; ₹500)</option>
                <option value="mid">Mid (₹500 - ₹1000)</option>
                <option value="high">High (&gt; ₹1000)</option>
              </select>
            </div>
            {activeTab === "cars" && (
              <div>
                <label className="block text-sm font-medium mb-2">Passengers</label>
                <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-card">
                  <option value="">Any</option>
                  <option value="2">2+</option>
                  <option value="4">4+</option>
                  <option value="6">6+</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchTerm && filteredResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="px-4 py-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((item) => (
                <motion.div key={`${item.type}-${item._id}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image?.url || item.images?.[0]?.url || "/placeholder.svg"}
                      alt={item.model || item.name || item.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate">{item.model || item.name || item.title}</h3>
                      <div className="flex items-center mt-1">
                        <FaStar className="text-orange-500 text-sm mr-1" />
                        <span className="text-sm text-muted-foreground">{getAverageRating(item?.reviews)}</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground capitalize">{item.type}</span>
                      </div>
                      {(item.price || item.pricePerDay || item.entryFee) && (
                        <div className="text-orange-600 font-bold mt-2">
                          <FaRupeeSign className="inline mr-1 text-xs" />
                          {parseNumber(item.pricePerDay ?? item.price ?? item.entryFee)}
                        </div>
                      )}
                      {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
