import { useState, useEffect } from "react";
import { Star, Loader2, Car, Hotel, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ReviewService } from "@/components/apiService";

const ReviewForm = ({ 
  entityType, 
  entityId, 
  driverId, 
  existingReview, 
  onSuccess, 
  onCancel 
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [selectedEntityType, setSelectedEntityType] = useState(entityType || "");
  const [selectedEntityId, setSelectedEntityId] = useState(entityId || "");
  const [selectedDriverId, setSelectedDriverId] = useState(driverId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  // Available entities for selection (would typically come from props or API)
  const [availableEntities, setAvailableEntities] = useState({
    Car: [],
    Hotel: [],
    Logistics: [],
    Driver: []
  });

  useEffect(() => {
    // Load available entities based on type
    // This would typically be an API call
    if (selectedEntityType) {
      // fetchEntities(selectedEntityType);
    }
  }, [selectedEntityType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEntityType || !selectedEntityId || !rating || !comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedEntityType === "Driver" && !selectedDriverId) {
      toast({
        title: "Error",
        description: "Please select a driver",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
        reviewedItem: selectedEntityId,
        reviewedModel: selectedEntityType,
        ...(selectedEntityType === "Driver" && { driver: selectedDriverId })
      };

      let result;
      if (existingReview) {
        console.log('reviewData updating', reviewData);
        result = await ReviewService.update(existingReview._id, reviewData);
        toast({
          title: "Success",
          description: "Review updated successfully",
          className: "bg-amber-500 text-white"
        });
        setRating(0)
        setComment('')
        
      } else {
        console.log('reviewData creating', reviewData);
        
        result = await ReviewService.create(reviewData);
        toast({
          title: "Success",
          description: "Review submitted successfully",
          className: "bg-amber-500 text-white"
        });
      }

      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEntityIcon = (type) => {
    switch (type) {
      case "Car": return <Car className="h-4 w-4" />;
      case "Hotel": return <Hotel className="h-4 w-4" />;
      case "Logistics": return <Truck className="h-4 w-4" />;
      case "Driver": return <User className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg  p-6">
      <h2 className="text-2xl font-bold text-black mb-6">
        {existingReview ? "Edit Review" : "Write a Review"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entity Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="entityType" className="text-black">
            What are you reviewing?
          </Label>
          <Select 
            value={selectedEntityType} 
            onValueChange={setSelectedEntityType}
            disabled={!!entityType} // Disable if entityType is provided as prop
          >
            <SelectTrigger id="entityType" className="bg-white border-black text-black">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Car">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>Car</span>
                </div>
              </SelectItem>
              <SelectItem value="Hotel">
                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4" />
                  <span>Hotel</span>
                </div>
              </SelectItem>
              <SelectItem value="Logistics">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Logistics Service</span>
                </div>
              </SelectItem>
              <SelectItem value="Driver">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Driver</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Entity Selection */}
        {selectedEntityType && !entityId && (
          <div className="space-y-2">
            <Label htmlFor="entityId" className="text-black">
              Select {selectedEntityType}
            </Label>
            <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
              <SelectTrigger id="entityId" className="bg-white border-black text-black">
                <SelectValue placeholder={`Choose a ${selectedEntityType}`} />
              </SelectTrigger>
              <SelectContent>
                {availableEntities[selectedEntityType]?.map((entity) => (
                  <SelectItem key={entity._id} value={entity._id}>
                    <div className="flex items-center gap-2">
                      {renderEntityIcon(selectedEntityType)}
                      <span>{entity.name || entity.title || entity.model}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Driver Selection (for driver reviews) */}
        {selectedEntityType === "Driver" && !driverId && (
          <div className="space-y-2">
            <Label htmlFor="driverId" className="text-black">
              Select Driver
            </Label>
            <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
              <SelectTrigger id="driverId" className="bg-white border-black text-black">
                <SelectValue placeholder="Choose a driver" />
              </SelectTrigger>
              <SelectContent>
                {availableEntities.Driver?.map((driver) => (
                  <SelectItem key={driver._id} value={driver._id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{driver.fullName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Star Rating */}
        <div className="space-y-2">
          <Label className="text-black">Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-500 text-amber-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment" className="text-black">
            Your Review
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="bg-white border-black text-black resize-none"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !rating || !comment.trim()}
            className="bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {existingReview ? "Updating..." : "Submitting..."}
              </>
            ) : existingReview ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;