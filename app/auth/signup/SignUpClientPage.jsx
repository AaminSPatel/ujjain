"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye,Mail,Phone , EyeOff, Star, ArrowLeft, Gift, User, Car, MapPin, IdCard, Calendar, CreditCard } from "lucide-react"
import { useUjjain } from "@/components/context/UjjainContext"

export default function SignUpClientPage() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState(null) // null, "user", or "driver"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "user",
    referrer: "",
    // Driver specific fields
    address: "",
    driverLicense: {
      number: "",
      expiryDate: ""
    },
    vehicleInfo: {
      make: "",
      model: "",
      year: "",
      color: "",
      licensePlate: ""
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const {signUp,brand} = useUjjain();
  // Auto-fill referral code from URL params
  useEffect(() => {
    const refCode = searchParams.get("ref")
    if (refCode) {
      setFormData((prev) => ({ ...prev, referrer: refCode }))
    }
  }, [searchParams])


  const validateForm = () => {
    const newErrors = {}

    // Common validations for both user types
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    const mobileRegex = /^[6-9]\d{9}$/
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required"
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number and special character"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Driver specific validations
    if (userType === "driver") {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required"
      } else if (formData.address.trim().length < 10) {
        newErrors.address = "Address must be at least 10 characters"
      }

      if (!formData.driverLicense.number.trim()) {
        newErrors.driverLicenseNumber = "Driver license number is required"
      }

      if (!formData.driverLicense.expiryDate) {
        newErrors.driverLicenseExpiry = "Driver license expiry date is required"
      }

      if (!formData.vehicleInfo.make.trim()) {
        newErrors.vehicleMake = "Vehicle make is required"
      }

      if (!formData.vehicleInfo.model.trim()) {
        newErrors.vehicleModel = "Vehicle model is required"
      }

      if (!formData.vehicleInfo.licensePlate.trim()) {
        newErrors.vehicleLicensePlate = "License plate is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }



  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Prepare data based on user type
    const signupData = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      passwordConfirm: formData.confirmPassword,
      role: userType,
      referrer: formData.referrer,
      ...(userType === "driver" && {
        address: formData.address,
        driverLicense: formData.driverLicense,
        vehicleInfo: formData.vehicleInfo
      })
    }
 try {
   // Simulate API call
    await signUp(signupData)
    setTimeout(() => {
      setIsLoading(false)
      console.log("Sign up attempt:", signupData)
      alert(`${userType === "driver" ? "Driver" : userType === "hotel_manager" ? "Hotel Manager" : "User"} account created successfully!`)
    }, 2000)
 } catch (error) {
  console.log(error);

 }
   
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('driverLicense.') || name.startsWith('vehicleInfo.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Render account type selection buttons
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-8 w-8 text-orange-500" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{brand.name}</h1>
                    <p className="text-xs text-gray-600">{brand.description}</p>
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Choose your account type to get started</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setUserType("user")}
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 py-4"
                  variant="outline"
                >
                  <User className="h-8 w-8 text-orange-500" />
                  <div className="text-left">
                    <div className="font-semibold">Customer Registration</div>
                    <div className="text-sm text-muted-foreground">Book rides and tours</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setUserType("driver")}
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 py-4"
                  variant="outline"
                >
                  <Car className="h-8 w-8 text-orange-500" />
                  <div className="text-left">
                    <div className="font-semibold">Driver Registration</div>
                    <div className="text-sm text-muted-foreground">Join as a driver and earn money</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setUserType("hotel_manager")}
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 py-4"
                  variant="outline"
                >
                  <MapPin className="h-8 w-8 text-orange-500" />
                  <div className="text-left">
                    <div className="font-semibold">Hotel Manager Registration</div>
                    <div className="text-sm text-muted-foreground">Register as hotel owner.</div>
                  </div>
                </Button>
              </motion.div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-orange-500 hover:text-orange-600 font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Render the appropriate form based on selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Home */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUserType(null)}
            className="mr-2 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
          >
            Home
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-orange-500" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Ujjain Travel</h1>
                  <p className="text-xs text-gray-600">Sacred City Explorer</p>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {userType === "driver" ? "Driver Registration" : userType === "hotel_manager" ? "Hotel Manager Registration" : "Customer Registration"}
            </CardTitle>
            <CardDescription>
              {userType === "driver"
                ? "Join our driver community and start earning"
                : userType === "hotel_manager"
                ? "Register as hotel manager and manage your properties"
                : "Create your account to book rides in Ujjain"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 ${errors.fullName ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 ${errors.email ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`pl-10 h-11 ${errors.mobile ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
              </div>

              {/* Driver Specific Fields */}
              {userType === "driver" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Enter your complete address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`pl-10 h-11 ${errors.address ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="driverLicense.number">Driver License Number</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="driverLicense.number"
                          name="driverLicense.number"
                          type="text"
                          placeholder="DL12345678901234"
                          value={formData.driverLicense.number}
                          onChange={handleInputChange}
                          className={`pl-10 h-11 ${errors.driverLicenseNumber ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.driverLicenseNumber && <p className="text-sm text-red-500">{errors.driverLicenseNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driverLicense.expiryDate">License Expiry Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="driverLicense.expiryDate"
                          name="driverLicense.expiryDate"
                          type="date"
                          value={formData.driverLicense.expiryDate}
                          onChange={handleInputChange}
                          className={`pl-10 h-11 ${errors.driverLicenseExpiry ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.driverLicenseExpiry && <p className="text-sm text-red-500">{errors.driverLicenseExpiry}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleInfo.make">Vehicle Make</Label>
                      <Input
                        id="vehicleInfo.make"
                        name="vehicleInfo.make"
                        type="text"
                        placeholder="e.g., Toyota, Honda"
                        value={formData.vehicleInfo.make}
                        onChange={handleInputChange}
                        className={`h-11 ${errors.vehicleMake ? "border-red-500" : ""}`}
                        required
                      />
                      {errors.vehicleMake && <p className="text-sm text-red-500">{errors.vehicleMake}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleInfo.model">Vehicle Model</Label>
                      <Input
                        id="vehicleInfo.model"
                        name="vehicleInfo.model"
                        type="text"
                        placeholder="e.g., Camry, Civic"
                        value={formData.vehicleInfo.model}
                        onChange={handleInputChange}
                        className={`h-11 ${errors.vehicleModel ? "border-red-500" : ""}`}
                        required
                      />
                      {errors.vehicleModel && <p className="text-sm text-red-500">{errors.vehicleModel}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleInfo.year">Vehicle Year</Label>
                      <Input
                        id="vehicleInfo.year"
                        name="vehicleInfo.year"
                        type="number"
                        placeholder="2020"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        value={formData.vehicleInfo.year}
                        onChange={handleInputChange}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleInfo.color">Vehicle Color</Label>
                      <Input
                        id="vehicleInfo.color"
                        name="vehicleInfo.color"
                        type="text"
                        placeholder="Red, Blue, etc."
                        value={formData.vehicleInfo.color}
                        onChange={handleInputChange}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleInfo.licensePlate">License Plate</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="vehicleInfo.licensePlate"
                        name="vehicleInfo.licensePlate"
                        type="text"
                        placeholder="ABC1234"
                        value={formData.vehicleInfo.licensePlate}
                        onChange={handleInputChange}
                        className={`pl-10 h-11 ${errors.vehicleLicensePlate ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.vehicleLicensePlate && <p className="text-sm text-red-500">{errors.vehicleLicensePlate}</p>}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={`h-11 pr-12 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={`h-11 pr-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referrer">Referral Code (Optional)</Label>
                <div className="relative">
                  <Input
                    id="referrer"
                    name="referrer"
                    type="text"
                    placeholder="Enter referral code"
                    value={formData.referrer}
                    onChange={handleInputChange}
                    className="h-11 pl-12"
                  />
                  <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
                </div>
                {formData.referrer && (
                  <p className="text-sm text-green-600">🎉 You'll earn bonus points with this referral!</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input type="checkbox" required className="mt-1 rounded border-gray-300" />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-orange-500 hover:text-orange-600">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                /* disabled={isLoading} */
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                {isLoading ? "Creating Account..." : `Create ${userType === "driver" ? "Driver" : userType === "hotel_manager" ? "Hotel Manager" : "Customer"} Account`}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-orange-500 hover:text-orange-600 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}