"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function PaymentModal({ booking, onComplete, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("cash_at_drop");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);


  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "cash_at_drop") {
        // For cash payment, just mark as paid
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}/payment`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            paymentMethod: paymentMethod,
            status: "completed",
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to process ${paymentMethod.replace('_', ' ')} payment`);
        }

        onComplete(paymentMethod);
      } else if (paymentMethod === "razorpay_at_drop") {
        // For online payment, integrate with Razorpay
        await handleOnlinePayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      
      // Create Razorpay order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bookingId: booking._id,
          amount: booking.pricing?.totalPrice || booking.payment?.amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await response.json();
console.log(orderData , 'response' , response);

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Safar Sathi',
        description: `Payment for Booking ${booking._id}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
               razorpay_order_id: response.razorpay_order_id || orderData.orderId || booking.payment?.razorpayOrderId || null,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || null,
                 bookingId: booking._id,
                method:'razorpay_at_drop'
              }),
            });

            if (verifyResponse.ok) {
              onComplete("online");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: booking.user?.fullName,
          email: booking.user?.email,
          contact: booking.user?.mobile,
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      throw error;
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-1 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{booking.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">
                    {booking.pickupLocation?.address?.split(',')[0]} → {booking.dropoffLocation?.address?.split(',')[0]}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-orange-500">₹{booking.pricing?.totalPrice || booking.payment?.amount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Choose Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-orange-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_at_drop"
                    checked={paymentMethod === "cash_at_drop"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex items-center">
                    <FaMoneyBillWave className="text-green-500 text-xl mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">Cash Payment</p>
                      <p className="text-sm text-gray-600">Pay directly to the driver</p>
                    </div>
                  </div>
                </label>
{/* 
                <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-orange-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_drop"
                    checked={paymentMethod === "cash_on_drop"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex items-center">
                    <FaMoneyBillWave className="text-orange-500 text-xl mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">Cash on Drop</p>
                      <p className="text-sm text-gray-600">Pay to the driver upon drop-off</p>
                    </div>
                  </div>
                </label> */}

                <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-orange-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay_at_drop"
                    checked={paymentMethod === "razorpay_at_drop"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex items-center">
                    <FaCreditCard className="text-blue-500 text-xl mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">Online Payment</p>
                      <p className="text-sm text-gray-600">Secure payment via Razorpay</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>



            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Payment Button or Confirmation */}
            {showConfirmation ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl"
              >
                <div className="text-center">
                  <FaCreditCard className="text-blue-500 text-3xl mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Online Payment</h3>
                  <p className="text-gray-600 mb-4">
                    You are about to pay ₹{booking.pricing?.totalPrice || booking.payment?.amount} via Razorpay.
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                        handlePayment();
                      }}
                      disabled={loading}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-2xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        "Proceed to Pay"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={paymentMethod === "razorpay_at_drop" ? () => setShowConfirmation(true) : handlePayment}
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  )  : paymentMethod === "cash_at_drop" ? (
                    <>
                      <FaMoneyBillWave className="mr-2" />
                      Confirm Cash on Drop
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="mr-2" />
                      Confirm Online Payment
                    </>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  onClick={onClose}
                  className="w-full text-gray-500 py-2 rounded-2xl font-medium hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}

            {/* Security Note */}
            <div className="mt-6 p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center mb-2">
                <FaCheckCircle className="text-green-500 mr-2" />
                <span className="font-semibold text-green-800">Secure Payment</span>
              </div>
              <p className="text-sm text-green-700">
                {paymentMethod === "cash"
                  ? "Pay directly to the driver after safe completion of the journey."
                  : paymentMethod === "cash_on_drop"
                  ? "Pay to the driver upon drop-off after safe completion of the journey."
                  : "Your payment is secured with bank-level encryption via Razorpay."
                }
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
