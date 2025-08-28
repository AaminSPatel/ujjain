import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiX } from 'react-icons/fi';
import { FaCar, FaIdCard, FaMoneyBill, FaCreditCard } from 'react-icons/fa';
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
    // Driver-specific fields
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
    // Payment preferences
    preferredPaymentMethod: 'credit_card'
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
   const {updateProfile} = useUjjain()
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
      setProfileImage(file);
      setErrors(prev => ({ ...prev, profilePic: '' }));
    }
  };
/* 
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    
    // Driver-specific validations
    if (user?.role === 'driver') {
      if (!formData.driverLicense.number.trim()) newErrors.driverLicenseNumber = 'License number is required';
      if (!formData.vehicleInfo.make.trim()) newErrors.vehicleMake = 'Vehicle make is required';
      if (!formData.vehicleInfo.model.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
   // if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submitData = { ...formData };
      
      // If there's a new profile image, handle it
      if (profileImage) {
        // In a real app, you would upload the image first
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img 
                    src={URL.createObjectURL(profileImage)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : user?.profilePic?.url ? (
                  <img 
                    src={user.profilePic.url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={40} className="text-gray-400" />
                )}
              </div>
              <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer">
                <FiCamera size={16} />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.profilePic && <p className="text-red-500 text-sm mt-2">{errors.profilePic}</p>}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
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
                    />
                    {/* {errors.driverLicenseNumber && <p className="text-red-500 text-sm mt-1">{errors.driverLicenseNumber}</p>} */}
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.vehicleMake ? 'border-red-500' : 'border-gray-300'}`}
                    />
                   {/*  {errors.vehicleMake && <p className="text-red-500 text-sm mt-1">{errors.vehicleMake}</p>} */}
                  </div>
                  
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      id="model"
                      name="vehicleInfo.model"
                      value={formData.vehicleInfo.model}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.vehicleModel ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {/* {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>} */}
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
          
          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
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
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center disabled:opacity-75"
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

/* // Example usage in a profile page component
const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1234567890',
    role: 'driver', // Change to 'user' to see different fields
    profilePic: {
      url: ''
    },
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001'
    },
    driverLicense: {
      number: 'DL123456789',
      expiryDate: '2025-12-31'
    },
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      color: 'Blue',
      licensePlate: 'ABC123'
    },
    preferredPaymentMethod: 'credit_card'
  });

  const handleUpdateUser = async (userData) => {
    // This would be your actual update function from context
    console.log('Updating user with:', userData);
    // Simulate API call
    return new Promise(resolve => setTimeout(() => {
      setCurrentUser(prev => ({ ...prev, ...userData }));
      resolve();
    }, 1500));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                {currentUser.profilePic?.url ? (
                  <img 
                    src={currentUser.profilePic.url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={48} className="text-gray-400" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-800">{currentUser.fullName}</h1>
              <div className="mt-2 flex items-center">
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <FiMail className="text-orange-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiPhone className="text-orange-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="text-gray-800">{currentUser.mobile}</p>
                </div>
              </div>
              
              <div className="flex items-start md:col-span-2">
                <FiMapPin className="text-orange-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">
                    {currentUser.address.street}, {currentUser.address.city}, {currentUser.address.state} {currentUser.address.postalCode}, {currentUser.address.country}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <FiUser className="mr-2" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <UserUpdateModal 
        user={currentUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
};
 */
export default UserUpdateModal;