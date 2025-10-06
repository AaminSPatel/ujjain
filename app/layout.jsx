"use client"

import "./globals.css"
import { useEffect, useState } from "react"
import BottomTabBar from "@/components/BottomTabBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ClientLayout from "@/components/ClientLayout"
import InstallPWA from "@/components/InstallPwa"

export const metadata = {
  title: "Safar Sathi - Sacred City Explorer",
  description:
    "Your trusted companion for exploring the sacred city of Ujjain with premium car rentals, hotel bookings, and expert guidance.",
}

export default function RootLayout({ children }) {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    // ✅ Detect PWA (standalone) mode
    const checkPWA = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone
      setIsPWA(standalone)
    }

    checkPWA()
    window.addEventListener("resize", checkPWA)
    return () => window.removeEventListener("resize", checkPWA)
  }, [])

  return (
    <html lang="en">
      <head>
        {/* ✅ PWA Essentials */}
        <meta name="application-name" content="Safar Sathi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Safar Sathi" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f97316" />
        <meta name="background-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />

        {/* ✅ App Icons for Android/iOS */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>

      <body className="antialiased">
        <ClientLayout>
          <Header />
          {children}
          <InstallPWA />
          <Footer />
          {/* ✅ Show BottomTabBar only if in PWA mode */}
          {isPWA && <BottomTabBar />}
        </ClientLayout>
      </body>
    </html>
  )
}
