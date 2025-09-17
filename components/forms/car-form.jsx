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
import { X, Plus, Upload } from "lucide-react"

export function CarForm({ open, onOpenChange, car, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    model: "",
    type: "Sedan",
    pricePerDay: "",
    description: "",
    features: [],
    availability: true,
    images: [],
  })
  const [newFeature, setNewFeature] = useState("")
  const [imagePreviews, setImagePreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (car) {
      setFormData({
        model: car.model || "",
        type: car.type || "Sedan",
        pricePerDay: car.pricePerDay?.toString() || "",
        description: car.description || "",
        features: car.features || [],
        availability: car.availability ?? true,
        images: car.images || [],
      })

      if (car.images && car.images.length > 0) {
        setImagePreviews(car.images.map(img => img.url || img))
      } else {
        setImagePreviews([])
      }
    } else {
      setFormData({
        model: "",
        type: "Sedan",
        pricePerDay: "",
        description: "",
        features: [],
        availability: true,
        images: [],
      })
      setImagePreviews([])
    }
  }, [car, open])

  const handleSubmit = (e) => {
    e.preventDefault()

    const submissionData = {
      ...formData,
      pricePerDay: Number(formData.pricePerDay),
    }

    onSubmit(submissionData)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    processImageFiles(files)
  }

  const processImageFiles = (files) => {
    const validFiles = []
    const newPreviews = []
    
    files.forEach(file => {
      if (!file.type.match("image.*")) {
        alert("Please select only image files (JPEG, PNG, GIF, etc.)")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} size should be less than 5MB`)
        return
      }

      validFiles.push(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target.result)
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
    
    if (validFiles.length) {
      setFormData({ ...formData, images: [...formData.images, ...validFiles] })
    }
  }

  const removeImage = (index) => {
    const newImages = [...formData.images]
    const newPreviews = [...imagePreviews]
    
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setFormData({ ...formData, images: newImages })
    setImagePreviews(newPreviews)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length) {
      processImageFiles(files)
    }
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
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{car ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription className="text-sm">
            {car ? "Update car information" : "Add a new vehicle to your fleet"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="images">Car Images</Label>
            <div
              className={`flex items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 w-full h-full p-2 overflow-y-auto">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-5">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                </div>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
                multiple
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Toyota Camry"
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
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Economy">Economy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Comfortable and reliable car for your travel needs..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                className="flex-1"
              />
              <Button type="button" onClick={addFeature} size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add
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

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Processing..." : car ? "Update Car" : "Add Car"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}