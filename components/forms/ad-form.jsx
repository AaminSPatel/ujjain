"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUjjain } from "@/components/context/UjjainContext"
import { toast } from "sonner"

export function AdForm({ ad, onClose }) {
  const { addAd, updateAd } = useUjjain()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: ad?.title || "",
    description: ad?.description || "",
    link: ad?.link || "",
    active: ad?.active ?? true,
    image: null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('link', formData.link)
      submitData.append('active', formData.active)

      if (formData.image) {
        submitData.append('image', formData.image)
      }

      if (ad) {
        await updateAd(ad._id, submitData)
        toast.success("Ad updated successfully")
      } else {
        await addAd(submitData)
        toast.success("Ad created successfully")
      }

      onClose()
    } catch (error) {
      console.error("Error saving ad:", error)
      toast.error("Failed to save ad")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{ad ? "Edit Ad" : "Create New Ad"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter ad title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter ad description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange('image', e.target.files[0])}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {ad?.image && (
              <div className="mt-2">
                <img
                  src={ad.image.url}
                  alt={ad.title}
                  className="w-32 h-20 object-cover rounded border"
                />
                <p className="text-sm text-gray-500 mt-1">Current image</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (ad ? "Update Ad" : "Create Ad")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
