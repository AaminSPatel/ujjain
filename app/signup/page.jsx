"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, User, Phone, MapPin, UserPlus, Car, IdCard, Calendar, CreditCard, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useUjjain } from "@/components/context/UjjainContext"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SignupPage() {
  const [selectedType, setSelectedType] = useState(null) // null, "user", or "driver"
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
    confirmPassword: "",
    // Driver specific fields
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { signup } = useUjjain()
  const { toast } = useToast()
  const router = useRouter()

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
    if (selectedType === "driver") {
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Prepare data based on user type
      const signupData = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: selectedType,
        ...(selectedType === "driver" && {
          address: formData.address,
          driverLicense: formData.driverLicense,
          vehicleInfo: formData.vehicleInfo
        })
      }

      await signup(signupData)
      toast({
        title: "Account created successfully!",
        description: selectedType === "driver" 
          ? "Your driver account is pending verification" 
          : "Welcome to Ujjain Travel",
      })
      router.push(selectedType === "driver" ? "/driver/dashboard" : "/dashboard")
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Render account type selection buttons
  if (!selectedType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                Select the type of account you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setSelectedType("user")}
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 py-4"
                  variant="outline"
                >
                  <User className="h-8 w-8" />
                  <div className="text-left">
                    <div className="font-semibold">User Registration</div>
                    <div className="text-sm text-muted-foreground">Basic account for booking rides</div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setSelectedType("driver")}
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 py-4"
                  variant="outline"
                >
                  <Car className="h-8 w-8" />
                  <div className="text-left">
                    <div className="font-semibold">Driver Registration</div>
                    <div className="text-sm text-muted-foreground">Become a driver and earn money</div>
                  </div>
                </Button>
              </motion.div>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedType(null)}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {selectedType === "driver" ? "Driver Registration" : "User Registration"}
                </CardTitle>
                <CardDescription>
                  {selectedType === "driver" 
                    ? "Fill in your details to become a driver" 
                    : "Create your user account"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields for both user types */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.mobile ? "border-red-500" : ""}`}
                      maxLength="10"
                      required
                    />
                  </div>
                  {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                </div>
              </div>

              {/* Driver Specific Fields */}
              {selectedType === "driver" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Enter your complete address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`pl-10 min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="driverLicense.number">Driver License Number *</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="driverLicense.number"
                          name="driverLicense.number"
                          type="text"
                          placeholder="DL12345678901234"
                          value={formData.driverLicense.number}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.driverLicenseNumber ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.driverLicenseNumber && <p className="text-sm text-red-500">{errors.driverLicenseNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driverLicense.expiryDate">License Expiry Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="driverLicense.expiryDate"
                          name="driverLicense.expiryDate"
                          type="date"
                          value={formData.driverLicense.expiryDate}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.driverLicenseExpiry ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.driverLicenseExpiry && <p className="text-sm text-red-500">{errors.driverLicenseExpiry}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleInfo.make">Vehicle Make *</Label>
                      <Input
                        id="vehicleInfo.make"
                        name="vehicleInfo.make"
                        type="text"
                        placeholder="e.g., Toyota, Honda"
                        value={formData.vehicleInfo.make}
                        onChange={handleInputChange}
                        className={errors.vehicleMake ? "border-red-500" : ""}
                        required
                      />
                      {errors.vehicleMake && <p className="text-sm text-red-500">{errors.vehicleMake}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleInfo.model">Vehicle Model *</Label>
                      <Input
                        id="vehicleInfo.model"
                        name="vehicleInfo.model"
                        type="text"
                        placeholder="e.g., Camry, Civic"
                        value={formData.vehicleInfo.model}
                        onChange={handleInputChange}
                        className={errors.vehicleModel ? "border-red-500" : ""}
                        required
                      />
                      {errors.vehicleModel && <p className="text-sm text-red-500">{errors.vehicleModel}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleInfo.licensePlate">License Plate *</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="vehicleInfo.licensePlate"
                          name="vehicleInfo.licensePlate"
                          type="text"
                          placeholder="ABC1234"
                          value={formData.vehicleInfo.licensePlate}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.vehicleLicensePlate ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.vehicleLicensePlate && <p className="text-sm text-red-500">{errors.vehicleLicensePlate}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating {selectedType === "driver" ? "Driver" : "User"} Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create {selectedType === "driver" ? "Driver" : "User"} Account
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}