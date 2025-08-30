"use client"

import React from "react"

import { useState, useMemo,useEffect } from "react"
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

export default function NotificationFormModal({ open, onOpenChange, onSubmit, users = [], defaults = null }) {
  // defaults: { target: 'user' | 'all-users' | 'all-drivers', userId?: string }
  const [target, setTarget] = useState(defaults?.target || "all-users")
  const [userId, setUserId] = useState(defaults?.userId || "")
  const [type, setType] = useState("info")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const selectableUsers = useMemo(() => {
    // If targeting drivers only (when later extended), we could filter here.
    return users
  }, [users])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { target, userId: target === "user" ? userId : null, type, title, message }
      await onSubmit?.(payload)
      onOpenChange(false)
      // reset
      setUserId("")
      setType("info")
      setTitle("")
      setMessage("")
    } finally {
      setLoading(false)
    }
  }

  // Keep defaults synced when modal opens for a specific user
  // This ensures when you click "Notify" on a row, the user is pre-selected
  useEffect(() => {
    if (open && defaults) {
      setTarget(defaults.target || "user")
      setUserId(defaults.userId || "")
    }
  }, [open, defaults])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[95vw]">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>Send a notification to a specific user, all users, or all drivers.</DialogDescription>
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
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="promo">Promotion</SelectItem>
                  <SelectItem value="system">System</SelectItem>
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
                  {selectableUsers.map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.fullName} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message..."
              rows={5}
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (target === "user" && !userId) || !message.trim()}>
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
