"use client";

import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaRoute,
  FaCreditCard,
  FaMoneyBillWave
} from "react-icons/fa";

const PassengerCard = ({
  passenger,
  booking,
  onCallPassenger,
  onStatusUpdate,
  updatingStatus = false,
  onShowPaymentModal,
  onShowReviewModal,
  compact = false
}) => {
  if (!passenger) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-6 text-center"
      >
        <FaUser className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Passenger information not available</p>
      </motion.div>
    );
  }

  const getPassengerStatus = () => {
    if (!booking) return { text: 'Unknown', color: 'text-gray-500' };

    switch (booking.status) {
      case 'confirmed':
        return { text: 'Booking confirmed', color: 'text-blue-500' };
      case 'accepted':
        return { text: 'Driver assigned', color: 'text-green-500' };
      case 'arrived':
        return { text: 'Driver arrived', color: 'text-purple-500' };
      case 'in_progress':
        return { text: 'Ride in progress', color: 'text-orange-500' };
      case 'completed':
        return { text: 'Trip completed', color: 'text-gray-500' };
      default:
        return { text: 'Pending', color: 'text-yellow-500' };
    }
  };

  const passengerStatus = getPassengerStatus();

  if (compact) {
    // Compact version for small displays
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-4"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              {passenger.profilePic?.url ? (
                <img
                  src={passenger.profilePic.url}
                  alt={passenger.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser className="text-white text-lg" />
              )}
            </div>
            {passenger.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaShieldAlt className="text-white text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-800">{passenger.fullName}</p>
              <span className={`text-xs font-medium ${passengerStatus.color}`}>
                {passengerStatus.text}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaPhone className="text-gray-400" />
              <span>{passenger.mobile}</span>
            </div>
          </div>
          <button
            onClick={() => onCallPassenger(passenger.mobile)}
            className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <FaPhone className="text-sm" /> 
          </button>
        </div>
      </motion.div>
    );
  }

  // Full version
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 md:p-6 p-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {passenger.profilePic?.url ? (
                  <img
                    src={passenger.profilePic.url}
                    alt={passenger.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-white text-2xl" />
                )}
              </div>
              {passenger.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5">
                  <FaShieldAlt className="text-white text-sm" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{passenger.fullName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <FaPhone className="text-white/80" />
                <span className="font-semibold">{passenger.mobile}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${passengerStatus.color}`}>
              {passengerStatus.text}
            </div>
            <button
              onClick={() => onCallPassenger(passenger.mobile)}
              className="mt-2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-white/30 transition-colors"
            >
              <FaPhone className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="md:p-6 p-4">
        {/* Contact & Verification Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <FaPhone className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-800">{passenger.mobile}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-800">
                {passenger.isVerified ? 'Verified' : 'Unverified'}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information */}
       {/*  {passenger.address && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-orange-500" />
              Address Information
            </h4>
            <div className="space-y-2 text-sm">
              {passenger.address.street && (
                <p className="text-gray-700">{passenger.address.street}</p>
              )}
              <div className="flex space-x-4">
                {passenger.address.city && (
                  <span className="text-gray-600">{passenger.address.city}</span>
                )}
                {passenger.address.state && (
                  <span className="text-gray-600">{passenger.address.state}</span>
                )}
                {passenger.address.postalCode && (
                  <span className="text-gray-600">{passenger.address.postalCode}</span>
                )}
              </div>
              {passenger.address.country && (
                <p className="text-gray-600">{passenger.address.country}</p>
              )}
            </div>
          </div>
        )}
 */}
        {/* Booking Details */}
       {/*  {booking && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <FaRoute className="mr-2 text-blue-500" />
              Trip Details
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Pickup Location</span>
                <span className="font-semibold text-blue-800 text-right">
                  {booking.pickupLocation?.address || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Drop-off Location</span>
                <span className="font-semibold text-blue-800 text-right">
                  {booking.dropoffLocation?.address || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Passengers</span>
                <span className="font-semibold text-blue-800">
                  {booking.passengers?.adults || 0} Adult{booking.passengers?.adults !== 1 ? 's' : ''}
                  {booking.passengers?.children > 0 && `, ${booking.passengers.children} Child${booking.passengers.children !== 1 ? 'ren' : ''}`}
                  {booking.passengers?.infants > 0 && `, ${booking.passengers.infants} Infant${booking.passengers.infants !== 1 ? 's' : ''}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="text-blue-700 font-semibold">Total Fare</span>
                <span className="font-bold text-orange-500 text-lg">
                  ₹{booking.pricing?.totalPrice || booking.payment?.amount || 0}
                </span>
              </div>
            </div>
          </div>
        )} */}

        {/* Special Requests */}
        {booking?.specialRequests && (
          <div className="bg-yellow-50 rounded-2xl md:p-4 p-2 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
              <FaClock className="mr-2 text-yellow-500" />
              Special Requests
            </h4>
            <p className="text-yellow-700">{booking.specialRequests}</p>
          </div>
        )}

        {/* Action Buttons for Passenger Status Updates */}
     {/*    {booking && onStatusUpdate && (
          <div className="mt-6 space-y-3">
            {booking.status === 'arrived' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusUpdate('in_progress')}
                disabled={updatingStatus}
                className="w-full bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {updatingStatus ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCheckCircle className="mr-2" />
                )}
                Confirm Pickup
              </motion.button>
            )}

            {booking.status === 'completed' && (!booking.payment?.status || booking.payment.status === 'pending') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShowPaymentModal}
                className="w-full bg-green-500 text-white py-3 rounded-2xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <FaCreditCard className="mr-2" />
                Pay Now
              </motion.button>
            )}

            {booking.status === 'completed' && booking.payment?.status === 'completed' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShowReviewModal}
                className="w-full bg-blue-500 text-white py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <FaStar className="mr-2" />
                Rate & Review Driver
              </motion.button>
            )}
          </div>
        )}
 */}
        {/* Payment Status */}
        {booking?.payment && (
          <div className="mt-4 md:p-4 p-2 rounded-2xl border-2"
               style={{
                 backgroundColor: booking.payment.status === 'completed' ? '#f0fdf4' : '#fef3c7',
                 borderColor: booking.payment.status === 'completed' ? '#bbf7d0' : '#fde68a'
               }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {booking.payment.status === 'completed' ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaClock className="text-yellow-500" />
                )}
                <span className={`font-semibold ${
                  booking.payment.status === 'completed' ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  Payment {booking.payment.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Method</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {booking.payment.method || 'Cash'}
                </p>
              </div>
            </div>
            {booking.payment.transactionId && (
              <div className="mt-2 text-xs text-gray-600">
                Transaction ID: {booking.payment.transactionId}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PassengerCard;
