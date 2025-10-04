import "./globals.css"
import BottomTabBar from "@/components/BottomTabBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { UjjainProvider } from "@/components/context/UjjainContext"
export const metadata = {
  title: "Ujjain Explore - Sacred City Explorer",
  description:
    "Your trusted companion for exploring the sacred city of Ujjain with premium car rentals, hotel bookings, and expert guidance.",
  manifest: "/manifest.json",
/*   themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
 */
icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
}
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ujjain Travel" />
        <link rel="apple-touch-icon" href="/placeholder.svg?height=180&width=180" />
      </head>
      <body className="antialiased">
        <UjjainProvider>
        <Header/>
          
          
          {children}
          
       <Footer/>
          </UjjainProvider>
       {<BottomTabBar/>}
      </body>
    </html>
  )
}
