import Header from "../components/Header"
import Footer from "../components/Footer"
import { FaUsers, FaAward, FaCar, FaHotel, FaMapMarkerAlt, FaClock, FaHeart, FaShieldAlt } from "react-icons/fa"
import Link from "next/link"

export default function About() {
  const stats = [
    { icon: <FaUsers />, number: "10,000+", label: "Happy Travelers" },
    { icon: <FaCar />, number: "500+", label: "Cars Available" },
    { icon: <FaHotel />, number: "200+", label: "Partner Hotels" },
    { icon: <FaAward />, number: "5", label: "Years Experience" },
  ]

  const values = [
    {
      icon: <FaHeart className="text-4xl text-red-500" />,
      title: "Devotion",
      description:
        "We understand the spiritual significance of your journey to Ujjain and treat every pilgrimage with utmost respect and care.",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-500" />,
      title: "Trust",
      description:
        "Your safety and satisfaction are our top priorities. We maintain the highest standards in all our services.",
    },
    {
      icon: <FaClock className="text-4xl text-blue-500" />,
      title: "Reliability",
      description:
        "24/7 support ensures you always have assistance whenever you need it during your spiritual journey.",
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl text-purple-500" />,
      title: "Local Expertise",
      description:
        "Our deep knowledge of Ujjain helps you discover hidden gems and experience authentic spiritual moments.",
    },
  ]

  const team = [
    {
      name: "Rajesh Sharma",
      position: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      description: "A devoted follower of Lord Mahakal with 15+ years in travel industry.",
    },
    {
      name: "Priya Gupta",
      position: "Operations Manager",
      image: "/placeholder.svg?height=200&width=200",
      description: "Expert in hospitality management ensuring smooth travel experiences.",
    },
    {
      name: "Amit Patel",
      position: "Tour Guide Coordinator",
      image: "/placeholder.svg?height=200&width=200",
      description: "Local expert with deep knowledge of Ujjain temples and traditions.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Ujjain Travel</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Your trusted companion for exploring the sacred city of Ujjain, where spirituality meets exceptional service
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl text-orange-500 mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2019 by a group of devoted pilgrims, Ujjain Travel was born from a deep understanding of
                  the spiritual significance of Ujjain and the challenges faced by travelers visiting this sacred city.
                </p>
                <p>
                  Our founder, Rajesh Sharma, after multiple visits to Mahakaleshwar Temple, realized the need for a
                  reliable, respectful, and comprehensive travel service that understands the spiritual nature of the
                  journey to Ujjain.
                </p>
                <p>
                  Today, we have served over 10,000 pilgrims and travelers, helping them experience the divine energy of
                  Ujjain while ensuring their comfort, safety, and spiritual fulfillment.
                </p>
                <p>
                  We believe that every journey to Ujjain is sacred, and we are honored to be part of your spiritual
                  experience.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/tower.jpeg"
                alt="Mahakaleshwar Temple"
                className="rounded-3xl shadow-lg"
              />
              <img
                src="/mahakal5.jpeg"
                alt="Ujjain Ghat"
                className="rounded-3xl shadow-lg mt-8"
              />
              <img
                src="/abt1.jpeg"
                alt="Temple Rituals"
                className="rounded-3xl shadow-lg -mt-8"
              />
              <img
                src="/ic1.png"
                alt="Spiritual Journey"
                className="rounded-3xl h-96 object-contain shadow-lg bg-gradient-to-b from-teal-100 via-sky-400 to-teal-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide us in serving every pilgrim and traveler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="mb-6 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to making your Ujjain experience unforgettable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-8 text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-orange-500 font-semibold mb-4">{member.position}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8">
            To provide exceptional travel services that honor the spiritual significance of Ujjain while ensuring
            comfort, safety, and authentic experiences for every pilgrim and traveler.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Us
            </Link>
            <Link
              href="/booking"
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
