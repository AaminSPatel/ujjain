"use client";

import { motion } from "framer-motion";
import {
  FaClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaRoute,
  FaExclamationTriangle,
  FaCar,
  FaUser,
  FaRupeeSign,
  FaPiggyBank,
  FaMoneyBill,
  FaMoneyBillAlt,
} from "react-icons/fa";

export default function BookingStatusCard({ booking, userRole, onShowOTPModal, onStatusUpdate, onShowPaymentModal, onShowReviewModal }) {
  if (!booking) return null;

  // ✅ Function to render payment status badge
  const renderPaymentStatus = () => {
    const status = booking.payment?.status;

    if (status === "completed")
      return (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs sm:text-sm font-semibold shadow-sm">
          <FaCheckCircle className="text-green-500 text-sm sm:text-base" />
          Completed
        </span>
      );
    if (status === "pending")
      return (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm font-semibold shadow-sm animate-pulse">
          <FaClock className="text-yellow-500 text-sm sm:text-base" />
          Pending
        </span>
      );
    return (
      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs sm:text-sm font-semibold shadow-sm">
        <FaExclamationTriangle className="text-red-500 text-sm sm:text-base" />
        Failed
      </span>
    );
  };

  // ✅ Function to render booking status
  const renderBookingStatus = () => {
    const status = booking.status;

    const statusClasses = {
      completed:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      in_progress:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      cancelled:
        "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    };

    const label =
      status === "in_progress"
        ? "In Progress"
        : status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
          statusClasses[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status === "completed" && <FaCheckCircle className="text-green-500" />}
        {status === "in_progress" && <FaClock className="text-blue-500" />}
        {status === "cancelled" && (
          <FaExclamationTriangle className="text-red-500" />
        )}
        {status === "pending" && <FaClock className="text-yellow-500" />}
        {label}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <FaCar className="text-blue-600 text-lg sm:text-xl" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
            Booking ID:{" "}
            <span className="text-gray-600 dark:text-gray-400">
              {booking._id?.slice(-6) || "N/A"}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <FaUser className="text-gray-600 dark:text-gray-400" />
          <span className="font-medium truncat max-w-[210px] sm:max-w-none">
            Adults: {(booking?.passengers?.adults) }, Childrens: {booking?.passengers?.children }, Infants: {booking?.passengers?.infants}
          </span>
        </div>
      </div>

      {/* Locations */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <FaMapMarkerAlt className="text-red-500 mt-0.5 flex-shrink-0" />
          <span className="  line-clamp-2">{booking?.pickupLocation?.address}</span>
        </div>
        <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <FaRoute className="text-green-500 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{booking?.dropoffLocation?.address}</span>
        </div>
      </div>
  <div className="space-y-2 mb-4 flex flex-row justify-around items-center gap-4">
        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <FaRupeeSign className="text-sky-200 mt-0.5 flex-shrink-0  text-lg font-semibold" />
          <span className="  line-clamp-2 text-lg font-semibold">{booking?.payment?.amount}</span>
        </div>
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
          <FaMoneyBillAlt className="text-green-500 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{booking?.payment?.method}</span>
        </div>
      </div>

      {/* Payment & Booking Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            Payment Status
          </p>
          {renderPaymentStatus()}
        </div>

        <div className="flex flex-col gap-1 text-center items-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            Booking Status
          </p>
          {renderBookingStatus()}
        </div>
      </div>

      {/* Driver Actions (Driver only) */}
      {userRole === "driver" && booking.status === "accepted" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 space-y-2"
        >
          <button
            onClick={() => onStatusUpdate('in_progress')}
            className="w-full sm:w-auto text-center bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-xl shadow-md"
          >
            Start Ride
          </button>
        </motion.div>
      )}
      {userRole === "driver" && booking.status === "in_progress" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 space-y-2"
        >
          <button
            onClick={onShowOTPModal}
            className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-xl shadow-md"
          >
            Verify Pickup via OTP
          </button>


        </motion.div>

      )}
      {userRole === "driver" && booking.status === "picked" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 space-y-2"
        >
          <button
            onClick={async () => {
              if (onStatusUpdate) {
                try {
                  const updatedBooking = await onStatusUpdate('completed');
                  // After status update, check payment status and show appropriate modal
                  if (updatedBooking?.payment?.status === 'pending' && onShowPaymentModal) {
                    setTimeout(() => onShowPaymentModal(), 500);
                  } else if (updatedBooking?.payment?.status === 'completed' && onShowReviewModal) {
                    setTimeout(() => onShowReviewModal(), 500);
                  }
                } catch (error) {
                  console.error('Error completing booking:', error);
                }
              }
            }}
            className="w-full sm:w-auto text-center bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-xl shadow-md"
          >
            Complete Booking
          </button>


        </motion.div>

      )}

      {/* Passenger Actions (Passenger only) */}
      {userRole === "passenger" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 space-y-2"
        >
          {booking.payment?.status === "pending" && onShowPaymentModal && (
            <button
              onClick={onShowPaymentModal}
              className="w-full sm:w-auto text-center bg-orange-600 hover:bg-orange-700 active:scale-[0.98] transition-all text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-xl shadow-md"
            >
              Complete Payment
            </button>
          )}

          {booking.payment?.status === "completed" && booking.status === "completed" && onShowReviewModal && (
            <button
              onClick={onShowReviewModal}
              className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-xl shadow-md"
            >
              Write a Review
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
