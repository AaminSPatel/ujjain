 "use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams  } from "next/navigation";
//import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaCar,
  FaRoute,
  FaShieldAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaCommentDots,
  FaArrowLeft,
  FaLocationArrow,
  FaDirections,
  FaExclamationTriangle,
  FaExclamationCircle
} from "react-icons/fa";
import { useUjjain } from "@/components/context/UjjainContext";
import SEOHead from "@/components/SEOHead";
import dynamic from "next/dynamic";
import Link from "next/link";
import safeStorage from "@/components/utils/safeStorage";

// Dynamic imports for components
const ActiveBookingMap = dynamic(() => import("@/components/ActiveBookingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  ),
});

const BookingStatusCard = dynamic(() => import("@/components/BookingStatusCard"), {
  ssr: false,
});

const DriverCard = dynamic(() => import("@/components/DriverCard"), {
  ssr: false,
});

const PassengerCard = dynamic(() => import("@/components/PassengerCard"), {
  ssr: false,
});

const OTPModal = dynamic(() => import("@/components/OTPModal"), {
  ssr: false,
});

const OTPDisplayModal = dynamic(() => import("@/components/OTPDisplayModal"), {
  ssr: false,
});

const PaymentModal = dynamic(() => import("@/components/PaymentModal"), {
  ssr: false,
});

const ReviewModal = dynamic(() => import("@/components/ReviewModal"), {
  ssr: false,
});

