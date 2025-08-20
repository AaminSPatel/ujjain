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
import { LogisticsForm } from "@/components/forms/logistics-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"

export default function LogisticsPage() {
  const [filteredLogistics, setFilteredLogistics] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLogistics, setEditingLogistics] = useState(null)
  const [deletingLogistics, setDeletingLogistics] = useState(null)
  const { logistics, isLoading: contextLoading, addLogistics, updateLogistics, removeLogistics } = useUjjain()
  const { toast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    const filtered = logistics.filter(
      (logistic) =>
        logistic.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logistic.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLogistics(filtered)
  }, [logistics, searchTerm])

  const handleDelete = async (logisticsId) => {
    try {
      setLocalLoading(true)
      await removeLogistics(logisticsId)
      toast({
        title: "Success",
        description: "Logistics service deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete logistics service",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
      setDeletingLogistics(null)
    }
  }

  const handleFormSubmit = async (logisticsData) => {
    try {
      setLocalLoading(true)
      if (editingLogistics) {
        await updateLogistics(editingLogistics._id, logisticsData)
        toast({
          title: "Success",
          description: "Logistics service updated successfully",
        })
      } else {
        await addLogistics(logisticsData)
        toast({
          title: "Success",
          description: "Logistics service created successfully",
        })
      }
      setIsFormOpen(false)
      setEditingLogistics(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save logistics service",
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
          <h1 className="text-3xl font-bold tracking-tight">Logistics Management</h1>
          <p className="text-muted-foreground">Manage your logistics services and availability</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logistics Services</CardTitle>
          <CardDescription>View and manage all logistics services in your system</CardDescription>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
          ) : filteredLogistics.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No services match your search" : "No logistics services available"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogistics.map((logistic) => (
                  <motion.tr 
                    key={logistic._id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group"
                  >
                    <TableCell className="font-medium">{logistic.serviceName}</TableCell>
                    <TableCell>
                      <Badge variant="default">{logistic.serviceType}</Badge>
                    </TableCell>
                    <TableCell>₹{logistic.priceRange.min} - ₹{logistic.priceRange.max}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {logistic.coverageArea?.slice(0, 2).map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {logistic.coverageArea?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{logistic.coverageArea.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {logistic.vehicles?.slice(0, 2).map((vehicle, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {vehicle.type}
                          </Badge>
                        ))}
                        {logistic.vehicles?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{logistic.vehicles.length - 2}
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
                              setEditingLogistics(logistic)
                              setIsFormOpen(true)
                            }}
                            disabled={localLoading}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeletingLogistics(logistic)} 
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

      <LogisticsForm 
        open={isFormOpen} 
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingLogistics(null)
        }} 
        logistics={editingLogistics} 
        onSubmit={handleFormSubmit}
        isLoading={localLoading}
      />

      <DeleteConfirmDialog
        open={!!deletingLogistics}
        onOpenChange={() => setDeletingLogistics(null)}
        onConfirm={() => handleDelete(deletingLogistics?._id)}
        title="Delete Logistics Service"
        description={`Are you sure you want to delete ${deletingLogistics?.serviceName}? This action cannot be undone.`}
        isLoading={localLoading}
      />
    </div>
  )
}