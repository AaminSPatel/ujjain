"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlaceForm } from "@/components/forms/place-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"

export default function PlacesPage() {
  const [allPlaces, setAllPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState(null)
  const [deletingPlace, setDeletingPlace] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addPlace,removePlace,updatePlace , places } = useUjjain()
  const { toast } = useToast()
useEffect(() => {
  if (places.length > 0) {
    setAllPlaces(places)
    setIsLoading(false)
  }
}, [places])

useEffect(() => {
  if (allPlaces.length === 0) {
    setFilteredPlaces([])
    return
  }

  const searchLower = searchTerm.toLowerCase()
  const filtered = allPlaces.filter((place) => {
    // Safely check all properties
    const nameMatch = place?.name?.toLowerCase().includes(searchLower) || false
    const categoryMatch = place?.category?.toLowerCase().includes(searchLower) || false
    const locationMatch = place?.location?.toLowerCase().includes(searchLower) || false
    const highlightsMatch = place?.highlights?.some(highlight => 
      highlight?.toLowerCase().includes(searchLower)
    ) || false

    return nameMatch || categoryMatch || locationMatch || highlightsMatch
  })
  
  setFilteredPlaces(filtered)
}, [allPlaces, searchTerm])
  const fetchPlaces = async () => {
    try {
      setIsLoading(true)
      const response = await apiCall("/places", "GET")
      setAllPlaces(response.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch places",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (placeId) => {
    try {
      await removePlace(placeId)
      setAllPlaces(places.filter((place) => place._id !== placeId))
      toast({
        title: "Success",
        description: "Place deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete place",
        variant: "destructive",
      })
    }
    setDeletingPlace(null)
  }

  const handleFormSubmit = async (placeData) => {
    try {
      if (editingPlace) {
         await updatePlace(editingPlace._id, placeData)
        //setAllPlaces(allPlaces.map((place) => (place._id === editingPlace._id ? response.data : place)))
        toast({
          title: "Success",
          description: "Place updated successfully",
        })
      } else {
         await addPlace(placeData)
        //setAllPlaces([...allPlaces, response.data])
        toast({
          title: "Success",
          description: "Place created successfully",
        })
      }
      setIsFormOpen(false)
      setEditingPlace(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save place",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Places Management</h1>
          <p className="text-muted-foreground">Manage tourist destinations and attractions</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Place
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Places List</CardTitle>
          <CardDescription>View and manage all tourist destinations</CardDescription>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
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
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlaces.map((place) => (
                  <motion.tr key={place._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
                    <TableCell className="font-medium">{place.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{place.category}</Badge>
                    </TableCell>
                    <TableCell>{place.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={place.isActive ? "default" : "secondary"}>
                        {place.isActive ? "Active" : "Inactive"}
                      </Badge>
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
                              setEditingPlace(place)
                              setIsFormOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingPlace(place)} className="text-red-600">
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
          )}
        </CardContent>
      </Card>

      <PlaceForm open={isFormOpen} onOpenChange={setIsFormOpen} place={editingPlace} onSubmit={handleFormSubmit} />

      <DeleteConfirmDialog
        open={!!deletingPlace}
        onOpenChange={() => setDeletingPlace(null)}
        onConfirm={() => handleDelete(deletingPlace?._id)}
        title="Delete Place"
        description={`Are you sure you want to delete ${deletingPlace?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
