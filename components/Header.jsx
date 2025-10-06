"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Star, Phone, User } from "lucide-react"
import { useUjjain } from "./context/UjjainContext"
import { useEffect } from "react"
import NotificationBell from "./NotificationBell" // Import the notification component

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { user ,brand} = useUjjain()
  
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true)
    }
  }, [user])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Cars", href: "/cars" },
    { name: "Hotels", href: "/hotels" },
    { name: "Logistics", href: "/logistics" },
  ]

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Safar Sathi" className="h-10 w-10 rounded-full"/>
            <div>
              <h1 className="text-xl font-bold text-gray-900 poppin uppercase">{brand.name}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Sacred City Explorer</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-500 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2 text-orange-500">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">+91-9876543210</span>
            </div>
            
            {/* Notification Bell - Only show when logged in */}
            <div className="w-7">

            {isLoggedIn && <NotificationBell />}
            </div>
            
            {!isLoggedIn && (
              <Link href="/auth/signin">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden pl-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            {/* Profile link */}
            
            <Link href="/profile">
              <User size={19}/>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-amber-500 transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}