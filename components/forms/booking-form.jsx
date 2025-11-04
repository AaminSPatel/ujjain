"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useUjjain } from "@/components/context/UjjainContext"
import safeStorage from "../utils/safeStorage.js"

export function BookingForm({ open, onOpenChange, booking, onSubmit, cars, hotels, logistics }) {
  const { addBooking } = useUjjain()
  const [formData, setFormData] = useState({
    serviceType: "cab",
    service: "",
    startDate: new Date(),
    endDate: new Date(),
    pickupLocation: "",
    dropoffLocation: "",
    pickupTime: "",
    arrivalTime: "",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    rooms: 1,
    pricing: {
      basePrice: 0,
      discount: 0,
      tax: 0,
      totalPrice: 0
    },
    coupon: {
      code: "",
      discountAmount: 0,
      discountType: "fixed"
    },
    specialRequests: "",
    payment: {
      method: "cash",
      amount: 0,
      transactionId: "",
      paidAt: null
    },
    status: "pending",
    isPaid: false,
    isCancelled: false
  })

  useEffect(() => {
    if (booking) {
      console.log('Loading booking for edit:', booking)
      setFormData({
        serviceType: booking.serviceType || "cab",
        service: booking.service || "",
        startDate: booking.startDate ? new Date(booking.startDate) : new Date(),
        endDate: booking.endDate ? new Date(booking.endDate) : new Date(),
        pickupLocation: booking.pickupLocation?.address || "",
        dropoffLocation: booking.dropoffLocation?.address || "",
        pickupTime: booking.pickupTime || "",
        arrivalTime: booking.arrivalTime || "",
        passengers: {
          adults: booking.passengers?.adults || 1,
          children: booking.passengers?.children || 0,
          infants: booking.passengers?.infants || 0
        },
        rooms: booking.rooms || 1,
        pricing: {
          basePrice: booking.pricing?.basePrice || 0,
          discount: booking.pricing?.discount || 0,
          tax: booking.pricing?.tax || 0,
          totalPrice: booking.pricing?.totalPrice || 0
        },
        coupon: {
          code: booking.coupon?.code || "",
          discountAmount: booking.coupon?.discountAmount || 0,
          discountType: booking.coupon?.discountType || "fixed"
        },
        specialRequests: booking.specialRequests || "",
        payment: {
          method: booking.payment?.method || "cash",
          amount: booking.payment?.amount || 0,
          transactionId: booking.payment?.transactionId || "",
          paidAt: booking.payment?.paidAt ? new Date(booking.payment.paidAt) : null
        },
        status: booking.status || "pending",
        isPaid: booking.isPaid || false,
        isCancelled: booking.isCancelled || false
      })
    } else {
      console.log('Creating new booking form')
      setFormData({
        serviceType: "cab",
        service: "",
        startDate: new Date(),
        endDate: new Date(),
        pickupLocation: "",
        dropoffLocation: "",
        pickupTime: "",
        arrivalTime: "",
        passengers: {
          adults: 1,
          children: 0,
          infants: 0
        },
        rooms: 1,
        pricing: {
          basePrice: 0,
          discount: 0,
          tax: 0,
          totalPrice: 0
        },
        coupon: {
          code: "",
          discountAmount: 0,
          discountType: "fixed"
        },
        specialRequests: "",
        payment: {
          method: "cash",
          amount: 0,
          transactionId: "",
          paidAt: null
        },
        status: "pending",
        isPaid: false,
        isCancelled: false
      })
    }
  }, [booking, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Submitting booking form:', formData)

      // Get current user from safeStorage
      const currentUser = JSON.parse(safeStorage.get("user") || '{}');
      const userId = currentUser._id

      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Ensure pricing fields are defined and valid numbers
      const pricing = {
        basePrice: Number(formData.pricing.basePrice) || 0,
        discount: Number(formData.pricing.discount) || 0,
        tax: Number(formData.pricing.tax) || 0,
        totalPrice: Number(formData.pricing.totalPrice) || 0,
      };

      // Map form data to backend schema
      const bookingData = {
        dates: [formData.startDate],
        user: userId,
        serviceType: formData.serviceType === 'cab' ? 'Car' : formData.serviceType === 'hotel' ? 'Hotel' : formData.serviceType === 'logistics' ? 'Logistics' : formData.serviceType,
        service: formData.service,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate?.toISOString() || formData.startDate.toISOString(),
        passengers: formData.passengers,
        rooms: formData.rooms,
        pickupLocation: formData.serviceType !== 'hotel' ? { address: formData.pickupLocation } : undefined,
        dropoffLocation: formData.serviceType !== 'hotel' ? { address: formData.dropoffLocation } : undefined,
        pickupTime: formData.serviceType !== 'hotel' ? formData.pickupTime : undefined,
        arrivalTime: formData.serviceType === 'hotel' ? formData.arrivalTime : undefined,
        pricing: pricing,
        coupon: formData.coupon.code ? formData.coupon : undefined,
        specialRequests: formData.specialRequests,
        payment: {
          method: formData.payment.method,
          amount: pricing.totalPrice || formData.payment.amount,
          status: formData.isPaid ? 'completed' : 'pending',
          transactionId: formData.payment.transactionId,
          paymentDate: formData.payment.paidAt
        },
        status: formData.status,
        isPaid: formData.isPaid,
        isCancelled: formData.isCancelled
      }

      console.log('Mapped booking data:', bookingData)

      if (booking) {
        // Update existing booking
        console.log('Updating existing booking:', booking._id)
        // For now, we'll create a new booking. In a real app, you'd have an update endpoint
        await addBooking(bookingData)
      } else {
        // Create new booking
        await addBooking(bookingData)
      }

      onSubmit(bookingData)
    } catch (error) {
      console.error('Error submitting booking form:', error)
      throw error
    }
  }

  const getServiceOptions = () => {
    switch (formData.serviceType) {
      case "cab":
        return cars || []
      case "hotel":
        return hotels || []
      case "logistics":
        return logistics || []
      default:
        return []
    }
  }

  const getServiceDisplayName = (service) => {
    switch (formData.serviceType) {
      case "cab":
        return service.model || "Unknown Car"
      case "hotel":
        return service.name || "Unknown Hotel"
      case "logistics":
        return service.title || "Unknown Service"
      default:
        return "Unknown Service"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{booking ? "Edit Booking" : "Create New Booking"}</DialogTitle>
          <DialogDescription>{booking ? "Update booking information" : "Create a new booking"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value, service: "" })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cab">Cab</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => setFormData({ ...formData, service: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {getServiceOptions().map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      {getServiceDisplayName(service)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Adults</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                value={formData.passengers.adults}
                onChange={(e) => setFormData({ ...formData, passengers: { ...formData.passengers, adults: Number(e.target.value) } })}
                placeholder="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                min="0"
                value={formData.passengers.children}
                onChange={(e) => setFormData({ ...formData, passengers: { ...formData.passengers, children: Number(e.target.value) } })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="infants">Infants</Label>
              <Input
                id="infants"
                type="number"
                min="0"
                value={formData.passengers.infants}
                onChange={(e) => setFormData({ ...formData, passengers: { ...formData.passengers, infants: Number(e.target.value) } })}
                placeholder="0"
              />
            </div>
          </div>

          {formData.serviceType === 'Hotel' && (
            <div className="space-y-2">
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                placeholder="1"
                required
              />
            </div>
          )}

          {/* Location Details - conditional */}
          {formData.serviceType !== 'Hotel' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <Input
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  placeholder="Pickup address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Dropoff Location</Label>
                <Input
                  value={formData.dropoffLocation}
                  onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                  placeholder="Dropoff address"
                  required
                />
              </div>
            </div>
          )}

          {/* Time Details */}
          <div className="grid grid-cols-2 gap-4">
            {formData.serviceType === 'Hotel' ? (
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="pickupTime">Pickup Time</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Pricing Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹)</Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                value={formData.pricing.basePrice}
                onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, basePrice: Number(e.target.value) } })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (₹)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                value={formData.pricing.discount}
                onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, discount: Number(e.target.value) } })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Tax (₹)</Label>
              <Input
                id="tax"
                type="number"
                min="0"
                value={formData.pricing.tax}
                onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, tax: Number(e.target.value) } })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalPrice">Total Price (₹)</Label>
            <Input
              id="totalPrice"
              type="number"
              min="0"
              value={formData.pricing.totalPrice}
              onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, totalPrice: Number(e.target.value) } })}
              placeholder="0"
              required
            />
          </div>

          {/* Coupon Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <Input
                id="couponCode"
                value={formData.coupon.code}
                onChange={(e) => setFormData({ ...formData, coupon: { ...formData.coupon, code: e.target.value } })}
                placeholder="COUPON123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountAmount">Discount Amount</Label>
              <Input
                id="discountAmount"
                type="number"
                min="0"
                value={formData.coupon.discountAmount}
                onChange={(e) => setFormData({ ...formData, coupon: { ...formData.coupon, discountAmount: Number(e.target.value) } })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={formData.coupon.discountType}
                onValueChange={(value) => setFormData({ ...formData, coupon: { ...formData.coupon, discountType: value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={formData.payment.method}
              onValueChange={(value) => setFormData({ ...formData, payment: { ...formData.payment, method: value } })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="paypal">Paypal</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Special Requests</Label>
            <Textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Any special requests"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{booking ? "Update Booking" : "Create Booking"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
