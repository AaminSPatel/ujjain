"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function ReviewModal({ booking, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit({
        rating,
        comment: comment.trim(),
      });
    } catch (error) {
      console.error('Review submission error:', error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Rate Your Experience</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Driver Info */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                {booking?.assignedDriver?.profilePic?.url ? (
                  <img
                    src={booking.assignedDriver.profilePic.url}
                    alt={booking.assignedDriver.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {booking?.assignedDriver?.fullName?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-800">{booking?.assignedDriver?.fullName}</h3>
              <p className="text-sm text-gray-600">Driver</p>
            </div>

            {/* Rating Stars */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                How was your experience?
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`text-2xl transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience with this driver..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {comment.length}/500
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Quick Feedback Options */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick feedback:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Professional driver",
                  "Clean vehicle",
                  "On time pickup",
                  "Safe driving",
                  "Good communication",
                  "Value for money"
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      if (!comment.includes(option)) {
                        setComment(prev => prev ? `${prev}, ${option}` : option);
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || !comment.trim()}
              className="w-full bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" />
                  Submit Review
                </>
              )}
            </button>

            {/* Skip Button */}
            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 rounded-2xl font-medium hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>

            {/* Benefits of Review */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
              <h4 className="font-semibold text-blue-800 mb-2">Why review?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Help other passengers make better choices</li>
                <li>• Improve service quality for everyone</li>
                <li>• Drivers appreciate honest feedback</li>
                <li>• Your review helps maintain high standards</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
