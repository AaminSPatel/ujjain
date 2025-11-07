"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar, FaCheckCircle, FaExclamationTriangle, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ReviewModal({ booking, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBenefits, setShowBenefits] = useState(false);

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] sm:max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Sticky */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Rate Your Experience</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-6">
              {/* Driver Info */}
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  {booking?.assignedDriver?.profilePic?.url ? (
                    <img
                      src={booking.assignedDriver.profilePic.url}
                      alt={booking.assignedDriver.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-base sm:text-lg">
                      {booking?.assignedDriver?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{booking?.assignedDriver?.fullName}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Driver</p>
              </div>

              {/* Rating Stars */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  How was your experience?
                </label>
                <div className="flex justify-center space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none p-1"
                    >
                      <FaStar
                        className={`text-xl sm:text-2xl transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your feedback
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with this driver..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm sm:text-base"
                  rows={3}
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {comment.length}/500
                </div>
              </div>

              {/* Quick Feedback Options */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Quick feedback:</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {[
                    "Professional",
                    "Clean car",
                    "On time",
                    "Safe driving",
                    "Good communication",
                    "Good value"
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (!comment.includes(option)) {
                          setComment(prev => prev ? `${prev}, ${option}` : option);
                        }
                      }}
                      className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-orange-100 hover:text-orange-700 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Collapsible Benefits Section */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowBenefits(!showBenefits)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-sm font-medium text-gray-700">Why leave a review?</span>
                  {showBenefits ? (
                    <FaChevronUp className="text-gray-400 text-xs" />
                  ) : (
                    <FaChevronDown className="text-gray-400 text-xs" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showBenefits && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Help other passengers choose</li>
                          <li>• Improve service quality</li>
                          <li>• Drivers appreciate feedback</li>
                          <li>• Maintain high standards</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-white sticky bottom-0 space-y-2">
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || !comment.trim()}
              className="w-full bg-orange-500 text-white py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2 text-sm sm:text-base" />
                  Submit Review
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 rounded-xl sm:rounded-2xl font-medium hover:text-gray-700 transition-colors text-sm sm:text-base"
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}