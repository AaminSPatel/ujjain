"use client"

import { useState ,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,DialogFooter 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

export function UserForm({ open, onOpenChange, user, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: ""
    },
    isPro: false,
    isVerified: false,
    isAvailable: false
  });

  const [driverData, setDriverData] = useState({
    driverLicense: {
      number: "",
      expiryDate: ""
    },
    vehicleInfo: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        role: user.role || "user",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: ""
        },
        isPro: user.isPro || false,
        isVerified: user.isVerified || false,
        isAvailable: user.isAvailable || false
      });

      if (user.role === "driver") {
        setDriverData({
          driverLicense: user.driverLicense || {
            number: "",
            expiryDate: ""
          },
          vehicleInfo: user.vehicleInfo || ""
        });
      }
    } else {
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        role: "user",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: ""
        },
        isPro: false,
        isVerified: false,
        isAvailable: false
      });
      setDriverData({
        driverLicense: {
          number: "",
          expiryDate: ""
        },
        vehicleInfo: ""
      });
    }
  }, [user, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      ...(formData.role === "driver" ? driverData : {})
    };

    onSubmit(submissionData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update user information" : "Create a new user account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="9876543210"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {formData.role === "driver" && (
            <>
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium">Driver Information</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={driverData.driverLicense.number}
                      onChange={(e) => setDriverData({
                        ...driverData,
                        driverLicense: {
                          ...driverData.driverLicense,
                          number: e.target.value
                        }
                      })}
                      placeholder="DL1234567890"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                    <Input
                      id="licenseExpiry"
                      type="date"
                      value={driverData.driverLicense.expiryDate}
                      onChange={(e) => setDriverData({
                        ...driverData,
                        driverLicense: {
                          ...driverData.driverLicense,
                          expiryDate: e.target.value
                        }
                      })}
                      required
                    />
                  </div>
                </div>
              </div>

            

              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
                <Label htmlFor="isAvailable">Available for Trips</Label>
              </div>
            </>
          )}
 <div className="flex items-center space-x-2">
                <Switch
                  id="isVerified"
                  checked={formData.isVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
                />
                <Label htmlFor="isVerified">Verified Driver</Label>
              </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPro"
              checked={formData.isPro}
              onCheckedChange={(checked) => setFormData({ ...formData, isPro: checked })}
            />
            <Label htmlFor="isPro">Pro Member</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : user ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}