import "./globals.css"
import BottomTabBar from "@/components/BottomTabBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ClientLayout from "@/components/ClientLayout"
import InstallPWA from "@/components/InstallPwa"
export const metadata = {
  title: "Safar Sathi - Sacred City Explorer",
  description:
    "Your trusted companion for exploring the sacred city of Ujjain with premium car rentals, hotel bookings, and expert guidance.",
 // manifest: "/manifest.json",
/*   themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
 */

}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f97316" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ujjain Travel" />

        {/* Favicon setup */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="background-color" content="#f7ff74" />
      </head>
      <body className="antialiased">
        <ClientLayout>
        <Header/>


          {children}
  <InstallPWA/> 
       <Footer/>
          </ClientLayout>
       {<BottomTabBar/>}
      </body>
    </html>
  )
}
