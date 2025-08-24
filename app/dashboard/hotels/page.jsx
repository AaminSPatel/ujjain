"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, List, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HotelForm } from "@/components/forms/hotel-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"

export default function HotelsPage() {
  const [filteredHotels, setFilteredHotels] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [deletingHotel, setDeletingHotel] = useState(null)
  const [allHotels, setAllHotels] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const { hotels, isLoading: contextLoading, addHotel, updateHotel, removeHotel } = useUjjain()
  const { toast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)

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
      />

      <DeleteConfirmDialog
        open={!!deletingHotel}
        onOpenChange={() => setDeletingHotel(null)}
        onConfirm={() => handleDelete(deletingHotel?._id)}
        title="Delete Hotel"
        description={`Are you sure you want to delete ${deletingHotel?.name}? This action cannot be undone.`}
        isLoading={localLoading}
      />
    </div>
  )
}
