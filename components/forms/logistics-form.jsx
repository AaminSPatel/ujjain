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

export function LogisticsForm({ open, onOpenChange, logistics, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceType: "Freight",
    description: "",
    coverageArea: [],
    vehicles: [],
    priceRange: { min: 0, max: 0 },
    features: [],
    availability: true,
    image: null
  })
  const [newCoverageArea, setNewCoverageArea] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newVehicle, setNewVehicle] = useState({
    type: "",
    capacity: "",
    pricePerKm: ""
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (logistics) {
      setFormData({
        serviceName: logistics.serviceName || "",
        serviceType: logistics.serviceType || "Freight",
        description: logistics.description || "",
        coverageArea: logistics.coverageArea || [],
        vehicles: logistics.vehicles || [],
        priceRange: logistics.priceRange || { min: 0, max: 0 },
        features: logistics.features || [],
        availability: logistics.availability ?? true,
        image: logistics.image.url || null
      })
      
      // Set image preview if editing existing logistics with image
      if (logistics.image) {
        setImagePreview(logistics.image.url)
      }
    } else {
      setFormData({
        serviceName: "",
        serviceType: "Freight",
        description: "",
        coverageArea: [],
        vehicles: [],
        priceRange: { min: 0, max: 0 },
        features: [],
        availability: true,
        image: null
      })
      setImagePreview(null)
    }
  }, [logistics, open])

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      priceRange: {
        min: Number(formData.priceRange.min),
        max: Number(formData.priceRange.max)
      },
      vehicles: formData.vehicles.map(vehicle => ({
        type: vehicle.type,
        capacity: vehicle.capacity,
        pricePerKm: Number(vehicle.pricePerKm)
      }))
    };

    console.log("Submitting:", submissionData);
    onSubmit(submissionData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    processImageFile(file);
  };

  const processImageFile = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert("Please select an image file (JPEG, PNG, GIF, etc.)");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setFormData({ ...formData, image: file });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    
    const files = e.dataTransfer.files;
    if (files.length) {
      processImageFile(files[0]);
    }
  };

  const addCoverageArea = () => {
    if (newCoverageArea.trim() && !formData.coverageArea.includes(newCoverageArea.trim())) {
      setFormData({
        ...formData,
        coverageArea: [...formData.coverageArea, newCoverageArea.trim()],
      })
      setNewCoverageArea("")
    }
  }

  const removeCoverageArea = (area) => {
    setFormData({
      ...formData,
      coverageArea: formData.coverageArea.filter((a) => a !== area),
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

  const addVehicle = () => {
    if (newVehicle.type.trim() && newVehicle.capacity.trim() && newVehicle.pricePerKm.trim()) {
      setFormData({
        ...formData,
        vehicles: [...formData.vehicles, { ...newVehicle }],
      })
      setNewVehicle({
        type: "",
        capacity: "",
        pricePerKm: ""
      })
    }
  }

  const removeVehicle = (index) => {
    setFormData({
      ...formData,
      vehicles: formData.vehicles.filter((_, i) => i !== index),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{logistics ? "Edit Logistics Service" : "Add New Logistics Service"}</DialogTitle>
          <DialogDescription>
            {logistics ? "Update logistics service information" : "Add a new logistics service to your offerings"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="image">Service Image</Label>
            <div 
              className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-full p-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="object-contain w-full h-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {e.stopPropagation(); removeImage();}}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-5">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
              <input
                id="image-upload"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                placeholder="Express Delivery"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Freight">Freight</SelectItem>
                  <SelectItem value="Parcel">Parcel</SelectItem>
                  <SelectItem value="Moving">Moving</SelectItem>
                  <SelectItem value="Heavy Load">Heavy Load</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Reliable and fast logistics service for all your needs..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Coverage Areas</Label>
            <div className="flex gap-2">
              <Input
                value={newCoverageArea}
                onChange={(e) => setNewCoverageArea(e.target.value)}
                placeholder="Add a coverage area"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCoverageArea())}
              />
              <Button type="button" onClick={addCoverageArea} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.coverageArea.map((area, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {area}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCoverageArea(area)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vehicles</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Vehicle type"
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
              />
              <Input
                placeholder="Capacity"
                value={newVehicle.capacity}
                onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
              />
              <Input
                placeholder="Price per Km (₹)"
                type="number"
                value={newVehicle.pricePerKm}
                onChange={(e) => setNewVehicle({ ...newVehicle, pricePerKm: e.target.value })}
              />
            </div>
            <Button type="button" onClick={addVehicle} size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
            <div className="space-y-2 mt-2">
              {formData.vehicles.map((vehicle, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1 font-medium">{vehicle.type}</span>
                  <span className="flex-1 text-sm">{vehicle.capacity}</span>
                  <span className="flex-1 text-sm">₹{vehicle.pricePerKm}/km</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicle(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Minimum Price (₹)</Label>
              <Input
                id="minPrice"
                type="number"
                value={formData.priceRange.min}
                onChange={(e) => setFormData({
                  ...formData,
                  priceRange: { ...formData.priceRange, min: e.target.value }
                })}
                placeholder="500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Maximum Price (₹)</Label>
              <Input
                id="maxPrice"
                type="number"
                value={formData.priceRange.max}
                onChange={(e) => setFormData({
                  ...formData,
                  priceRange: { ...formData.priceRange, max: e.target.value }
                })}
                placeholder="5000"
                required
              />
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

          <div className="flex items-center space-x-2">
            <Switch
              id="availability"
              checked={formData.availability}
              onCheckedChange={(checked) => setFormData({ ...formData, availability: checked })}
            />
            <Label htmlFor="availability">Available for booking</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : logistics ? "Update Service" : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}