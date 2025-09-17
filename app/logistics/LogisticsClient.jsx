"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  MapPin,
  Truck,
  Package,
  Star,
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import { useUjjain } from "../../components/context/UjjainContext";
import Link from "next/link";

// Mock data based on your logistics schema
/* const mockLogisticsData = [
  {
    id: 1,
    serviceName: "Express Freight Solutions",
    serviceType: "Freight",
    description:
      "Fast and reliable freight transportation across India with real-time tracking and insurance coverage.",
    coverageArea: ["Ujjain", "Indore", "Bhopal", "Mumbai", "Delhi"],
    vehicles: [
      { type: "Mini Truck", capacity: "1 Ton", pricePerKm: 15 },
      { type: "Medium Truck", capacity: "3 Ton", pricePerKm: 25 },
      { type: "Large Truck", capacity: "10 Ton", pricePerKm: 40 },
    ],
    images: [{ public_id: "freight1", url: "/placeholder.svg?height=200&width=300" }],
    priceRange: { min: 500, max: 5000 },
    availability: true,
    features: ["Real-time Tracking", "Insurance Coverage", "24/7 Support", "Express Delivery"],
    rating: 4.8,
    reviews: 156,
    createdAt: new Date(),
  },
  {
    id: 2,
    serviceName: "Quick Parcel Delivery",
    serviceType: "Parcel",
    description: "Same-day and next-day parcel delivery services within Ujjain and nearby cities.",
    coverageArea: ["Ujjain", "Dewas", "Shajapur", "Agar Malwa"],
    vehicles: [
      { type: "Bike", capacity: "5 Kg", pricePerKm: 8 },
      { type: "Auto", capacity: "50 Kg", pricePerKm: 12 },
      { type: "Van", capacity: "200 Kg", pricePerKm: 18 },
    ],
    images: [{ public_id: "parcel1", url: "/placeholder.svg?height=200&width=300" }],
    priceRange: { min: 50, max: 800 },
    availability: true,
    features: ["Same Day Delivery", "SMS Updates", "Cash on Delivery", "Fragile Handling"],
    rating: 4.6,
    reviews: 89,
    createdAt: new Date(),
  },
  {
    id: 3,
    serviceName: "Home Relocation Services",
    serviceType: "Moving",
    description: "Complete household shifting services with packing, loading, transportation, and unpacking.",
    coverageArea: ["Ujjain", "Indore", "Bhopal", "Gwalior", "Jabalpur"],
    vehicles: [
      { type: "Tempo", capacity: "1 BHK", pricePerKm: 20 },
      { type: "Mini Truck", capacity: "2 BHK", pricePerKm: 35 },
      { type: "Large Truck", capacity: "3+ BHK", pricePerKm: 50 },
    ],
    images: [{ public_id: "moving1", url: "/placeholder.svg?height=200&width=300" }],
    priceRange: { min: 2000, max: 15000 },
    availability: true,
    features: ["Professional Packing", "Loading/Unloading", "Transit Insurance", "Unpacking Service"],
    rating: 4.7,
    reviews: 234,
    createdAt: new Date(),
  },
  {
    id: 4,
    serviceName: "Heavy Machinery Transport",
    serviceType: "Heavy Load",
    description: "Specialized transportation for heavy machinery, industrial equipment, and oversized cargo.",
    coverageArea: ["Ujjain", "Indore", "Mumbai", "Pune", "Ahmedabad"],
    vehicles: [
      { type: "Trailer", capacity: "25 Ton", pricePerKm: 80 },
      { type: "Heavy Trailer", capacity: "50 Ton", pricePerKm: 120 },
      { type: "Specialized Carrier", capacity: "100 Ton", pricePerKm: 200 },
    ],
    images: [{ public_id: "heavy1", url: "/placeholder.svg?height=200&width=300" }],
    priceRange: { min: 5000, max: 50000 },
    availability: true,
    features: ["Crane Service", "Route Planning", "Special Permits", "Expert Handling"],
    rating: 4.9,
    reviews: 67,
    createdAt: new Date(),
  },
  {
    id: 5,
    serviceName: "Global Shipping Solutions",
    serviceType: "International",
    description: "International shipping and logistics services with customs clearance and door-to-door delivery.",
    coverageArea: ["Ujjain", "Mumbai", "Delhi", "Chennai", "Kolkata"],
    vehicles: [
      { type: "Air Cargo", capacity: "500 Kg", pricePerKm: 150 },
      { type: "Sea Cargo", capacity: "20 Ft Container", pricePerKm: 100 },
      { type: "Land Transport", capacity: "10 Ton", pricePerKm: 60 },
    ],
    image: [{ public_id: "international1", url: "/placeholder.svg?height=200&width=300" }],
    priceRange: { min: 10000, max: 100000 },
    availability: true,
    features: ["Customs Clearance", "Documentation", "Door-to-Door", "Tracking & Updates"],
    rating: 4.5,
    reviews: 123,
    createdAt: new Date(),
  },
] */

