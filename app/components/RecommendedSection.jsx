"use client"
import { motion } from "framer-motion"
import { FaStar, FaCar, FaHotel, FaMapMarkerAlt } from "react-icons/fa"
import Link from "next/link"

export default function RecommendedSection({ type = "cars", title, items = [] }) {
  const getIcon = () => {
    switch (type) {
      case "cars":
        return <FaCar className="text-blue-500" />
      case "hotels":
        return <FaHotel className="text-green-500" />
      case "places":
        return <FaMapMarkerAlt className="text-purple-500" />
      default:
        return <FaStar className="text-orange-500" />
    }
  }

  const getLink = (item) => {
    switch (type) {
      case "cars":
        return `/cars/${item.id}`
      case "hotels":
        return `/hotels/${item.id}`
      case "places":
        return `/places/${item.id}`
      default:
        return "#"
    }
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-3xl mr-3">{getIcon()}</div>
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          </div>
          <p className="text-gray-600">Handpicked recommendations for your journey</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                    <FaStar className="text-yellow-500 mr-1 text-sm" />
                    <span className="text-sm font-semibold">{item.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description || item.excerpt}</p>

                <div className="flex items-center justify-between">
                  {item.price && (
                    <div className="text-orange-500 font-bold">
                      ₹{item.price}
                      <span className="text-gray-500 text-sm">/{type === "hotels" ? "night" : "day"}</span>
                    </div>
                  )}

                  <Link
                    href={getLink(item)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${type}`}
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All {title}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="ml-2"
            >
              →
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  )
}
