"use client"
import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { FaPhone, FaCar, FaHotel,  FaQuoteLeft, FaArrowRight, FaStar, FaClock } from "react-icons/fa"
import { MdPlace, MdRateReview } from "react-icons/md"
import Link from "next/link"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      image: "/tower.jpeg",
      title: "Discover Sacred Ujjain",
      subtitle: "Experience the spiritual heart of India",
      description: "Explore ancient temples, sacred ghats, and divine experiences in the holy city of Ujjain",
    },
    {
      image: "/mahakal2.jpeg",
      title: "Mahakaleshwar Temple",
      subtitle: "One of the 12 Jyotirlingas",
      description: "Visit the most sacred temple dedicated to Lord Shiva in the heart of Ujjain",
    },
    {
      image: "/kumbh1.jpeg",
      title: "Kumbh Mela Experience",
      subtitle: "Witness the grand spiritual gathering",
      description: "Be part of the worlds largest religious gathering at the sacred Shipra River",
    },
  ]

  const features = [
    {
      icon: <FaCar className="text-4xl text-orange-500" />,
      title: "Premium Car Rentals",
      description: "Comfortable and reliable vehicles for your Ujjain journey",
      link: "/cars",
    },
    {
      icon: <FaHotel className="text-4xl text-blue-600" />,
      title: "Best Hotels",
      description: "Handpicked accommodations near major temples and attractions",
      link: "/hotels",
    },
    {
      icon: <FaStar className="text-4xl text-purple-600" />,
      title: "Sacred Places",
      description: "Detailed guides to all holy sites and temples in Ujjain",
      link: "/places",
    },
    {
      icon: <FaClock className="text-4xl text-green-600" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your travel needs",
      link: "/contact",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment: "Amazing service! The car was clean and the driver was very knowledgeable about Ujjain temples.",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Perfect hotel recommendations. Stayed very close to Mahakaleshwar temple. Highly recommended!",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad",
      rating: 5,
      comment: "Excellent 24/7 support. They helped us plan the perfect darshan schedule during Kumbh Mela.",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const popularPlaces = [
    {
      name: "Mahakaleshwar Temple",
      image: "/mahakal3.jpeg",
      description: "Sacred Jyotirlinga temple",
      rating: 4.9,
    },
    {
      name: "Ram Ghat",
      image: "/ramghat1.jpeg",
      description: "Holy bathing ghat on Shipra",
      rating: 4.8,
    },
    {
      name: "Kal Bhairav Temple",
      image: "/kalbhairawa.jpeg",
      description: "Ancient temple of Lord Bhairav",
      rating: 4.7,
    },
    {
      name: "Vedh Shala",
      image: "/vedshala.jpeg",
      description: "Historic astronomical observatory",
      rating: 4.6,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />

      {/* Hero Section with Swiper */}
      <section className="relative  sm:h-screen h-[80vh]">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="h-full max-h-screen"
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full sm:max-h-screen sm:h-screen h-[70vh] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30">
                  <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="text-white max-w-2xl">
                      <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
                      <h2 className="text-2xl md:text-3xl mb-6 text-orange-300">{slide.subtitle}</h2>
                      <p className="text-xl mb-8 leading-relaxed">{slide.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <Link href="/cars" className="btn-primary">
                          Book Car <FaCar className="ml-2 inline" />
                        </Link>
                        <Link href="/hotels" className="btn-secondary">
                          Book Hotel <FaHotel className="ml-2 inline" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 24/7 Help Banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 z-10">
          <div className="container mx-auto px-4 flex items-center justify-center">
            <FaPhone className="mr-3 text-xl animate-pulse" />
            <span className="text-lg font-semibold">24/7 Help Available - Call: +91-9876543210</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Choose Ujjain Travel?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive travel services to make your spiritual journey to Ujjain memorable and
              hassle-free
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link href={feature.link} key={index}>
                <div className="card p-8 text-center group cursor-pointer">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <div className="flex items-center justify-center text-orange-500 font-semibold">
                    Learn More <FaArrowRight className="ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Places Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Popular Sacred Places</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most revered temples and holy sites in Ujjain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularPlaces.map((place, index) => (
              <div key={index} className="card overflow-hidden">
                <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{place.name}</h3>
                  <p className="text-gray-600 mb-4">{place.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-semibold">{place.rating}</span>
                    </div>
                    <Link href="/places" className="text-orange-500 font-semibold hover:text-orange-600">
                      Explore <FaArrowRight className="ml-1 inline" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/places" className="btn-primary">
              View All Places <MdPlace className="ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read reviews from pilgrims who experienced Ujjain with our services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>

                <div className="relative">
                  <FaQuoteLeft className="text-orange-500 text-2xl mb-4" />
                  <p className="text-gray-700 italic">{testimonial.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/reviews" className="btn-secondary">
              Read More Reviews <MdRateReview className="ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Explore Sacred Ujjain?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Book your car and hotel now for an unforgettable spiritual journey to the holy city of Ujjain
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-300"
            >
              Get Help
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
