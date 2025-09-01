import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_API_URL;


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
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
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

// Add response interceptor to handle token expiration
/* api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if this is an authentication error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Check if we have a token to refresh with
      const token = localStorage.getItem('token');
      if (!token) {
        // No token available, redirect to login
        window.location.href = '/auth/signin';
        return Promise.reject(error);
      }
      
      // Prevent infinite loop by checking if this is already a refresh request
      if (originalRequest.url.includes('/refresh-token')) {
        // This is already a refresh request that failed, don't try again
      //  localStorage.removeItem('token');
        //localStorage.removeItem('user');
        window.location.href = '/auth/signin';
        return Promise.reject(error);
      }
      
      try {
        // Try to refresh the token
        const refreshResponse = await api.post('/users/refresh-token');
        const newToken = refreshResponse.data.token;
        
        // Update stored token
        localStorage.setItem('token', newToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        
        // Refresh failed, clear storage and redirect to login
       // localStorage.removeItem('token');
       // localStorage.removeItem('user');
        window.location.href = '/auth/signin';
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors or if we've already retried, just reject
    return Promise.reject(error);
  }
); */

// Handle token expiration
/* api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //localStorage.removeItem('token');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
); */
 


// ====================== Users ======================
export const UserService = {
  // Authentication
  signUp: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data.token) {
            window.location.href = '/';

      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  signIn: async (credentials) => {
    try {
      // Determine if the input is email or mobile
      const identifier = credentials.identifier; // This could be email or mobile
      const password = credentials.password;
      
      // Check if identifier is email or mobile
     // const isEmail = identifier.includes('@');
      
      const requestData = {
        password,
        identifier
      };

      const response = await api.post('/users/login', requestData);
      
      if (response.data.token) {
        console.log('token', response.data.token);
        
        localStorage.setItem('token', response.data.token);
        // Also store user data if needed
        if (response.data.user) {

          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    console.log('loging out');
    
    const response = await api.post('/users/logout');
   // localStorage.removeItem('token');
    return response.data;
  },
 // Update user profile - COMPLETE VERSION
  updateProfile: async (userData) => {
    console.log('User data service',userData.profilePic);
    
    try {
      const formData = new FormData();
      
      // Helper function to append data
      const appendIfExists = (key, value) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      };
      
      // Append basic user info
      appendIfExists('fullName', userData.fullName);
      appendIfExists('email', userData.email);
      appendIfExists('mobile', userData.mobile);
      
      // Handle address if present
      if (userData.address) {
        appendIfExists('address[street]', userData.address.street);
        appendIfExists('address[city]', userData.address.city);
        appendIfExists('address[state]', userData.address.state);
        appendIfExists('address[country]', userData.address.country);
        appendIfExists('address[postalCode]', userData.address.postalCode);
      }
      
      // Handle profile picture
      if (userData.profilePic && userData.profilePic instanceof File) {
        console.log('userData.profilePic',userData.profilePic);
        
        formData.append('image', userData.profilePic);
      }
      
      // Handle driver license if present
      if (userData.driverLicense) {
        appendIfExists('driverLicense[number]', userData.driverLicense.number);
        appendIfExists('driverLicense[expiryDate]', userData.driverLicense.expiryDate);
        
        if (userData.driverLicense.frontImage instanceof File) {
          formData.append('driverLicenseFront', userData.driverLicense.frontImage);
        }
        if (userData.driverLicense.backImage instanceof File) {
          formData.append('driverLicenseBack', userData.driverLicense.backImage);
        }
      }
      
      // Handle vehicle info if present
      if (userData.vehicleInfo) {
        appendIfExists('vehicleInfo[make]', userData.vehicleInfo.make);
        appendIfExists('vehicleInfo[model]', userData.vehicleInfo.model);
        appendIfExists('vehicleInfo[year]', userData.vehicleInfo.year);
        appendIfExists('vehicleInfo[color]', userData.vehicleInfo.color);
        appendIfExists('vehicleInfo[licensePlate]', userData.vehicleInfo.licensePlate);
      }
      
      // Handle payment method if present
      appendIfExists('preferredPaymentMethod', userData.preferredPaymentMethod);
      
      // Log formData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      //const response = await api.put('/users/update-profile', formData);
           // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

     return (await axios.put(`${backendUrl}/users/update-profile`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data', // ← This is crucial!
                'Authorization': `Bearer ${token}`, // Include the token
  },
})).data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
  // User profile
  getProfile: async () => (await api.get('/users/me')).data,

// Update user profile
  changePassword: async (passwordData) => 
    (await api.patch('/users/change-password', passwordData)).data,
 // Admin function to create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/users/admin/create', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteAccount: async () => {
    const response = await api.delete('/users/delete-account');
    localStorage.removeItem('token');
    return response.data;
  },
 // Add notification to user
  addNotification: async (userId, notificationData) => {
    console.log('userId, notificationData',userId, notificationData);
    
    try {
      const response = await api.post(`/users/${userId}/notifications`, notificationData);
      return response.data;

    } catch (error) {
      throw error;
    }
  },

  // Get user notifications
  getNotifications: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/notifications`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (userId, notificationId) => {
    try {
      const response = await api.patch(`/users/${userId}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (userId) => {
    try {
      const response = await api.patch(`/users/${userId}/notifications/read-all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (userId, notificationId) => {
    try {
      const response = await api.delete(`/users/${userId}/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Clear all notifications
  clearAllNotifications: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}/notifications`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin functions
  getAllUsers: async () => (await api.get('/users')).data,

  getUserById: async (id) => (await api.get(`/users/${id}`)).data,

  updateUser: async (id, userData) => {
        //console.log('data at apiService', userData);
  return (await api.patch(`/users/${id}`, userData)).data},

  deleteUser: async (id) => {
    console.log('remove user api',id);

    return (await api.delete(`/users/${id}`)).data},
  // Refresh token
  //refreshToken: async () => (await api.post('/users/refresh-token')).data,
};


// ====================== PLACES ======================
export const PlaceService = {
  getAll: async () => (await axios.get(`${backendUrl}/places`)).data,
  create: async (placeData) => {
    const formData = new FormData();
    Object.keys(placeData).forEach((key) => {
      if (key === 'images') {
        placeData.images.forEach(img => formData.append('images', img));
      } else {
        formData.append(key, placeData[key]);
      }
    });
    return (await axios.post(`${backendUrl}/places`, formData)).data;
  },
  update:async (id, placeData) => {
    const formData = new FormData();
    Object.keys(placeData).forEach((key) => {
      if (key === 'images') {
        placeData.images.forEach(img => formData.append('images', img));
      } /* else if (key === 'features') {
        formData.append(key, JSON.stringify(carData[key]));
      } */ else {
        formData.append(key, placeData[key]);
      }
    });
    return (await axios.put(`${backendUrl}/places/${id}`, formData)).data;
  },
  delete: async (id) => (await axios.delete(`${backendUrl}/places/${id}`)).data,
};

// ====================== CARS ======================
export const CarService = {
  getAll: async () => (await axios.get(`${backendUrl}/cars`)).data,
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
    return (await axios.post(`${backendUrl}/cars`, formData)).data;
  },
  update: async (id, carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach((key) => {
      if (key === 'images') {
        carData.images.forEach(img => formData.append('images', img));
      } else if (key === 'features') {
        // Check if features is already a string (shouldn't be)
        if (typeof carData[key] === 'string') {
          // If it's already a string, try to parse it first
          try {
            const parsed = JSON.parse(carData[key]);
            formData.append(key, JSON.stringify(parsed));
          } catch {
            formData.append(key, carData[key]);
          }
        } else {
          formData.append(key, JSON.stringify(carData[key]));
        }
      } else {
        formData.append(key, carData[key]);
      }
    });
    return (await axios.put(`${backendUrl}/cars/${id}`, formData)).data;
  },
  delete: async (id) => (await axios.delete(`${backendUrl}/cars/${id}`)).data,
};

// ====================== BLOGS ======================
export const BlogService = {
  getAll: async () => (await axios.get(`${backendUrl}/blogs`)).data,
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
    return (await axios.post(`${backendUrl}/blogs`, formData)).data;
  },
  delete: async (id) => (await axios.delete(`${backendUrl}/blogs/${id}`)).data,
};

// ====================== BOOKINGS ======================
export const BookingService = {
  getAll: async () => (await axios.get(`${backendUrl}/bookings`)).data,
  create: async (bookingData) => (await axios.post(`${backendUrl}/bookings`, bookingData)).data,
  updateStatus: async (id, status) => (await axios.put(`${backendUrl}/bookings/${id}`, { status })).data,
  delete: async (id) => (await axios.delete(`${backendUrl}/bookings/${id}`)).data,
};

// ====================== Hotels ======================
// services/hotelService.js
export const HotelService = {
  getAll: async () => (await axios.get(`${backendUrl}/hotels`)).data,
  
  create: async (hotelData) => {
    const formData = new FormData();
    Object.keys(hotelData).forEach((key) => {
      if (key === 'images') {
        // Only append FILE objects
        hotelData.images.forEach(img => {
          if (img instanceof File) {
            formData.append('images', img);
          }
        });
      } else if (['amenities', 'features', 'roomTypes'].includes(key)) {
        // Handle array fields for hotels based on your schema
        formData.append(key, JSON.stringify(hotelData[key]));
      } else {
        formData.append(key, hotelData[key]);
      }
    });
    return (await axios.post(`${backendUrl}/hotels`, formData)).data;
  },
  
 update: async (id, hotelData) => {
  try {
    console.log('hotelData api service', hotelData);
    
    const formData = new FormData();
    
    // Separate existing images from new files
    const existingImages = hotelData?.images?.filter(img => img && typeof img === 'object' && img.url);
    const newImages = hotelData?.images?.filter(img => img instanceof File);
    
    console.log('Existing images:', existingImages?.length);
    console.log('New images:', newImages?.length);
    
    // Add all regular fields first
    Object.keys(hotelData).forEach((key) => {
      if (key !== 'images') { // Skip images for now
        if (['amenities', 'features', 'roomTypes'].includes(key)) {
          // Handle array fields
          let arrayValue = hotelData[key];
          
          if (typeof arrayValue === 'string') {
            try {
              arrayValue = JSON.parse(arrayValue);
            } catch (error) {
              console.warn(`Could not parse ${key} string:`, arrayValue,error);
              arrayValue = [];
            }
          }
          
          formData.append(key, JSON.stringify(Array.isArray(arrayValue) ? arrayValue : []));
        } else {
          // Regular fields
          formData.append(key, hotelData[key]);
        }
      }
    });
    
    // Add new image files
    newImages.forEach(img => {
      formData.append('images', img);
    });
    
    // Add existing images as a separate field
    formData.append('existingImages', JSON.stringify(existingImages));
    
    // Debug: Log what's in formData
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    // Make the request with proper headers
    const response = await axios.put(`${backendUrl}/hotels/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Response received:', response.status);
    return response.data;
    
  } catch (error) {
    console.error('Error in hotel update service:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Server response error:', error.response.status);
      console.error('Server response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    throw error;
  }
},
  
  delete: async (id) => (await axios.delete(`${backendUrl}/hotels/${id}`)).data,
};

// ====================== Logistics ======================
export const LogisticsService = {
  getAll: async () => (await axios.get(`${backendUrl}/logistics`)).data,
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
    return (await axios.post(`${backendUrl}/logistics`, formData)).data;
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
  return (await axios.put(`${backendUrl}/logistics/${id}`, formData)).data;
},
  delete: async (id) => (await axios.delete(`${backendUrl}/logistics/${id}`)).data,
};

// ====================== USERS ======================
/* export const UserService = {
  // Get all users
  getAll: async () => (await axios.get(`${backendUrl}/users`)).data,

  // Create user
  create: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key === "profileImage") {
        formData.append("profileImage", userData.profileImage);
      } else if (Array.isArray(userData[key]) || typeof userData[key] === "object") {
        formData.append(key, JSON.stringify(userData[key]));
      } else {
        formData.append(key, userData[key]);
      }
    });
    return (await axios.post(`${backendUrl}/users`, formData)).data;
  },

  // Update user
  update: async (id, userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key === "profileImage") {
        formData.append("profileImage", userData.profileImage);
      } else if (Array.isArray(userData[key]) || typeof userData[key] === "object") {
        formData.append(key, JSON.stringify(userData[key]));
      } else {
        formData.append(key, userData[key]);
      }
    });
    return (await axios.put(`${backendUrl}/users/${id}`, formData)).data;
  },

  // Delete user
  delete: async (id) => (await axios.delete(`${backendUrl}/users/${id}`)).data,
};
 */
// ====================== REVIEWS ======================
export const ReviewService = {
  // Create a new review
  create: async (reviewData) => {
    let token = localStorage.getItem('token')
    try {
              console.log('reviewData api service', reviewData);

      const response = await axios.post(`${backendUrl}/reviews`, reviewData, {
       headers: {
                'Authorization': `Bearer ${token}`, // Include the token
  }
      });
      console.log('response.data',response);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get reviews for an item
  getByItem: async (itemId, model, queryParams = {}) => {
    try {
      const params = new URLSearchParams({ model, ...queryParams });
      const response = await axios.get(`${backendUrl}/reviews/${itemId}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's reviews
  getByUser: async (queryParams = {}) => {
    try {
      const params = new URLSearchParams(queryParams);
      const response = await axios.get(`${backendUrl}/reviews/user?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a review
  update: async (id, reviewData) => {
    try {
      const response = await axios.put(`${backendUrl}/reviews/${id}`, reviewData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a review
  delete: async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/reviews/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all reviews (admin only)
  getAll: async () => {
    try {
      //const params = new URLSearchParams(queryParams);
      const response = await axios.get(`${backendUrl}/reviews`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('response.data',response.data);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// ====================== CONTACT ======================
export const ContactService = {
  getAll: async () => (await axios.get(`${backendUrl}/contacts`)).data,
  delete: async (id) => (await axios.delete(`${backendUrl}/contacts/${id}`)).data,
};
