"use client"

import { motion } from "framer-motion"
import { Car, MapPin, MessageSquare, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { PopularPlaces } from "@/components/dashboard/popular-places"
import { useState } from "react"
import { useEffect } from "react"
import { useUjjain } from "../../components/context/UjjainContext"
import Link from "next/link"

export default function DashboardPage() {
  const [allCars, setAllCars] = useState([])
  const [allHotels, setAllHotels] = useState([])
  const [allPlaces, setAllPlaces] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [allLogistics, setAllLogistics] = useState([])

  const { cars, hotels, places, bookings, logistics } = useUjjain()

  useEffect(() => {
    setAllCars(cars)
    setAllHotels(hotels)
    setAllPlaces(places)
    setAllBookings(bookings)
    setAllLogistics(logistics)
  }, [cars, hotels, logistics])

  const stats = [
    {
      title: "Total Logistics",
      value: allLogistics?.length || 0,
      change: "0",
      icon: Truck,
      color: "text-blue-600",
      link: "/dashboard/logistics",
    },
    {
      title: "Active Cars",
      value: allCars.length,
      change: "+5.2%",
      icon: Car,
      color: "text-green-600",
      link: "/dashboard/cars",
    },
    {
      title: "Places Listed",
      value: allPlaces.length,
      change: "+12.5%",
      icon: MapPin,
      color: "text-purple-600",
      link: "/dashboard/places",
    },
    {
      title: "Hotels",
      value: allHotels.length,
      change: "+8.3%",
      icon: MessageSquare,
      color: "text-orange-600",
      link: "/dashboard/hotels",
    },
  ]
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your travel business.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <Link href={stat.link}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Overview</CardTitle>
            <CardDescription className="text-sm">Monthly booking trends and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 hidden">
        <Card>
          <CardHeader>
            <CardTitle>Popular Places</CardTitle>
            <CardDescription>Most visited destinations this month</CardDescription>
          </CardHeader>
          <CardContent>
            <PopularPlaces />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <Car className="h-8 w-8 mb-2 text-blue-600" />
                <h3 className="font-semibold">Add New Car</h3>
                <p className="text-sm text-muted-foreground">Add a new vehicle to your fleet</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <MapPin className="h-8 w-8 mb-2 text-green-600" />
                <h3 className="font-semibold">Add Place</h3>
                <p className="text-sm text-muted-foreground">List a new destination</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
