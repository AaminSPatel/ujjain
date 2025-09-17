"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Grid, List, MoreHorizontal, Trash2, Star, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ReviewsPage() {
  const [filteredReviews, setFilteredReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingReview, setDeletingReview] = useState(null)
  const [viewMode, setViewMode] = useState("table") // 'table' or 'grid'
  const [ratingFilter, setRatingFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const { reviews, isLoading: contextLoading, removeReview, cars, places, hotels } = useUjjain()
  const { toast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    let filtered = reviews.filter(
      (review) =>
        review.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getReviewTarget(review)?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter))
    }

    // Apply service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter(review => review.reviewedModel === serviceFilter)
    }

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, ratingFilter, serviceFilter])

  const handleDelete = async (reviewId) => {
    try {
      setLocalLoading(true)
      await removeReview(reviewId)
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
      setDeletingReview(null)
    }
  }

  const getReviewTarget = (review) => {
    if (review?.reviewedModel === "Car") {
      return review?.reviewedItem?.model || "Car"
    } else if (review?.reviewedModel === "Hotel") {
      return review?.reviewedItem?.name || "Hotel"
    } else if (review?.reviewedModel === "Logistics") {
      return review?.reviewedItem?.serviceName || "Logistics Service"
    } else if (review?.reviewedModel === "Driver") {
      return review?.reviewedItem?.fullName || "Driver"
    }
    return "Unknown"
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="space-y-6 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reviews Management</h1>
          <p className="text-muted-foreground mt-1">View and manage customer reviews</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="h-10 w-10 p-0 flex items-center justify-center"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-10 w-10 p-0 flex items-center justify-center"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>All customer feedback and ratings</CardDescription>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={contextLoading}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Hotel">Hotels</SelectItem>
                  <SelectItem value="Car">Cars</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Driver">Drivers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {contextLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm || ratingFilter !== "all" || serviceFilter !== "all" 
                  ? "No reviews match your search criteria" 
                  : "No reviews available"}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">Target</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Service</TableHead>
                    <TableHead className="font-semibold">Rating</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">Comment</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredReviews.map((review) => (
                      <motion.tr 
                        key={review._id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group border-b"
                        layout
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="hidden sm:flex">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium capitalize line-clamp-1">{review?.user?.fullName}</p>
                              <p className="text-xs text-muted-foreground sm:hidden">{getReviewTarget(review)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{getReviewTarget(review)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{review.reviewedModel}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{review.rating}</span>
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-xs truncate">{review.comment}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
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
                                onClick={() => setDeletingReview(review)} 
                                className="text-red-600 focus:text-red-600"
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
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredReviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg capitalize line-clamp-1">
                              {review?.user?.fullName}
                            </CardTitle>
                            <CardDescription className="line-clamp-1">
                              {getReviewTarget(review)}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{review.reviewedModel}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-medium text-sm">{review.rating}/5</span>
                        </div>
                        
                        <p className="text-sm mb-4 line-clamp-3">{review.comment}</p>
                        
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500"
                            onClick={() => setDeletingReview(review)}
                            disabled={localLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deletingReview}
        onOpenChange={() => setDeletingReview(null)}
        onConfirm={() => handleDelete(deletingReview?._id)}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        isLoading={localLoading}
      />
    </div>
  )
}