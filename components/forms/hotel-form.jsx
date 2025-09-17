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
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"

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
    images: [],
    rooms: [],
  })

  // For rooms
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    features: [],
    availability: "Available",
    images: [],
  })
  const [newRoomFeature, setNewRoomFeature] = useState("")
  const [roomImagePreviews, setRoomImagePreviews] = useState([])

  const [newAmenity, setNewAmenity] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newRoomType, setNewRoomType] = useState("")
  const [imagePreviews, setImagePreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const roomFileInputRef = useRef(null)

// AND REPLACE THIS useEffect:
useEffect(() => {
  if (hotel) {
    // Convert room data to ensure proper types and filter invalid images
    const processedRooms = hotel.rooms ? hotel.rooms.map(room => ({
      ...room,
      price: room.price?.toString() || "",
      capacity: room.capacity?.toString() || "",
      // Filter out invalid images
      images: (room.images || []).filter(img => 
        img && typeof img === 'object' && img.public_id && img.url
      )
    })) : [];
    
    setFormData({
      ...hotel,
      price: hotel.price?.toString() || "",
      originalPrice: hotel.originalPrice?.toString() || "",
      rooms: processedRooms
    });
    
    setImagePreviews(
      hotel.images?.map((img) => (typeof img === "string" ? img : img.url)) || []
    );
  }
}, [hotel, open]);

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
      originalPrice: Number.parseFloat(formData.originalPrice),
      rooms: formData.rooms.map((room) => ({
        ...room,
        price: Number.parseFloat(room.price),
        capacity: Number.parseInt(room.capacity, 10),
      })),
    })
  }

  // ---------------- Room Handlers ----------------
 
const addRoom = () => {
  if (!newRoom.name || !newRoom.price) return alert("Room name & price required");
  
  // Filter out any empty image objects before adding the room
  const validImages = newRoom.images.filter(img => 
    img && (img.url || (img instanceof File))
  );
  
  setFormData({
    ...formData,
    rooms: [...formData.rooms, {
      ...newRoom,
      images: validImages
    }],
  });
  
  setNewRoom({
    name: "",
    description: "",
    price: "",
    capacity: "",
    features: [],
    availability: "Available",
    images: [],
  });
  setRoomImagePreviews([]);
};


  const removeRoom = (index) => {
    setFormData({
      ...formData,
      rooms: formData.rooms.filter((_, i) => i !== index),
    })
  }

  const addRoomFeature = () => {
    if (newRoomFeature.trim() && !newRoom.features.includes(newRoomFeature.trim())) {
      setNewRoom({
        ...newRoom,
        features: [...newRoom.features, newRoomFeature.trim()],
      })
      setNewRoomFeature("")
    }
  }

  const removeRoomFeature = (feature) => {
    setNewRoom({
      ...newRoom,
      features: newRoom.features.filter((f) => f !== feature),
    })
  }

  const handleRoomImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const newPreviews = []
    const newImages = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target.result)
        newImages.push(file)
        if (newPreviews.length === files.length) {
          setRoomImagePreviews((prev) => [...prev, ...newPreviews])
          setNewRoom((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeRoomImage = (index) => {
    setRoomImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setNewRoom((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // ---------------- Hotel Images ----------------
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const newPreviews = []
    const newImages = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target.result)
        newImages.push(file)
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews])
          setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // ---------------- Amenity / Feature / RoomType ----------------
  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] })
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
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
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
      setFormData({ ...formData, roomTypes: [...formData.roomTypes, newRoomType.trim()] })
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
          <DialogDescription>
            {hotel ? "Update hotel information" : "Add a new hotel to your listings"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hotel Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Grand Hotel"
                  required
                />
              </div>
              <div>
                <Label>Category</Label>
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
              <div>
                <Label>Price (₹/night)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="5000"
                  required
                />
              </div>
              <div>
                <Label>Original Price (₹/night)</Label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="6000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Mumbai, India"
                  required
                />
              </div>
              <div>
                <Label>Distance from City Center</Label>
                <Input
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="2 km"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your hotel..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label>Availability</Label>
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
          </div>

          {/* Hotel Images */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Hotel Images</h3>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-dashed border-2 p-4 text-center cursor-pointer rounded-lg"
            >
              <Upload className="w-6 h-6 mx-auto text-gray-400" />
              <p className="text-xs text-gray-500 mt-1">Click or drag images</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities & Features */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Amenities</h3>
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add amenity (e.g. Pool)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {amenity}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeAmenity(amenity)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Features</h3>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature (e.g. Free WiFi)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Room Types */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Room Types</h3>
            <div className="flex gap-2">
              <Input
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value)}
                placeholder="Add room type (e.g. Deluxe)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRoomType())}
              />
              <Button type="button" onClick={addRoomType} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.roomTypes.map((roomType, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  {roomType}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeRoomType(roomType)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* ✅ Rooms Section */}
          <div className="space-y-4 border p-4 rounded-lg">
            <h3 className="font-semibold text-lg">Rooms</h3>
            <p className="text-sm text-gray-500">Add individual rooms with their specific details</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Room Name</Label>
                <Input
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="Deluxe Suite"
                />
              </div>
              <div>
                <Label>Price (₹/night)</Label>
                <Input
                  type="number"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                  placeholder="2500"
                />
              </div>
              <div>
                <Label>Capacity (Guests)</Label>
                <Input
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                  placeholder="2"
                />
              </div>
              <div>
                <Label>Availability</Label>
                <Select
                  value={newRoom.availability}
                  onValueChange={(value) => setNewRoom({ ...newRoom, availability: value })}
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
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                placeholder="Spacious AC room with balcony..."
                rows={2}
              />
            </div>

            {/* Room Features */}
            <div>
              <Label>Room Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newRoomFeature}
                  onChange={(e) => setNewRoomFeature(e.target.value)}
                  placeholder="Add feature (e.g. AC)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRoomFeature())}
                />
                <Button type="button" onClick={addRoomFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newRoom.features.map((feature, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeRoomFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Room Images */}
            <div>
              <Label>Room Images</Label>
              <input
                ref={roomFileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleRoomImageUpload}
              />
              <div
                onClick={() => roomFileInputRef.current?.click()}
                className="border-dashed border-2 p-4 text-center cursor-pointer rounded-lg"
              >
                <Upload className="w-6 h-6 mx-auto text-gray-400" />
                <p className="text-xs text-gray-500 mt-1">Click or drag images</p>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {roomImagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={preview}
                      alt="Room Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeRoomImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="button" onClick={addRoom} className="w-full">
              Add Room
            </Button>

            {/* Display Added Rooms */}
            <div className="space-y-3 mt-4">
              <h4 className="font-medium">Added Rooms ({formData.rooms.length})</h4>
              {formData.rooms.map((room, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{room.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{room.price} / night • {room.capacity} guests • {room.availability}
                    </p>
                    {room.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {room.features.map((feature, j) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRoom(i)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
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