"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaStar, FaTimes } from "react-icons/fa"
import { useUjjain } from "./UjjainContext"

export default function ReviewModal({ isOpen, onClose, type = "general", itemId = null, itemName = "" }) {
  const { addReview } = useUjjain()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    review: "",
    images: [],
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newReview = {
      ...formData,
      type,
      itemId,
      itemName,
      date: new Date().toISOString(),
    }
    addReview(newReview)

    // Reset form
    setFormData({
      name: "",
      email: "",
      rating: 5,
      title: "",
      review: "",
      images: [],
    })

    onClose()
    alert("Thank you for your review! It will be published after verification.")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {itemName && (
              <div className="mb-4 p-3 bg-orange-50 rounded-2xl">
                <p className="text-sm text-orange-600">
                  Reviewing: <span className="font-semibold">{itemName}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your name"
                  />
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-2xl transition-colors duration-200"
                    >
                      <FaStar className={star <= formData.rating ? "text-yellow-500" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Share your experience in detail..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors duration-300"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
