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
} from "react-icons/fa"
import { useUjjain } from "./context/UjjainContext"

export default function Footer() {
  // safe-guard brand so component doesn't crash if context is undefined
  const ctx = useUjjain?.() ?? {}
  const brand = ctx.brand ?? {
    name: "Safar Saathi",
    image: "/logo.png",
    description: "",
    mobile: "0000000000",
    email: "info@example.com",
  }

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/places", label: "Places" },
    { href: "/cars", label: "Car Rental" },
    { href: "/hotels", label: "Hotels" },
    { href: "/faqs", label: "FAQs" },
  ]

  const services = [
    { href: "/cars", label: "Car Booking" },
    { href: "/hotels", label: "Hotel Booking" },
    { href: "/contact", label: "24/7 Support" },
  ]

  const legal = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Us" },
  ]

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={brand.image}
                alt={brand.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg md:text-2xl font-bold">{brand.name}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{brand.description}</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Your trusted partner for exploring Ujjain — car rentals, hotel bookings, and guided tours.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/16RxfBC2NE/"
                aria-label="Facebook"
                className="text-2xl text-blue-500 hover:opacity-80 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/safar__sathi?igsh=bDljNms5ZjRmM2Nv"
                aria-label="Instagram"
                className="text-2xl text-[#E1306C] hover:opacity-80 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://x.com/Safar__Sathi?t=gRfS7jeHa1pgSLdmOAaaag&s=08"
                aria-label="X / Twitter"
                className="text-2xl text-[#1DA1F2] hover:opacity-80 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://youtube.com/@safarsathiofficial?si=IxK-fvOfb9lUFsH8"
                aria-label="YouTube"
                className="text-2xl text-[#FF0000] hover:opacity-80 transition"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md md:text-xl font-bold mb-4 text-orange-500">Quick Links</h4>

            {/* IMPORTANT: two cols on mobile, single col on md+ */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 text-sm hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-md md:text-xl font-bold mb-4 text-orange-500">Our Services</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-300 text-sm hover:text-orange-500 transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-md md:text-xl font-bold mb-4 text-orange-500">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1" />
                <p className="text-gray-300 leading-snug">
                  Near Mahakaleshwar Temple,
                  <br /> Ujjain, Madhya Pradesh 456001
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-orange-500" />
                <p className="text-gray-300">+91-{brand.mobile}</p>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-orange-500" />
                <p className="text-gray-300">{brand.email}</p>
              </div>

              <div className="mt-2">
                <h5 className="font-bold text-sm text-orange-500">24/7 Emergency Support</h5>
                <p className="text-gray-300 text-sm">+91-{brand.mobile}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              {legal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
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
