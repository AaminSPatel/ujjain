"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaHome, FaCar, FaHotel, FaMapMarkerAlt, FaPhone } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomTabBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  const tabs = [
    { icon: FaHome, label: "Home", href: "/" },
    { icon: FaCar, label: "Cars", href: "/cars" },
    { icon: FaHotel, label: "Hotels", href: "/hotels" },
    { icon: FaMapMarkerAlt, label: "Places", href: "/places" },
    { icon: FaPhone, label: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-2">
            <div className="flex justify-around items-center">
              {tabs.map((tab, index) => {
                const isActive = pathname === tab.href
                const Icon = tab.icon

                return (
                  <Link key={index} href={tab.href} className="relative">
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                        isActive ? "bg-orange-100" : "hover:bg-gray-100"
                      }`}
                    >
                      <motion.div
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          color: isActive ? "#f97316" : "#6b7280",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Icon className="text-xl" />
                      </motion.div>
                      <motion.span
                        animate={{
                          fontSize: isActive ? "10px" : "9px",
                          color: isActive ? "#f97316" : "#6b7280",
                          fontWeight: isActive ? "600" : "400",
                        }}
                        className="mt-1"
                      >
                        {tab.label}
                      </motion.span>

                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
