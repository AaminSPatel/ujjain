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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function BookingForm({ open, onOpenChange, booking, onSubmit, cars }) {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    fullname: "",
    address: "",
    placeToPick: "",
    placeToDrop: "",
    car_id: "",
    dates: [],
    payment_type: "Cash",
    dateofpick: new Date(),
    total_price: "",
    status: "Pending"
  })

  useEffect(() => {
    if (booking) {
      setFormData({
        email: booking.email || "",
        mobile: booking.mobile || "",
        fullname: booking.fullname || "",
        address: booking.address || "",
        placeToPick: booking.placeToPick || "",
        placeToDrop: booking.placeToDrop || "",
        car_id: booking.car_id?.toString() || "",
        dates: booking.dates || [],
        payment_type: booking.payment_type || "Cash",
        dateofpick: booking.dateofpick ? new Date(booking.dateofpick) : new Date(),
        total_price: booking.total_price?.toString() || "",
        status: booking.status || "Pending"
      })
    } else {
      setFormData({
        email: "",
        mobile: "",
        fullname: "",
        address: "",
        placeToPick: "",
        placeToDrop: "",
        car_id: "",
        dates: [],
        payment_type: "Cash",
        dateofpick: new Date(),
        total_price: "",
        status: "Pending"
      })
    }
  }, [booking, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      dates: formData.dates,
      dateofpick: formData.dateofpick,
      total_price: Number(formData.total_price)
    })
  }

  const addDate = (date) => {
    if (!formData.dates.some(d => d.getTime() === date.getTime())) {
      setFormData({
        ...formData,
        dates: [...formData.dates, date]
      })
    }
  }

  const removeDate = (date) => {
    setFormData({
      ...formData,
      dates: formData.dates.filter(d => d.getTime() !== date.getTime())
    })
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
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 9876543210"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Complete postal address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="placeToPick">Pickup Location</Label>
              <Input
                id="placeToPick"
                value={formData.placeToPick}
                onChange={(e) => setFormData({ ...formData, placeToPick: e.target.value })}
                placeholder="Ujjain Railway Station"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeToDrop">Drop Location</Label>
              <Input
                id="placeToDrop"
                value={formData.placeToDrop}
                onChange={(e) => setFormData({ ...formData, placeToDrop: e.target.value })}
                placeholder="Mahakaleshwar Temple"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Car</Label>
              <Select
                value={formData.car_id}
                onValueChange={(value) => setFormData({ ...formData, car_id: value })}
                
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a car" />
                </SelectTrigger>
                <SelectContent>
                  {cars?.map((car) => (
                    <SelectItem key={car._id} value={car._id.toString()}>
                      {car.model} ({car.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.payment_type}
                onValueChange={(value) => setFormData({ ...formData, payment_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-semibold">
            <div className="space-y-2 group">
              <Label >Pickup Date</Label>
              <Calendar
                mode="single"
                selected={formData.dateofpick}
                onSelect={(date) => date && setFormData({ ...formData, dateofpick: date })}
                className="rounded-md border group-hover:flex hidden"
              />
            </div>
            <div className="space-y-2 group">
              <Label >Booking Dates</Label>
              <Calendar
                mode="multiple"
                selected={formData.dates}
                onSelect={(dates) => dates && setFormData({ ...formData, dates })}
                className="rounded-md border  group-hover:flex hidden"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.dates.map((date) => (
                  <Badge key={date.toString()} variant="secondary" className="flex items-center gap-1">
                    {format(date, 'PPP')}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeDate(date)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_price">Total Price (₹)</Label>
              <Input
                id="total_price"
                type="number"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                placeholder="2500"
                required
              />
            </div>
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
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