"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, MapPin } from "lucide-react"

export default function FeaturesSection() {
  const hotels = [
    {
      id: 1,
      name: "Hotel Mahakal Palace",
      category: "LUXURY",
      rating: 4.8,
      reviews: 342,
      location: "Near Mahakaleshwar Temple",
      distance: "0.2 km from temple",
      description: "Luxury hotel with stunning temple views and premium amenities for a comfortable stay.",
      price: 3500,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Free WiFi", "AC", "Restaurant", "Room Service"],
      features: ["Temple View", "Premium Rooms", "24/7 Service"],
      roomTypes: ["Deluxe", "Suite", "Premium"],
    },
    {
      id: 2,
      name: "Ujjain Heritage Resort",
      category: "HERITAGE",
      rating: 4.7,
      reviews: 289,
      location: "Ram Ghat Road",
      distance: "0.5 km from Mahakaleshwar",
      description: "Experience traditional hospitality in this beautifully designed heritage property.",
      price: 2800,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Free WiFi", "AC", "Restaurant", "Swimming Pool"],
      features: ["Heritage Architecture", "Cultural Programs", "Garden View"],
      roomTypes: ["Heritage Room", "Royal Suite"],
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className={`${
                        hotel.category === "LUXURY" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                      }`}
                    >
                      {hotel.category}
                    </Badge>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{hotel.rating}</span>
                      <span className="text-gray-500">({hotel.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-700">{hotel.location}</span>
                  </div>

                  <p className="text-green-600 font-medium mb-3">{hotel.distance}</p>
                  <p className="text-gray-600 mb-4">{hotel.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-green-600 border-green-200">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="bg-blue-100 text-blue-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Room Types */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Room Types Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.roomTypes.map((type) => (
                        <span key={type} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{hotel.price}</span>
                      <span className="text-gray-500 ml-1">Per room</span>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
