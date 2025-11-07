import axios from 'axios';
import safeStorage from './utils/safeStorage.js';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in every request
api.interceptors.request.use(
  (config) => {
    // Get token from safeStorage
    const token = safeStorage.get('token');

    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      console.warn('Authentication failed (401). Clearing stored token and user data.');

      // Clear stored token and user data
      safeStorage.remove('token');
      safeStorage.remove('user');

      // Redirect to login page with a small delay to allow error handling
      if (typeof window !== 'undefined') {
        // Check if we're not already on the login page
        if (!window.location.pathname.includes('/auth/') &&
            !window.location.pathname.includes('/signin') &&
            !window.location.pathname.includes('/login')) {
          console.log('Redirecting to login due to authentication failure');
          setTimeout(() => {
            window.location.href = '/auth/signin';
          }, 500);
        }
      }
    }

    return Promise.reject(error);
  }
);

// ====================== BOOKINGS ======================
export const BookingService = {
  // Get all bookings (admin only)
  getAll: async () => {
    try {
      //const queryString = new URLSearchParams(params).toString();
      const url = '/bookings';
    //  console.log('🔍 GET All Bookings URL:', url);
      
      const response = await api.get(url);
    //  console.log('✅ BookingService.getAll() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getAll() ERROR:', error);
      throw error;
    }
  },

  // Get single booking by ID
  getById: async (id) => {
    try {
    //  console.log('🔍 BookingService.getById() called with ID:', id);
    //  console.log('🌐 Full API URL:', `${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`);
      
      const response = await api.get(`/bookings/${id}`);
      
     /*  console.log('✅ BookingService.getById() SUCCESS:', {
        status: response.status,
        data: response.data
      });
       */
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getById() ERROR:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  },

  // Get bookings by user ID
  getByUser: async (userId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/bookings/user/${userId}?${queryString}`
        : `/bookings/user/${userId}`;
      //console.log('🔍 GET User Bookings URL:', url);
      
      const response = await api.get(url);
      //console.log('✅ BookingService.getByUser() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getByUser() ERROR:', error);
      throw error;
    }
  },

  // Get current user's bookings
  getMyBookings: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/bookings/user/me?${queryString}` : '/bookings/user/me';
      //console.log('🔍 GET My Bookings URL:', url);
      
      const response = await api.get(url);
      //console.log('✅ BookingService.getMyBookings() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getMyBookings() ERROR:', error);
      throw error;
    }
  },

  // Create new booking
  create: async (bookingData) => {
    try {
  //    console.log('🔍 BookingService.create() called with data:', bookingData);

      // Transform frontend data to match backend schema
      const transformedData = {
        serviceType: bookingData.serviceType,
        service: bookingData.service,
        room: bookingData.room,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        passengers: bookingData.passengers || bookingData.guests,
        rooms: bookingData.serviceType === 'Hotel' ? bookingData.rooms || 1 : null,
        email: bookingData.email,
        mobile: bookingData.mobile,
        fullname: bookingData.fullname,
        address: bookingData.address,
        car_id: bookingData.car_id,
        dates: bookingData.dates,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        specialRequests: bookingData.specialRequests,
        pricing: bookingData.pricing,
        payment: {
          amount: bookingData.payment?.amount || bookingData.pricing?.totalPrice || 0,
          method: bookingData.payment?.method || 'cash',
          status: 'pending'
        },
        status: 'pending',
        isPaid: false,
        isCancelled: false,
        bookingType: bookingData.bookingType,
        isInstantBooking: bookingData.isInstantBooking,
        transportType: bookingData.transportType
      };

   //   console.log('📦 Sending transformed data to backend:', transformedData);

      const response = await api.post('/bookings', transformedData);
      console.log('✅ BookingService.create() SUCCESS:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.create() ERROR:', error);
      throw error;
    }
  },

  // Update booking status (admin only)
  updateStatus: async (id, status, cancellationReason = null) => {
    try {
     // console.log('🔍 BookingService.updateStatus() called:', { id, status, cancellationReason });
      
      const data = { status };
      if (cancellationReason) {
        data.cancellationReason = cancellationReason;
      }
      
      const response = await api.put(`/bookings/${id}/status`, data);
     // console.log('✅ BookingService.updateStatus() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.updateStatus() ERROR:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id, cancellationReason = null) => {
    try {
     // console.log('🔍 BookingService.cancelBooking() called:', { id, cancellationReason });
   //   
      const data = {};
      if (cancellationReason) {
        data.cancellationReason = cancellationReason;
      }
      
      const response = await api.put(`/bookings/${id}/cancel`, data);
    //  console.log('✅ BookingService.cancelBooking() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.cancelBooking() ERROR:', error);
      throw error;
    }
  },

  // Update payment status (admin only)
  updatePaymentStatus: async (id, paymentStatus, transactionId = null, paymentDate = null) => {
    try {
      //console.log('🔍 BookingService.updatePaymentStatus() called:', { id, paymentStatus, transactionId, paymentDate });
      
      const data = { paymentStatus };
      if (transactionId) data.transactionId = transactionId;
      if (paymentDate) data.paymentDate = paymentDate;
      
      const response = await api.put(`/bookings/${id}/payment`, data);
     // console.log('✅ BookingService.updatePaymentStatus() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.updatePaymentStatus() ERROR:', error);
      throw error;
    }
  },

  // Delete booking (admin only)
  delete: async (id) => {
    try {
    //  console.log('🔍 BookingService.delete() called with ID:', id);
      
      const response = await api.delete(`/bookings/${id}`);
    //  console.log('✅ BookingService.delete() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.delete() ERROR:', error);
      throw error;
    }
  },

  // Legacy method for backward compatibility
  updateBookingStatus: async (id, status, otp = null) => {
    try {
    //  console.log('🔍 BookingService.updateBookingStatus() called:', { id, status, otp });
      
      const data = { status };
      if (otp) data.otp = otp;
      
      const response = await api.put(`/bookings/${id}`, data);
     // console.log('✅ BookingService.updateBookingStatus() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.updateBookingStatus() ERROR:', error);
      throw error;
    }
  },

  // Get bookings by service type and service IDs (for hotel managers)
  getBookingsByService: async (serviceType, serviceIds) => {
    try {
    //  console.log('🔍 BookingService.getBookingsByService() called:', { serviceType, serviceIds });
      
      const queryString = new URLSearchParams({ serviceType, serviceIds: serviceIds.join(',') }).toString();
      const response = await api.get(`/bookings/service?${queryString}`);
    //  console.log('✅ BookingService.getBookingsByService() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getBookingsByService() ERROR:', error);
      throw error;
    }
  },

  // Driver routes
  assignBookingToDriver: async (bookingId, driverId) => {
    try {
    //  console.log('🔍 BookingService.assignBookingToDriver() called:', { bookingId, driverId });
      
      const response = await api.post(`/bookings/${bookingId}/assign-driver`, { driverId });
    //  console.log('✅ BookingService.assignBookingToDriver() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.assignBookingToDriver() ERROR:', error);
      throw error;
    }
  },

  driverAcceptBooking: async (bookingId) => {
    try {
    //  console.log('🔍 BookingService.driverAcceptBooking() called with bookingId:', bookingId);
      
      const response = await api.post(`/bookings/${bookingId}/driver-accept`);
    //  console.log('✅ BookingService.driverAcceptBooking() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.driverAcceptBooking() ERROR:', error);
      throw error;
    }
  },

  driverUpdateStatus: async (bookingId, status, additionalData = {}) => {
    try {
    //  console.log('🔍 BookingService.driverUpdateStatus() called:', { bookingId, status, additionalData });

      const data = { status, ...additionalData };
      const response = await api.put(`/bookings/${bookingId}/driver-status`, data);
     // console.log('✅ BookingService.driverUpdateStatus() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.driverUpdateStatus() ERROR:', error);
      throw error;
    }
  },

  driverCancelAcceptedBooking: async (bookingId) => {
    try {
      console.log('🔍 BookingService.driverCancelAcceptedBooking() called with bookingId:', bookingId);

      const response = await api.put(`/bookings/${bookingId}/driver-cancel-accepted`);
      console.log('✅ BookingService.driverCancelAcceptedBooking() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.driverCancelAcceptedBooking() ERROR:', error);
      throw error;
    }
  },

  driverShareLocation: async (bookingId, latitude, longitude) => {
    try {
   //   console.log('🔍 BookingService.driverShareLocation() called:', { bookingId, latitude, longitude });
      
      const response = await api.post(`/bookings/${bookingId}/driver-location`, { latitude, longitude });
    //  console.log('✅ BookingService.driverShareLocation() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.driverShareLocation() ERROR:', error);
      throw error;
    }
  },

  getDriverBookings: async () => {
    try {
    //  console.log('🔍 BookingService.getDriverBookings() called');
      
      const response = await api.get('/bookings/driver/bookings');
    //  console.log('✅ BookingService.getDriverBookings() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getDriverBookings() ERROR:', error);
      throw error;
    }
  },

  getDriverAssignedBookings: async () => {
    try {
    //  console.log('🔍 BookingService.getDriverAssignedBookings() called');
      
      const response = await api.get('/bookings/driver/my-bookings');
    //  console.log('✅ BookingService.getDriverAssignedBookings() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getDriverAssignedBookings() ERROR:', error);
      throw error;
    }
  },

  // Live tracking for passengers
  getLiveTracking: async (bookingId) => {
    try {
   //   console.log('🔍 BookingService.getLiveTracking() called with bookingId:', bookingId);
      
      const response = await api.get(`/bookings/${bookingId}/live-tracking`);
   //   console.log('✅ BookingService.getLiveTracking() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.getLiveTracking() ERROR:', error);
      throw error;
    }
  },

  // Update driver location
  updateDriverLocation: async (bookingId, driverLocation) => {
    try {
    //  console.log('🔍 BookingService.updateDriverLocation() called:', { bookingId, driverLocation });
      
      const response = await api.put(`/bookings/${bookingId}/driver-location`, {
        lat: driverLocation.lat,
        lng: driverLocation.lng
      });
    //  console.log('✅ BookingService.updateDriverLocation() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.updateDriverLocation() ERROR:', error);
      throw error;
    }
  },

  // Update booking locations
  updateBookingLocations: async (bookingId, locationData) => {
    try {
    //  console.log('🔍 BookingService.updateBookingLocations() called:', { bookingId, locationData });
      
      const response = await api.put(`/bookings/${bookingId}/locations`, locationData);
    //  console.log('✅ BookingService.updateBookingLocations() SUCCESS');
      return response.data;
    } catch (error) {
      console.error('❌ BookingService.updateBookingLocations() ERROR:', error);
      throw error;
    }
  },

  // TEST FUNCTION: Direct API call to diagnose issues
  testBookingAPI: async (bookingId) => {
    try {
   //   console.log('🧪 BookingService.testBookingAPI() called with ID:', bookingId);
      
      // Test 1: Check if API is reachable
      const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`);
    //  console.log('📡 API Health Check Status:', healthCheck.status);
      
      // Test 2: Try direct fetch with authentication
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    //  console.log('🔐 Token available:', !!token);
      
      const directResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
    /*   console.log('📡 Direct Fetch Result:', {
        status: directResponse.status,
        statusText: directResponse.statusText,
        ok: directResponse.ok
      });
       */
      if (directResponse.ok) {
        const data = await directResponse.json();
        return { success: true, data, method: 'direct' };
      } else {
        const errorText = await directResponse.text();
        return { 
          success: false, 
          error: errorText,
          status: directResponse.status 
        };
      }
      
    } catch (error) {
      console.error('❌ BookingService.testBookingAPI() ERROR:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
};
// ====================== Users ======================
export const UserService = {
  // Authentication
  signUp: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data.token) {
      safeStorage.set('token', response.data.token);
    }
    //console.log('api service',response);

    return response;
  },

  signIn: async (credentials) => {
    const requestData = {
      password: credentials.password,
      identifier: credentials.identifier
    };

    const response = await api.post('/users/login', requestData);

    if (response.data.token) {
      safeStorage.set('token', response.data.token);
      if (response.data.user) {
        safeStorage.set('user', response.data.user);
      }
    }

    return response.data;
  },

  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },

  // User profile
  getProfile: async () => (await api.get('/users/me')).data,

  // Update user profile
  updateProfile: async (userData) => {
    const token = safeStorage.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();

    // Append basic user info
    if (userData.fullName !== undefined) formData.append('fullName', userData.fullName);
    if (userData.email !== undefined) formData.append('email', userData.email);
    if (userData.mobile !== undefined) formData.append('mobile', userData.mobile);

    // Handle nested address object
    if (userData.address) {
      if (userData.address.street !== undefined) formData.append('address.street', userData.address.street);
      if (userData.address.city !== undefined) formData.append('address.city', userData.address.city);
      if (userData.address.state !== undefined) formData.append('address.state', userData.address.state);
      if (userData.address.country !== undefined) formData.append('address.country', userData.address.country);
      if (userData.address.postalCode !== undefined) formData.append('address.postalCode', userData.address.postalCode);
    }

    // Handle driver license
    if (userData.driverLicense) {
      if (userData.driverLicense.number !== undefined) formData.append('driverLicense.number', userData.driverLicense.number);
      if (userData.driverLicense.expiryDate !== undefined) formData.append('driverLicense.expiryDate', userData.driverLicense.expiryDate);
    }

    // Handle vehicle info
    if (userData.vehicleInfo) {
      if (userData.vehicleInfo.make !== undefined) formData.append('vehicleInfo.make', userData.vehicleInfo.make);
      if (userData.vehicleInfo.model !== undefined) formData.append('vehicleInfo.model', userData.vehicleInfo.model);
      if (userData.vehicleInfo.year !== undefined) formData.append('vehicleInfo.year', userData.vehicleInfo.year);
      if (userData.vehicleInfo.color !== undefined) formData.append('vehicleInfo.color', userData.vehicleInfo.color);
      if (userData.vehicleInfo.licensePlate !== undefined) formData.append('vehicleInfo.licensePlate', userData.vehicleInfo.licensePlate);
    }

    // Handle preferred payment method
    if (userData.preferredPaymentMethod !== undefined) formData.append('preferredPaymentMethod', userData.preferredPaymentMethod);

    // Handle profile picture
    if (userData.profilePic && userData.profilePic instanceof File) {
      formData.append('image', userData.profilePic);
    }

    try {
      const response = await axios.put(`${backendUrl}/users/update-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) =>
    (await api.patch('/users/change-password', passwordData)).data,

  // Admin functions
  getAllUsers: async () => (await api.get('/users')).data,

  getUserById: async (id) => (await api.get(`/users/${id}`)).data,

  updateUser: async (id, userData) => (await api.patch(`/users/${id}`, userData)).data,

  deleteUser: async (id) => (await api.delete(`/users/${id}`)).data,

  createUser: async (userData) => (await api.post('/users/admin/create', userData)).data,

  deleteAccount: async () => {
    const response = await api.delete('/users/delete-account');
    localStorage.removeItem('token');
    return response.data;
  },

  // Add notification to user
  addNotification: async (userId, notificationData) => {
    const response = await api.post(`/users/${userId}/notifications`, notificationData);
    return response.data;
  },

  // Get user notifications
  getNotifications: async (userId) => {
    const response = await api.get(`/users/${userId}/notifications`);
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (userId, notificationId) => {
    const response = await api.patch(`/users/${userId}/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (userId) => {
    const response = await api.patch(`/users/${userId}/notifications/read-all`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (userId, notificationId) => {
    const response = await api.delete(`/users/${userId}/notifications/${notificationId}`);
    return response.data;
  },

  // Clear all notifications
  clearAllNotifications: async (userId) => {
    const response = await api.delete(`/users/${userId}/notifications`);
    return response.data;
  },
};

// ====================== PLACES ======================
export const PlaceService = {
  getAll: async () => (await api.get('/places')).data,
  create: async (placeData) => {
    const formData = new FormData();
    Object.keys(placeData).forEach((key) => {
      if (key === 'images') {
        placeData.images.forEach(img => formData.append('images', img));
      } else {
        formData.append(key, placeData[key]);
      }
    });
    return (await axios.post(`${backendUrl}/places`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  update: async (id, placeData) => {
    const formData = new FormData();
    Object.keys(placeData).forEach((key) => {
      if (key === 'images') {
        placeData.images.forEach(img => formData.append('images', img));
      } else {
        formData.append(key, placeData[key]);
      }
    });
    return (await axios.put(`${backendUrl}/places/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  delete: async (id) => (await api.delete(`/places/${id}`)).data,
};

// ====================== CARS ======================
export const CarService = {
  getAll: async () => (await api.get('/cars')).data,
  create: async (carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach((key) => {
      if (key === 'images') {
        carData.images.forEach(img => formData.append('images', img));
      } else if (key === 'features') {
        formData.append(key, JSON.stringify(carData[key]));
      } else {
        formData.append(key, carData[key]);
      }
    });
    return (await axios.post(`${backendUrl}/cars`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  update: async (id, carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach((key) => {
      if (key === 'images') {
        carData.images.forEach(img => formData.append('images', img));
      } else if (key === 'features') {
        formData.append(key, JSON.stringify(carData[key]));
      } else {
        formData.append(key, carData[key]);
      }
    });
    return (await axios.put(`${backendUrl}/cars/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  delete: async (id) => (await api.delete(`/cars/${id}`)).data,
};

// ====================== HOTELS ======================
export const HotelService = {
  getAll: async () => (await api.get('/hotels')).data,

create: async (hotelData) => {
  console.log('hotelData at apiServices', hotelData);
  
  const formData = new FormData();
  
  // Add all simple fields first
  Object.keys(hotelData).forEach((key) => {
    if (key !== 'images' && key !== 'rooms') {
      if (['amenities', 'features', 'roomTypes'].includes(key)) {
        formData.append(key, JSON.stringify(hotelData[key]));
      } else {
        formData.append(key, hotelData[key]);
      }
    }
  });
  
  // Add hotel images
  if (hotelData.images) {
    hotelData.images.forEach(img => {
      if (img instanceof File) {
        formData.append('images', img);
      }
    });
  }
  
  // Add rooms and their images with correct field names
  if (hotelData.rooms && hotelData.rooms.length > 0) {
    // Add rooms data without images
    const roomsWithoutImages = hotelData.rooms.map(room => {
      const { ...roomWithoutImages } = room;
      return roomWithoutImages;
    });
    formData.append('rooms', JSON.stringify(roomsWithoutImages));
    
    // Add room images with correct field names
    hotelData.rooms.forEach((room, roomIndex) => {
      if (room.images && room.images.length > 0) {
        room.images.forEach((img, imgIndex) => {
          if (img instanceof File) {
            formData.append(`roomImage_${roomIndex}_${imgIndex}`, img);
          }
        });
      }
    });
  }
  
  return (await axios.post(`${backendUrl}/hotels`, formData, {
    headers: {
      'Authorization': `Bearer ${safeStorage.get('token')}`,

    },
  })).data;
},
update: async (id, hotelData) => {
  const formData = new FormData();

  // Separate existing images from new files
  const existingImages = hotelData?.images?.filter(img => img && typeof img === 'object' && img.url);
  const newImages = hotelData?.images?.filter(img => img instanceof File);

  // Add all regular fields first
  Object.keys(hotelData).forEach((key) => {
    if (key !== 'images' && key !== 'rooms') {
      if (['amenities', 'features', 'roomTypes'].includes(key)) {
        let arrayValue = hotelData[key];
        if (typeof arrayValue === 'string') {
          try {
            arrayValue = JSON.parse(arrayValue);
          } catch (error) {
            console.log('Error parsing array field:', error);
            arrayValue = [];
          }
        }
        formData.append(key, JSON.stringify(Array.isArray(arrayValue) ? arrayValue : []));
      } else {
        formData.append(key, hotelData[key]);
      }
    }
  });

  // Handle rooms data - ensure it's properly stringified and validated
  if (hotelData.rooms) {
    // Convert room data and filter out invalid images
    const roomsData = hotelData.rooms.map(room => ({
      ...room,
      // Ensure numeric fields are numbers
      price: Number(room.price) || 0,
      capacity: Number(room.capacity) || 1,
      // Filter out invalid images
      images: (room.images || []).filter(img => 
        img && typeof img === 'object' && img.public_id && img.url
      )
    }));
    formData.append('rooms', JSON.stringify(roomsData));
  }

  // Add new image files
  newImages.forEach(img => {
    formData.append('images', img);
  });

  // Add existing images as a separate field
  formData.append('existingImages', JSON.stringify(existingImages));

  const token = safeStorage.get('token');
  return (await axios.put(`${backendUrl}/hotels/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  })).data;
},

  delete: async (id) => (await api.delete(`/hotels/${id}`)).data,
};

// ====================== LOGISTICS ======================
export const LogisticsService = {
  getAll: async () => (await api.get('/logistics')).data,
  create: async (logisticsData) => {
    const formData = new FormData();
    Object.keys(logisticsData).forEach((key) => {
      if (key === 'images') {
        logisticsData.images.forEach(img => formData.append('images', img));
      } else if (key === 'coverageArea' || key === 'features' || key === 'vehicles') {
        formData.append(key, JSON.stringify(logisticsData[key]));
      } else if (key === 'priceRange') {
        formData.append(key, JSON.stringify(logisticsData[key]));
      } else {
        formData.append(key, logisticsData[key]);
      }
    });
    return (await axios.post(`${backendUrl}/logistics`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  update: async (id, logisticsData) => {
    const formData = new FormData();
    Object.keys(logisticsData).forEach((key) => {
      if (key === 'images') {
        logisticsData.images.forEach(img => formData.append('images', img));
      } else if (key === 'coverageArea' || key === 'features' || key === 'vehicles') {
        formData.append(key, JSON.stringify(logisticsData[key]));
      } else if (key === 'priceRange') {
        formData.append(key, JSON.stringify({
          min: Number(logisticsData[key].min),
          max: Number(logisticsData[key].max)
        }));
      } else {
        formData.append(key, logisticsData[key]);
      }
    });
    return (await axios.put(`${backendUrl}/logistics/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  delete: async (id) => (await api.delete(`/logistics/${id}`)).data,
};

// ====================== BLOGS ======================
export const BlogService = {
  getAll: async () => (await api.get('/blogs')).data,
  create: async (blogData) => {
    const formData = new FormData();
    Object.keys(blogData).forEach((key) => {
      if (key === 'images') {
        blogData.images.forEach(img => formData.append('images', img));
      } else if (key === 'tags') {
        formData.append(key, JSON.stringify(blogData[key]));
      } else {
        formData.append(key, blogData[key]);
      }
    });
    return (await axios.post(`${backendUrl}/blogs`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  delete: async (id) => (await api.delete(`/blogs/${id}`)).data,
};

// ====================== REVIEWS ======================
export const ReviewService = {
  create: async (reviewData) => {
    const token = safeStorage.get('token');
    const response = await axios.post(`${backendUrl}/reviews`, reviewData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  },

  getByItem: async (itemId, model, queryParams = {}) => {
    const params = new URLSearchParams({ model, ...queryParams });
    const response = await axios.get(`${backendUrl}/reviews/${itemId}?${params}`);
    return response.data;
  },

  getByUser: async (queryParams = {}) => {
    const params = new URLSearchParams(queryParams);
    const response = await axios.get(`${backendUrl}/reviews/user?${params}`, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`
      }
    });
    return response.data;
  },

  update: async (id, reviewData) => {
    const response = await axios.put(`${backendUrl}/reviews/${id}`, reviewData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`
      }
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${backendUrl}/reviews/${id}`, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`
      }
    });
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get(`${backendUrl}/reviews`, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`
      }
    });
    return response.data;
  },

  getReviewsByDriver: async (driverId) => {
    const params = new URLSearchParams({ model: 'Driver' });
    const response = await axios.get(`${backendUrl}/reviews/${driverId}?${params}`, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`
      }
    });
    return response.data;
  }
};

// ====================== ADS ======================
export const AdService = {
  getAll: async () => (await api.get('/ads')).data,
  getActive: async () => (await api.get('/ads/active')).data,
  create: async (adData) => {
    console.log(adData);

    let formData;
    if (adData instanceof FormData) {
      formData = adData;
    } else {
      formData = new FormData();
      Object.keys(adData).forEach((key) => {
        if (key === 'image') {
          formData.append('image', adData[key]);
        } else {
          formData.append(key, adData[key]);
        }
      });
    }
    return (await axios.post(`${backendUrl}/ads`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  update: async (id, adData) => {
    let formData;
    if (adData instanceof FormData) {
      formData = adData;
    } else {
      formData = new FormData();
      Object.keys(adData).forEach((key) => {
        if (key === 'image') {
          formData.append('image', adData[key]);
        } else {
          formData.append(key, adData[key]);
        }
      });
    }
    return (await axios.put(`${backendUrl}/ads/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${safeStorage.get('token')}`,
      },
    })).data;
  },
  delete: async (id) => (await api.delete(`/ads/${id}`)).data,
};

// ====================== CONTACT ======================
export const ContactService = {
  getAll: async () => (await api.get('/contact')).data,
  create: async (contactData) => (await api.post('/contact', contactData)).data,
  delete: async (id) => (await api.delete(`/contact/${id}`)).data,
};
