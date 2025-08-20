"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BlogForm } from "@/components/forms/blog-form"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [deletingBlog, setDeletingBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { apiCall } = useUjjain()
  const { toast } = useToast()

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredBlogs(filtered)
  }, [blogs, searchTerm])

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      const response = await apiCall("/blogs", "GET")
      setBlogs(response.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (blogId) => {
    try {
      await apiCall(`/blogs/${blogId}`, "DELETE")
      setBlogs(blogs.filter((blog) => blog._id !== blogId))
      toast({
        title: "Success",
        description: "Blog deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      })
    }
    setDeletingBlog(null)
  }

  const handleFormSubmit = async (blogData) => {
    try {
      if (editingBlog) {
        const response = await apiCall(`/blogs/${editingBlog._id}`, "PUT", blogData)
        setBlogs(blogs.map((blog) => (blog._id === editingBlog._id ? response.data : blog)))
        toast({
          title: "Success",
          description: "Blog updated successfully",
        })
      } else {
        const response = await apiCall("/blogs", "POST", blogData)
        setBlogs([...blogs, response.data])
        toast({
          title: "Success",
          description: "Blog created successfully",
        })
      }
      setIsFormOpen(false)
      setEditingBlog(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs Management</h1>
          <p className="text-muted-foreground">Create and manage travel blog posts</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blogs List</CardTitle>
          <CardDescription>View and manage all blog posts</CardDescription>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <motion.tr key={blog._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>{formatDate(blog.createdAt || new Date())}</TableCell>
                    <TableCell>
                      <Badge variant={blog.published ? "default" : "secondary"}>
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {blog.tags?.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingBlog(blog)
                              setIsFormOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingBlog(blog)} className="text-red-600">
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

      <BlogForm open={isFormOpen} onOpenChange={setIsFormOpen} blog={editingBlog} onSubmit={handleFormSubmit} />

      <DeleteConfirmDialog
        open={!!deletingBlog}
        onOpenChange={() => setDeletingBlog(null)}
        onConfirm={() => handleDelete(deletingBlog?._id)}
        title="Delete Blog"
        description={`Are you sure you want to delete "${deletingBlog?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
