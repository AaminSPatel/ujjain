"use client"

import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Trophy,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Car,
  Package,
  Clock,
  Award,
  Gift,
  Users,
  TrendingUp,
  Wallet,
  Bell,
  Shield,
  Camera,
  Copy,
  Facebook,
  MessageCircle,
  Instagram,
  Crown,
  UserIcon, 
  CarTaxiFront
} from "lucide-react"
import Link from "next/link"
import { useUjjain } from "@/components/context/UjjainContext"
import  UserUpdateModal  from "@/components/forms/UserUpdateModal"
import { FaWhatsapp } from "react-icons/fa"


export default function ProfileClient() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { user,logout,formatDate,brand} = useUjjain()

  useEffect(() => {
      //setLoading(true)
    if (user) {
      setUserData(user)
    } else {
      setUserData(null)
    }
    setLoading(false)
  }, [user])

  const copyReferralLink = () => {
    if (!userData) return
    const referralLink = `${window.location.origin}/auth/signup?ref=${userData.referralId}`
    navigator.clipboard.writeText(referralLink)
    // You could add a toast notification here
  }

  const shareToWhatsApp = () => {
    if (!userData) return
    const referralLink = `${window.location.origin}/auth/signup?ref=${userData.referralId}`
    const message = `Join Ujjain Travel using my referral code ${userData.referralId} and get exclusive benefits! ${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  const shareToFacebook = () => {
    if (!userData) return
    const referralLink = `${window.location.origin}/auth/signup?ref=${userData.referralId}`
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, "_blank")
  }

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing with links, so copy to clipboard
    copyReferralLink()
    alert("Referral link copied! You can paste it in your Instagram story or post.")
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // No userData found - show sign in section
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {brand.name}</h2>
            <p className="text-gray-600 mb-6">Sign in to access your profile and manage your account</p>
            <Link href="/auth/signin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // userData is logged in - show appropriate profile based on role
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-950 rounded-xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={userData?.profilePic?.url || "/placeholder.svg"} alt={userData.fullName} />
                <AvatarFallback className="text-2xl bg-orange-500">
                  {userData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-white text-gray-900 hover:bg-gray-100"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-3xl font-bold capitalize">{userData.fullName}</h1>
                {userData.isVerified && (
                  <Badge className="bg-green-500 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {userData.isPro && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-white/90">
                {userData.role === "admin" && (
                  <Link href='dashboard'>
                    <div className="flex items-center bg-orange-600 py-1 px-2 rounded-2xl space-x-2">
                      <Crown className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </div>
                  </Link>
                )}
                {userData.role === "hotel_manager" && (
                  <Link href='/hotel-manage'>
                    <div className="flex items-center bg-orange-600 py-1 px-2 rounded-2xl space-x-2">
                      <Crown className="h-4 w-4" />
                      <span>Hotel Manage</span>
                    </div>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{userData.mobile}</span>
                </div>
                {userData.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {userData.address.city}, {userData.address.state}
                    </span>
                  </div>
                )}
              </div>

              {userData.role === "driver" && (
                <div className="flex items-center justify-center md:justify-start space-x-6 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userData.driverRating || 0}</div>
                    <div className="text-sm text-white/80">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userData.totalTrips || 0}</div>
                    <div className="text-sm text-white/80">Trips</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹{userData.wallet?.balance || 0}</div>
                    <div className="text-sm text-white/80">Wallet</div>
                  </div>
                </div>
              )}
            </div>
              <div className="flex gap-4">
            <Button variant="secondary"  onClick={() => setIsModalOpen(!isModalOpen)} className="bg-white text-gray-900 hover:bg-gray-100">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            {userData.role === "driver" && <Link href='/driver'>
            <Button variant="secondary"  className="bg-orange-400 text-gray-900 hover:bg-amber-500">
              <CarTaxiFront className="h-4 w-4 mr-2" />
              Driver Panel
            </Button>
            </Link>}
              </div>
          </div>
        </motion.div>
       <UserUpdateModal
        user={userData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        /* onUpdate={handleUpdateUser} */
      />
        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 my-2 py-4 sm:auto h-32 ">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="refer-earn">Refer & Earn</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {/* {userData.role === "driver" && <TabsTrigger value="driver">Driver</TabsTrigger>} */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.bookings?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

             {/*  <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{userData.wallet?.balance || 0}</div>
                  <p className="text-xs text-muted-foreground">Available balance</p>
                </CardContent>
              </Card>
 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(userData.achievements?.filter((a) => a.earned).length || 0)}/{(userData.achievements?.length || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Badges earned</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.bookings?.slice(0, 3).map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {booking.serviceType === "Hotel" ? (
                            <MapPin className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Package className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{booking?.service?.name || booking.service?.model ||booking.service?.serviceName }</p>
                          <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{booking.payment?.amount}</p>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">No bookings found</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.notifications?.slice(0, 3).map((notification) => (
                    <div key={notification._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                      </div>
                      {!notification.isRead && <div className="h-2 w-2 bg-blue-600 rounded-full"></div>}
                    </div>
                  )) || <p className="text-gray-500">No notifications</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.bookings?.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          {booking.serviceType === "Hotel" ? (
                            <MapPin className="h-6 w-6 text-blue-600" />
                          ) : (
                            <Package className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{booking?.service?.name || booking?.service?.model || booking?.service?.serviceName }</h3>
                          <p className="text-gray-500">
                            {booking?.serviceType} • {formatDate(booking?.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{booking?.payment?.amount}</p>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "completed"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {booking.status} {/* {booking.payment.status} */}
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">No bookings found</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.achievements?.map((achievement) => {
                const IconComponent = achievement.icon
                return (
                  <Card
                    key={achievement.id}
                    className={achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200"}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`inline-flex p-4 rounded-full mb-4 ${achievement.earned ? "bg-green-100" : "bg-gray-100"}`}
                      >
                        <IconComponent
                          className={`h-8 w-8 ${achievement.earned ? "text-green-600" : "text-gray-400"}`}
                        />
                      </div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                      {achievement.earned ? (
                        <Badge className="bg-green-500 text-white">Earned</Badge>
                      ) : (
                        <Badge variant="outline">Not Earned</Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              }) || <p className="text-gray-500">No achievements found</p>}
            </div>
          </TabsContent>

          {/* Refer & Earn Tab */}
          <TabsContent value="refer-earn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <span>Refer & Earn</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                  <Gift className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Earn ₹100 for every referral!</h3>
                  <p className="text-gray-600">Share your referral code and earn rewards when your friends book their first ride.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Your Referral Code</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 p-3 bg-gray-100 rounded-lg font-mono text-lg text-center">
                        {userData.referralId || "N/A"}
                      </div>
                      <Button onClick={copyReferralLink} variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Share on Social Media</Label>
                    <div className="flex space-x-3">
                      <Button onClick={shareToWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600">
                        <FaWhatsapp className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button onClick={shareToFacebook} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button onClick={shareToInstagram} className="flex-1 bg-pink-500 hover:bg-pink-600">
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{userData.referralStats?.totalReferred || 0}</div>
                      <div className="text-sm text-gray-500">Friends Referred</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">₹{userData.referralStats?.referralEarnings || 0}</div>
                      <div className="text-sm text-gray-500">Total Earned</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {userData.referralStats?.totalReferred >= 10 ? "Gold" : userData.referralStats?.totalReferred >= 5 ? "Silver" : "Bronze"}
                      </div>
                      <div className="text-sm text-gray-500">Referral Tier</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive booking updates via email</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Toggle
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive SMS updates</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Toggle
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add extra security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-500">Control who can see your profile</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Public
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Sharing</p>
                      <p className="text-sm text-gray-500">Share location for better service</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-gray-500">Download your data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Button onClick={() => logout()}>Logout</Button>
            </div>
          </TabsContent>

       
        </Tabs>
      </div>
    </div>
  )
}