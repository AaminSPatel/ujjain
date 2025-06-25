"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaStar, FaCheckCircle, FaPhone, FaWhatsapp, FaClock } from "react-icons/fa"
import Header from "../../components/Header"
import SEOHead from "../../components/SEOHead"
import { useUjjain } from "../../components/UjjainContext"

export default function ServiceDetail({ params }) {
  const [service, setService] = useState(null)

   const {serviceData} = useUjjain() 


  useEffect(() => {
    const currentService = serviceData[params.slug]
    if (currentService) {
      setService(currentService)
    }
  }, [params.slug])

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${service.title} - Ujjain Travel`}
        description={service.description}
        keywords={`${service.title.toLowerCase()}, ujjain ${service.title.toLowerCase()}, ujjain travel services`}
        image={service.image}
      />
      
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30">
          <div className="container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{service.title}</h1>
              <h2 className="text-xl md:text-2xl mb-6 text-orange-300">{service.subtitle}</h2>
              <p className="text-lg mb-8 leading-relaxed">{service.description}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+919876543210"
                  className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-colors duration-300"
                >
                  <FaPhone className="inline mr-2" />
                  Book Now
                </a>
                <a
                  href="https://wa.me/919876543210"
                  className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors duration-300"
                >
                  <FaWhatsapp className="inline mr-2" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What's Included</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive service includes everything you need for a memorable spiritual experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-2xl text-orange-500" />
                </div>
                <p className="font-semibold text-gray-800">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Package</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect package that suits your needs and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {service.packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card overflow-hidden ${index === 1 ? 'ring-2 ring-orange-500 transform scale-105' : ''}`}
              >
                {index === 1 && (
                  <div className="bg-orange-500 text-white text-center py-2 font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{pkg.name}</h3>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-orange-500 mb-2">
                      ₹{pkg.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600">per person</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <FaClock className="text-blue-500 mr-3" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-3" />
                      <span>{pkg.temples} temples covered</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Package Includes:</h4>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition-colors duration-300">
                    Book This Package
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from satisfied travelers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {service.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Services?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide exceptional service with attention to every detail of your spiritual journey
            </p>
          </div>

         </div>
         </section>
         </div>
  )}