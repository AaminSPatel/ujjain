"use client"

import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const places = [
  {
    id: 1,
    name: "Mahakaleshwar Temple",
    category: "Religious",
    visits: 1250,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Kal Bhairav Temple",
    category: "Religious",
    visits: 890,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Ram Ghat",
    category: "Cultural",
    visits: 650,
    rating: 4.4,
  },
  {
    id: 4,
    name: "Vedh Shala",
    category: "Historical",
    visits: 420,
    rating: 4.2,
  },
]

export function PopularPlaces() {
  return (
    <div className="space-y-4">
      {places.map((place, index) => (
        <div key={place.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium">{place.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {place.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">{place.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{place.visits}</p>
            <p className="text-xs text-muted-foreground">visits</p>
          </div>
        </div>
      ))}
    </div>
  )
}
