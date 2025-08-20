"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "Rahul Sharma",
    action: "booked Toyota Innova",
    time: "2 hours ago",
    amount: "₹7,500",
  },
  {
    id: 2,
    user: "Priya Patel",
    action: "reviewed Mahakaleshwar Temple",
    time: "4 hours ago",
    rating: "5 stars",
  },
  {
    id: 3,
    user: "Amit Kumar",
    action: "cancelled booking",
    time: "6 hours ago",
    amount: "₹3,000",
  },
  {
    id: 4,
    user: "Sneha Singh",
    action: "booked Maruti Swift",
    time: "8 hours ago",
    amount: "₹4,500",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{activity.amount || activity.rating}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

