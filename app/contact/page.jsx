"use client"
import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaHeadset } from "react-icons/fa"
import SEOHead from "@/components/SEOHead"
import { useUjjain } from "@/components/context/UjjainContext"
import { ContactService } from "@/components/apiService"

export default function Contact() {
  const { brand } = useUjjain()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    urgency: "normal",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // null, 'success', 'error'

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await ContactService.create(formData)
      setSubmitStatus('success')
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        urgency: "normal",
      })
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: <FaPhone className="text-3xl text-orange-500" />,
      title: "Phone Support",
      details: [brand.mobile],
      description: "Call us for immediate assistance",
      action: `tel:${brand.mobile}`,
      actionText: "Call Now",
    },
    {
      icon: <FaWhatsapp className="text-3xl text-green-500" />,
      title: "WhatsApp Support",
      details: [brand.mobile],
      description: "Quick responses via WhatsApp chat",
      action: `https://wa.me/${brand.mobile}`,
      actionText: "Chat on WhatsApp",
    },
    {
      icon: <FaEnvelope className="text-3xl text-blue-500" />,
      title: "Email Support",
      details: [brand.email],
      description: "Send us your queries, we respond within 2 hours",
      action: `mailto:${brand.email}`,
      actionText: "Send Email",
    },
  ]

  const officeInfo = [
    {
      icon: <FaMapMarkerAlt className="text-2xl text-orange-500" />,
      title: "Main Office",
      details: [ "Indore Road, Ujjain", "Madhya Pradesh 456001"],
    },
    {
      icon: <FaClock className="text-2xl text-blue-500" />,
      title: "Office Hours",
      details: ["Monday - Sunday: 24/7", "Emergency Support: Always Available", "Office Visits: 9:00 AM - 8:00 PM"],
    },
    {
      icon: <FaHeadset className="text-2xl text-green-500" />,
      title: "Support Languages",
      details: ["Hindi (Native)", "English (Available)"],
    },
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <SEOHead
        title={`Contact Us - ${brand.name}`}
        description={`Get in touch with ${brand.name} for all your travel needs. Contact us via phone, WhatsApp, or email for immediate assistance.`}
        keywords="safar sathi contact, support, travel help, contact safar sathi"
      />

      

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">We're Here to Help</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Support for all your travel needs. Our dedicated team is always ready to assist you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${brand.mobile}`}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <FaPhone className="inline mr-2" />
                Call Now: {brand.mobile}
              </a>
              <a
                href={`https://wa.me/${brand.mobile}`}
                className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                <FaWhatsapp className="inline mr-2" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your preferred way to contact us. We're here to assist you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{method.title}</h3>
                <div className="space-y-2 mb-4">
                  {method.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 font-semibold">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <a
                  href={method.action}
                  className="inline-block bg-orange-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
                >
                  {method.actionText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
              <p className="text-xl text-gray-600">Fill out the form below and we'll get back to you within 2 hours</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select subject</option>
                        <option value="car-booking">Car Booking</option>
                        <option value="hotel-booking">Hotel Booking</option>
                        <option value="tour-package">Tour Package</option>
                        <option value="complaint">Complaint</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="Please describe your query in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">
                      Thank you for your message! We will get back to you within 2 hours.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
                      Failed to send message. Please try again or contact us directly.
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Office Information */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {officeInfo.map((info, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{info.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Map Placeholder */}
               {/*  <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Find Us</h3>
                  <div className="bg-gray-200 rounded-2xl h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FaMapMarkerAlt className="text-4xl mx-auto mb-2" />
                      <p>Interactive Map</p>
                      <p className="text-sm">Near Mahakaleshwar Temple, Ujjain</p>
                    </div>
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Quick Links */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Need Quick Answers?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Check our frequently asked questions for instant answers to common queries
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/faqs"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              View FAQs
            </a>
            <a
              href="/blogs"
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Travel Guides
            </a>
          </div>
        </div>
      </section>

   
     
    </div>
  )
}
