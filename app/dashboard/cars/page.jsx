"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CarForm } from "@/components/forms/car-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"

export default function CarsPage() {
  const [filteredCars, setFilteredCars] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [deletingCar, setDeletingCar] = useState(null)
  const [viewMode, setViewMode] = useState("table") // Added view mode state
  const { removeCar, cars, isLoading: contextLoading, addCar, updateCar } = useUjjain()
  const { toast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    const filtered = cars.filter(
      (car) =>
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.type?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCars(filtered)
  }, [cars, searchTerm])

  const handleDelete = async (carId) => {
    try {
      setLocalLoading(true)
      await removeCar(carId)
      toast({
        title: "Success",
        description: "Car deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
      setDeletingCar(null)
    }
  }

  const handleFormSubmit = async (carData) => {
    try {
      setLocalLoading(true)
      if (editingCar) {
        console.log(carData.features)
        await updateCar(editingCar._id, carData)
        toast({
          title: "Success",
          description: "Car updated successfully",
        })
      } else {
        await addCar(carData)
        toast({
          title: "Success",
          description: "Car created successfully",
        })
      }
      setIsFormOpen(false)
      setEditingCar(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save car",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
    }
  }

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredCars.map((car) => (
        <motion.div
          key={car._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{car.model}</h3>
              <p className="text-sm text-gray-600">{car.type}</p>
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
                    setEditingCar(car)
                    setIsFormOpen(true)
                  }}
                  disabled={localLoading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeletingCar(car)} className="text-red-600" disabled={localLoading}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price/Day:</span>
              <span className="font-medium">₹{car.pricePerDay}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge variant={car.available ? "default" : "secondary"}>
                {car.available ? "Available" : "Unavailable"}
              </Badge>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Features:</p>
              <div className="flex flex-wrap gap-1">
                {car.features?.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {car.features?.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{car.features.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cars Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your vehicle fleet and availability</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Car
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Cars List</CardTitle>
          <CardDescription className="text-sm">View and manage all vehicles in your fleet</CardDescription>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={contextLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={contextLoading} className="flex-1 sm:flex-none bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {contextLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">{searchTerm ? "No cars match your search" : "No cars available"}</p>
            </div>
          ) : viewMode === "grid" ? (
            <GridView />
          ) : (
            /* Made table responsive with horizontal scroll on mobile */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Model</TableHead>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Price/Day</TableHead>
                    <TableHead className="min-w-[120px]">Availability</TableHead>
                    <TableHead className="min-w-[150px]">Features</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map((car) => (
                    <motion.tr
                      key={car._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group"
                    >
                      <TableCell className="font-medium">{car.model}</TableCell>
                      <TableCell>{car.type}</TableCell>
                      <TableCell>₹{car.pricePerDay}</TableCell>
                      <TableCell>
                        <Badge variant={car.available ? "default" : "secondary"}>
                          {car.available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {car.features?.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {car.features?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{car.features.length - 2}
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
                                setEditingCar(car)
                                setIsFormOpen(true)
                              }}
                              disabled={localLoading}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingCar(car)}
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
          )}
        </CardContent>
      </Card>

      <CarForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingCar(null)
        }}
        car={editingCar}
        onSubmit={handleFormSubmit}
        isLoading={localLoading}
      />

      <DeleteConfirmDialog
        open={!!deletingCar}
        onOpenChange={() => setDeletingCar(null)}
        onConfirm={() => handleDelete(deletingCar?._id)}
        title="Delete Car"
        description={`Are you sure you want to delete ${deletingCar?.model}? This action cannot be undone.`}
        isLoading={localLoading}
      />
    </div>
  )
}
