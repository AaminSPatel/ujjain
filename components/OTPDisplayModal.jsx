"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaKey, FaClock } from "react-icons/fa";

export default function OTPDisplayModal({ booking, onClose }) {
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute = 60 seconds

  useEffect(() => {
    if (!booking?.pickupOtp) return;

    // Calculate initial time left
    const expiresAt = new Date(booking.pickupOtp.expiresAt);
    const now = new Date();
    const initialTimeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
    setTimeLeft(initialTimeLeft);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose(); // Auto-close when timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [booking?.pickupOtp, onClose]);

  if (!booking?.pickupOtp) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-blue-50 opacity-50" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Header */}
          <div className="relative z-10 text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaKey className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pickup OTP</h2>
            <p className="text-gray-600 text-sm">Show this code to your driver</p>
          </div>

          {/* OTP Display */}
          <div className="relative z-10 bg-gray-50 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl font-mono font-bold text-gray-800 tracking-widest mb-4">
              {booking.pickupOtp.code}
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <FaClock className="text-orange-500" />
              <span className="font-semibold">Expires in: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="relative z-10 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Your driver will verify this OTP to confirm pickup.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              I Understand
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 60) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
