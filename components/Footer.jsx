'use client'
import Link from "next/link"
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaStar,
} from "react-icons/fa"
import { useUjjain } from "./context/UjjainContext"

export default function Footer() {
  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/places", label: "Places" },
    { href: "/cars", label: "Car Rental" },
    { href: "/hotels", label: "Hotels" },
  /*   { href: "/blogs", label: "Blogs" }, */
    { href: "/faqs", label: "FAQs" },
  ]
const {brand}=useUjjain()
  const services = [
    { href: "/cars", label: "Car Booking" },
    { href: "/hotels", label: "Hotel Booking" },
    { href: "/contact", label: "24/7 Support" },
    /* { href: "/booking", label: "Package Deals" },
    { href: "/reviews", label: "Reviews" }, */
  ]

  const legal = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    /* { href: "/refund", label: "Refund Policy" }, */
    { href: "/contact", label: "Contact Us" },
  ]

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img src={brand.image} alt="Safar Saathi" className="h-12 w-12 rounded-full"/>
              <div>
                <h3 className="text-2xl font-bold"> {brand.name}</h3>
                <p className="text-gray-400">Sacred City Explorer</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for exploring the sacred city of Ujjain. We provide comprehensive travel services
              including car rentals, hotel bookings, and guided tours to make your spiritual journey memorable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl text-blue-500 hover:bg-white  p-0 rounded-sm transition-colors duration-300">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl text-[#E1306C] hover:bg-white  rounded-sm transition-colors duration-300">
               <FaInstagram />
              </a>
              <a href="#" className="text-2xl text-[#1DA1F2] hover:bg-white  rounded-sm transition-colors duration-300">
                 <FaTwitter />
              </a>
              <a href="#" className="text-2xl text-[#FF0000] hover:bg-white  rounded-sm transition-colors duration-300">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-orange-500">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-orange-500 transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-orange-500">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-300"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-orange-500">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1" />
                <div>
                  <p className="text-gray-300">
                    Near Mahakaleshwar Temple,
                    <br />
                    Ujjain, Madhya Pradesh 456001
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-orange-500" />
                <p className="text-gray-300">+91-{brand.mobile}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-orange-500" />
                <p className="text-gray-300"> {brand.email}</p>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-bold mb-3 text-orange-500">24/7 Emergency Support</h5>
              <p className="text-gray-300">+91-{brand.mobile}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2024 {brand.name}. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              {legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
