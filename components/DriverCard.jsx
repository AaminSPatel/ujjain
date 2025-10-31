"use client";

import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaStar,
  FaShieldAlt,
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaCarAlt
} from "react-icons/fa";

const DriverCard = ({
  driver,
  booking,
  onCallDriver,
  onStatusUpdate,
  updatingStatus = false,
  compact = false
}) => {
  if (!driver) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-6 text-center"
      >
        <FaUser className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Driver information not available</p>
      </motion.div>
    );
  }

  const getDriverStatus = () => {
    if (!booking) return { text: 'Unknown', color: 'text-gray-500' };

    switch (booking.status) {
      case 'confirmed':
        return { text: 'Assigned', color: 'text-blue-500' };
      case 'accepted':
        return { text: 'On the way', color: 'text-orange-500' };
      case 'arrived':
        return { text: 'Arrived', color: 'text-purple-500' };
      case 'in_progress':
        return { text: 'Driving', color: 'text-sky-500' };
      case 'completed':
        return { text: 'Trip completed', color: 'text-gray-500' };
      default:
        return { text: 'Pending', color: 'text-yellow-500' };
    }
  };

  const driverStatus = getDriverStatus();
//console.log('driver',driver);

  if (compact) {
    // Compact version for small displays
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-3"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              {driver.profilePic?.url ? (
                <img
                  src={driver.profilePic.url}
                  alt={driver.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser className="text-white text-lg" />
              )}
            </div>
            {driver.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaShieldAlt className="text-white text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-800">{driver.fullName}</p>
              <span className={`text-xs font-medium ${driverStatus.color}`}>
                {driverStatus.text}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaPhone className="text-green-500" />
              <span>+91 {driver.mobile}</span>
              
            </div> <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaStar className="text-yellow-500" />
              <span>{driver.driverRating?.toFixed(1) || '4.5'}</span>
              <span>({driver.totalTrips || 0} trips) </span>
            </div>
          </div>
          <button
            onClick={() => onCallDriver(driver.mobile)}
            className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <FaPhone className="text-sm" />
          </button>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FaCar className="mr-2 text-orange-500" />
              Vehicle Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold text-gray-800">
                  {driver.vehicleInfo?.make} {driver?.vehicleInfo?.model}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Plate</p>
                <p className="font-semibold text-gray-800">{driver.vehicleInfo.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className={`font-semibold text-${driver.vehicleInfo.color || 'gray'}-500 text-gray-800 capitalize`}>{driver.vehicleInfo.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold text-gray-800">{driver.vehicleInfo.year}</p>
              </div>
            </div>
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
      <h1 className="flex items-center gap-2 text-2xl font-bold px-6 py-4 text-white bg-gradient-to-r from-orange-500 to-orange-700 ">
        Driver Details <FaCarAlt />
      </h1>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-6 py-2 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {driver.profilePic?.url ? (
                  <img
                    src={driver.profilePic.url}
                    alt={driver.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-white text-2xl" />
                )}
              </div>
              {driver.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5">
                  <FaShieldAlt className="text-white text-sm" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{driver.fullName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <FaStar className="text-yellow-300" />
                <span className="font-semibold">{driver.driverRating?.toFixed(1) || '4.5'}</span>
                <span className="text-white/80">({driver.totalTrips || 0} trips)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${driverStatus.color}`}>
              {driverStatus.text}
            </div>
            <button
              onClick={() => onCallDriver(driver.mobile)}
              className="mt-2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-white/30 transition-colors"
            >
              <FaPhone className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Driver Details */}
      <div className="px-6 py-3">
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="flex items-center space-x-3">
            <FaPhone className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-800">{driver.mobile}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-800">
                {driver.isVerified ? 'Verified' : 'Unverified'}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        {(
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FaCar className="mr-2 text-orange-500" />
              Vehicle Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold text-gray-800">
                  {driver.vehicleInfo?.make} {driver?.vehicleInfo?.model}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Plate</p>
                <p className="font-semibold text-gray-800">{driver.vehicleInfo.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-semibold text-gray-800">{driver.vehicleInfo.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold text-gray-800">{driver.vehicleInfo.year}</p>
              </div>
            </div>
          </div>
        )}

        {/* Driver License */}
      {/*   {driver?.driverLicense && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <FaShieldAlt className="mr-2 text-blue-500" />
              Driver License
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600">License Number</p>
                <p className="font-semibold text-blue-800">{driver?.driverLicense?.number}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Expiry Date</p>
                <p className="font-semibold text-blue-800">
                  {driver.driverLicense?.expiryDate ?
                    new Date(driver.driverLicense.expiryDate).toLocaleDateString() :
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
 */}
        {/* Current Location (if available) */}
       {/*  {booking?.driverLocation?.coordinates && (
          <div className="bg-green-50 rounded-2xl p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-500" />
              Current Location
            </h4>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-500" />
              <span className="text-green-700">
                Live tracking active - Driver location updating
              </span>
            </div>
          </div>
        )}
 */}
        {/* Action Buttons for Driver Status Updates */}
     {/*    {booking && onStatusUpdate && (
          <div className="mt-6 space-y-3">
            {booking.status === 'confirmed' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusUpdate('accepted')}
                disabled={updatingStatus}
                className="w-full bg-green-500 text-white py-3 rounded-2xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {updatingStatus ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCheckCircle className="mr-2" />
                )}
                Accept Booking
              </motion.button>
            )}

            {booking.status === 'accepted' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusUpdate('arrived')}
                disabled={updatingStatus}
                className="w-full bg-purple-500 text-white py-3 rounded-2xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {updatingStatus ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaMapMarkerAlt className="mr-2" />
                )}
                Mark as Arrived
              </motion.button>
            )}

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
                  <FaRoute className="mr-2" />
                )}
                Start Ride
              </motion.button>
            )}

            {booking.status === 'in_progress' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusUpdate('completed')}
                disabled={updatingStatus}
                className="w-full bg-blue-500 text-white py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {updatingStatus ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCheckCircle className="mr-2" />
                )}
                Complete Ride
              </motion.button>
            )}
          </div>
        )} */}
      </div>
    </motion.div>
  );
};

export default DriverCard;
