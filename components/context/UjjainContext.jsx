 "use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  PlaceService,
  ReviewService,
  ContactService,
  BookingService,
  BlogService,
  UserService,
  CarService,
  HotelService,
  LogisticsService,
  AdService,
} from "./../apiService.js";
const UjjainContext = createContext();

export const useUjjain = () => {
  const context = useContext(UjjainContext);
  if (!context) {
    throw new Error("useUjjain must be used within UjjainProvider");
  }
  return context;
};

export const UjjainProvider = ({ children }) => {
  //const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [places, setPlaces] = useState([]);
  const [cars, setCars] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [token, setToken] = useState(null);
  const [logistics, setLogistics] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL 

     const brand = {
    name: "Safar Sathi",
    image: "/logo.png",
    description: "Sacred City Explorer",
    icon: "",
    email: "wecare.safarsathi@gmail.com",
    mobile: "9294757679",
  };

  const getAverageRating = (reviews, ratingKey = 'rating') => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }

  const validReviews = reviews.filter(review => {
    const rating = review[ratingKey];
    return typeof rating === 'number' && rating >= 1 && rating <= 5;
  });

  if (validReviews.length === 0) {
    return 0;
  }

  const totalRating = validReviews.reduce((sum, review) => sum + review[ratingKey], 0);
  return Math.round((totalRating / validReviews.length) * 10) / 10;
};

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  console.log('storedToken , storedUser',storedToken , JSON.parse(storedUser))
    
  if (storedToken && storedUser) {
      console.log('login succesfull with token and user from local');
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } 
  }, []);

 // Check if user is authenticated on app load
  useEffect(() => {
   // console.log('token',localStorage.getItem('token'));
    
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await UserService.getProfile();
          setUser(userData.data.user);
          console.log('login succesfull with token');
          
        } catch (err) {
          console.error('Authentication check failed:', err);
          //localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Sign up function
  const signUp = async (userData) => {
    try {
      setLoading(true);
      setError('');
      const response = await UserService.signUp(userData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Sign up failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

// context/UjjainContext.js
const signIn = async (credentials) => {
  try {
    setLoading(true);
    setError('');
    const response = await UserService.signIn(credentials);
    
    // Assuming the response contains user data
    if (response.user) {
      setUser(response.user);
    }
    
    return response;
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || 'Sign in failed';
    setError(errorMsg);
    throw new Error(errorMsg);
  } finally {
    setLoading(false);
  }
};

  // Logout function
  const logout = async () => {
    try {
      //let token = localStorage.getItem('token');
      
      setLoading(true);
 /*   if(token){
    //console.log();
    
     await UserService.logout();
   } */
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      console.log('logout final');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      //console.log('sign in function',updates);

      setError('');
      const response = await UserService.updateProfile(updates);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Profile update failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      setLoading(true);
      await UserService.deleteAccount();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Account deletion failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError('');
      const response = await UserService.changePassword(passwordData);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Password change failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

 //USERS ADMIN
  const fetchUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      console.log(data.data.users, "users");
      setUsers(data.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const addUser = async (userData) => {
    console.log('context userdata',  userData);
    
    await UserService.createUser(userData);
    fetchUsers();
  };

  const updateUser = async (id, userData) => {
    console.log('data at context', userData);
    
    await UserService.updateUser(id, userData);
    fetchUsers();
  };

  const removeUser = async (id) => {
    console.log('remove user context',id);
    
    await UserService.deleteUser(id);
    fetchUsers();
  };

// notificaitons
// Add a notification to a user (admin only)
const addUserNotification = async ( userId,notification) => {
  try {
    console.log('notificaiton context',notification);
    
    const result = await UserService.addNotification(userId, notification);
    console.log("Notification added:", result);
    setUser(result.data.user)
    
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

// Get user notifications
const getUserNotifications = async (userId) => {
  try {
    const result = await UserService.getNotifications(userId);
    console.log("User notifications:", result);
    return result;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

// Mark notification as read
const markAsRead = async (userId, notificationId) => {
  try {
    const result = await UserService.markNotificationAsRead(userId, notificationId);
    console.log("Notification marked as read:", result);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  try {
    const result = await UserService.markAllNotificationsAsRead(userId);
    console.log("All notifications marked as read:", result);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};



  // Clear error
  const clearError = () => setError('');


 
  /* 
  const hotels = [
    {
      id: 1,
      name: "Hotel Mahakal Palace",
      category: "luxury",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.8,
      reviews: 342,
      price: 3500,
      originalPrice: 4200,
      location: "Near Mahakaleshwar Temple",
      distance: "0.2 km from temple",
      amenities: ["Free WiFi", "AC", "Restaurant", "Room Service", "Parking"],
      features: ["Temple View", "Premium Rooms", "24/7 Service"],
      description:
        "Luxury hotel with stunning temple views and premium amenities for a comfortable stay.",
      availability: "Available",
      roomTypes: ["Deluxe", "Suite", "Premium"],
    },
    {
      id: 2,
      name: "Ujjain Heritage Resort",
      category: "heritage",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.7,
      reviews: 289,
      price: 2800,
      originalPrice: 3500,
      location: "Ram Ghat Road",
      distance: "0.5 km from Mahakaleshwar",
      amenities: ["Free WiFi", "AC", "Restaurant", "Swimming Pool", "Spa"],
      features: ["Heritage Architecture", "Cultural Programs", "Garden View"],
      description:
        "Experience traditional hospitality in this beautifully designed heritage property.",
      availability: "Available",
      roomTypes: ["Heritage Room", "Royal Suite"],
    },
    {
      id: 3,
      name: "Budget Inn Ujjain",
      category: "budget",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.3,
      reviews: 156,
      price: 1200,
      originalPrice: 1500,
      location: "Station Road",
      distance: "1.2 km from temple",
      amenities: ["Free WiFi", "AC", "Restaurant", "Parking"],
      features: ["Clean Rooms", "Budget Friendly", "Good Location"],
      description:
        "Comfortable and affordable accommodation perfect for budget-conscious travelers.",
      availability: "Available",
      roomTypes: ["Standard", "Deluxe"],
    },
    {
      id: 4,
      name: "Royal Residency",
      category: "mid-range",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.6,
      reviews: 198,
      price: 2200,
      originalPrice: 2800,
      location: "Kal Bhairav Road",
      distance: "0.8 km from temple",
      amenities: ["Free WiFi", "AC", "Restaurant", "Room Service", "Laundry"],
      features: ["Spacious Rooms", "Modern Amenities", "Great Service"],
      description:
        "Well-appointed mid-range hotel offering excellent value for money.",
      availability: "Available",
      roomTypes: ["Standard", "Deluxe", "Executive"],
    },
    {
      id: 5,
      name: "Shipra Grand",
      category: "luxury",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.9,
      reviews: 267,
      price: 4200,
      originalPrice: 5000,
      location: "Shipra River Front",
      distance: "1.0 km from temple",
      amenities: [
        "Free WiFi",
        "AC",
        "Restaurant",
        "Swimming Pool",
        "Spa",
        "Gym",
      ],
      features: ["River View", "Luxury Suites", "Fine Dining"],
      description:
        "Premium luxury hotel with breathtaking river views and world-class amenities.",
      availability: "Limited",
      roomTypes: ["Deluxe", "River View Suite", "Presidential Suite"],
    },
    {
      id: 6,
      name: "Temple View Lodge",
      category: "budget",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.2,
      reviews: 134,
      price: 900,
      originalPrice: 1200,
      location: "Temple Street",
      distance: "0.1 km from temple",
      amenities: ["Free WiFi", "AC", "Restaurant"],
      features: ["Temple View", "Walking Distance", "Basic Comfort"],
      description:
        "Simple and clean accommodation right next to the temple for convenient darshan.",
      availability: "Available",
      roomTypes: ["Standard", "AC Room"],
    },
  ]; */

  const serviceData = {
    "temple-tour-packages": {
      title: "Temple Tour Packages",
      subtitle: "Complete Spiritual Journey Experience",
      description:
        "Explore all major temples of Ujjain with our expertly crafted tour packages. Experience the divine energy of sacred places with professional guidance and comfortable transportation.",
      image: "/placeholder.svg?height=400&width=800",
      features: [
        "Visit all 12 major temples in Ujjain",
        "Professional local guide included",
        "Comfortable AC transportation",
        "Flexible timing options",
        "Photography assistance",
        "Prasad and offerings arrangement",
        "24/7 support during tour",
        "Customizable itinerary",
      ],
      packages: [
        {
          name: "Half Day Temple Tour",
          duration: "4-5 hours",
          temples: 6,
          price: 1500,
          includes: ["Transport", "Guide", "Water bottles"],
        },
        {
          name: "Full Day Temple Tour",
          duration: "8-10 hours",
          temples: 12,
          price: 2500,
          includes: [
            "Transport",
            "Guide",
            "Lunch",
            "Water bottles",
            "Photography",
          ],
        },
        {
          name: "Premium Spiritual Experience",
          duration: "2 days",
          temples: 15,
          price: 5000,
          includes: [
            "Transport",
            "Guide",
            "Meals",
            "Accommodation",
            "Special darshan arrangements",
          ],
        },
      ],
      testimonials: [
        {
          name: "Rajesh Kumar",
          rating: 5,
          comment:
            "Excellent service! The guide was very knowledgeable about temple history and rituals.",
        },
        {
          name: "Priya Sharma",
          rating: 5,
          comment:
            "Perfect arrangement for Bhasma Aarti. Highly recommended for spiritual seekers.",
        },
      ],
    },
    "kumbh-mela-packages": {
      title: "Kumbh Mela Packages",
      subtitle: "Experience the Grand Spiritual Gathering",
      description:
        "Be part of the world's largest religious gathering with our comprehensive Kumbh Mela packages. We provide complete arrangements for accommodation, transportation, and guided experiences.",
      image: "/placeholder.svg?height=400&width=800",
      features: [
        "Premium tent accommodation near ghats",
        "VIP darshan arrangements",
        "Expert guidance on rituals",
        "Safe and secure transportation",
        "Group and individual packages",
        "Medical assistance available",
        "Cultural program access",
        "Photography and videography services",
      ],
      packages: [
        {
          name: "Basic Kumbh Experience",
          duration: "3 days",
          temples: 8,
          price: 8000,
          includes: ["Tent stay", "Meals", "Transport", "Guide"],
        },
        {
          name: "Premium Kumbh Package",
          duration: "5 days",
          temples: 12,
          price: 15000,
          includes: [
            "Deluxe tent",
            "All meals",
            "AC transport",
            "VIP darshan",
            "Cultural programs",
          ],
        },
        {
          name: "Luxury Kumbh Experience",
          duration: "7 days",
          temples: 15,
          price: 25000,
          includes: [
            "Luxury accommodation",
            "All meals",
            "Private transport",
            "Personal guide",
            "Special ceremonies",
          ],
        },
      ],
      testimonials: [
        {
          name: "Amit Patel",
          rating: 5,
          comment:
            "Once in a lifetime experience! Perfect arrangements and great hospitality.",
        },
        {
          name: "Sunita Devi",
          rating: 5,
          comment:
            "Felt blessed to be part of Kumbh Mela. Excellent service by Ujjain Travel team.",
        },
      ],
    },
  };
  // Fetch all data on mount
  const fetchPlaces = async () => {
    try {
      const data = await PlaceService.getAll();
      setPlaces(data);
    } catch (err) {
      console.error("Error fetching places:", err);
    }
  };

  const addPlace = async (placeData) => {
    await PlaceService.create(placeData);
    fetchPlaces();
  };

  const updatePlace = async (id, placeData) => {
    await PlaceService.update(id, placeData);
    fetchPlaces();
  };

  const removePlace = async (id) => {
    await PlaceService.delete(id);
    fetchPlaces();
  };

  // CARS

  const fetchCars = async () => {
    try {
      const data = await CarService.getAll();
      console.log(data, "cars");

      setCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const addCar = async (carData) => {
    await CarService.create(carData);
    fetchCars();
  };

  const updateCar = async (id, carData) => {
    await CarService.update(id, carData);
    fetchCars();
  };

  const removeCar = async (id) => {
    await CarService.delete(id);
    fetchCars();
  };

  // BLOGS

  const fetchBlogs = async () => {
    try {
      const data = await BlogService.getAll();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const addBlog = async (blogData) => {
    await BlogService.create(blogData);
    fetchBlogs();
  };

  const removeBlog = async (id) => {
    await BlogService.delete(id);
    fetchBlogs();
  };

  // BOOKINGS

  const fetchBookings = async (params = {}) => {
    try {
      const data = await BookingService.getAll(params);
      setBookings(data.bookings || data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchMyBookings = async (params = {}) => {
    try {
      const data = await BookingService.getMyBookings(params);
      setBookings(data.bookings || data);
    } catch (err) {
      console.error("Error fetching my bookings:", err);
    }
  };

  const addBooking = async (bookingData) => {
    try {
      // Ensure user field is set correctly
          console.log('data at context booking addBooking',bookingData );

      if (!bookingData.user && user && user._id) {
        bookingData.user = user._id;
      }
      const result = await BookingService.create(bookingData);
      console.log('Booking created:', result);
      fetchBookings(); // Refresh bookings list

      // Refetch user profile to get updated notifications
      if (user && user._id) {
        try {
          const updatedUser = await UserService.getProfile();
          setUser(updatedUser.data.user);
          localStorage.setItem('user', JSON.stringify(updatedUser.data.user));
        } catch (profileErr) {
          console.error("Error refetching user profile:", profileErr);
        }
      }

      return result;
    } catch (err) {
      console.error("Error creating booking:", err);
      throw err;
    }
  };

  const changeBookingStatus = async (id, status, cancellationReason = null) => {
    try {
      const result = await BookingService.updateStatus(id, status, cancellationReason);
      console.log('Booking status updated:', result);
      fetchBookings(); // Refresh bookings list
      return result;
    } catch (err) {
      console.error("Error updating booking status:", err);
      throw err;
    }
  };

  const cancelBooking = async (id, cancellationReason = null) => {
    try {
      const result = await BookingService.cancelBooking(id, cancellationReason);
      console.log('Booking cancelled:', result);
      fetchBookings(); // Refresh bookings list
      return result;
    } catch (err) {
      console.error("Error cancelling booking:", err);
      throw err;
    }
  };

  const updatePaymentStatus = async (id, paymentStatus, transactionId = null, paymentDate = null) => {
    try {
      const result = await BookingService.updatePaymentStatus(id, paymentStatus, transactionId, paymentDate);
      console.log('Payment status updated:', result);
      fetchBookings(); // Refresh bookings list
      return result;
    } catch (err) {
      console.error("Error updating payment status:", err);
      throw err;
    }
  };

  const removeBooking = async (id) => {
    try {
      const result = await BookingService.delete(id);
      console.log('Booking deleted:', result);
      fetchBookings(); // Refresh bookings list
      return result;
    } catch (err) {
      console.error("Error deleting booking:", err);
      throw err;
    }
  };

  const getBookingById = async (id) => {
    try {
      const result = await BookingService.getById(id);
      return result;
    } catch (err) {
      console.error("Error fetching booking by ID:", err);
      throw err;
    }
  };

  const getBookingsByUser = async (userId, params = {}) => {
    try {
      const result = await BookingService.getByUser(userId, params);
      return result;
    } catch (err) {
      console.error("Error fetching bookings by user:", err);
      throw err;
    }
  };

  // DRIVER FUNCTIONS
  const fetchDriverBookings = async () => {
    try {
      const result = await BookingService.getDriverBookings();
      setBookings(result.bookings || result);
      return result;
    } catch (err) {
      console.error("Error fetching driver bookings:", err);
      throw err;
    }
  };

  const driverAcceptBooking = async (bookingId) => {
    try {
      const result = await BookingService.driverAcceptBooking(bookingId);
      console.log('Driver accepted booking:', result);
      fetchDriverBookings(); // Refresh driver bookings
      return result;
    } catch (err) {
      console.error("Error accepting booking as driver:", err);
      throw err;
    }
  };

  const driverUpdateStatus = async (bookingId, status) => {
    try {
      const result = await BookingService.driverUpdateStatus(bookingId, status);
      console.log('Driver updated booking status:', result);
      fetchDriverBookings(); // Refresh driver bookings
      return result;
    } catch (err) {
      console.error("Error updating booking status as driver:", err);
      throw err;
    }
  };

  const driverShareLocation = async (bookingId, latitude, longitude) => {
    try {
      const result = await BookingService.driverShareLocation(bookingId, latitude, longitude);
      console.log('Driver shared location:', result);
      return result;
    } catch (err) {
      console.error("Error sharing location as driver:", err);
      throw err;
    }
  };

  // HOTELS
  const fetchHotels = async () => {
    try {
      const data = await HotelService.getAll();
      setHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  const addHotel = async (hotelData) => {
    await HotelService.create(hotelData);
    fetchHotels();
  };

  const updateHotel = async (id, hotelData) => {
    console.log('context me data',id, hotelData);
    
    await HotelService.update(id, hotelData);
    fetchHotels();
  };

  const removeHotel = async (id) => {
    await HotelService.delete(id);
    fetchHotels();
  };

  // LOGISTICS
  const fetchLogistics = async () => {
    try {
      const data = await LogisticsService.getAll();
      setLogistics(data);
    } catch (err) {
      console.error("Error fetching logistics:", err);
    }
  };

  const addLogistics = async (logisticsData) => {
    await LogisticsService.create(logisticsData);
    fetchLogistics();
  };

  const updateLogistics = async (id, logisticsData) => {
    await LogisticsService.update(id, logisticsData);
    fetchLogistics();
  };

  const removeLogistics = async (id) => {
    await LogisticsService.delete(id);
    fetchLogistics();
  };

  // REVIEWS
  const fetchReviews = async () => {
    try {
      const data = await ReviewService.getAll();
      setReviews(data);
      console.log('data of reviews', data);
      
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const removeReview = async (id) => {
    await ReviewService.delete(id);
    fetchReviews();
  };

// Create a review for a car
const createCarReview = async () => {
  try {
    const reviewData = {
      rating: 5,
      comment: "Excellent car! Very comfortable and clean.",
      reviewedItem: "car_id_here",
      reviewedModel: "Car"
    };
    
    const result = await ReviewService.create(reviewData);
    console.log("Review created:", result);
  } catch (error) {
    console.error("Error creating review:", error);
  }
};

// Create a review for a driver
const createDriverReview = async () => {
  try {
    const reviewData = {
      rating: 4,
      comment: "Great driver, very professional.",
      reviewedItem: "booking_id_here", // or driver_id depending on your schema
      reviewedModel: "Driver",
      driver: "driver_user_id_here"
    };
    
    const result = await ReviewService.create(reviewData);
    console.log("Driver review created:", result);
  } catch (error) {
    console.error("Error creating driver review:", error);
  }
};

// Get reviews for a hotel
const getHotelReviews = async () => {
  try {
    const result = await ReviewService.getByItem("hotel_id_here", "Hotel", {
      page: 1,
      limit: 10,
      sortBy: "rating",
      sortOrder: "desc"
    });
    console.log("Hotel reviews:", result);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

// Update a review
const updateReview = async () => {
  try {
    const result = await ReviewService.update("review_id_here", {
      rating: 4,
      comment: "Updated review comment"
    });
    console.log("Review updated:", result);
  } catch (error) {
    console.error("Error updating review:", error);
  }
};
  // ADS
  const fetchAds = async () => {
    try {
      const data = await AdService.getAll();
      setAds(data);
    } catch (err) {
      console.error("Error fetching ads:", err);
    }
  };

  const addAd = async (adData) => {
    await AdService.create(adData);
    fetchAds();
  };

  const updateAd = async (id, adData) => {
    await AdService.update(id, adData);
    fetchAds();
  };

  const removeAd = async (id) => {
    await AdService.delete(id);
    fetchAds();
  };

  // CONTACTS
  const fetchContacts = async () => {
    try {
      const data = await ContactService.getAll();
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const addContact = async (contactData) => {
    await ContactService.create(contactData);
    fetchContacts();
  };
  const removeContact = async (id) => {
    await ContactService.delete(id);
    fetchContacts();
  };

 

  // USE EFFECTS - Fetch initial data
  useEffect(() => {
    fetchPlaces();
    fetchCars();
    fetchBlogs();
    fetchBookings();
    fetchReviews();
    fetchHotels();
    fetchLogistics();
    fetchAds();
    fetchUsers()
  }, []);

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("safar-sathi-favorites");
    const savedBookings = localStorage.getItem("safar-sathi-bookings");
    const savedReviews = localStorage.getItem("safar-sathi-reviews");
    const userLocal = localStorage.getItem("user");

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
        setUser(JSON.parse(userLocal));

  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("safar-sathi-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("safar-sathi-bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("safar-sathi-reviews", JSON.stringify(reviews));
  }, [reviews]);
  const addToFavorites = (item) => {
    setFavorites((prev) => [...prev.filter((fav) => fav.id !== item.id), item]);
  };

  const removeFromFavorites = (itemId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== itemId));
  };

  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") {
        setInstallPrompt(null);
      }
    }
  };

/*   const apiCall = async (endpoint, method, data) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      if (
        data &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        options.body = JSON.stringify(data);
      }

      // Mock API responses for demo
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock data based on endpoint
      if (endpoint === "/cars" && method === "GET") {
        return {
          data: [
            {
              _id: "1",
              model: "Toyota Innova",
              type: "SUV",
              pricePerDay: 2500,
              available: true,
              features: ["AC", "GPS", "Music System"],
              images: ["/placeholder.svg?height=200&width=300"],
            },
            {
              _id: "2",
              model: "Maruti Swift",
              type: "Hatchback",
              pricePerDay: 1500,
              available: false,
              features: ["AC", "Music System"],
              images: ["/placeholder.svg?height=200&width=300"],
            },
          ],
        };
      }

      if (endpoint === "/places" && method === "GET") {
        return {
          data: [
            {
              _id: "1",
              name: "Mahakaleshwar Temple",
              category: "Religious",
              location: "Ujjain, MP",
              rating: 4.8,
              isActive: true,
              description: "Famous Jyotirlinga temple",
            },
            {
              _id: "2",
              name: "Kal Bhairav Temple",
              category: "Religious",
              location: "Ujjain, MP",
              rating: 4.5,
              isActive: true,
              description: "Ancient temple dedicated to Kal Bhairav",
            },
          ],
        };
      }

      if (endpoint === "/bookings" && method === "GET") {
        return {
          data: [
            {
              _id: "1",
              bookingId: "UJ001",
              customerName: "Rahul Sharma",
              customerEmail: "rahul@example.com",
              carModel: "Toyota Innova",
              startDate: "2024-01-15",
              endDate: "2024-01-18",
              totalAmount: 7500,
              status: "confirmed",
            },
            {
              _id: "2",
              bookingId: "UJ002",
              customerName: "Priya Patel",
              customerEmail: "priya@example.com",
              carModel: "Maruti Swift",
              startDate: "2024-01-20",
              endDate: "2024-01-22",
              totalAmount: 3000,
              status: "pending",
            },
          ],
        };
      }

      if (endpoint === "/blogs" && method === "GET") {
        return {
          data: [
            {
              _id: "1",
              title: "Top 10 Places to Visit in Ujjain",
              author: "Admin",
              content:
                "Ujjain is a beautiful city with rich cultural heritage...",
              tags: ["travel", "ujjain", "temples"],
              published: true,
              createdAt: "2024-01-10",
            },
            {
              _id: "2",
              title: "Best Time to Visit Ujjain",
              author: "Admin",
              content:
                "The best time to visit Ujjain is during winter months...",
              tags: ["travel", "weather", "tips"],
              published: false,
              createdAt: "2024-01-05",
            },
          ],
        };
      }

      // Default success response for other operations
      return { success: true, data: data };
    } catch (error) {
      throw error;
    }
  }; */
  const getUserById = (userId) => {
  if (!userId || !users || !Array.isArray(users)) {
    return null;
  }

  const cleanUserId = userId.trim();
  
  return users.find(u => {
    return u._id === cleanUserId || 
           u.id === cleanUserId || 
           (u._id && u._id.toString() === cleanUserId);
  }) || null;
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-IN", options); // Output: "06 October 2025"
}

  const value = {
    // notificaitons functions
addUserNotification,markAllAsRead,markAsRead,getUserNotifications,
    user,getUserById,
    places,
    fetchPlaces,
    addPlace,
    updatePlace,
    removePlace,
    cars,
    fetchCars,
    addCar,
    updateCar,
    removeCar,
    blogs,
    fetchBlogs,
    addBlog,getAverageRating,
    removeBlog,
    bookings,
    fetchBookings,
    fetchMyBookings,
    addBooking,
    changeBookingStatus,
    cancelBooking,
    updatePaymentStatus,
    removeBooking,
    getBookingById,
    getBookingsByUser,
    // Driver functions
    fetchDriverBookings,
    driverAcceptBooking,
    driverUpdateStatus,
    driverShareLocation,
    contacts,
    fetchContacts,
    addContact,
    removeContact,
    logout,
    formatDate,
    favorites,
    addToFavorites,
    removeFromFavorites,
    bookings,
    brand,
    reviews,
    addReview,
    isOnline,
    installPrompt,
    installApp,
    hotels,
    serviceData,
    hotels,
    logistics,
    ads,
    reviews,
    contacts,
    fetchHotels,
    addHotel,
    updateHotel,
    removeHotel,
    fetchLogistics,
    addLogistics,
    updateLogistics,
    removeLogistics,
    fetchAds,
    addAd,
    updateAd,
    removeAd,
    fetchReviews,
    removeReview,
    fetchContacts,
    removeContact,
    users,
    fetchUsers,
    addUser,
    updateUser,
    removeUser,

    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,

    updateProfile,
    deleteAccount,
    changePassword,
    clearError,
  };

  return (
    <UjjainContext.Provider value={value}>{children}</UjjainContext.Provider>
  );
};
