"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"
import { BookingForm } from "@/components/forms/booking-form"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(true)
  const [editingBooking, setEditingBooking] = useState(true)
  const { apiCall, isLoading  :contextLoading} = useUjjain()
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    let filtered = bookings.filter(
      (booking) =>
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.carModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await apiCall("/bookings", "GET")
      setBookings(response.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await apiCall(`/bookings/${bookingId}`, "PATCH", { status })
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status } : booking)))
      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
          <p className="text-muted-foreground">Manage customer bookings and reservations</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Car
        </Button>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Calendar View
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings List</CardTitle>
          <CardDescription>View and manage all customer bookings</CardDescription>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <motion.tr key={booking._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
                    <TableCell className="font-medium">{booking.bookingId || booking._id?.slice(-8)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.carModel}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(booking.startDate)}</div>
                        <div className="text-muted-foreground">to {formatDate(booking.endDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell>₹{booking.totalAmount}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status] || statusColors.pending}>{booking.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {booking.status === "pending" && (
                            <DropdownMenuItem onClick={() => updateBookingStatus(booking._id, "confirmed")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm
                            </DropdownMenuItem>
                          )}
                          {booking.status !== "cancelled" && (
                            <DropdownMenuItem
                              onClick={() => updateBookingStatus(booking._id, "cancelled")}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
            <BookingForm 
              open={isFormOpen} 
              onOpenChange={(open) => {
                setIsFormOpen(open)
                if (!open) setEditingBooking(null)
              }} 
              car={editingBooking} 
              onSubmit={updateBookingStatus}
              isLoading={isLoading}
            />
      
    </div>
  )
}
