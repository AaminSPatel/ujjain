"use client"
import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { FaCalendar, FaUser, FaEye, FaHeart, FaComment, FaSearch } from "react-icons/fa"
import Link from "next/link"

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "temples", name: "Temples" },
    { id: "festivals", name: "Festivals" },
    { id: "travel-tips", name: "Travel Tips" },
    { id: "culture", name: "Culture" },
    { id: "history", name: "History" },
  ]

  const blogs = [
    {
      id: 1,
      title: "Complete Guide to Mahakaleshwar Temple Darshan",
      category: "temples",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Everything you need to know about visiting the sacred Jyotirlinga temple, including timings, rituals, and the famous Bhasma Aarti.",
      author: "Rajesh Sharma",
      date: "2024-01-15",
      readTime: "8 min read",
      views: 2847,
      likes: 156,
      comments: 23,
      featured: true,
    },
    {
      id: 2,
      title: "Kumbh Mela 2025: A Pilgrim's Complete Guide",
      category: "festivals",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Prepare for the grand Kumbh Mela in Ujjain with our comprehensive guide covering dates, rituals, accommodation, and essential tips.",
      author: "Priya Gupta",
      date: "2024-01-12",
      readTime: "12 min read",
      views: 3421,
      likes: 234,
      comments: 45,
      featured: true,
    },
    {
      id: 3,
      title: "10 Hidden Gems in Ujjain You Must Visit",
      category: "travel-tips",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Discover lesser-known temples, ghats, and cultural sites that offer authentic spiritual experiences away from the crowds.",
      author: "Amit Patel",
      date: "2024-01-10",
      readTime: "6 min read",
      views: 1876,
      likes: 98,
      comments: 17,
      featured: false,
    },
    {
      id: 4,
      title: "The Sacred History of Shipra River",
      category: "history",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Explore the mythological and historical significance of the holy Shipra River and its role in Hindu traditions.",
      author: "Dr. Sunita Joshi",
      date: "2024-01-08",
      readTime: "10 min read",
      views: 1543,
      likes: 87,
      comments: 12,
      featured: false,
    },
    {
      id: 5,
      title: "Best Time to Visit Ujjain: A Seasonal Guide",
      category: "travel-tips",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Plan your spiritual journey with our detailed guide on weather, festivals, and crowd patterns throughout the year.",
      author: "Vikash Singh",
      date: "2024-01-05",
      readTime: "7 min read",
      views: 2156,
      likes: 134,
      comments: 28,
      featured: false,
    },
    {
      id: 6,
      title: "Traditional Ujjain Cuisine: A Food Lover's Guide",
      category: "culture",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Savor the authentic flavors of Ujjain with our guide to local delicacies, street food, and traditional restaurants.",
      author: "Meera Sharma",
      date: "2024-01-03",
      readTime: "9 min read",
      views: 1987,
      likes: 156,
      comments: 34,
      featured: false,
    },
    {
      id: 7,
      title: "Kal Bhairav Temple: The Unique Liquor Offering Tradition",
      category: "temples",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Learn about the fascinating tradition of offering liquor to Kal Bhairav and the spiritual significance behind this unique practice.",
      author: "Pandit Ramesh Tiwari",
      date: "2024-01-01",
      readTime: "5 min read",
      views: 2654,
      likes: 189,
      comments: 41,
      featured: false,
    },
    {
      id: 8,
      title: "Photography Guide: Capturing Ujjain's Spiritual Beauty",
      category: "travel-tips",
      image: "/placeholder.svg?height=250&width=400",
      excerpt:
        "Tips and techniques for photographing temples, rituals, and landscapes while respecting religious sentiments.",
      author: "Rohit Photographer",
      date: "2023-12-28",
      readTime: "11 min read",
      views: 1432,
      likes: 76,
      comments: 19,
      featured: false,
    },
  ]

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredBlogs = blogs.filter((blog) => blog.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Ujjain Travel Blog</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Discover stories, guides, and insights about the sacred city of Ujjain from fellow travelers and local
            experts
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
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      {selectedCategory === "all" && searchTerm === "" && (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Stories</h2>
              <p className="text-xl text-gray-600">Our most popular and insightful articles</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredBlogs.map((blog) => (
                <div key={blog.id} className="card overflow-hidden group">
                  <div className="relative">
                    <img
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {blog.category.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                      <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed">{blog.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendar className="mr-1" />
                          <span>{new Date(blog.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span>{blog.readTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaEye className="mr-1" />
                          <span>{blog.views}</span>
                        </div>
                        <div className="flex items-center">
                          <FaHeart className="mr-1" />
                          <span>{blog.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <FaComment className="mr-1" />
                          <span>{blog.comments}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blogs/${blog.id}`}
                        className="bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-600 transition-colors duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Blogs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {selectedCategory === "all"
                ? "All Stories"
                : `${categories.find((c) => c.id === selectedCategory)?.name} Stories`}
            </h2>
            <p className="text-xl text-gray-600">
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="card overflow-hidden group">
                <div className="relative">
                  <img
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
                      {blog.category.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  {blog.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">{blog.excerpt.substring(0, 120)}...</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      <span>{blog.author}</span>
                    </div>
                    <span>{blog.readTime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <FaEye className="mr-1" />
                        <span>{blog.views}</span>
                      </div>
                      <div className="flex items-center">
                        <FaHeart className="mr-1" />
                        <span>{blog.likes}</span>
                      </div>
                    </div>

                    <Link
                      href={`/blogs/${blog.id}`}
                      className="bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-purple-600 transition-colors duration-300"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-300 mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Subscribe to our newsletter and never miss the latest stories, guides, and tips about Ujjain
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
