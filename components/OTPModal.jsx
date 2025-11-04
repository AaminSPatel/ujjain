"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import safeStorage from "./utils/safeStorage.js";

export default function OTPModal({ booking, onVerify, onClose }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  useEffect(() => {
    if (booking && !otpSent && !sendingOTP) {
      sendOTP();
    }
  }, [booking]);

  const sendOTP = async () => {
    if (sendingOTP) return; // Prevent multiple calls
    setSendingOTP(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}/generate-pickup-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${safeStorage.get("token") || ""}`,
          },
        }
      );
      if (response.ok) {
        setOtpSent(true);
        setError("");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Connection error. Please try again.");
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return setError("Enter a valid 6-digit OTP");
    setLoading(true);
    setError("");
    try {
      await onVerify(otp);
     // return 
    } catch {
      setError("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    sendOTP();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 scroll-my-0 py-1 fle items-center justify-center px-3"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-4 sm:p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pickup OTP</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Info */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <p className="text-sm text-gray-600">
              OTP sent to passenger’s mobile. Verify to confirm pickup.
            </p>
          </div>

          {/* Passenger */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {booking?.user?.fullName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm leading-tight">
                {booking?.user?.fullName}
              </p>
              <p className="text-xs text-gray-600">{booking?.user?.mobile}</p>
            </div>
          </div>

          {/* OTP Input */}
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 6) setOtp(value);
              setError("");
            }}
            placeholder="000000"
            maxLength={6}
            className="w-full text-center text-2xl font-mono tracking-widest px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none mb-3"
          />

          {/* Error / Success */}
          {error && (
            <div className="mb-3 text-sm text-red-600 flex items-center justify-center gap-1">
              <FaExclamationTriangle className="text-red-500" /> {error}
            </div>
          )}
          {otpSent && !error && (
            <div className="mb-3 text-sm text-green-600 flex items-center justify-center gap-1">
              <FaCheckCircle className="text-green-500" /> OTP sent successfully
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                "Verify Pickup"
              )}
            </button>

            <button
              onClick={handleResendOTP}
              disabled={!otpSent || sendingOTP}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              {sendingOTP ? "Sending..." : "Resend OTP"}
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          {/* Note */}
          <p className="text-[11px] text-blue-700 bg-blue-50 rounded-xl p-2 mt-4 text-center leading-snug">
            OTP valid for 10 minutes. Verify before confirming pickup.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
