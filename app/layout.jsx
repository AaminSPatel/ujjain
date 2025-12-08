import "./globals.css"
import BottomTabBar from "@/components/BottomTabBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ClientLayout from "@/components/ClientLayout"
import InstallPWA from "@/components/InstallPwa"

export const metadata = {
  title: "Safar Sathi - Premium Car Rentals & Taxi Services in Dewas, Indore, Ujjain | 24/7 Cab Booking",
  description: "Safar Sathi offers premium taxi services, car rentals, and cab bookings in Dewas, Indore, Ujjain, and surrounding areas. Book 24/7 reliable taxi services for local rides, airport transfers, outstation trips, temple tours, and corporate travel. Affordable AC/Non-AC cabs with verified drivers, instant booking, and safe rides for families, tourists, and business travelers across Madhya Pradesh.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // Removed keywords array as it's not used by modern search engines
  // and can be considered spammy if too long
  keywords : [ "Indore taxi for tourists", 'safar', 'sathi', 'taxi', 'ujjain', 'indore',
    "Reliable airport transfer Indore",
    "Indore VIP cab service",
    "Indore ride for shopping",
    "Cab to Meghdoot Garden Indore",

    "Safar Sathi Indore",
    "Safar Sathi taxi Indore",
    "Safar Sathi cab booking Indore",
    "Safar Sathi airport taxi Indore",
    "Safar Sathi car rental Indore",
    "Safar Sathi ride booking Indore",
    "Safar Sathi Indore travel",
    "Safar Sathi Vijay Nagar cab",
    "Safar Sathi Palasia cab",
    "Safar Sathi Rajwada taxi",
    "Safar Sathi Indore app",
    "Safar Sathi drivers Indore",
    "Safar Sathi local ride Indore",
    "Safar Sathi corporate cab Indore",
    "Safar Sathi outstation Indore",
    "Safar Sathi airport pickup",
    "Safar Sathi contact Indore",
    "Safar Sathi rental cab Indore",
    "Safar Sathi nearby taxi",
    "Safar Sathi premium cab Indore",

    // Additional 10 SEO-boosting keywords
    "Madhya Pradesh taxi service",
    "Central India car rental",
    "MP tourism cab service",
    "Religious tour taxi Madhya Pradesh",
    "Business travel cab MP",
    "Affordable intercity taxi service",
    "Premium car hire Madhya Pradesh",
    "24/7 cab service near me",
    "Online taxi booking app",
    "Trusted cab service MP"
  ],

  openGraph: {
    title: "Safar Sathi - Premium Taxi Services in Dewas, Indore & Ujjain",
    description: "Safar Sathi - Book reliable 24/7 taxi services, car rentals, and cab bookings across Dewas, Indore, Ujjain. Airport transfers, outstation trips, temple tours with verified drivers.",
    url: "https://safar-sathi.vercel.app/",
    siteName: "Safar Sathi",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Safar Sathi - Premium Taxi Services",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safar Sathi - Premium Taxi Services in MP",
    description: "24/7 reliable taxi services in Dewas, Indore, Ujjain. Book cabs for local rides, airport transfers, outstation trips & temple tours with safar sathi.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://safar-sathi.vercel.app/",
  },
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  // Removed appleWebApp as it's duplicated in head
  // Removed formatDetection as it's not commonly used
  category: "travel",
  authors: [{ name: "Safar Sathi Team" }],
  publisher: "Safar Sathi",
  // Removed viewport as it should only be in head
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Compulsory Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* ✅ PWA Essentials */}
        <meta name="application-name" content="Safar Sathi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Safar Sathi" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f97316" />
        <meta name="background-color" content="#ffffff" />
        
        {/* ✅ Google Verification */}
        <meta name="google-site-verification" content="zqC-69tz8B1VhINUghxq96W2BgClagcAIvgQKh7Lqi4" />
        
        {/* ✅ Icons - Cleaned and Optimized */}
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
       {/*  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
         */}
        {/* ✅ Preload Critical Resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ✅ Additional SEO Meta */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
      </head>

      <body className="antialiased">
        <ClientLayout>
          <Header />
          {children}
          <InstallPWA />
          <Footer />
          <BottomTabBar />
        </ClientLayout>
      </body>
    </html>
  )
}