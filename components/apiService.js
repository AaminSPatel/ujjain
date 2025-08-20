import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_API_URL;

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
export const UserService = {
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

// ====================== REVIEWS ======================
export const ReviewService = {
  getAll: async () => (await axios.get(`${backendUrl}/reviews`)).data,
  delete: async (id) => (await axios.delete(`${backendUrl}/reviews/${id}`)).data,
};


// ====================== CONTACT ======================
export const ContactService = {
  getAll: async () => (await axios.get(`${backendUrl}/contacts`)).data,
  delete: async (id) => (await axios.delete(`${backendUrl}/contacts/${id}`)).data,
};