function ActiveBookingContent() {
   const params = useParams();
  const id = params?.id;


  const router = useRouter();

   // Add validation for the ID
  useEffect(() => {
    if (!id) {
      console.error('No booking ID found in URL parameters');
      setError('Invalid booking ID');
      setLoading(false);
      return;
    }
    
    // Validate if it's a valid MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error('Invalid booking ID format:', id);
      setError('Invalid booking ID format');
      setLoading(false);
      return;
    }
  }, [id]);


  const { user, updateBookingStatus, driverUpdateStatus, addReview , brand,getBookingById} = useUjjain();
  const searchParams = useSearchParams(); // Use this instead
  
  // Get role from search params
  const roleParam = searchParams?.get('role');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'driver' or 'passenger'
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [lastShownOtpTimestamp, setLastShownOtpTimestamp] = useState(null);

  // Modal states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showOTPDisplayModal, setShowOTPDisplayModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Status update handlers
  const handleStatusUpdate = async (newStatus, otp = null) => {
    if (!booking) return;

    setUpdatingStatus(true);
    try {
      let result;
      if (userRole === 'driver') {
        // Use driver-specific update for drivers
        result = await driverUpdateStatus(booking._id, newStatus);
      } else {
        // Use general update for passengers and admins
        result = await updateBookingStatus(booking._id, newStatus, otp);
      }

      if (result) {
        setBooking(result);
        // Close modals if needed
        if (newStatus === 'arrived') {
          setShowOTPModal(false);
        }
        if (newStatus === 'completed') {
          // Show payment modal for passengers
          if (userRole === 'passenger') {
            setShowPaymentModal(true);
          }
        }
      }
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOTPVerification = async (otp) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}/verify-pickup-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ safeStorage.get('token')}`,
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const result = await response.json();
      setBooking(result.booking);
      setShowOTPModal(false);
     // alert('Pickup verified successfully!');
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  const handlePaymentComplete = (paymentMethod) => {
    setShowPaymentModal(false);
    // Show review modal after payment
    setTimeout(() => {
      setShowReviewModal(true);
    }, 1000);
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!booking?.assignedDriver) return;

    try {
      await addReview({
        ...reviewData,
        booking: booking._id,
        driver: booking.assignedDriver._id,
        user: user._id,
      });
      setShowReviewModal(false);
     // alert('Thank you for your review!');
      // Redirect to home or bookings page
      router.push('/profile');
    } catch (error) {
      console.error('Review submission failed:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Fetch booking details
useEffect(() => {
  const fetchBooking = async () => {
    if (!id || !user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching booking with ID:', id); // Debug log
      setUserRole(user.role)
      const response = await getBookingById(id);
      console.log('Booking API response:', response); // Debug log

      if (!response) {
        throw new Error('No booking data received');
      }

      const bookingData = response;
      setBooking(bookingData);

      // Rest of your role determination logic...
      
    } catch (error) {
      console.error('Error fetching booking:', error);
      // More specific error handling
      if (error.response?.status === 404) {
        setError('Booking not found');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view this booking');
      } else if (error.response?.status === 401) {
        setError('Please log in to view this booking');
      } else {
        setError(error.message || 'Failed to load booking details');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchBooking();
}, [id, user]);
  // Polling for real-time updates
  useEffect(() => {
    if (!booking || !userRole || !id) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await getBookingById(id);

        if (response) {
          const updatedBooking = response;
          setBooking(updatedBooking);

          // Show OTP modal for passengers when pickupOtp is newly available (not already shown)
          if ((userRole === 'user' || userRole === 'admin')  && updatedBooking.pickupOtp && !showOTPDisplayModal) {
            const otpGeneratedAt = new Date(updatedBooking.pickupOtp.generatedAt).getTime();
            const lastShown = lastShownOtpTimestamp || 0;

            // Only show if OTP was generated after the last time we showed it
            if (otpGeneratedAt > lastShown) {
              setShowOTPDisplayModal(true);
              setLastShownOtpTimestamp(otpGeneratedAt);
            }
          }
        }
      } catch (error) {
        console.error('Error polling booking updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [booking, userRole, id, showOTPDisplayModal, lastShownOtpTimestamp]);

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-500', text: 'Pending', icon: FaClock },
      confirmed: { color: 'bg-blue-500', text: 'Confirmed', icon: FaCheckCircle },
      accepted: { color: 'bg-green-500', text: 'Accepted', icon: FaCheckCircle },
      arrived: { color: 'bg-purple-500', text: 'Arrived', icon: FaMapMarkerAlt },
      in_progress: { color: 'bg-orange-500', text: 'In Progress', icon: FaRoute },
      completed: { color: 'bg-green-600', text: 'Completed', icon: FaCheckCircle },
      cancelled: { color: 'bg-red-500', text: 'Cancelled', icon: FaExclamationTriangle },
      failed: { color: 'bg-red-500', text: 'Failed', icon: FaExclamationTriangle },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Booking</h2>
          <p className="text-gray-600 mb-6">{error || 'Booking not found'}</p>
          <Link
            href="/profile"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <SEOHead
        title={`Booking ${booking._id} - Active Booking`}
        description="Track your active booking with live updates and driver location"
      />

      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <StatusIcon className="text-lg" />
              <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${statusConfig.color}`}>
                {statusConfig.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Map (Full width on mobile, 2/3 on desktop) */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-3 pb-12">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-9 flex items-center">
                  <FaRoute className="mr-3 text-orange-500" />
                  Live Tracking
                </h2>
                <ActiveBookingMap
                  booking={booking}
                  userRole={userRole}
                  onLocationUpdate={(location) => {
                    // Handle live location updates
                   // console.log('Location update:', location);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Cards (Full width on mobile, 1/3 on desktop) */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Status Card */}
            <BookingStatusCard
              booking={booking}
              userRole={userRole}
              onStatusUpdate={handleStatusUpdate}
              updatingStatus={updatingStatus}
              onShowOTPModal={() => setShowOTPModal(true)}
              onShowPaymentModal={() => setShowPaymentModal(true)}
              onShowReviewModal={() => setShowReviewModal(true)}
              compact={true}
            />

            {/* Role-based Content */}
            {userRole !== 'driver' ? (
              <>
                {/* Driver View */}
                <DriverCard
                  driver={booking.assignedDriver}
                  booking={booking}
                  onCallDriver={(mobile) => window.open(`tel:${mobile}`, '_self')}
                  onStatusUpdate={handleStatusUpdate}
                  updatingStatus={updatingStatus}
                  compact={true}
                />

              
              </>
            ) : (
              // Passenger View
              <PassengerCard
                passenger={booking.user}
                booking={booking}
                onCallPassenger={(mobile) => window.open(`tel:${mobile}`, '_self')}
                onStatusUpdate={handleStatusUpdate}
                updatingStatus={updatingStatus}
                onShowPaymentModal={() => setShowPaymentModal(true)}
                onShowReviewModal={() => setShowReviewModal(true)}
                compact={false}
              />
            )}
              {/* Emergency and Support Buttons for Passengers */}
                <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
                  <button
                    onClick={() => window.open('tel:112', '_self')}
                    className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <FaExclamationTriangle className="mr-2" />
                    Emergency SOS
                  </button>
                  <button
                    onClick={() => window.open(`tel:${brand.mobile}`, '_self')}
                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <FaPhone className="mr-2" />
                    Support
                  </button>
                </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOTPModal && (
        <OTPModal
          booking={booking}
          onVerify={handleOTPVerification}
          onClose={() => setShowOTPModal(false)}
        />
      )}

      {showOTPDisplayModal && (
        <OTPDisplayModal
          booking={booking}
          onClose={() => setShowOTPDisplayModal(false)}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          booking={booking}
          onComplete={handlePaymentComplete}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          booking={booking}
          onSubmit={handleReviewSubmit}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}



// Loading component for Suspense fallback
function ActiveBookingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading active booking...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function ActiveBooking() {
  return (
    <Suspense fallback={<ActiveBookingLoading />}>
      <ActiveBookingContent />
    </Suspense>
  );
}
