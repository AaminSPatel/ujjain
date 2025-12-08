"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, List, Grid3X3, User, Eye, Phone, Mail, MapPin, Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HotelForm } from "@/components/forms/hotel-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"
import { HotelService } from "@/components/apiService"

export default function HotelsPage() {
  const [filteredHotels, setFilteredHotels] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [deletingHotel, setDeletingHotel] = useState(null)
  const [viewingHotel, setViewingHotel] = useState(null)
  const [updatingStatusHotel, setUpdatingStatusHotel] = useState(null)
  const [allHotels, setAllHotels] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const { hotels, isLoading: contextLoading, addHotel, updateHotel, removeHotel,user } = useUjjain()
  const { toast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)

  const statusOptions = [
    { value: "verified", label: "Verified", color: "default" },
    { value: "unverified", label: "Unverified", color: "secondary" },
    { value: "rejected", label: "Rejected", color: "destructive" },
    { value: "blacklisted", label: "Blacklisted", color: "destructive" },
    { value: "pro", label: "Pro", color: "outline" }
  ]

  useEffect(() => {
    if (hotels.length > 0) {
      setAllHotels(hotels)
      setLocalLoading(false)
    }
  }, [hotels])
  useEffect(() => {
    const filtered = allHotels.filter(
      (hotel) =>
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredHotels(filtered)
  }, [allHotels, searchTerm])

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
    //console.log('adding hotel',hotelData);

    try {
      setLocalLoading(true)
      if (editingHotel) {
        console.log("editing hotel", hotelData)
        await updateHotel(editingHotel._id, hotelData)

        toast({
          title: "Success",
          description: "Hotel updated successfully",
        })
      } else {
        console.log("adding hotel", hotelData)
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

  const handleStatusUpdate = async (hotelId, newStatus) => {
    try {
      setLocalLoading(true)
      await HotelService.updateStatus(hotelId, newStatus)

      // Update the local state
      setAllHotels(prevHotels =>
        prevHotels.map(hotel =>
          hotel._id === hotelId ? { ...hotel, status: newStatus } : hotel
        )
      )

      toast({
        title: "Success",
        description: `Hotel status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error('Status update error:', error)
      toast({
        title: "Error",
        description: "Failed to update hotel status",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
      setUpdatingStatusHotel(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotels Management</h1>
          <p className="text-muted-foreground">Manage your hotel listings and availability</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hotels List</CardTitle>
          <CardDescription>View and manage all hotels in your system</CardDescription>
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
                              onClick={() => setViewingHotel(hotel)}
                              disabled={localLoading}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
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
                            {user?.role === 'admin' && (
                              <DropdownMenuItem
                                onClick={() => setUpdatingStatusHotel(hotel)}
                                disabled={localLoading}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                            )}
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
            /* Added grid view layout */
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
                              onClick={() => setViewingHotel(hotel)}
                              disabled={localLoading}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
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
                            {user?.role === 'admin' && (
                              <DropdownMenuItem
                                onClick={() => setUpdatingStatusHotel(hotel)}
                                disabled={localLoading}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                            )}
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

      <HotelForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingHotel(null)
        }}
        hotel={editingHotel}
        onSubmit={handleFormSubmit}
        isLoading={localLoading}
        userRole={user?.role}
      />

      <DeleteConfirmDialog
        open={!!deletingHotel}
        onOpenChange={() => setDeletingHotel(null)}
        onConfirm={() => handleDelete(deletingHotel?._id)}
        title="Delete Hotel"
        description={`Are you sure you want to delete ${deletingHotel?.name}? This action cannot be undone.`}
        isLoading={localLoading}
      />

      <Dialog open={!!viewingHotel} onOpenChange={() => setViewingHotel(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Hotel Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected hotel
            </DialogDescription>
          </DialogHeader>
          {viewingHotel && (
            <div className="space-y-6">
              {/* Hotel Images */}
              {viewingHotel.images && viewingHotel.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hotel Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingHotel.images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={`${viewingHotel.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Name:</span>
                        <span className="text-sm font-semibold">{viewingHotel.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Category:</span>
                        <Badge variant="outline">{viewingHotel.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <Badge variant={
                          viewingHotel.status === "verified" ? "default" :
                          viewingHotel.status === "unverified" ? "secondary" :
                          viewingHotel.status === "rejected" ? "destructive" :
                          viewingHotel.status === "blacklisted" ? "destructive" : "outline"
                        }>
                          {viewingHotel.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{viewingHotel.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Price:</span>
                        <span className="text-sm font-semibold text-primary">₹{viewingHotel.price}</span>
                      </div>
                      {viewingHotel.originalPrice && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Original Price:</span>
                          <span className="text-sm font-semibold line-through text-muted-foreground">₹{viewingHotel.originalPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span className="text-sm">{viewingHotel.location}</span>
                      </div>
                      {viewingHotel.distance && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Distance:</span>
                          <span className="text-sm">{viewingHotel.distance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Owner Information */}
                  {viewingHotel.owner && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={viewingHotel.owner.profilePic} alt={viewingHotel.owner.fullName} />
                          <AvatarFallback>
                            {viewingHotel.owner.fullName?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{viewingHotel.owner.fullName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {viewingHotel.owner.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {viewingHotel.owner.mobile}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {viewingHotel.contact && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Mobile:</span>
                          <span className="text-sm font-semibold">{viewingHotel.contact.mobile}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Email:</span>
                          <span className="text-sm font-semibold">{viewingHotel.contact.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Address:</span>
                          <span className="text-sm font-semibold">{viewingHotel.contact.address}</span>
                        </div>
                        {viewingHotel.contact.website && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Website:</span>
                            <a
                              href={viewingHotel.contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities and Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewingHotel.amenities && viewingHotel.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingHotel.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {viewingHotel.features && viewingHotel.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingHotel.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {viewingHotel.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{viewingHotel.description}</p>
                  </div>
                </div>
              )}

              {/* Rooms */}
              {viewingHotel.rooms && viewingHotel.rooms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Rooms ({viewingHotel.rooms.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingHotel.rooms.map((room, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{room.name}</h4>
                            <Badge variant={
                              room.availability === "Available" ? "default" :
                              room.availability === "Limited" ? "secondary" : "destructive"
                            }>
                              {room.availability}
                            </Badge>
                          </div>
                          {room.description && (
                            <p className="text-sm text-muted-foreground">{room.description}</p>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-primary">₹{room.price}</span>
                            <span className="text-sm text-muted-foreground">Capacity: {room.capacity}</span>
                          </div>
                          {room.features && room.features.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {room.features.slice(0, 3).map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {room.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.features.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{viewingHotel.reviews?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{viewingHotel.rooms?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Rooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{viewingHotel.amenities?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Amenities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Date(viewingHotel.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-muted-foreground">Listed</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!updatingStatusHotel} onOpenChange={() => setUpdatingStatusHotel(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Update Hotel Status
            </DialogTitle>
            <DialogDescription>
              Change the status of {updatingStatusHotel?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <select
                id="status"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={updatingStatusHotel?.status}
                onChange={(e) => {
                  const newStatus = e.target.value
                  handleStatusUpdate(updatingStatusHotel._id, newStatus)
                }}
                disabled={localLoading}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
