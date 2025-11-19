'use client'
import dynamic from "next/dynamic";
import { motion } from "framer-motion"

const Home = dynamic(() => import("@/components/home/home"), {
  ssr: false,
  loading: () => <HomeLoading />
});


const HomeLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo Skeleton */}
          <div className="w-32 h-10 bg-white/30 rounded-lg animate-pulse"></div>
          
          {/* Description Skeleton */}
          <div className="w-64 h-4 bg-white/30 rounded animate-pulse"></div>
          <div className="w-56 h-4 bg-white/30 rounded animate-pulse"></div>
          
          {/* Booking Card Skeleton */}
          <div className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-md">
            {/* Location Inputs */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
            
            {/* Transport Options */}
            <div className="mt-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-3 rounded-xl border-2 border-gray-200 bg-white">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Book Button */}
            <div className="mt-4 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Ad Carousel Skeleton */}
      <div className="md:px-4 px-2 py-4">
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Popular Car Rentals Skeleton */}
      <div className="md:px-4 px-2 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                repeat: Number.POSITIVE_INFINITY, 
                repeatType: "reverse",
                delay: index * 0.1 
              }}
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
          ))}
        </div>
      </div>

      {/* Top Hotels Skeleton */}
      <div className="md:px-4 px-2 py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Number.POSITIVE_INFINITY, 
                  repeatType: "reverse",
                  delay: index * 0.1 
                }}
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
            ))}
          </div>
        </div>
      </div>

      {/* Sacred Places Skeleton */}
      <div className="md:px-4 px-2 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-1 gap-y-4">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                repeat: Number.POSITIVE_INFINITY, 
                repeatType: "reverse",
                delay: index * 0.1 
              }}
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
          ))}
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="md:px-4 px-2 py-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Number.POSITIVE_INFINITY, 
                  repeatType: "reverse",
                  delay: index * 0.1 
                }}
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
            ))}
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-orange-500 text-white py-4 md:py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left space-y-2 md:space-y-0 md:space-x-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/50 rounded-full animate-pulse mr-2 md:mr-3"></div>
            <div className="space-y-1">
              <div className="h-4 w-32 bg-white/50 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-white/50 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/50 rounded-full animate-pulse mr-2 md:mr-3"></div>
            <div className="space-y-1">
              <div className="h-4 w-32 bg-white/50 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-white/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default function Page() {
  return <Home />
}

