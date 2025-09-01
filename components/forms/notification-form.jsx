"use client"

import React from "react"
import { useState, useMemo, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserService } from "@/components/apiService" // Import your user service
import { useToast } from "@/hooks/use-toast" // Using your custom toast hook
import { useUjjain } from "../context/UjjainContext"

export default function NotificationFormModal({ open, onOpenChange, users = [], defaults = null }) {
  const [target, setTarget] = useState(defaults?.target || "all-users")
  const [userId, setUserId] = useState(defaults?.userId || "")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast() // Initialize the toast hook

  const {addUserNotification} = useUjjain()
  const selectableUsers = useMemo(() => {
    return users
  }, [users])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTarget("all-users")
      setUserId("")
      setTitle("")
      setMessage("")
    }
  }, [open])

  // Keep defaults synced when modal opens for a specific user
  useEffect(() => {
    if (open && defaults) {
      setTarget(defaults.target || "user")
      setUserId(defaults.userId || "")
    }
  }, [open, defaults])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Message is required",
        variant: "destructive"
      })
      return
    }

    if (target === "user" && !userId) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      // Handle different target types
      if (target === "user") {
        // Send notification to specific user
        console.log(userId);
        
        await addUserNotification(userId,{
          title: title.trim() || "Notification",
          message: message.trim()
        }) 
        toast({
          title: "Success",
          description: "Notification sent to user"
        })
      } else if (target === "all-users") {
        // Send notification to all users
        const userPromises = users
          .filter(user => user.role === "user")
          .map(user => 
            UserService.addNotification(user._id, {
              title: title.trim() || "System Notification",
              message: message.trim()
            }).catch(error => {
              console.error(`Failed to send notification to user ${user._id}:`, error)
              return null
            })
          )
        
        await Promise.all(userPromises)
        toast({
          title: "Success",
          description: "Notification sent to all users"
        })
      } else if (target === "all-drivers") {
        // Send notification to all drivers
        const driverPromises = users
          .filter(user => user.role === "driver")
          .map(user => 
            UserService.addNotification(user._id, {
              title: title.trim() || "Driver Notification",
              message: message.trim()
            }).catch(error => {
              console.error(`Failed to send notification to driver ${user._id}:`, error)
              return null
            })
          )
        
        await Promise.all(driverPromises)
        toast({
          title: "Success",
          description: "Notification sent to all drivers"
        })
      }

      // Close the modal
      onOpenChange(false)
      
    } catch (error) {
      console.error("Error sending notification:", error)
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[95vw]">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a notification to a specific user, all users, or all drivers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Recipient</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger id="target" className="w-full">
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-users">All Users</SelectItem>
                  <SelectItem value="all-drivers">All Drivers</SelectItem>
                  <SelectItem value="user">Specific User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="normal">
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {target === "user" && (
            <div className="space-y-2">
              <Label htmlFor="userId">Select User</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger id="userId" className="w-full">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {selectableUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.fullName} ({user.email}) - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Short title for the notification" 
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message..."
              rows={5}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (target === "user" && !userId) || !message.trim()}
            >
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}