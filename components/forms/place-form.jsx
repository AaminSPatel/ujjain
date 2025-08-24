"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PlaceForm({ open, onOpenChange, place, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    rating: 0,
    isActive: true,
    images: [],
    openingHours: "",
    entryFee: 0,
    bestTimeToVisit: "",
    cleaness: 0,
    trips: 0,
    visitors: 0,
    price: 0,
  })

  const [newImages, setNewImages] = useState([])

  useEffect(() => {
    if (place) {
      setFormData({
        title: place.title || "",
        category: place.category || "",
        location: place.location || "",
        description: place.description || "",
        rating: place?.rating?.toString() || "0",
        isActive: place?.isActive ?? true,
        images: place.images || [],
        openingHours: place?.openingHours || "",
        entryFee: place?.entryFee?.toString() || "0",
        bestTimeToVisit: place?.bestTimeToVisit || "",
        cleaness: place?.cleaness?.toString() || "0",
        trips: place?.trips?.toString() || "0",
        visitors: place?.visitors?.toString() || "0",
        price: place?.price?.toString() || "0",
      })
      setNewImages([])
    } else {
      setFormData({
        title: "",
        category: "",
        location: "",
        description: "",
        rating: "0",
        isActive: true,
        images: [],
        openingHours: "",
        entryFee: "0",
        bestTimeToVisit: "",
        cleaness: "0",
        trips: "0",
        visitors: "0",
        price: "0",
      })
      setNewImages([])
    }
  }, [place, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      rating: formData.rating ? Number.parseFloat(formData.rating) : 0,
      entryFee: formData.entryFee ? Number.parseFloat(formData.entryFee) : 0,
      cleaness: formData.cleaness ? Number.parseFloat(formData.cleaness) : 0,
      trips: formData.trips ? Number.parseFloat(formData.trips) : 0,
      visitors: formData.visitors ? Number.parseFloat(formData.visitors) : 0,
      price: formData.price ? Number.parseFloat(formData.price) : 0,
      images: newImages,
    })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files])
    }
    e.target.value = ""
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const getImageUrl = (image) => {
    if (typeof image === "string") return image
    if (image instanceof File) return URL.createObjectURL(image)
    if (image && typeof image === "object") return image.url
    return "/placeholder.svg"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl m overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{place ? "Edit Place" : "Add New Place"}</DialogTitle>
          <DialogDescription className="text-sm">
            {place ? "Update place information" : "Add a new tourist destination"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Mahakaleshwar Temple"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Religious">Religious</SelectItem>
                  <SelectItem value="Historical">Historical</SelectItem>
                  <SelectItem value="Natural">Natural</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ujjain, Madhya Pradesh"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the place, its significance, and what visitors can expect..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("images").click()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Upload multiple images (JPEG, PNG, WebP)</p>
            </div>

            {(formData.images.length > 0 || newImages.length > 0) && (
              <div className="space-y-3">
                {formData.images.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Existing Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <img
                            src={getImageUrl(image) || "/placeholder.svg"}
                            alt={`Existing ${index}`}
                            className="w-full h-16 sm:h-20 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                            Existing
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newImages.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">New Images to Upload</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {newImages.map((image, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`New ${index}`}
                            className="w-full h-16 sm:h-20 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeNewImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <Badge variant="default" className="absolute bottom-1 left-1 text-xs">
                            New
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                placeholder="4.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee (₹)</Label>
              <Input
                id="entryFee"
                type="number"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitors">Visitors</Label>
              <Input
                id="visitors"
                type="number"
                value={formData.visitors}
                onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trips">Trips</Label>
              <Input
                id="trips"
                type="number"
                value={formData.trips}
                onChange={(e) => setFormData({ ...formData, trips: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cleaness">Cleanliness</Label>
              <Input
                id="cleaness"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.cleaness}
                onChange={(e) => setFormData({ ...formData, cleaness: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bestTimeToVisit">Best Time</Label>
              <Input
                id="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                placeholder="October to March"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Input
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="6:00 AM - 10:00 PM"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active (visible to users)</Label>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {place ? "Update Place" : "Add Place"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
