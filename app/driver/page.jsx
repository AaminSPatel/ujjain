"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Star, Trophy, Car, CreditCard, Wallet2, Ticket, CalendarDays, MapPin, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useUjjain } from '@/components/context/UjjainContext';
import { useEffect } from "react"

// NOTE: Replace sample data with your API/context data.
// Keep IDs from your DB (cars/hotels/logistics) when wiring.


const earningsData = [
  { month: "Jan", earnings: 22000, bookings: 110, rating: 4.6 },
  { month: "Feb", earnings: 26000, bookings: 132, rating: 4.7 },
  { month: "Mar", earnings: 31000, bookings: 154, rating: 4.8 },
  { month: "Apr", earnings: 28000, bookings: 143, rating: 4.7 },
  { month: "May", earnings: 34000, bookings: 172, rating: 4.8 },
  { month: "Jun", earnings: 36000, bookings: 180, rating: 4.8 },
]

const reviewsSample = [
  { id: "r1", user: "Rohan", rating: 5, text: "Punctual and very polite. Clean car.", date: "2025-06-18" },
  { id: "r2", user: "Sneha", rating: 4, text: "Smooth drive, safe and comfortable.", date: "2025-06-11" },
  { id: "r3", user: "Irfan", rating: 5, text: "Helped with luggage, great service!", date: "2025-05-29" },
]

export default function DriverPanelPage() {
  const [tab, setTab] = useState("overview")
  const [driver, setDriver] = useState({})
  const {user} = useUjjain()
  //console.log('driver page', user);
  useEffect(()=>{
    if(user){
setDriver(user)
    }
  },[user])
  const nextPayout = useMemo(() => {
    const eligible = Math.max(driver?.wallet?.balance - 500, 0)
    return eligible
  }, [driver?.wallet?.balance])

  return (
    <main className="p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={driver?.profilePic?.url || "/placeholder.svg"} alt={`${driver?.fullName} avatar`} />
              <AvatarFallback className="font-medium">{driver?.fullName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-pretty text-xl font-semibold md:text-2xl">Welcome, {driver?.fullName}</h1>
              <p className="text-sm text-muted-foreground">Driver ID: {driver?._id}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="flex items-center gap-1" variant="secondary">
              <Star className="h-4 w-4 text-amber-500" /> {driver?.rating} ({driver?.totalReviews})
            </Badge>
            <Badge className="flex items-center gap-1" variant="outline">
              <Car className="h-4 w-4" /> {driver?.vehicleInfo?.make} {driver?.vehicleInfo?.model}
            </Badge>
            <Badge className="flex items-center gap-1" variant="outline">
              <MapPin className="h-4 w-4" /> {driver?.address?.city}
            </Badge>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          {/*   <TabsTrigger value="wallet">Wallet</TabsTrigger> */}
            <TabsTrigger value="reviews">Ratings & Reviews</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Bookings</CardTitle>
                  <CardDescription>Lifetime</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{driver?.bookings?.length}</div>
                  <Car className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Wallet Balance</CardTitle>
                  <CardDescription>Available</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <div className="text-3xl font-bold">₹{driver?.wallet?.balance?.toLocaleString()}</div>
                  <Wallet2 className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Pending Payout</CardTitle>
                  <CardDescription>Next cycle</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <div className="text-3xl font-bold">₹{nextPayout?.toLocaleString()}</div>
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Earnings & Bookings</CardTitle>
                  <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      earnings: { label: "Earnings", color: "hsl(var(--chart-1))" },
                      bookings: { label: "Bookings", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[280px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="earnings"
                          name="Earnings (₹)"
                          fill="var(--color-earnings)"
                          radius={[6, 6, 0, 0]}
                        />
                        <Line type="monotone" dataKey="bookings" name="Bookings" stroke="var(--color-bookings)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Milestones earned</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {driver?.achievements?.map((ach) => (
                    <Badge key={ach?.id} className={`${ach?.color} flex items-center gap-1`}>
                      <ach.icon className="h-4 w-4" /> {ach?.title}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>Manage upcoming and past bookings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((b) => (
                    <div key={b} className="rounded-lg border p-3 md:p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">UPCOMING</Badge>
                            <span className="text-sm text-muted-foreground">#{1000 + b}</span>
                          </div>
                          <div className="text-sm md:text-base">Ujjain City Tour • 3 hrs • 30 km</div>
                          <div className="text-xs text-muted-foreground">
                            <CalendarDays className="mr-1 inline-block h-3.5 w-3.5" />
                            12 Sep 2025, 10:00 AM • <MapPin className="mr-1 inline-block h-3.5 w-3.5" />
                            Pickup: Tower Square
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="secondary">
                            Navigate
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact
                          </Button>
                          <Button size="sm">Start</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           {/* Wallet */}
       {/*   <TabsContent value="wallet" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Balance</CardTitle>
                  <CardDescription>Available to withdraw</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold">₹{driver?.wallet?.balance?.toLocaleString()}</div>
                  <Button className="w-full">Withdraw</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending</CardTitle>
                  <CardDescription>Processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold">₹{driver?.wallet?.pending?.toLocaleString()}</div>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Payouts
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Trend</CardTitle>
                  <CardDescription>Recent</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{ earnings: { label: "Earnings", color: "hsl(var(--chart-1))" } }}
                    className="h-[160px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={earningsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="earnings" stroke="var(--color-earnings)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
 */}
          {/* Ratings & Reviews */}
          <TabsContent value="reviews" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Rating</CardTitle>
                  <CardDescription>Based on {driver?.totalReviews} reviews</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <div className="text-2xl font-bold">{driver?.rating}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Maintain above 4.5 for bonus tokens.</p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>What riders say</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reviewsSample?.map((rv) => (
                    <div key={rv?.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{rv?.user}</div>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {rv?.rating}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{rv?.text}</p>
                      <div className="mt-2 text-xs text-muted-foreground">{rv?.date}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vehicle */}
          <TabsContent value="vehicle" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
                <CardDescription>Registered vehicle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Make / Model</Label>
                    <div className="text-sm">
                      {driver?.vehicleInfo?.make} {driver?.vehicleInfo?.model}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Year / Color</Label>
                    <div className="text-sm">
                      {driver?.vehicleInfo?.year} • {driver?.vehicleInfo?.color}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Plate</Label>
                    <div className="text-sm">{driver?.vehicleInfo?.plate}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {driver?.vehicleInfo?.photos?.map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border">
                      <Image
                        alt="Vehicle photo"
                        src={src || "/placeholder.svg"}
                        width={600}
                        height={400}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {driver?.vehicle?.docs?.map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="text-sm">{d?.name}</div>
                      <Badge variant={d?.status?.includes("Expiring") ? "destructive" : "secondary"}>{d.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tokens */}
          <TabsContent value="tokens" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>My Tokens</CardTitle>
                  <CardDescription>Boost visibility to get more bookings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{driver?.wallet?.tokens}</div>
                    <Ticket className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Use tokens to promote your profile during peak hours.
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary">Get 5 Tokens</Button>
                    <Button>Get 20 Tokens</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Redeem / Purchase</CardTitle>
                  <CardDescription>Add tokens to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" min={1} placeholder="Enter tokens" />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select defaultValue="upi">
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="wallet">Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">Purchase</Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4" /> Notes
                    </Label>
                    <Textarea placeholder="Any notes for support..." />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
