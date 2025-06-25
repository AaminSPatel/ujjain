"use client"
import { useState } from "react"
import Link from "next/link"
import { FaPhone, FaBars, FaTimes, FaStar } from "react-icons/fa"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/places", label: "Places" },
    { href: "/cars", label: "Cars" },
    { href: "/hotels", label: "Hotels" },
    { href: "/blogs", label: "Blogs" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <FaStar className="text-3xl text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ujjain Travel</h1>
              <p className="text-sm text-gray-600">Sacred City Explorer</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Phone Number */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-orange-500">
              <FaPhone className="mr-2" />
              <span className="font-semibold">+91-9876543210</span>
            </div>
            <Link href="/booking" className="btn-primary">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-2xl text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <nav className="py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 px-4 text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 py-3 border-t">
                <div className="flex items-center text-orange-500 mb-3">
                  <FaPhone className="mr-2" />
                  <span className="font-semibold">+91-9876543210</span>
                </div>
                <Link href="/booking" className="btn-primary w-full text-center">
                  Book Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
