"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Check, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUjjain } from "./context/UjjainContext"
import { useToast } from "@/hooks/use-toast"

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)
  const { user, addUserNotification, markAllAsRead, markAsRead, getUserNotifications } = useUjjain()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Load notifications when dropdown opens
  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [isOpen, user])

  const loadNotifications = async () => {
    if (!user?._id) return

    try {
      setIsLoading(true)
      // Fetch fresh notifications from server
      const response = await getUserNotifications(user._id)
      console.log('notifications from server', response.data.notifications);

      setNotifications(response.data.notifications?.reverse() || [])
    } catch (error) {
      console.error("Error loading notifications:", error)
      // Fallback to user.notifications if API fails
      setNotifications(user?.notifications?.reverse() || [])
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    if (!user?._id) return
    
    try {
      await markAsRead(user._id, notificationId)
      // Update local state
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ))
      toast({
        title: "Success",
        description: "Notification marked as read"
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?._id) return
    
    try {
      await markAllAsRead(user._id)
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast({
        title: "Success",
        description: "All notifications marked as read"
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      })
    }
  }

  const handleClearAll = async () => {
    if (!user?._id) return
    
    try {
      // You'll need to implement clearAllNotifications in your context
      // For now, we'll just clear the local state
      setNotifications([])
      toast({
        title: "Success",
        description: "Notifications cleared"
      })
    } catch (error) {
      console.error("Error clearing notifications:", error)
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive"
      })
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative "
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5  w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute -right-14 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-8 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
           {/*    {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-8 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )} */}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.reverse().map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">
                          {notification.title || "Notification"}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()} •{" "}
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="h-6 w-6 p-0 ml-2"
                          title="Mark as read"
                        >
                          <EyeOff className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}