export default function LogisticsClient() {
  const [logisticsData, setLogisticsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    serviceType: "all",
    priceRange: [0, 100000],
    coverageArea: "",
    availability: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { logistics, getAverageRating } = useUjjain();
  // Apply filters
  useEffect(() => {
    setFilteredData(logistics);
  }, [logistics]);
  useEffect(() => {
    let filtered = logistics;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.serviceName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.features.some((feature) =>
            feature.toLowerCase().includes(filters.search.toLowerCase())
          )
      );
    }

    // Service type filter
    if (filters.serviceType !== "all") {
      filtered = filtered.filter(
        (item) => item.serviceType === filters.serviceType
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (item) =>
        item.priceRange.min >= filters.priceRange[0] &&
        item.priceRange.max <= filters.priceRange[1]
    );

    // Coverage area filter
    if (filters.coverageArea) {
      filtered = filtered.filter((item) =>
        item.coverageArea.some((area) =>
          area.toLowerCase().includes(filters.coverageArea.toLowerCase())
        )
      );
    }

    // Availability filter
    if (filters.availability !== "all") {
      filtered = filtered.filter((item) =>
        filters.availability === "available"
          ? item.availability
          : !item.availability
      );
    }

    setFilteredData(filtered);
  }, [filters, logistics]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      serviceType: "all",
      priceRange: [0, 100000],
      coverageArea: "",
      availability: "all",
    });
  };

  const serviceTypes = [
    "Freight",
    "Parcel",
    "Moving",
    "Heavy Load",
    "International",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Logistics Services in Ujjain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 max-w-3xl mx-auto"
          >
            Find reliable transportation and logistics solutions for all your
            needs
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            <AnimatePresence>
              {showFilters /* || window.innerWidth >= 1024 */ && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:block"
                >
                  <Card className="sticky top-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Filter className="h-5 w-5" />
                        <span>Filters</span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Clear All
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Search */}
                      <div className="space-y-2">
                        <Label>Search Services</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search logistics services..."
                            value={filters.search}
                            onChange={(e) =>
                              handleFilterChange("search", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Service Type */}
                      <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Select
                          value={filters.serviceType}
                          onValueChange={(value) =>
                            handleFilterChange("serviceType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Services</SelectItem>
                            {serviceTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-2">
                        <Label>Price Range (₹)</Label>
                        <div className="px-2">
                          <Slider
                            value={filters.priceRange}
                            onValueChange={(value) =>
                              handleFilterChange("priceRange", value)
                            }
                            max={100000}
                            min={0}
                            step={500}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>₹{filters.priceRange[0]}</span>
                            <span>₹{filters.priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Coverage Area */}
                      <div className="space-y-2">
                        <Label>Coverage Area</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Enter city name..."
                            value={filters.coverageArea}
                            onChange={(e) =>
                              handleFilterChange("coverageArea", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="space-y-2">
                        <Label>Availability</Label>
                        <Select
                          value={filters.availability}
                          onValueChange={(value) =>
                            handleFilterChange("availability", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Services</SelectItem>
                            <SelectItem value="available">
                              Available Now
                            </SelectItem>
                            <SelectItem value="unavailable">
                              Currently Unavailable
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredData.length} Services Found
              </h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full py-0  hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={service?.image?.url || "/placeholder.svg"}
                        alt={service.serviceName}
                        className="w-full h-56 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-500 text-white">
                          {service.serviceType}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        {service.availability ? (
                          <Badge className="bg-green-500 text-white">
                            Available
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                          {service.serviceName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">
                            {getAverageRating(service?.reviews)}
                          </span>
                          {service.reviews?.length && (
                            <span className="text-gray-500">
                              ({service.reviews?.length})
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Coverage Areas */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Coverage Areas:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {service.coverageArea.slice(0, 3).map((area) => (
                            <Badge
                              key={area}
                              variant="outline"
                              className="text-xs"
                            >
                              {area}
                            </Badge>
                          ))}
                          {service.coverageArea.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.coverageArea.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Types */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Vehicle Options:
                          </span>
                        </div>
                        <div className="space-y-1">
                          {service.vehicles.slice(0, 2).map((vehicle, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {vehicle.type} ({vehicle.capacity})
                              </span>
                              <span className="text-green-600 font-medium">
                                ₹{vehicle.pricePerKm}/km
                              </span>
                            </div>
                          ))}
                          {service.vehicles.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{service.vehicles.length - 2} more options
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 3).map((feature) => (
                            <Badge
                              key={feature}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{service.priceRange.min} - ₹
                            {service.priceRange.max}
                          </span>
                          <p className="text-sm text-gray-500">
                            Starting price
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link className="" href={`/logistics/${service._id}`}>
                            <Button
                              size="sm"
                              className="bg-cyan-500 hover:bg-cyan-600"
                            >
                              View Details
                            </Button>
                          </Link>
                          <Link
                            className=""
                            href={`/booking?logistics=${service._id}&serviceType=Logistics`}
                          >
                            <Button
                              className="bg-amber-500 hover:bg-orange-600"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
