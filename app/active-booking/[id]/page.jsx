"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  FaExclamationCircle,
  FaBed,
  FaHotel,
  FaMapPin,
  FaCalendarAlt,
  FaKey,
  FaDoorClosed,
  FaWifi,
  FaParking,
  FaUtensils,
  FaSwimmingPool,
  FaTv,
  FaWind,
  FaUsers,
  FaBuilding,
  FaTimesCircle,
  FaMoneyBill,
  FaUmbrellaBeach,
  FaCommentAlt
} from "react-icons/fa";
import { useUjjain } from "@/components/context/UjjainContext";
import SEOHead from "@/components/SEOHead";
import dynamic from "next/dynamic";
import Link from "next/link";
import safeStorage from "@/components/utils/safeStorage";
import Image from "next/image";

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

// New HotelDetailsCard component
function HotelDetailsCard({ hotel, booking, onPaymentClick, onCancelBooking, onShowReviewModal }) {
  if (!hotel) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'wifi': FaWifi,
      'parking': FaParking,
      'pool': FaSwimmingPool,
      'restaurant': FaUtensils,
      'tv': FaTv,
      'ac': FaWind,
      'breakfast': FaUtensils,
    };
    
    const amenityLower = amenity.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (amenityLower.includes(key)) {
        return icon;
      }
    }
    return FaCheckCircle;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Hotel Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaHotel className="text-3xl mr-3" />
            <div>
              <h2 className="text-2xl font-bold">{hotel.name}</h2>
              <div className="flex items-center mt-1">
                <FaStar className="text-yellow-300 mr-1" />
                <span className="font-semibold">{hotel.rating || '4.5'}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{hotel.category || 'Luxury'} Hotel</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">₹{hotel.price || booking?.pricing?.totalPrice || 'N/A'}</div>
            <div className="text-sm opacity-90">per night</div>
          </div>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="p-6">
        {/* Contact & Address Section */}
        <div className="mb-6 md:flex">
          <div className="flex items-center justify-center">
           <Image src={hotel.images[0].url || '/logo.png'} alt="Hotel image" height={200} width={120}></Image> 
          </div>
          
          <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaMapPin className="mr-2 text-blue-500" />
            Contact & Location
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Hotel Address</p>
                <p className="text-gray-600">{hotel.location || 'Address not specified'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-green-500 mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Hotel Contact</p>
                <p className="text-gray-600">+91 {hotel?.owner?.mobile || 'No contact available'}</p>
              </div>
            </div>
           {/*  <div className="flex items-center">
              <FaBuilding className="text-purple-500 mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Check-in/out</p>
                <p className="text-gray-600">Check-in: 2:00 PM • Check-out: 12:00 PM</p>
              </div>
            </div> */}
          </div>
          </div>
          
       
        </div>

        {/* Booking Details */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Booking Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-semibold text-gray-800">
                {booking?.startDate ? formatDate(booking.startDate) : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-semibold text-gray-800">
                {booking?.endDate ? formatDate(booking.endDate) : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rooms</p>
              <p className="font-semibold text-gray-800 flex items-center">
                <FaDoorClosed className="mr-1" />
                {booking?.rooms || 1} Room{booking?.rooms > 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p className="font-semibold text-gray-800 flex items-center">
                <FaUsers className="mr-1" />
                {booking?.passengers?.adults || 1} Adult(s)
              </p>
            </div>
          </div>
        </div>

        {/* Hotel Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <FaUmbrellaBeach className="mr-2 text-yellow-500" />
              Hotel Amenities
            </h3>
            <div className="flex flex-wrap gap-3">
              {hotel.amenities.slice(0, 6).map((amenity, index) => {
                const Icon = getAmenityIcon(amenity);
                return (
                  <div
                    key={index}
                    className="flex items-center px-3 py-2 bg-gray-100 rounded-lg"
                  >
                    <Icon className="text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </div>
                );
              })}
              {hotel.amenities.length > 6 && (
                <div className="px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    +{hotel.amenities.length - 6} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {booking?.status !== 'pending' && booking?.status !== 'cancelled' && (booking?.payment?.status !== 'completed') && (
            <button
              onClick={onPaymentClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center transition-colors"
            >
              <FaMoneyBill className="mr-2" />
              Complete Payment (₹{booking?.pricing?.totalPrice || hotel.price})
            </button>
          )}
          {booking?.status !== 'completed' && booking?.status !== 'cancelled' && (booking?.payment?.status === 'completed') && (
            <button
              onClick={onShowReviewModal}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center transition-colors"
            >
              <FaCommentAlt className="mr-2" />
              Review Hotel {/* (₹{booking?.pricing?.totalPrice || hotel.price}) */}
            </button>
          )}
          
          {booking?.status !== 'completed' && booking?.status !== 'cancelled' && (
            <button
              onClick={onCancelBooking}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center transition-colors"
            >
              <FaTimesCircle className="mr-2" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ActiveBookingContent() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get('role');

  const { user, updateBookingStatus, driverUpdateStatus, driverCancelAcceptedBooking, cancelBooking, addReview, brand, getBookingById } = useUjjain();

  const [booking, setBooking] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
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
        if (newStatus === 'driver_cancel_accepted') {
          result = await driverCancelAcceptedBooking(booking._id);
        } else {
          result = await driverUpdateStatus(booking._id, newStatus);
        }
      } else {
        result = await updateBookingStatus(booking._id, newStatus, otp);
      }

      if (result) {
        setBooking(result);
        if (newStatus === 'arrived') {
          setShowOTPModal(false);
        }
        if (newStatus === 'completed' && userRole === 'passenger') {
          setShowPaymentModal(true);
        }
      }
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !confirm('Are you sure you want to cancel this booking?')) return;

    setUpdatingStatus(true);
    try {
      const result = await cancelBooking(booking._id);
      if (result) {
        setBooking(result);
        //alert('Booking cancelled successfully.');
      }
    } catch (error) {
      console.error('Cancellation failed:', error);
     // alert('Failed to cancel booking. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const handleOTPVerification = async (otp) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}/verify-pickup-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${safeStorage.get('token')}`,
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const result = await response.json();
      setBooking(result.data);
      setShowOTPModal(false);
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  const handlePaymentComplete = (paymentMethod) => {
    setShowPaymentModal(false);
    setTimeout(() => {
      setShowReviewModal(true);
    }, 1000);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const reviewPayload = {
        ...reviewData,
        booking: booking._id,
        user: user._id,
      };

      if (booking.serviceType === "Hotel") {
        reviewPayload.reviewedItem = booking.service;
        reviewPayload.reviewedModel = "Hotel";
      } else if (booking.serviceType === "Car") {
        reviewPayload.reviewedItem = booking.service;
        reviewPayload.reviewedModel = "Car";
        reviewPayload.driver = booking?.assignedDriver?._id;
      }

      await addReview(reviewPayload);
      setShowReviewModal(false);
      router.push('/profile');
    } catch (error) {
      console.error('Review submission failed:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Fetch booking and hotel details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!id || !user) {
        setLoading(false);
        return;
      }

      try {
        setUserRole(user.role);
        const response = await getBookingById(id);

        if (!response) {
          throw new Error('No booking data received');
        }

        const bookingData = response;
        setBooking(bookingData);

        // If serviceType is hotel, fetch hotel details
        if (bookingData.serviceType === 'Hotel' && bookingData.service) {
          try {
            const hotelResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hotels/${bookingData.service}`, {
              headers: {
                'Authorization': `Bearer ${safeStorage.get('token')}`,
              },
            });

            if (hotelResponse.ok) {
              const hotelData = await hotelResponse.json();
              setHotel(hotelData);
            }
          } catch (hotelError) {
            console.error('Error fetching hotel details:', hotelError);
          }
        }

        // If serviceType is car, fetch car details
        if (bookingData.serviceType === 'Car' && bookingData.service) {
          try {
            const carResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${bookingData.service._id}`, {
              headers: {
                'Authorization': `Bearer ${safeStorage.get('token')}`,
              },
            });
            if (carResponse.ok) {          
              const carData = await carResponse.json();
             // console.log('car data fatched',carData);
              setCar(carData);
            }
          } catch (carError) {
            console.error('Error fetching car details:', carError);
          }
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError(error.message || 'Failed to load booking details');
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

          if ((userRole === 'user' || userRole === 'admin') && updatedBooking.pickupOtp && !showOTPDisplayModal) {
            const otpGeneratedAt = new Date(updatedBooking.pickupOtp.generatedAt).getTime();
            const lastShown = lastShownOtpTimestamp || 0;

            if (otpGeneratedAt > lastShown) {
              setShowOTPDisplayModal(true);
              setLastShownOtpTimestamp(otpGeneratedAt);
            }
          }
        }
      } catch (error) {
        console.error('Error polling booking updates:', error);
      }
    }, 5000);

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
  const isHotelBooking = booking.serviceType === 'Hotel';
  const isCarBooking = booking.serviceType === 'Car';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <SEOHead
        title={`${isHotelBooking ? 'Hotel' : 'Car'} Booking ${booking.uniqueId}`}
        description={isHotelBooking ? 'View your hotel booking details and information' : 'Track your active booking with live updates and driver location'}
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isHotelBooking ? (
                  <FaHotel className="text-xl text-purple-600" />
                ) : (
                  <FaCar className="text-xl text-blue-600" />
                )}
                <div className="text-gray-700 font-semibold">
                  {booking.serviceType} Booking
                  {isCarBooking && booking.carBookingType && (
                    <div className="text-sm text-gray-500 mt-1">
                      ({booking.carBookingType.replace('_', ' ')})
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon className="text-lg" />
                <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${statusConfig.color}`}>
                  {statusConfig.text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {isHotelBooking ? (
          // Hotel Booking Layout
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Hotel Details */}
            <div className="w-full lg:w-2/3">
              <HotelDetailsCard
                hotel={booking.service}
                booking={booking}
                onPaymentClick={handlePaymentClick}
                onCancelBooking={handleCancelBooking}
                onShowReviewModal={()=>setShowReviewModal(true)}
              />

              {/* Booking and Payment Details */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaCreditCard className="mr-2 text-green-600" />
                  Payment Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Room Price</span>
                    <span className="font-semibold">₹{hotel?.basePrice || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{booking?.pricing?.tax || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-₹{booking?.coupon?.discountAmount || 0}</span>
                  </div> 
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-semibold text-green-600">₹{booking?.pricing?.platformFee || 0}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{booking?.pricing?.totalPrice || hotel?.price || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                      booking?.payment?.status === 'completed' ? 'bg-green-500' :
                      booking?.payment?.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {booking?.payment?.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Status Card and Emergency */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Status Card for Hotel */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaBed className="mr-2 text-purple-600" />
                  Hotel Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-semibold">{booking.uniqueId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${statusConfig.color}`}>
                      {statusConfig.text}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booking Date</span>
                    <span className="font-semibold">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency and Support */}
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
                  Hotel Support
                </button>
                <button
                  onClick={() => window.open(`tel:${hotel?.owner?.mobile || brand.mobile}`, '_self')}
                  className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center"
                >
                  <FaHotel className="mr-2" />
                  Contact Hotel
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Car Booking Layout (Original Layout)
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Map and Payment Details */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
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
                    }}
                  />
                </div>
              </div>

              {/* Payment Details for Car Booking */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaCreditCard className="mr-2 text-green-600" />
                  Payment Details
                </h3>
                <div className="space-y-4">
                  {booking.carBookingType === 'per_km' && car?.pricePerKm && booking.distance ? (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price per Km (₹{car.pricePerKm} × {booking.distance} km)</span>
                      <span className="font-semibold">₹{car.pricePerKm * booking.distance}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Base Fare</span>
                      <span className="font-semibold">₹{ booking?.pricing?.basePrice|| 0}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{booking?.pricing?.tax || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-₹{booking?.coupon?.discountAmount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-semibold text-green-600">₹{booking?.pricing?.platformFee || 0}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{booking?.pricing?.totalPrice || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                      booking?.payment?.status === 'completed' ? 'bg-green-500' :
                      booking?.payment?.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {booking?.payment?.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Cards */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Status Card */}
              {userRole && <BookingStatusCard
                booking={booking}
                userRole={userRole}
                onStatusUpdate={handleStatusUpdate}
                updatingStatus={updatingStatus}
                onShowOTPModal={() => setShowOTPModal(true)}
                onShowPaymentModal={() => setShowPaymentModal(true)}
                onShowReviewModal={() => setShowReviewModal(true)}
                compact={true}
              />}

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
        )}
      </div>

      {/* Modals */}
      {!isHotelBooking && showOTPModal && (
        <OTPModal
          booking={booking}
          onVerify={handleOTPVerification}
          onClose={() => setShowOTPModal(false)}
        />
      )}

      {!isHotelBooking && showOTPDisplayModal && (
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