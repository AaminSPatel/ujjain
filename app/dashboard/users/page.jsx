"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Shield,
  Car,
  LayoutGrid,
  List,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserForm } from "@/components/forms/user-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NotificationFormModal from "@/components/forms/notification-form"

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // 'table' | 'grid'
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [notifyDefaults, setNotifyDefaults] = useState(null)

  const { removeUser, users, isLoading: contextLoading, addUser, updateUser } = useUjjain()
  const { toast } = useToast()

  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const handleDelete = async (userId) => {
    try {
      setLocalLoading(true)
      await removeUser(userId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
      setDeletingUser(null)
    }
  }

  const handleFormSubmit = async (userData) => {
    try {
      setLocalLoading(true)
      if (editingUser) {
        console.log("data in handle submit", userData)
        await updateUser(editingUser._id, userData)
        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
                console.log("data in handle submit", userData)
        await addUser(userData)
        toast({
          title: "Success",
          description: "User created successfully",
        })
      }
      setIsFormOpen(false)
      setEditingUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
    }
  }

  const handleNotifySubmit = async (payload) => {
    // Integrate your notification API here
    // payload = { target, userId, type, title, message }
    // Example: await NotificationService.send(payload)

    toast({
      title: "Notification sent",
      description:
        payload.target === "user"
          ? `Sent to user ID: ${payload.userId}`
          : `Broadcast to ${payload.target.replace("-", " ")}`,
    })
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> Admin
          </Badge>
        )
      case "driver":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Car className="h-3 w-3" /> Driver
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="h-3 w-3" /> User
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 max-w-screen ">
      {/* Header: responsive layout with actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pretty">Users Management</h1>
          <p className="text-muted-foreground">Manage all registered users and their permissions</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-md border bg-background">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-md"
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
            >
              <List className="h-4 w-4 mr-1" />
              Columns
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-md"
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Grid
            </Button>
          </div>

          {/* Notification bell */}
          <Button
            variant="outline"
            size="icon"
            aria-label="Send notification"
            onClick={() => {
              setNotifyDefaults({ target: "all-users" })
              setNotifyOpen(true)
            }}
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* Add user */}
          <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>View and manage all registered users in the system</CardDescription>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={contextLoading}
              />
            </div>
            <Button variant="outline" disabled={contextLoading} className="w-full sm:w-auto bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {contextLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No users match your search" : "No users available"}
              </p>
            </div>
          ) : viewMode === "table" ? (
            // TABLE VIEW (columns) - horizontally scrollable on mobile
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user?.profilePic?.url || "/placeholder.svg"}
                              alt={user.fullName || "User"}
                            />
                            <AvatarFallback>{(user.fullName || "U")?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            {user.isPro && (
                              <Badge variant="default" className="text-xs mt-1">
                                PRO
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{user.email}</span>
                          <span className="text-muted-foreground text-sm">{user.mobile}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.isVerified ? "default" : "secondary"}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                          {user.role === "driver" && (
                            <Badge variant={user.isAvailable ? "default" : "secondary"}>
                              {user.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingUser(user)
                                setIsFormOpen(true)
                              }}
                              disabled={localLoading}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setNotifyDefaults({ target: "user", userId: user._id })
                                setNotifyOpen(true)
                              }}
                            >
                              <Bell className="mr-2 h-4 w-4" />
                              Notify
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingUser(user)}
                              className="text-red-600"
                              disabled={localLoading}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // GRID VIEW - responsive cards
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user._id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profilePic?.url || "/placeholder.svg"} alt={user.fullName || "User"} />
                        <AvatarFallback>{(user.fullName || "U")?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.fullName}</CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Notify"
                        onClick={() => {
                          setNotifyDefaults({ target: "user", userId: user._id })
                          setNotifyOpen(true)
                        }}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="More actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingUser(user)
                              setIsFormOpen(true)
                            }}
                            disabled={localLoading}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingUser(user)}
                            className="text-red-600"
                            disabled={localLoading}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {getRoleBadge(user.role)}
                      <Badge variant={user.isVerified ? "default" : "secondary"}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                      {user.role === "driver" && (
                        <Badge variant={user.isAvailable ? "default" : "secondary"}>
                          {user.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      )}
                      {user.isPro && <Badge>PRO</Badge>}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{user.email}</div>
                      <div className="text-muted-foreground">{user.mobile}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingUser(user)
                          setIsFormOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeletingUser(user)}
                        disabled={localLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing modals */}
      <UserForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingUser(null)
        }}
        user={editingUser}
        onSubmit={handleFormSubmit}
        isLoading={localLoading}
      />

      <DeleteConfirmDialog
        open={!!deletingUser}
        onOpenChange={() => setDeletingUser(null)}
        onConfirm={() => handleDelete(deletingUser?._id)}
        title="Delete User"
        description={`Are you sure you want to delete ${deletingUser?.fullName}? This action cannot be undone.`}
        isLoading={localLoading}
      />

      {/* Notification modal */}
      <NotificationFormModal
        open={notifyOpen}
        onOpenChange={setNotifyOpen}
        onSubmit={handleNotifySubmit}
        users={filteredUsers}
        defaults={notifyDefaults}
      />
    </div>
  )
}
