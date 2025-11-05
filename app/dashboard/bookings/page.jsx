"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Info,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUjjain } from "@/components/context/UjjainContext";
import { useToast } from "@/hooks/use-toast";
import { BookingForm } from "@/components/forms/booking-form";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {  FaRupeeSign, FaUsers } from "react-icons/fa";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "detail"
  const [displayMode, setDisplayMode] = useState("table"); // "table" or "grid"

  const {
    fetchBookings: fetchBookingsFromContext,
    changeBookingStatus: changeBookingStatusFromContext,
    cancelBooking,
    updatePaymentStatus,
    removeBooking,
    getBookingById,
    cars,
    hotels,
    logistics,
    bookings: contextBookings,
  } = useUjjain();
  const { toast } = useToast();

  // Function to get room details by room ID from hotels array
  const getRoomDetails = (roomId) => {
    if (!roomId || !hotels || hotels.length === 0) return null;
    for (const hotel of hotels) {
      if (hotel.rooms && Array.isArray(hotel.rooms)) {
        const room = hotel.rooms.find((r) => r._id === roomId);
        if (room) {
          return room;
        }
      }
    }
    return null;
  };

  /* useEffect(() => {
    loadBookings();
  }, []); */

  useEffect(() => {
    // Update local state when context bookings change
    if (contextBookings && contextBookings.length > 0) {
      setBookings(contextBookings);
      setIsLoading(false);
    }
  }, [contextBookings]);

  useEffect(() => {
    let filtered = bookings.filter(
      (booking) =>
        booking.personalInfo?.fullname
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.personalInfo?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = async () => {
    try {
      console.log("Loading bookings...");
      setIsLoading(true);
      await fetchBookingsFromContext();
      console.log("Bookings loaded successfully");
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      console.log(`Changing booking ${bookingId} status to ${status}`);
      await changeBookingStatusFromContext(bookingId, status);
      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });
      // Refresh the selected booking if it's the one being updated
      if (selectedBooking && selectedBooking._id === bookingId) {
        const updatedBooking = await getBookingById(bookingId);
        setSelectedBooking(updatedBooking);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const handleCancelBooking = async (bookingId, reason = null) => {
    try {
      console.log(`Cancelling booking ${bookingId}`);
      await cancelBooking(bookingId, reason);
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
      // Refresh the selected booking if it's the one being cancelled
      if (selectedBooking && selectedBooking._id === bookingId) {
        const updatedBooking = await getBookingById(bookingId);
        setSelectedBooking(updatedBooking);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      console.log(`Deleting booking ${bookingId}`);
      await removeBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      // If the deleted booking was the selected one, clear the selection
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking(null);
        setViewMode("table");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsFormOpen(true);
  };

  const handleViewBooking = async (bookingId) => {
    try {
      console.log(`Viewing booking ${bookingId}`);
      const bookingDetails = await getBookingById(bookingId);
      console.log("Booking details:", bookingDetails);
      setSelectedBooking(bookingDetails);
      setViewMode("detail");
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch booking details",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getServiceName = (booking) => {
    if (!booking.service) return "N/A";

    switch (booking.serviceType) {
      case "Car":
        return booking.service.model || "Unknown Car";
      case "Hotel":
        return booking.service.name || "Unknown Hotel";
      case "Logistics":
        return booking.service.serviceName || "Unknown Logistics";
      default:
        return "Unknown Service";
    }
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      credit_card: "Credit Card",
      wallet: "Wallet",
      paypal: "PayPal",
      bank_transfer: "Bank Transfer",
    };
    return methods[method] || method;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bookings Management
          </h1>
          <p className="text-muted-foreground">
            Manage customer bookings and reservations
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Booking
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedBooking}>
            Detail View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Bookings List</CardTitle>
                  <CardDescription>
                    View and manage all customer bookings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={displayMode === "table" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setDisplayMode("table")}
                    className="h-9 w-9"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={displayMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setDisplayMode("grid")}
                    className="h-9 w-9"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
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
                <Button variant="outline" onClick={loadBookings}>
                  <Filter className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : displayMode === "table" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewBooking(booking._id)}
                      >
                        <TableCell className="font-medium">
                          {booking._id?.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.user?.fullName || "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.user?.email || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getServiceName(booking)}</TableCell>
                        <TableCell className="capitalize">
                          {booking.serviceType || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(booking.startDate)}</div>
                            {booking.endDate && (
                              <div className="text-muted-foreground">
                                to {formatDate(booking.endDate)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>₹{booking.payment?.amount || 0}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusColors[booking.status] ||
                              statusColors.pending
                            }
                          >
                            {booking.status || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-50">
                              <DropdownMenuItem
                                onClick={() => handleViewBooking(booking._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditBooking(booking)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Booking
                              </DropdownMenuItem>
                              {booking.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(booking._id, "confirmed")
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Confirm
                                </DropdownMenuItem>
                              )}
                              {booking.status !== "completed" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCancelBooking(booking._id)
                                  }
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setBookingToDelete(booking);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewBooking(booking._id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground">
                            Booking ID: {booking._id?.slice(-8)}
                          </h3>
                          <h2 className="font-bold text-lg">
                            {getServiceName(booking)}
                          </h2>
                        </div>
                        <Badge
                          className={
                            statusColors[booking.status] || statusColors.pending
                          }
                        >
                          {booking.status || "pending"}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div>
                          <p className="text-sm font-medium">
                            {booking.user?.fullName || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.user?.email || "N/A"}
                          </p>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Type
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {booking.serviceType || "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Dates
                          </span>
                          <span className="text-sm font-medium text-right">
                            {formatDate(booking.startDate)}
                            {booking.endDate &&
                              ` - ${formatDate(booking.endDate)}`}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Amount
                          </span>
                          <span className="text-sm font-medium">
                            ₹{booking.payment?.amount || 0}
                          </span>
                        </div>
                      </div>

                      <div
                        className="flex justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-50">
                            <DropdownMenuItem
                              onClick={() => handleViewBooking(booking._id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Booking
                            </DropdownMenuItem>
                            {booking.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(booking._id, "confirmed")
                                }
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirm
                              </DropdownMenuItem>
                            )}
                            {booking.status !== "completed" && (
                              <DropdownMenuItem
                                onClick={() => handleCancelBooking(booking._id)}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setBookingToDelete(booking);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/*  details */}
        <TabsContent value="detail">
          <AnimatePresence mode="wait">
            {selectedBooking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex flex-col space-y-1.5">
                      <CardTitle className="flex items-center gap-2">
                        Booking Details
                        <Badge
                          className={
                            statusColors[selectedBooking.status] ||
                            statusColors.pending
                          }
                        >
                          {selectedBooking.status || "pending"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Booking ID: {selectedBooking._id}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("table")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Customer Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Name</span>
                            <span className="font-medium">
                              {selectedBooking.user?.fullName || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Mail className="h-4 w-4" /> Email
                            </span>
                            <span className="font-medium">
                              {selectedBooking.user?.email || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Phone className="h-4 w-4" /> Phone
                            </span>
                            <span className="font-medium">
                              {selectedBooking.user?.mobile || "N/A"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Service Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Service Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium capitalize">
                              {selectedBooking.serviceType || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Service
                            </span>
                            <span className="font-medium">
                              {getServiceName(selectedBooking)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Duration
                            </span>
                            <span className="font-medium">
                              {formatDate(selectedBooking.startDate)}
                              {selectedBooking.endDate &&
                                ` to ${formatDate(selectedBooking.endDate)}`}
                            </span>
                          </div>
                          {/* Passenger Details */}
                          {selectedBooking.passengers && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Passengers
                              </span>
                              <span className="font-medium">
                                {selectedBooking.passengers.adults || 0} Adult
                                {(selectedBooking.passengers.adults || 0) !== 1
                                  ? "s"
                                  : ""}
                                , {selectedBooking.passengers.children || 0}{" "}
                                Child
                                {(selectedBooking.passengers.children || 0) !==
                                1
                                  ? "ren"
                                  : ""}
                                , {selectedBooking.passengers.infants || 0}{" "}
                                Infant
                                {(selectedBooking.passengers.infants || 0) !== 1
                                  ? "s"
                                  : ""}
                              </span>
                            </div>
                          )}
                          {/* Room Details for Hotels */}
                          {selectedBooking.serviceType === "Hotel" &&
                            selectedBooking.rooms && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Rooms
                                </span>
                                <span className="font-medium">
                                  {selectedBooking.rooms} Room
                                  {selectedBooking.rooms !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                          {/* Room ID for Hotels */}
                          {selectedBooking.serviceType === "Hotel" &&
                            selectedBooking.room && (
                              <div className="flex items-center justify-between">
                                <div className="flex justify-center flex-col">
                                  <span className="text-muted-foreground">
                                    Room
                                  </span>
                                  <img
                                    src={
                                      getRoomDetails(selectedBooking.room)
                                        .images[0].url
                                    }
                                    alt="Room image"
                                    className="h-20 w-20"
                                  />
                                </div>
                                <div className="flex justify-center flex-col">
                                  <span className="font-medium">
                                    
                                    {getRoomDetails(selectedBooking.room).name}
                                  </span>
                                  <span className="font-medium flex items-center gap-2">
                                    <FaRupeeSign />
                                    {getRoomDetails(selectedBooking.room).price}
                                  </span>
                                  <span className="font-medium flex items-center gap-2">
                                    <FaUsers/>
                                    {
                                      getRoomDetails(selectedBooking.room)
                                        .capacity
                                    }
                                  </span>
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>

                      {/* Location Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Location Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                          <div className="flex items-start justify-between">
                            <span className="text-muted-foreground">
                              Pickup
                            </span>
                            <span className="font-medium text-right">
                              {selectedBooking.pickupLocation?.address || "N/A"}
                            </span>
                          </div>
                          {selectedBooking.dropoffLocation && (
                            <div className="flex items-start justify-between">
                              <span className="text-muted-foreground">
                                Dropoff
                              </span>
                              <span className="font-medium text-right">
                                {selectedBooking.dropoffLocation.address}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Payment Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Amount
                            </span>
                            <span className="font-medium">
                              ₹{selectedBooking.payment?.amount || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Method
                            </span>
                            <span className="font-medium capitalize">
                              {getPaymentMethodText(
                                selectedBooking.payment?.method
                              ) || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Status
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {selectedBooking.payment?.status || "N/A"}
                            </Badge>
                          </div>
                          {selectedBooking.payment?.transactionId && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Transaction ID
                              </span>
                              <span className="font-medium text-xs">
                                {selectedBooking.payment.transactionId}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Additional Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <div className="flex items-start justify-between">
                            <span className="text-muted-foreground">
                              Created At
                            </span>
                            <span className="font-medium">
                              {formatDateTime(selectedBooking.createdAt)}
                            </span>
                          </div>
                          {selectedBooking.specialRequests && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Special Requests
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedBooking.specialRequests}
                              </p>
                            </div>
                          )}
                          {selectedBooking.cancellationReason && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Cancellation Reason
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedBooking.cancellationReason}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setViewMode("table")}
                      >
                        Back to List
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleEditBooking(selectedBooking)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Booking
                      </Button>
                      {selectedBooking.status === "pending" && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleStatusChange(selectedBooking._id, "confirmed")
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Booking
                        </Button>
                      )}
                      {selectedBooking.status !== "completed" && (
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleCancelBooking(selectedBooking._id)
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      <BookingForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingBooking(null);
        }}
        booking={editingBooking}
        onSubmit={async (bookingData) => {
          try {
            // console.log('Submitting booking form:', bookingData)
            // Handle form submission logic here
            toast({
              title: "Success",
              description: editingBooking
                ? "Booking updated successfully"
                : "Booking created successfully",
            });
            setIsFormOpen(false);
            setEditingBooking(null);
            loadBookings();
          } catch (error) {
            console.error("Error submitting booking form:", error);
            toast({
              title: "Error",
              description: "Failed to save booking",
              variant: "destructive",
            });
          }
        }}
        cars={cars}
        hotels={hotels}
        logistics={logistics}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => handleDeleteBooking(bookingToDelete?._id)}
        title="Delete Booking"
        description={`Are you sure you want to delete the booking for ${bookingToDelete?.personalInfo?.fullname}? This action cannot be undone.`}
      />
    </div>
  );
}
