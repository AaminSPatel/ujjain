"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus,Star, Search, Filter, MoreHorizontal, Edit, Trash2, List, Grid3X3, Calendar, Users, DollarSign, Check, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HotelForm } from "@/components/forms/hotel-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"

export default function HotelManagePage() {
  const [filteredHotels, setFilteredHotels] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [deletingHotel, setDeletingHotel] = useState(null)
  const [allHotels, setAllHotels] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const [bookings, setBookings] = useState([])
  const { hotels, formatDate, isLoading: contextLoading, addHotel, updateHotel, removeHotel, user } = useUjjain()
  const { toast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null) // Track which booking is being processed
  const [selectedBooking, setSelectedBooking] = useState(null) // Track selected booking for details view
  const [showBookingDetails, setShowBookingDetails] = useState(false) // Control booking details modal

  useEffect(() => {
    if (hotels.length > 0 && user) {
      const userHotels = hotels.filter(hotel => hotel.owner === user._id)
      setAllHotels(userHotels)
      setLocalLoading(false)
    }
  }, [hotels, user])

  useEffect(() => {
    const filtered = allHotels.filter(
      (hotel) =>
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredHotels(filtered)
  }, [allHotels, searchTerm])

  // Fetch bookings for user's hotels
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || allHotels.length === 0) return

      try {
        const hotelIds = allHotels.map(hotel => hotel._id)
        const { BookingService } = await import('@/components/apiService')
        const data = await BookingService.getBookingsByService('Hotel', hotelIds)
        setBookings(data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    fetchBookings()
  }, [user, allHotels])

  const handleDelete = async (hotelId) => {
    try {
      setLocalLoading(true)
      await removeHotel(hotelId)
      toast({
        title: "Success",
        description: "Hotel deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hotel",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
      setDeletingHotel(null)
    }
  }

  const handleFormSubmit = async (hotelData) => {
    try {
      setLocalLoading(true)
      if (editingHotel) {
        await updateHotel(editingHotel._id, hotelData)
        toast({
          title: "Success",
          description: "Hotel updated successfully",
        })
      } else {
        await addHotel(hotelData)
        toast({
          title: "Success",
          description: "Hotel created successfully",
        })
      }
      setIsFormOpen(false)
      setEditingHotel(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save hotel",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
    }
  }

  const getHotelBookings = (hotelId) => {
    return bookings.filter(booking => booking.service._id === hotelId)
  }

  const getTotalRevenue = () => {
    return bookings
      .filter(booking => booking.payment?.status === "completed")
      .reduce((total, booking) => total + (booking.payment?.amount || 0), 0)
  }

  const handleAcceptBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId)
      const { BookingService } = await import('@/components/apiService')
      await BookingService.acceptHotelBooking(bookingId)
      toast({
        title: "Success",
        description: "Booking accepted successfully",
      })
      // Refresh bookings
      const hotelIds = allHotels.map(hotel => hotel._id)
      const data = await BookingService.getBookingsByService('Hotel', hotelIds)
      setBookings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept booking",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId)
      const { BookingService } = await import('@/components/apiService')
      await BookingService.rejectHotelBooking(bookingId)
      toast({
        title: "Success",
        description: "Booking rejected successfully",
      })
      // Refresh bookings
      const hotelIds = allHotels.map(hotel => hotel._id)
      const data = await BookingService.getBookingsByService('Hotel', hotelIds)
      setBookings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Management</h1>
          <p className="text-muted-foreground">Manage your hotels and view bookings</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading}>
          <Plus className="h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allHotels.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{getTotalRevenue()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allHotels.length > 0
                ? (allHotels.reduce((sum, hotel) => sum + (hotel.rating || 0), 0) / allHotels.length).toFixed(1)
                : 0
              } ★
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hotels" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hotels">My Hotels</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Hotels</CardTitle>
              <CardDescription>View and manage your hotel listings</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search hotels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={contextLoading}
                    />
                  </div>
                  <Button variant="outline" disabled={contextLoading}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <div className="flex gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {localLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredHotels.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No hotels match your search" : "No hotels available"}
                  </p>
                </div>
              ) : viewMode === "table" ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Amenities</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHotels.map((hotel) => (
                        <motion.tr
                          key={hotel._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="group"
                        >
                          <TableCell className="font-medium">{hotel.name}</TableCell>
                          <TableCell>{hotel.location}</TableCell>
                          <TableCell>₹{hotel.price}</TableCell>
                          <TableCell>
                            <Badge variant="default">{hotel.rating} ★</Badge>
                          </TableCell>
                          <TableCell>{getHotelBookings(hotel._id).length}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {hotel.amenities?.slice(0, 2).map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {hotel.amenities?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{hotel.amenities.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingHotel(hotel)
                                    setIsFormOpen(true)
                                  }}
                                  disabled={localLoading}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeletingHotel(hotel)}
                                  className="text-red-600"
                                  disabled={localLoading}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHotels.map((hotel) => (
                    <motion.div
                      key={hotel._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg line-clamp-1">{hotel.name}</CardTitle>
                              <CardDescription className="line-clamp-1">{hotel.location}</CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingHotel(hotel)
                                    setIsFormOpen(true)
                                  }}
                                  disabled={localLoading}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeletingHotel(hotel)}
                                  className="text-red-600"
                                  disabled={localLoading}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold text-primary">₹{hotel.price}</span>
                              <Badge variant="default">{hotel.rating} ★</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getHotelBookings(hotel._id).length} bookings
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {hotel.amenities?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{hotel.amenities.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Bookings</CardTitle>
              <CardDescription>View all bookings for your hotels</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors gap-4"
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowBookingDetails(true)
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{booking.service?.name || 'Hotel'}</h3>
                          <p className="text-gray-500 text-sm truncate">
                            {booking.user?.fullName} • {formatDate(booking.createdAt)}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-4">
                        <div className="text-left sm:text-right">
                          <p className="text-xl font-bold">₹{booking.payment?.amount || 0}</p>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedBooking(booking)
                              setShowBookingDetails(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {booking.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAcceptBooking(booking._id)
                                }}
                                disabled={actionLoading === booking._id}
                                className="bg-green-600 hover:bg-green-700 h-8 px-2"
                              >
                                {actionLoading === booking._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRejectBooking(booking._id)
                                }}
                                disabled={actionLoading === booking._id}
                                className="h-8 px-2"
                              >
                                {actionLoading === booking._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <HotelForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingHotel(null)
        }}
        hotel={editingHotel}
        onSubmit={handleFormSubmit}
        isLoading={localLoading}
      />

      <DeleteConfirmDialog
        open={!!deletingHotel}
        onOpenChange={() => setDeletingHotel(null)}
        onConfirm={() => handleDelete(deletingHotel?._id)}
        title="Delete Hotel"
        description={`Are you sure you want to delete ${deletingHotel?.name}? This action cannot be undone.`}
        isLoading={localLoading}
      />

      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Detailed information about the hotel booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Hotel Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Hotel:</span> {selectedBooking.service?.name}</p>
                    <p><span className="font-medium">Location:</span> {selectedBooking.service?.location}</p>
                    <p><span className="font-medium">Rating:</span> {selectedBooking.service?.rating} ★</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedBooking.user?.fullName}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.user?.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.user?.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Check-in:</span> {formatDate(selectedBooking.startDate)}</p>
                    <p><span className="font-medium">Check-out:</span> {formatDate(selectedBooking.endDate)}</p>
                    <p><span className="font-medium">Guests:</span> {selectedBooking.guests || 1}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Booking Date:</span> {formatDate(selectedBooking.createdAt)}</p>
                    <p><span className="font-medium">Status:</span>
                      <Badge
                        variant={
                          selectedBooking.status === "confirmed"
                            ? "default"
                            : selectedBooking.status === "completed"
                              ? "secondary"
                              : "destructive"
                        }
                        className="ml-2"
                      >
                        {selectedBooking.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Amount:</span> ₹{selectedBooking.payment?.amount || 0}</p>
                  <p><span className="font-medium">Payment Status:</span>
                    <Badge
                      variant={selectedBooking.payment?.status === "completed" ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {selectedBooking.payment?.status || "pending"}
                    </Badge>
                  </p>
                  {selectedBooking.payment?.method && (
                    <p><span className="font-medium">Payment Method:</span> {selectedBooking.payment.method}</p>
                  )}
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Special Requests</h3>
                  <p className="text-gray-600">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {selectedBooking.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="default"
                    onClick={() => {
                      handleAcceptBooking(selectedBooking._id)
                      setShowBookingDetails(false)
                    }}
                    disabled={actionLoading === selectedBooking._id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading === selectedBooking._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Accept Booking
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRejectBooking(selectedBooking._id)
                      setShowBookingDetails(false)
                    }}
                    disabled={actionLoading === selectedBooking._id}
                  >
                    {actionLoading === selectedBooking._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Reject Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
