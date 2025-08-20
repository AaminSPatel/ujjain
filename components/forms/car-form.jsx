/* "use client"

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
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

export function CarForm({ open, onOpenChange, car, onSubmit }) {
  const [formData, setFormData] = useState({
     model: "",
        type: "",
        pricePerDay: "",
        pricePerKm: "",
        available: true,
        features: [],
        detail: "",
        images: [],
        seats: "",
        fueltype: "",
        geartype: "",
  })
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (car) {
      setFormData({
        model: car.model || "",
        type: car.type || "",
        pricePerDay: car.pricePerDay?.toString() || "",
        pricePerKm: car.pricePerKm?.toString() || "",
        available: car.available ?? true,
        features: car.features || [],
        detail: car.detail || "",
        images: car.images || [],
        seats: car.seats?.toString() || "",
        fueltype: car.fueltype || "",
        geartype: car.geartype || "",
      })
    } else {
      setFormData({
        model: "",
        type: "",
        pricePerDay: "",
        pricePerKm: "",
        available: true,
        features: [],
        detail: "",
        images: [],
        seats: "",
        fueltype: "",
        geartype: "",
      })
    }
  }, [car, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      pricePerDay: Number.parseFloat(formData.pricePerDay),
      capacity: Number.parseInt(formData.capacity),
    })
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription>{car ? "Update car information" : "Add a new car to your fleet"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Toyota Innova"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="MUV">MUV</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per Day (₹)</Label>
              <Input
                id="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                placeholder="2500"
                required
              />
            </div><div className="space-y-2">
              <Label htmlFor="pricePerKm">Price per Km (₹)</Label>
              <Input
                id="pricePerKm"
                type="number"
                value={formData.pricePerKm}
                onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                placeholder="2500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                placeholder="7"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select
                value={formData.fueltype}
                onValueChange={(value) => setFormData({ ...formData, fueltype: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="CNG">CNG</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select
                value={formData.geartype}
                onValueChange={(value) => setFormData({ ...formData, geartype: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              placeholder="Comfortable and spacious car perfect for family trips..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
            <Label htmlFor="available">Available for booking</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{car ? "Update Car" : "Add Car"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
 */


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
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"

export function CarForm({ open, onOpenChange, car, onSubmit }) {
 const [formData, setFormData] = useState({
    model: "",
    type: "",
    pricePerDay: "",
    pricePerKm: "",
    available: true,
    features: [],
    detail: "",
    images: [],
    seats: "",
    fueltype: "",
    geartype: "",
  })
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (car) {
      setFormData({
        model: car.model || "",
        type: car.type || "",
        pricePerDay: car.pricePerDay?.toString() || "",
        pricePerKm: car.pricePerKm?.toString() || "",
        available: car.available ?? true,
        features: Array.isArray(car.features) ? car.features : [],
        detail: car.detail || "",
        images: car.images || [],
        seats: car.seats?.toString() || "",
        fueltype: car.fueltype || "",
        geartype: car.geartype || "",
      })
    } else {
      setFormData({
        model: "",
        type: "",
        pricePerDay: "",
        pricePerKm: "",
        available: true,
        features: [],
        detail: "",
        images: [],
        seats: "",
        fueltype: "",
        geartype: "",
      })
    }
  }, [car, open])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Separate existing images from new file uploads
    const existingImages = formData.images.filter(img => typeof img === 'object' && img.url);
    const newImages = formData.images.filter(img => img instanceof File);

    console.log('fetures in form', formData.features);
    
    onSubmit({
      ...formData,
      features: Array.isArray(formData.features) ? formData.features : [],
      pricePerDay: Number.parseFloat(formData.pricePerDay),
      pricePerKm: Number.parseFloat(formData.pricePerKm),
      seats: Number.parseInt(formData.seats),
      existingImages, // Keep track of existing images
      newImages,     // New files to upload
    })
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    })
  }

  // Handle image upload - preserve existing images and add new ones
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    })
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  // Helper function to get image source URL
  const getImageSrc = (img) => {
    if (typeof img === 'string') {
      return img; // Fallback for string URLs
    } else if (img instanceof File) {
      return URL.createObjectURL(img); // New file upload
    } else if (img && typeof img === 'object') {
      return img.url; // Existing image object from database
    }
    return "/placeholder.svg"; // Fallback
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription>{car ? "Update car information" : "Add a new car to your fleet"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Car Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Toyota Innova"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="MUV">MUV</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per Day (₹)</Label>
              <Input
                id="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                placeholder="2500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerKm">Price per Km (₹)</Label>
              <Input
                id="pricePerKm"
                type="number"
                value={formData.pricePerKm}
                onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                placeholder="15"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Capacity</Label>
              <Input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                placeholder="7"
                required
              />
            </div>
          </div>

          {/* Fuel & Transmission */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select
                value={formData.fueltype}
                onValueChange={(value) => setFormData({ ...formData, fueltype: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="CNG">CNG</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select
                value={formData.geartype}
                onValueChange={(value) => setFormData({ ...formData, geartype: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              placeholder="Comfortable and spacious car perfect for family trips..."
              rows={3}
            />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images">Car Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative aspect-square border rounded overflow-hidden group">
                  <img
                    src={getImageSrc(img)}
                    alt={`${img.url}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {/* Indicator for existing vs new images */}
                  {img instanceof File ? (
                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                      New
                    </div>
                  ) : (
                    <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                      Existing
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
            <Label htmlFor="available">Available for booking</Label>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{car ? "Update Car" : "Add Car"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
