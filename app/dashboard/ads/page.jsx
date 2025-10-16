"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { useUjjain } from "@/components/context/UjjainContext"
import { AdForm } from "@/components/forms/ad-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { toast } from "sonner"

export default function AdsPage() {
  const { ads, fetchAds, removeAd } = useUjjain()
  const [loading, setLoading] = useState(true)
  const [selectedAd, setSelectedAd] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adToDelete, setAdToDelete] = useState(null)

  useEffect(() => {
    const loadAds = async () => {
      try {
        await fetchAds()
      } catch (error) {
        console.error("Error loading ads:", error)
        toast.error("Failed to load ads")
      } finally {
        setLoading(false)
      }
    }

    loadAds()
  }, [fetchAds])

  const handleEdit = (ad) => {
    setSelectedAd(ad)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedAd(null)
    setIsFormOpen(true)
  }

  const handleDelete = (ad) => {
    setAdToDelete(ad)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!adToDelete) return

    try {
      await removeAd(adToDelete._id)
      toast.success("Ad deleted successfully")
      setDeleteDialogOpen(false)
      setAdToDelete(null)
    } catch (error) {
      console.error("Error deleting ad:", error)
      toast.error("Failed to delete ad")
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedAd(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading ads...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ads Management</h1>
          <p className="text-muted-foreground">Manage your advertisement campaigns</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Ad
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad._id} className="overflow-hidden">
            <div className="aspect-video relative">
              {ad.image ? (
                <img
                  src={ad.image.url}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={ad.active ? "default" : "secondary"}>
                  {ad.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{ad.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {ad.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ad.description}
                </p>
              )}

              {ad.link && (
                <div className="text-sm">
                  <span className="font-medium">Link:</span>{" "}
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {ad.link}
                  </a>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(ad.createdAt).toLocaleDateString()}
                </div>

                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(ad)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ad)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No ads found</div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Ad
          </Button>
        </div>
      )}

      {/* Ad Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AdForm ad={selectedAd} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Ad"
        description={`Are you sure you want to delete "${adToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
