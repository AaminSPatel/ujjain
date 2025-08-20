"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaCalendar,
  FaUser,
  FaEye,
  FaHeart,
  FaComment,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
} from "react-icons/fa"
import RecommendedSection from "@/components/RecommendedSection"
import ReviewModal from "@/components/ReviewModal"
import SEOHead from "@/components/SEOHead"
import { useUjjain } from "@/components/context/UjjainContext"

export default function BlogDetail({ params }) {
  const { addToFavorites, removeFromFavorites, favorites } = useUjjain()
  const [blog, setBlog] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [recommendedPlaces, setRecommendedPlaces] = useState([])

  // Mock blog data - in real app, fetch from API
  const blogData = {
    1: {
      id: 1,
      title: "Complete Guide to Mahakaleshwar Temple Darshan",
      category: "temples",
      image: "/placeholder.svg?height=400&width=800",
      content: `
        <h2>Introduction to Mahakaleshwar Temple</h2>
        <p>The Mahakaleshwar Temple in Ujjain is one of the most sacred temples in India and holds the distinction of being one of the twelve Jyotirlingas. This ancient temple is dedicated to Lord Shiva in his fierce form as Mahakala, the lord of time and death.</p>
        
        <h2>History and Significance</h2>
        <p>The temple has a rich history dating back to ancient times. According to Hindu scriptures, the Jyotirlinga at Mahakaleshwar is swayambhu (self-manifested), making it extremely sacred. The temple has been mentioned in various ancient texts including the Puranas.</p>
        
        <h2>The Famous Bhasma Aarti</h2>
        <p>One of the most unique and spiritually significant rituals at Mahakaleshwar Temple is the Bhasma Aarti, performed early in the morning around 4:00 AM. This ritual involves the application of sacred ash (bhasma) to the Shivalinga, and it's believed to be extremely powerful and auspicious.</p>
        
        <h3>How to Book Bhasma Aarti</h3>
        <ul>
          <li>Online booking through the official temple website</li>
          <li>Advance booking recommended (2-3 days prior)</li>
          <li>Limited capacity - only 100 devotees allowed</li>
          <li>Arrive by 3:30 AM for entry</li>
        </ul>
        
        <h2>Temple Timings</h2>
        <p>The temple is open from 4:00 AM to 11:00 PM daily. However, there are specific timings for different rituals:</p>
        <ul>
          <li>Bhasma Aarti: 4:00 AM - 5:00 AM</li>
          <li>Morning Darshan: 5:00 AM - 12:00 PM</li>
          <li>Evening Darshan: 4:00 PM - 11:00 PM</li>
        </ul>
        
        <h2>What to Expect During Your Visit</h2>
        <p>Visiting Mahakaleshwar Temple is a deeply spiritual experience. The temple complex is beautifully maintained and offers a serene atmosphere for prayer and meditation. The main sanctum houses the Jyotirlinga, and the energy inside is palpable.</p>
        
        <h2>Tips for Visitors</h2>
        <ul>
          <li>Dress modestly - traditional Indian attire preferred</li>
          <li>Remove leather items before entering</li>
          <li>Photography may be restricted in certain areas</li>
          <li>Maintain silence and respect inside the temple</li>
          <li>Book accommodation nearby for early morning Bhasma Aarti</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>A visit to Mahakaleshwar Temple is not just a religious pilgrimage but a transformative spiritual journey. The divine energy of this sacred place leaves a lasting impact on every devotee who visits with faith and devotion.</p>
      `,
      author: "Rajesh Sharma",
      date: "2024-01-15",
      readTime: "8 min read",
      views: 2847,
      likes: 156,
      comments: 23,
      tags: ["Mahakaleshwar", "Jyotirlinga", "Ujjain", "Temple", "Bhasma Aarti"],
    },
  }

  useEffect(() => {
    const currentBlog = blogData[params.id]
    if (currentBlog) {
      setBlog(currentBlog)
      setIsLiked(favorites.some((fav) => fav.id === currentBlog.id && fav.type === "blog"))
    }

    // Mock related blogs and places
    setRelatedBlogs([
      {
        id: 2,
        name: "Kumbh Mela 2025 Guide",
        image: "/placeholder.svg",
        rating: 4.9,
        excerpt: "Complete guide to Kumbh Mela",
      },
      {
        id: 3,
        name: "Hidden Gems in Ujjain",
        image: "/placeholder.svg",
        rating: 4.7,
        excerpt: "Discover lesser-known places",
      },
    ])

    setRecommendedPlaces([
      {
        id: 1,
        name: "Mahakaleshwar Temple",
        image: "/placeholder.svg",
        rating: 4.9,
        description: "Sacred Jyotirlinga temple",
      },
      { id: 2, name: "Ram Ghat", image: "/placeholder.svg", rating: 4.8, description: "Holy bathing ghat" },
    ])
  }, [params.id, favorites])

  const handleLike = () => {
    if (isLiked) {
      removeFromFavorites(blog.id)
    } else {
      addToFavorites({ ...blog, type: "blog" })
    }
    setIsLiked(!isLiked)
  }

  const shareOptions = [
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "text-blue-600",
      action: () => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`),
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "text-blue-400",
      action: () => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog?.title}`),
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "text-green-500",
      action: () => window.open(`https://wa.me/?text=${blog?.title} ${window.location.href}`),
    },
    {
      name: "Copy Link",
      icon: FaCopy,
      color: "text-gray-600",
      action: () => {
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      },
    },
  ]

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${blog.title} | Ujjain Travel Blog`}
        description={blog.content.substring(0, 160)}
        keywords={`${blog.tags?.join(", ")}, ujjain travel blog`}
        image={blog.image}
      />


      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-end pb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-white max-w-4xl">
              <div className="mb-4">
                <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
                  {blog.category.toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FaEye className="mr-2" />
                  <span>{blog.views} views</span>
                </div>
                <span>{blog.readTime}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isLiked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                }`}
              >
                <FaHeart className={isLiked ? "text-red-500" : ""} />
                <span>{blog.likes + (isLiked ? 1 : 0)}</span>
              </motion.button>

              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-2xl hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
              >
                <FaComment />
                <span>{blog.comments}</span>
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all duration-300"
              >
                <FaShare />
                <span className="hidden sm:inline">Share</span>
              </button>

              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border p-2 min-w-[200px]"
                >
                  {shareOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        option.action()
                        setShowShareMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors duration-300"
                    >
                      <option.icon className={`text-xl ${option.color}`} />
                      <span className="text-gray-700">{option.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Places */}
      <RecommendedSection type="places" title="Related Places" items={recommendedPlaces} />

      {/* Related Blogs */}
      <RecommendedSection type="blogs" title="Related Articles" items={relatedBlogs} />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        type="blog"
        itemId={blog.id}
        itemName={blog.title}
      />

    </div>
  )
}
