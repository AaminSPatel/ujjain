"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Car,
  Hotel,
  Truck,
  BarChart3,
  CheckCircle,
  XCircle,
  Navigation
} from "lucide-react";
import { useUjjain } from "@/components/context/UjjainContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { FaRupeeSign } from "react-icons/fa";

export default function ActiveBookingPage() {
  const { user, fetchMyBookings, cancelBooking, updateBookingStatus } = useUjjain();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0
  });
  const [cancelDialog, setCancelDialog] = useState({ open: false, bookingId: null });
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    if (user && user.role !== 'driver' && user.bookings) {
      loadBookings();
    }
  }, [user, activeTab]);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      let allBookings = [];

      // For passengers: fetch bookings based on active tab
      if (activeTab === 'active') {
        // Active tab: show active bookings (in_progress, picked, completed, accepted)
        const passengerData = user.bookings.filter((booking)=> booking.status === 'picked' ||booking.status === 'accepted' ||booking.status === 'in_progress' ||booking.status ===  'pending' );
        allBookings = passengerData;
      } else if (activeTab === 'manage') {
        // Manage tab: show all recent bookings (limit to recent ones)
        const passengerData = user.bookings;
        allBookings = passengerData;
      }

      setBookings(allBookings);
      calculateStats(allBookings);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) {
      setStats({
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        totalSpent: 0
      });
      return;
    }

    const stats = {
      total: bookings.length,
      active: bookings.filter(b => ['pending','in_progress', 'picked', 'accepted'].includes(b.status)).length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalSpent: bookings
        .filter(b => b.payment.status === 'completed')
        .reduce((sum, b) => sum + (b.payment?.amount || b.payment?.amount || 0), 0)
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      arrived: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-green-100 text-green-800',
      picked: 'bg-indigo-100 text-indigo-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'Car': return <Car className="h-4 w-4" />;
      case 'Hotel': return <Hotel className="h-4 w-4" />;
      case 'Logistics': return <Truck className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const groupBookingsByStatus = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) {
      return {};
    }

    const grouped = {};
    bookings.forEach(booking => {
      if (!grouped[booking.status]) {
        grouped[booking.status] = [];
      }
      grouped[booking.status].push(booking);
    });
    return grouped;
  };

  const handleCancelBooking = async () => {
    if (!cancelDialog.bookingId || !cancellationReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    try {
      await cancelBooking(cancelDialog.bookingId, cancellationReason);
      toast.success("Booking cancelled successfully");
      setCancelDialog({ open: false, bookingId: null });
      setCancellationReason("");
      loadBookings();
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error("Cancel booking error:", error);
    }
  };



  // Filter bookings by service type
  const filteredBookings = serviceTypeFilter === "all"
    ? bookings
    : bookings.filter(booking => booking.serviceType === serviceTypeFilter);

  const groupedBookings = groupBookingsByStatus(filteredBookings);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Bookings</h1>
          <p className="text-gray-600">Manage your current and active bookings</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-gray-500">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FaRupeeSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">₹{stats.totalSpent}</div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Service Type Filter Tabs */}
        <Tabs value={serviceTypeFilter} onValueChange={setServiceTypeFilter} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Car">Car</TabsTrigger>
            <TabsTrigger value="Hotel">Hotel</TabsTrigger>
            <TabsTrigger value="Logistics">Logistics</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Bookings</TabsTrigger>
            <TabsTrigger value="manage">All Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {/* First Section: Active Bookings Display */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <Button onClick={loadBookings} className="mt-4">
                    Retry
                  </Button>
                </div>
              ) : Object.keys(groupedBookings).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active bookings found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedBookings).map(([status, statusBookings]) => (
                    <div key={status}>
                      <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                        <Badge className={getStatusColor(status)}>
                          {status.replace('_', ' ')}
                        </Badge>
                        <span>({statusBookings.length})</span>
                      </h3>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {statusBookings.map((booking) => (
                          <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {getServiceIcon(booking.serviceType)}
                                <span className="font-medium truncate">{booking.serviceType}</span>
                              </div>
                              <Badge variant="outline" className={`${getStatusColor(booking.status)} text-xs shrink-0`}>
                                {booking.status.replace('_', ' ')}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span className="truncate">{formatDate(booking.startDate)}</span>
                              </div>

                              {booking.pickupLocation && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                  <span className="text-xs leading-tight break-words">{booking.pickupLocation.address}</span>
                                </div>
                              )}

                              {booking.pricing && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 text-base">
                                    ₹{booking.pricing.totalPrice || booking.pricing.basePrice}
                                  </span>
                                </div>
                              )}

                              {booking.assignedDriver && (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 shrink-0" />
                                  <span className="text-xs truncate">{booking.assignedDriver.fullName || 'Driver assigned'}</span>
                                </div>
                              )}

                              {booking.payment && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">
                                    Payment: {booking.payment.status === 'completed' ? 'Paid' : booking.payment.status}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 mt-4">
                              <Link href={`/active-booking/${booking._id}`} className="flex-1 min-w-0">
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                  <Navigation className="h-3 w-3 mr-1" />
                                  Track
                                </Button>
                              </Link>
                              {['accepted', 'pending'].includes(booking.status) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCancelDialog({ open: true, bookingId: booking._id })}
                                  className="text-red-600 hover:text-red-700 shrink-0 px-2"
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            {/* Second Section: Manage Bookings - Show all recent bookings */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
              <p className="text-gray-600 mb-4">View and manage all your recent bookings</p>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <Button onClick={loadBookings} className="mt-4">
                    Retry
                  </Button>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(booking.serviceType)}
                          <span className="font-medium">{booking.serviceType}</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.startDate)}</span>
                        </div>

                        {booking.pickupLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{booking.pickupLocation.address}</span>
                          </div>
                        )}

                        {booking.pricing && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              ₹{booking.pricing.totalPrice || booking.pricing.basePrice}
                            </span>
                          </div>
                        )}

                        {booking.assignedDriver && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Driver assigned</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Link href={`/active-booking/${booking._id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        {['accepted', 'pending'].includes(booking.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCancelDialog({ open: true, bookingId: booking._id })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Cancel Booking Dialog */}
        <Dialog open={cancelDialog.open} onOpenChange={(open) => setCancelDialog({ open, bookingId: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="cancellation-reason">Reason for cancellation</Label>
              <Textarea
                id="cancellation-reason"
                placeholder="Please provide a reason for cancellation..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
                  Cancel Booking
                </Button>
                <Button variant="outline" onClick={() => setCancelDialog({ open: false, bookingId: null })}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  );
}
