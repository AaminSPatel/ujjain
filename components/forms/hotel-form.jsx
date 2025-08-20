"use client"

import { useState, useEffect, useRef } from "react"
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
import { X, Plus, Upload, ImageIcon } from "lucide-react"

export function HotelForm({ open, onOpenChange, hotel, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "luxury",
    price: "",
    originalPrice: "",
    location: "",
    distance: "",
    amenities: [],
    features: [],
    description: "",
    availability: "Available",
    roomTypes: [],
    images: [] // Added images array
  })
  const [newAmenity, setNewAmenity] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newRoomType, setNewRoomType] = useState("")
  const [imagePreviews, setImagePreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        category: hotel.category || "luxury",
        price: hotel.price?.toString() || "",
        originalPrice: hotel.originalPrice?.toString() || "",
        location: hotel.location || "",
        distance: hotel.distance || "",
        amenities: hotel.amenities || [],
        features: hotel.features || [],
        description: hotel.description || "",
        availability: hotel.availability || "Available",
        roomTypes: hotel.roomTypes || [],
        images: hotel.images || []
      })
      
      // Set image previews if editing existing hotel with images
      if (hotel.images && hotel.images.length > 0) {
        setImagePreviews(hotel.images.map(img => typeof img === 'string' ? img : img.url))
      }
    } else {
      setFormData({
        name: "",
        category: "luxury",
        price: "",
        originalPrice: "",
        location: "",
        distance: "",
        amenities: [],
        features: [],
        description: "",
        availability: "Available",
        roomTypes: [],
        images: []
      })
      setImagePreviews([])
    }
  }, [hotel, open])

  const handleSubmit = (e) => {
    console.log('add hotel clicked');
    
    e.preventDefault()
    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
      originalPrice: Number.parseFloat(formData.originalPrice),
    })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    processImageFiles(files);
  };

  const processImageFiles = (files) => {
    const validFiles = files.filter(file => {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        alert(`Skipping ${file.name}: Only image files are allowed`);
        return false;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Skipping ${file.name}: Image size should be less than 5MB`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Create previews
    const newPreviews = [];
    const newImages = [];
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        newImages.push(file);
        
        // When all files are processed
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, ...newImages] 
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      processImageFiles(files);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      })
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
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

  const addRoomType = () => {
    if (newRoomType.trim() && !formData.roomTypes.includes(newRoomType.trim())) {
      setFormData({
        ...formData,
        roomTypes: [...formData.roomTypes, newRoomType.trim()],
      })
      setNewRoomType("")
    }
  }

  const removeRoomType = (roomType) => {
    setFormData({
      ...formData,
      roomTypes: formData.roomTypes.filter((r) => r !== roomType),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
          <DialogDescription>{hotel ? "Update hotel information" : "Add a new hotel to your listings"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="images">Hotel Images</Label>
            <div 
              className={`flex items-center justify-center w-full min-h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 p-2 w-full">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {e.stopPropagation(); removeImage(index);}}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-5">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                </div>
              )}
              <input
                id="images"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </div>
            <p className="text-xs text-gray-500">
              {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Hotel Mahakal Palace"
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
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="boutique">Boutique</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Current Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="3500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₹)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="4200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Near Mahakaleshwar Temple"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distance from Landmark</Label>
              <Input
                id="distance"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="0.2 km from temple"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Luxury hotel with stunning temple views and premium amenities..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add an amenity"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeAmenity(amenity)} />
                </Badge>
              ))}
            </div>
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

          <div className="space-y-2">
            <Label>Room Types</Label>
            <div className="flex gap-2">
              <Input
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value)}
                placeholder="Add a room type"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRoomType())}
              />
              <Button type="button" onClick={addRoomType} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.roomTypes.map((roomType, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {roomType}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeRoomType(roomType)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) => setFormData({ ...formData, availability: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Sold Out">Sold Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : hotel ? "Update Hotel" : "Add Hotel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}