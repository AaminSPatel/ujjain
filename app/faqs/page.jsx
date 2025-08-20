"use client"
import { useState } from "react"
import { FaChevronDown, FaChevronUp, FaSearch, FaQuestionCircle } from "react-icons/fa"

export default function FAQs() {
  const [openAccordion, setOpenAccordion] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "booking", name: "Booking" },
    { id: "temples", name: "Temples" },
    { id: "travel", name: "Travel" },
    { id: "accommodation", name: "Hotels" },
    { id: "general", name: "General" },
  ]

  const faqs = [
    {
      id: 1,
      category: "booking",
      question: "How can I book a car for temple visits in Ujjain?",
      answer:
        "You can book a car through our website by visiting the Cars section, selecting your preferred vehicle, choosing dates, and completing the booking process. You can also call our 24/7 helpline at +91-9876543210 for immediate assistance.",
    },
    {
      id: 2,
      category: "temples",
      question: "What are the timings for Mahakaleshwar Temple darshan?",
      answer:
        "Mahakaleshwar Temple is open from 4:00 AM to 11:00 PM daily. The famous Bhasma Aarti takes place early morning around 4:00 AM. We recommend reaching by 3:30 AM for the Bhasma Aarti as it requires advance booking and has limited capacity.",
    },
    {
      id: 3,
      category: "booking",
      question: "Can I cancel my booking? What is the cancellation policy?",
      answer:
        "Yes, you can cancel your booking. For cars: Free cancellation up to 24 hours before pickup. For hotels: Free cancellation up to 48 hours before check-in. Cancellation charges may apply for last-minute cancellations. Please check specific terms during booking.",
    },
    {
      id: 4,
      category: "temples",
      question: "How do I book tickets for Bhasma Aarti at Mahakaleshwar Temple?",
      answer:
        "Bhasma Aarti tickets can be booked online through the official temple website or through authorized booking centers. We recommend booking at least 2-3 days in advance as tickets are limited. Our team can also assist you with the booking process.",
    },
    {
      id: 5,
      category: "travel",
      question: "What is the best time to visit Ujjain?",
      answer:
        "The best time to visit Ujjain is from October to March when the weather is pleasant. Avoid summer months (April-June) due to extreme heat. Monsoon season (July-September) can be good but expect occasional heavy rains. Festival times like Mahashivratri and Kumbh Mela are spiritually significant but expect larger crowds.",
    },
    {
      id: 6,
      category: "accommodation",
      question: "Are there hotels near Mahakaleshwar Temple?",
      answer:
        "Yes, we have partnered with several hotels located within walking distance of Mahakaleshwar Temple. Options range from budget accommodations to luxury hotels. Most are within 0.5 km of the temple, making it convenient for early morning darshan and Bhasma Aarti.",
    },
    {
      id: 7,
      category: "travel",
      question: "Do your drivers know about all the temples and their significance?",
      answer:
        "Yes, all our drivers are local residents with extensive knowledge about Ujjain temples, their history, significance, and the best routes. Many of our drivers have been serving pilgrims for years and can provide valuable insights about rituals, timings, and local customs.",
    },
    {
      id: 8,
      category: "general",
      question: "Is 24/7 customer support really available?",
      answer:
        "Our customer support team is available 24/7 to assist you with any queries, emergencies, or last-minute changes. You can reach us at +91-9876543210 anytime. We understand that spiritual journeys don't follow regular business hours.",
    },
    {
      id: 9,
      category: "booking",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods including credit cards, debit cards, UPI, net banking, and digital wallets. You can also pay cash to the driver for car bookings, though advance online payment is recommended to confirm your booking.",
    },
    {
      id: 10,
      category: "temples",
      question: "Can you arrange special darshan or VIP passes?",
      answer:
        "We can assist with special darshan arrangements where available. Some temples offer VIP darshan for faster access. However, availability depends on the temple authorities and specific dates. Contact us in advance to check availability and make arrangements.",
    },
    {
      id: 11,
      category: "travel",
      question: "How far is Ujjain from major cities?",
      answer:
        "Ujjain is well-connected by road and rail. Distance from major cities: Indore (55 km), Bhopal (185 km), Delhi (650 km), Mumbai (650 km). We can arrange pickup from airports and railway stations. The nearest airport is Devi Ahilya Bai Holkar Airport in Indore.",
    },
    {
      id: 12,
      category: "accommodation",
      question: "Do hotels provide vegetarian food?",
      answer:
        "Yes, all our partner hotels understand the dietary preferences of pilgrims and provide pure vegetarian food. Many hotels have dedicated vegetarian kitchens and offer traditional Indian meals. Some also provide Jain food options upon request.",
    },
    {
      id: 13,
      category: "general",
      question: "What safety measures do you follow?",
      answer:
        "We prioritize your safety with verified drivers, well-maintained vehicles, GPS tracking, and regular vehicle inspections. All our partner hotels follow safety and hygiene standards. Our 24/7 support ensures help is always available during your journey.",
    },
    {
      id: 14,
      category: "temples",
      question: "Are there any dress code requirements for temples?",
      answer:
        "Most temples in Ujjain prefer modest, traditional clothing. Avoid shorts, sleeveless tops, and leather items. Many temples provide free cloth to cover if needed. For Bhasma Aarti, devotees often wear white clothes. Our drivers can guide you about specific requirements.",
    },
    {
      id: 15,
      category: "travel",
      question: "Can you arrange customized tour packages?",
      answer:
        "Yes, we offer customized tour packages based on your preferences, duration of stay, and budget. We can create itineraries covering all major temples, cultural sites, and experiences. Contact our team to discuss your requirements and get a personalized quote.",
    },
  ]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
     
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about visiting Ujjain, booking services, and temple information
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {selectedCategory === "all"
                  ? "All Questions"
                  : `${categories.find((c) => c.id === selectedCategory)?.name} Questions`}
              </h2>
              <p className="text-xl text-gray-600">
                {filteredFAQs.length} question{filteredFAQs.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="card overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <FaQuestionCircle className="text-blue-500 mt-1 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
                    </div>
                    <div className="flex-shrink-0">
                      {openAccordion === faq.id ? (
                        <FaChevronUp className="text-blue-500" />
                      ) : (
                        <FaChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {openAccordion === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="pl-8 border-l-4 border-blue-500">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl text-gray-300 mb-4">❓</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No questions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Can't find the answer you're looking for? Our 24/7 support team is here to help you with any queries about
            your Ujjain journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Call: +91-9876543210
            </a>
            <a
              href="mailto:info@ujjaintravel.com"
              className="border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

     
    </div>
  )
}
