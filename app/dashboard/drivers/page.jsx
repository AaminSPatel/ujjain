"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"
import { List, Grid2x2, Star, Wallet2, Car, Send, Bell, CalendarDays } from "lucide-react"
import { useUjjain } from "@/components/context/UjjainContext"

export default function AdminDriversPage() {
  const [view, setView] = useState("grid")
  const [query, setQuery] = useState("")
   const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const [bookingId, setBookingId] = useState("")
const [bookingDetails, setBookingDetails] = useState(null)
const [selectedDriverId, setSelectedDriverId] = useState("")

const {users} = useUjjain()
// Mock function to fetch booking details - replace with your actual API call
const fetchBookingDetails = async () => {
  if (!bookingId) return
  
  try {
    // This would be your actual API call in a real application
    // const details = await bookingService.getBookingById(bookingId)
    
    // Mock data for demonstration
    const mockBookingDetails = {
      id: bookingId,
      serviceType: "Cab",
      pickup: "123 Main Street, City Center",
      drop: "456 Park Avenue, Downtown",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      fare: 450,
      status: "pending"
    }
    
    setBookingDetails(mockBookingDetails)
  } catch (error) {
    console.error("Error fetching booking details:", error)
    // You might want to show an error toast here
  }
}

const assignBookingToDriver = async () => {
  if (!bookingDetails || !selectedDriverId) return
  
  try {
    // This would be your actual API call in a real application
    // await bookingService.assignBookingToDriver(bookingDetails.id, selectedDriverId)
    
    console.log(`Assigned booking ${bookingDetails.id} to driver ${selectedDriverId}`)
    
    // Show success message
    alert(`Booking successfully assigned to driver!`)
    
    // Clear the form
    clearSelection()
  } catch (error) {
    console.error("Error assigning booking:", error)
    // You might want to show an error toast here
  }
}

const clearSelection = () => {
  setBookingId("")
  setBookingDetails(null)
  setSelectedDriverId("")
}

  const [driverStats, setDriverStats] = useState({
    activeDrivers: 0,
    pendingApprovals: 0
  })
  //const { allUsers } = useUjjain()
   useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
       // const userData = await UserService.getAllUsers()
        setAllUsers(users)
        //console.log('userData',userData.data.users);
        
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
if(users.length){

  fetchUsers()
}
  }, [users])
  // Filter drivers from all users
  const drivers = useMemo(() => {
    if (!allUsers) return []
    return allUsers.filter(user => user.role === "driver")
  }, [allUsers])
  
  // Calculate driver statistics
  useEffect(() => {
    if (drivers.length) {
      const activeDrivers = drivers.filter(driver => 
        driver.isActive && driver.isVerified
      ).length 
      const allDrivers=drivers.length;
      const pendingApprovals = drivers.filter(driver => 
        !driver.isVerified || !driver.driverLicense?.number
      ).length
      
      setDriverStats({
        allDrivers,
        activeDrivers,
        pendingApprovals
      })
    }
  }, [drivers])
  
  // Generate chart data for weekly bookings (mock data for now)
  const kpiData = [
    { name: "Mon", bookings: 82 },
    { name: "Tue", bookings: 95 },
    { name: "Wed", bookings: 88 },
    { name: "Thu", bookings: 102 },
    { name: "Fri", bookings: 120 },
    { name: "Sat", bookings: 140 },
    { name: "Sun", bookings: 110 },
  ]
  
  // Filter drivers based on search query
  const filteredDrivers = useMemo(() => {
    const q = query.toLowerCase()
    return drivers.filter(
      (d) => 
        d.fullName?.toLowerCase().includes(q) || 
        d._id?.toLowerCase().includes(q) || 
        d.address?.city?.toLowerCase().includes(q)
    )
  }, [query, drivers])

  return (
    <main className=" md:p-6 sm:w-auto w-80">
      <div className="mx-auto w-full max-w-screen space-y-4 overflow-hidden">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-pretty text-xl font-semibold md:text-2xl">Drivers Management</h1>
            <p className="text-sm text-muted-foreground">Manage drivers, assign bookings, and send notifications</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border p-1">
              <Button size="sm" variant={view === "grid" ? "default" : "ghost"} onClick={() => setView("grid")}>
                <Grid2x2 className="mr-2 h-4 w-4" /> Grid
              </Button>
              <Button size="sm" variant={view === "table" ? "default" : "ghost"} onClick={() => setView("table")}>
                <List className="mr-2 h-4 w-4" /> Table
              </Button>
            </div>
            <Input
              placeholder="Search drivers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className='w-80 sm:w-auto'>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Drivers</CardTitle>
              <CardDescription>Live today</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{driverStats.allDrivers}</CardContent>
          </Card>
          <Card className='w-80 sm:w-auto'>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active Drivers</CardTitle>
              <CardDescription>Live today</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{driverStats.activeDrivers}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pending Approvals</CardTitle>
              <CardDescription>Docs & onboarding</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-amber-500">{driverStats.pendingApprovals}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Bookings Today</CardTitle>
              <CardDescription>Real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ bookings: { label: "Bookings", color: "hsl(var(--chart-1))" } }}
                className="h-[120px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
        </div>

        {/* Drivers list */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <Card key={driver._id} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src={driver.profilePic?.url || "/placeholder.svg"} alt={`${driver.fullName} avatar`} />
                    <AvatarFallback>{driver.fullName?.slice(0, 2).toUpperCase() || "DR"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{driver.fullName || "Driver"}</CardTitle>
                    <CardDescription>
                      {driver._id} • {driver?.address?.city || "Unknown City"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" /> {driver.driverRating || 0}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Car className="h-4 w-4" /> {driver.vehicleInfo ? `${driver?.vehicleInfo?.make} ${driver?.vehicleInfo?.model}` : "No vehicle"}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Wallet2 className="h-4 w-4" /> ₹{(driver?.wallet?.balance || 0).toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary">
                      Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      Bookings
                    </Button>
                    <Button size="sm">Message</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="[&_th]:px-3 [&_th]:py-2">
                    <tr className="border-b">
                      <th align="left">Driver</th>
                      <th align="left">City</th>
                      <th align="left">Rating</th>
                      <th align="left">Trips</th>
                      <th align="left">Balance</th>
                      <th align="left">Vehicle</th>
                      <th align="left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_td]:px-3 [&_td]:py-3">
                    {filteredDrivers.map((driver) => (
                      <tr key={driver._id} className="border-b">
                        <td className="min-w-[220px]">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={driver.profilePic?.url || "/placeholder.svg"} />
                              <AvatarFallback>{driver.fullName?.slice(0, 2).toUpperCase() || "DR"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{driver.fullName || "Driver"}</div>
                              <div className="text-xs text-muted-foreground">{driver._id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{driver.address?.city || "Unknown City"}</td>
                        <td className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500" /> {driver.driverRating || 0}
                        </td>
                        <td>{driver.totalTrips || 0}</td>
                        <td>₹{(driver.wallet?.balance || 0).toLocaleString()}</td>
                        <td>{driver.vehicleInfo ? `${driver.vehicleInfo.make} ${driver.vehicleInfo.model}` : "No vehicle"}</td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            <Button size="sm" variant="secondary">
                              Profile
                            </Button>
                            <Button size="sm" variant="outline">
                              Bookings
                            </Button>
                            <Button size="sm">Message</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Management Forms */}
        <Tabs defaultValue="notify" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="notify">
              <Bell className="mr-2 h-4 w-4" /> Send Notification
            </TabsTrigger>
            <TabsTrigger value="assign">
              <CalendarDays className="mr-2 h-4 w-4" /> Assign Booking
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet2 className="mr-2 h-4 w-4" /> Adjust Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notify" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Notification</CardTitle>
                <CardDescription>Notify one or more drivers</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-1">
                  <Label>Target</Label>
                  <Select defaultValue="single">
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Driver</SelectItem>
                      <SelectItem value="multiple">Multiple Drivers</SelectItem>
                      <SelectItem value="all">All Drivers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label className="mt-3">Driver ID(s)</Label>
                  <Input placeholder="driver_id_1, driver_id_2" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Message</Label>
                  <Textarea rows={6} placeholder="Write your notification..." />
                  <div className="flex justify-end">
                    <Button>
                      <Send className="mr-2 h-4 w-4" /> Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
<TabsContent value="assign" className="mt-4">
  <Card>
    <CardHeader>
      <CardTitle>Assign Booking</CardTitle>
      <CardDescription>Allocate a booking to a driver by entering the booking ID</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Booking ID</Label>
          <Input 
            placeholder="Enter booking ID" 
            onChange={(e) => setBookingId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Action</Label>
          <Button 
            className="w-full"
            onClick={fetchBookingDetails}
          >
            Fetch Booking Details
          </Button>
        </div>
      </div>

      {bookingDetails && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Service Type:</span>
                  <span>{bookingDetails.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Pickup Location:</span>
                  <span>{bookingDetails.pickup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Drop Location:</span>
                  <span>{bookingDetails.drop}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Start Time:</span>
                  <span>{new Date(bookingDetails.startTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Fare:</span>
                  <span>₹{bookingDetails.fare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={bookingDetails.status === 'pending' ? 'secondary' : 'default'}>
                    {bookingDetails.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {bookingDetails && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Assign to Driver</Label>
              <Select onValueChange={(value) => setSelectedDriverId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver._id} value={driver._id}>
                      {driver.fullName} - {driver.vehicleInfo ? `${driver.vehicleInfo.make} ${driver.vehicleInfo.model}` : 'No vehicle'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Driver Details</Label>
              {selectedDriverId ? (
                <div className="p-3 border rounded-md bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={drivers.find(d => d._id === selectedDriverId)?.profilePic?.url} />
                      <AvatarFallback>
                        {drivers.find(d => d._id === selectedDriverId)?.fullName?.charAt(0) || 'D'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {drivers.find(d => d._id === selectedDriverId)?.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rating: {drivers.find(d => d._id === selectedDriverId)?.driverRating || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 border rounded-md text-muted-foreground text-sm">
                  Select a driver to view details
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={clearSelection}>
              Clear
            </Button>
            <Button 
              onClick={assignBookingToDriver}
              disabled={!selectedDriverId}
            >
              Assign to Driver
            </Button>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="wallet" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Adjust Wallet</CardTitle>
                <CardDescription>Credit or debit driver wallet</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Driver ID</Label>
                  <Input placeholder="driver_id" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue="credit">
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="debit">Debit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label>Reason</Label>
                  <Textarea rows={4} placeholder="Explain the adjustment..." />
                  <div className="flex justify-end">
                    <Button>Adjust</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}