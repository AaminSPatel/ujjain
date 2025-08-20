"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, User, Shield, Car } from "lucide-react"
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

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const { removeUser, users, isLoading: contextLoading, addUser, updateUser } = useUjjain()
  const { toast } = useToast()

  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm))
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
        await updateUser(editingUser._id, userData)
        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
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

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="flex items-center gap-1"><Shield className="h-3 w-3" /> Admin</Badge>
      case "driver":
        return <Badge variant="secondary" className="flex items-center gap-1"><Car className="h-3 w-3" /> Driver</Badge>
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><User className="h-3 w-3" /> User</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">Manage all registered users and their permissions</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} disabled={contextLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>View and manage all registered users in the system</CardDescription>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={contextLoading}
              />
            </div>
            <Button variant="outline" disabled={contextLoading}>
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
          ) : (
            <Table>
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
                          <AvatarImage src={user.profilePic?.url} />
                          <AvatarFallback>
                            {user.fullName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{user.fullName}</p>
                          {user.isPro && (
                            <Badge variant="default" className="text-xs mt-1">PRO</Badge>
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
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
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
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
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
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
    </div>
  )
}