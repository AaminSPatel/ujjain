"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUjjain } from "@/components/context/UjjainContext";

export default function EmailVerificationModal({ userEmail, onVerificationSuccess, onClose }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [otpSent, setOtpSent] = useState(true);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();
  const { verifyEmailOTP, resendEmailOTP } = useUjjain();

  useEffect(() => {
    // Start countdown for resend
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  // Effect to handle redirection after successful verification
  useEffect(() => {
    if (success) {
      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 4000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [success, router]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await verifyEmailOTP(userEmail, otp);
      if (result.status === "success") {
        setSuccess(true);
        setSuccessMessage(result.message || "Email verified successfully!");
        
        // Call the success callback after a delay
        setTimeout(() => {
          onVerificationSuccess?.(result.user, result.token);
        }, 3000);
      } else {
        setError(result.message || "Verification failed");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setError(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (sendingOTP || resendDisabled) return;

    setSendingOTP(true);
    setError("");

    try {
      const result = await resendEmailOTP(userEmail);
      if (result.success) {
        setOtpSent(true);
        setResendDisabled(true);
        setCountdown(60);
      } else {
        setError(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setSendingOTP(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleVerify();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        >
          {/* Header - Only show when not in success state */}
          {!success && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Verify Your Email</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="text-lg" />
              </button>
            </div>
          )}

          {/* Success Content */}
          {success ? (
            <div className="text-center">
              {/* Logo */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-20 h-20">
                  <Image
                    src="/logo.png"
                    alt="Safar Sathi Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Success Message in Green */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FaCheckCircle className="text-green-500 text-xl" />
                  <span className="text-green-700 font-semibold">OTP Verified Successfully</span>
                </div>
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>

              {/* Welcome Message */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Your email is verified!
                </h3>
                <p className="text-gray-600 text-sm">
                  Welcome to Safar Sathi. Explore our cars, hotels, and many more services for you.
                </p>
              </div>

              {/* Redirect Message */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Redirecting to home page in <span className="font-semibold">4 seconds</span>...
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-4000"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Info */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${success ? 'bg-green-100' : 'bg-orange-100'}`}>
                  <FaEnvelope className="text-orange-500 text-xl" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-sm font-semibold text-gray-800">{userEmail}</p>
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
                onKeyPress={handleKeyPress}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center text-2xl font-mono tracking-widest px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none mb-4"
                autoFocus
              />

              {/* Error */}
              {error && (
                <div className="mb-4 text-sm text-red-600 flex items-center justify-center gap-2">
                  <FaExclamationTriangle className="text-red-500" /> {error}
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleVerify}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </button>

                <button
                  onClick={handleResendOTP}
                  disabled={sendingOTP || resendDisabled}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  {sendingOTP ? "Sending..." : resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mt-4 text-center leading-relaxed">
                OTP valid for 10 minutes. Check your spam folder if you don't see the email.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}