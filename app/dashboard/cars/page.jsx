"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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
  const { removeCar, cars, isLoading: contextLoading ,addCar,updateCar} = useUjjain()
  const { toast } = useToast()
//console.log(cars);

  // Use context cars directly and add local loading state only for mutations
  const [localLoading, setLocalLoading] = useState(false)

  // Filter cars whenever contextCars or searchTerm changes
  useEffect(() => {
    //if (!contextCars) return
    
    const filtered = cars.filter(
      (car) =>
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.type?.toLowerCase().includes(searchTerm.toLowerCase())
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
        console.log(carData.features);
        
        await updateCar(editingCar._id,carData)
        toast({
          title: "Success",
          description: "Car updated successfully",
        })
        //console.log(carData);
        
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cars Management</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet and availability</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Car
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cars List</CardTitle>
          <CardDescription>View and manage all vehicles in your fleet</CardDescription>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cars..."
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
        </CardHeader>
        <CardContent>
          {contextLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No cars match your search" : "No cars available"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <div className="flex gap-1">
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