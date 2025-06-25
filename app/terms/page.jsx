"use client"
import { motion } from "framer-motion"
import Header from "../components/Header"
import Footer from "../components/Footer"
import BottomTabBar from "../components/BottomTabBar"
import SEOHead from "../components/SEOHead"

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using Ujjain Travel services, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all visitors, users, and others who access or use our services.",
    },
    {
      title: "2. Services Description",
      content:
        "Ujjain Travel provides car rental services, hotel booking assistance, tour guidance, and travel-related services in and around Ujjain, Madhya Pradesh. We act as an intermediary between customers and service providers.",
    },
    {
      title: "3. Booking and Payment Terms",
      content:
        "All bookings are subject to availability and confirmation. Payment terms vary by service type. Car rentals require advance payment or security deposit. Hotel bookings follow individual hotel policies. Cancellation charges may apply as per our cancellation policy.",
    },
    {
      title: "4. Cancellation Policy",
      content:
        "Car Rentals: Free cancellation up to 24 hours before pickup time. Hotel Bookings: Cancellation terms as per individual hotel policies. Tour Packages: Cancellation charges apply based on the time of cancellation before the tour date.",
    },
    {
      title: "5. User Responsibilities",
      content:
        "Users must provide accurate information during booking. Valid identification is required for all services. Users are responsible for their belongings and behavior during the service period. Any damage to vehicles or property will be charged to the user.",
    },
    {
      title: "6. Limitation of Liability",
      content:
        "Ujjain Travel acts as an intermediary and is not liable for services provided by third parties. We are not responsible for delays, cancellations, or changes in services due to circumstances beyond our control including weather, traffic, or force majeure events.",
    },
    {
      title: "7. Privacy Policy",
      content:
        "We collect and use personal information in accordance with our Privacy Policy. Your information is used solely for providing services and improving customer experience. We do not share personal information with third parties without consent.",
    },
    {
      title: "8. Intellectual Property",
      content:
        "All content on our website including text, graphics, logos, and images are the property of Ujjain Travel. Users may not reproduce, distribute, or create derivative works without written permission.",
    },
    {
      title: "9. Dispute Resolution",
      content:
        "Any disputes arising from the use of our services will be resolved through negotiation. If unresolved, disputes will be subject to the jurisdiction of courts in Ujjain, Madhya Pradesh, India.",
    },
    {
      title: "10. Changes to Terms",
      content:
        "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of modified terms.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Terms & Conditions - Ujjain Travel"
        description="Read the terms and conditions for using Ujjain Travel services including car rentals, hotel bookings, and tour packages."
        keywords="ujjain travel terms, conditions, policy, car rental terms, hotel booking policy"
      />

      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Please read these terms carefully before using our services
            </p>
            <div className="mt-8 text-sm text-gray-300">Last updated: January 15, 2024</div>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                <h2 className="text-xl font-bold text-blue-800 mb-2">Important Notice</h2>
                <p className="text-blue-700">
                  By using Ujjain Travel services, you agree to comply with and be bound by these terms and conditions.
                  Please review them carefully. If you do not agree with these terms, please do not use our services.
                </p>
              </div>
            </motion.div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 card p-8 bg-gradient-to-br from-orange-50 to-blue-50"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@ujjaintravel.com
                </p>
                <p>
                  <strong>Phone:</strong> +91-9876543210
                </p>
                <p>
                  <strong>Address:</strong> Near Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456001
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <BottomTabBar />
    </div>
  )
}
