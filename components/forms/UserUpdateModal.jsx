"use client";

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiX } from 'react-icons/fi';
import { FaCar, FaIdCard, FaCreditCard } from 'react-icons/fa';
import { useUjjain } from '../context/UjjainContext';

const UserUpdateModal = ({ user, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    driverLicense: {
      number: '',
      expiryDate: ''
    },
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      color: '',
      licensePlate: ''
    },
    preferredPaymentMethod: 'credit_card'
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
const {updateProfile}  = useUjjain()
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        driverLicense: user.driverLicense || {
          number: '',
          expiryDate: ''
        },
        vehicleInfo: user.vehicleInfo || {
          make: '',
          model: '',
          year: '',
          color: '',
          licensePlate: ''
        },
        preferredPaymentMethod: user.preferredPaymentMethod || 'credit_card'
      });
      
      if (user.profilePic?.url) {
        setProfilePreview(user.profilePic.url);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePic: 'Image must be less than 5MB' }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePic: 'Please select an image file' }));
        return;
      }
      
      setProfileImage(file);
      setErrors(prev => ({ ...prev, profilePic: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation (only if provided)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Mobile validation (only if provided)
    if (formData.mobile && !/^[0-9+\-\s()]{10,}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }
    
    // Driver license validation (only if provided and user is driver)
    if (user?.role === 'driver' && formData.driverLicense.number && !/^[A-Z0-9]{5,20}$/i.test(formData.driverLicense.number)) {
      newErrors.driverLicenseNumber = 'Please enter a valid license number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submitData = { ...formData };
      
      // If there's a new profile image, add it to the form data
      if (profileImage) {
        submitData.profilePic = profileImage;
      }
      
      await updateProfile(submitData);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to update profile. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        {/* Header - Sticky on mobile */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Update Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {/* Profile Image Upload - Mobile responsive */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-orange-500">
                {profilePreview ? (
                  <img 
                    src={profilePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={32} className="text-gray-400" />
                )}
              </div>
              <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                <FiCamera size={14} className="md:size-4" />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.profilePic && (
              <p className="text-red-500 text-sm text-center mt-2 bg-red-50 p-2 rounded-md">
                {errors.profilePic}
              </p>
            )}
          </div>
          
          {/* Basic Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 text-orange-500" /> Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your mobile number"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
            </div>
          </div>
          
          {/* Address Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiMapPin className="mr-2 text-orange-500" /> Address
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input
                  type="text"
                  id="street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Street address"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="City"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  id="state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="State"
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Postal code"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  id="country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
          
          {/* Driver-specific fields */}
          {user?.role === 'driver' && (
            <>
              {/* Driver License Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaIdCard className="mr-2 text-orange-500" /> Driver License
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="driverLicense.number"
                      value={formData.driverLicense.number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.driverLicenseNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Driver license number"
                    />
                    {errors.driverLicenseNumber && <p className="text-red-500 text-sm mt-1">{errors.driverLicenseNumber}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="driverLicense.expiryDate"
                      value={formData.driverLicense.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Vehicle Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaCar className="mr-2 text-orange-500" /> Vehicle Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                      type="text"
                      id="make"
                      name="vehicleInfo.make"
                      value={formData.vehicleInfo.make}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Vehicle make"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      id="model"
                      name="vehicleInfo.model"
                      value={formData.vehicleInfo.model}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Vehicle model"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      id="year"
                      name="vehicleInfo.year"
                      value={formData.vehicleInfo.year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Manufacturing year"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      id="color"
                      name="vehicleInfo.color"
                      value={formData.vehicleInfo.color}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Vehicle color"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input
                      type="text"
                      id="licensePlate"
                      name="vehicleInfo.licensePlate"
                      value={formData.vehicleInfo.licensePlate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="License plate number"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Payment Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-orange-500" /> Payment Preferences
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="preferredPaymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Method</label>
                <select
                  id="preferredPaymentMethod"
                  name="preferredPaymentMethod"
                  value={formData.preferredPaymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="wallet">Wallet</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-500 text-sm">{errors.submit}</p>
            </div>
          )}
          
          {/* Form Actions - Sticky on mobile */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateModal;