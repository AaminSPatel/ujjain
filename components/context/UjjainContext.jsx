"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
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
import safeStorage from "./../utils/safeStorage.js";

const UjjainContext = createContext();

export const useUjjain = () => {
  const context = useContext(UjjainContext);
  if (!context) {
    throw new Error("useUjjain must be used within UjjainProvider");
  }
  return context;
};

export const UjjainProvider = ({ children }) => {
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
  const [isClient, setIsClient] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Location tracking state
  const [locationTracking, setLocationTracking] = useState({
    isActive: false,
    bookingId: null,
    watchId: null,
    lastLocation: null,
    lastUpdateTime: null,
  });

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
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check for stored token on mount (client-side only)
    const storedToken = safeStorage.get("token");
    const storedUser = safeStorage.get("user");

    if (storedToken && storedUser) {
      console.log('login succesfull with token and user from local');
      setToken(storedToken);
      setUser(storedUser);
    }
  }, [isClient]);

 // Check if user is authenticated on app load
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      const token = safeStorage.get('token');
      if (token) {
        try {
          const userData = await UserService.getProfile();
          setUser(userData.data.user);
          console.log('login succesfull with token');
        } catch (err) {
          console.error('Authentication check failed:', err);
          safeStorage.remove('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [isClient]);

  // Sign up function
  const signUp = async (userData) => {
    try {
      setLoading(true);
     //console.log('ujjain context');
      setError('');
      const response = await UserService.signUp(userData);
      //console.log('ujjain context',response);
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
      setLoading(true);
      await UserService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      console.log('logout final');
      safeStorage.remove('token');
      safeStorage.remove('user');
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError('');
      const response = await UserService.updateProfile(updates);
      setUser(response.data.user);
      safeStorage.set('user', response.data.user);
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
      safeStorage.remove('token');
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
     // console.log(data.data.users, "users");
      setUsers(data.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const addUser = async (userData) => {
   // console.log('context userdata',  userData);
    
    await UserService.createUser(userData);
    fetchUsers();
  };

  const updateUser = async (id, userData) => {
   // console.log('data at context', userData);
    
    await UserService.updateUser(id, userData);
    fetchUsers();
  };

  const removeUser = async (id) => {
  //  console.log('remove user context',id);
    
    await UserService.deleteUser(id);
    fetchUsers();
  };

// notificaitons
// Add a notification to a user (admin only)
const addUserNotification = async ( userId,notification) => {
  try {
    //console.log('notificaiton context',notification);
    
    const result = await UserService.addNotification(userId, notification);
    //console.log("Notification added:", result);
    setUser(result.data.user)
    
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

// Get user notifications
const getUserNotifications = async (userId) => {
  try {
    const result = await UserService.getNotifications(userId);
    //console.log("User notifications:", result);
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
          safeStorage.set('user', updatedUser.data.user);
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

  const updateBookingStatus = async (id, status, otp = null) => {
    try {
      const result = await BookingService.updateBookingStatus(id, status, otp);
      console.log('Booking status updated:', result);
      fetchBookings(); // Refresh bookings list
      return result;
    } catch (err) {
      console.error("Error updating booking status:", err);
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

  // Location tracking functions
  const startLocationTracking = (bookingId) => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return false;
    }

    if (locationTracking.isActive) {
      stopLocationTracking();
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Update location tracking state
        setLocationTracking(prev => ({
          ...prev,
          lastLocation: location,
          lastUpdateTime: Date.now(),
        }));

        // Send location update to server
        updateDriverLocation(bookingId, location);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    setLocationTracking(prev => ({
      ...prev,
      isActive: true,
      bookingId,
      watchId,
    }));

    return true;
  };

  const stopLocationTracking = () => {
    if (locationTracking.watchId) {
      navigator.geolocation.clearWatch(locationTracking.watchId);
    }

    setLocationTracking({
      isActive: false,
      bookingId: null,
      watchId: null,
      lastLocation: null,
      lastUpdateTime: null,
    });
  };

  const updateDriverLocation = async (bookingId, location) => {
    try {
      const result = await BookingService.updateDriverLocation(bookingId, location);
      console.log('Driver location updated:', result);
      return result;
    } catch (err) {
      console.error("Error updating driver location:", err);
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
    if (!isClient) return;

    fetchPlaces();
    fetchCars();
    fetchBlogs();
    fetchBookings();
    fetchReviews();
    fetchHotels();
    fetchLogistics();
    fetchAds();
    fetchUsers()
  }, [isClient]);

  // PWA Install Prompt
  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

  // Load data from localStorage
  useEffect(() => {
    if (!isClient) return;

    const savedFavorites = safeStorage.get("safar-sathi-favorites");
    const savedBookings = safeStorage.get("safar-sathi-bookings");
    const savedReviews = safeStorage.get("safar-sathi-reviews");
    const userLocal = safeStorage.get("user");

    if (savedFavorites) setFavorites(savedFavorites);
    if (savedBookings) setBookings(savedBookings);
    if (savedReviews) setReviews(savedReviews);
    if (userLocal) setUser(userLocal);
  }, [isClient]);

  // Save to localStorage
  useEffect(() => {
    if (!isClient) return;
    safeStorage.set("safar-sathi-favorites", favorites);
  }, [favorites, isClient]);

  useEffect(() => {
    if (!isClient) return;
    safeStorage.set("safar-sathi-bookings", bookings);
  }, [bookings, isClient]);

  useEffect(() => {
    if (!isClient) return;
    safeStorage.set("safar-sathi-reviews", reviews);
  }, [reviews, isClient]);
  const addToFavorites = (item) => {
    setFavorites((prev) => [...prev.filter((fav) => fav.id !== item.id), item]);
  };

  const removeFromFavorites = (itemId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== itemId));
  };

  const addReview = async (reviewData) => {
    try {
      // Create review via API
      const result = await ReviewService.create(reviewData);

      // Add to local state if successful
      const newReview = {
        ...result.review,
        id: result.review._id,
        createdAt: result.review.createdAt || new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);

      return result;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
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

  // Update Booking Locations
  const updateBookingLocations = async (bookingId, pickupLocation, dropoffLocation) => {
    try {
      setLoading(true);
      setError('');

      const response = await BookingService.updateBookingLocations(bookingId, {
        pickupLocation,
        dropoffLocation
      });

      console.log('Booking locations updated:', response);
      // Refresh bookings list
      fetchBookings();
      fetchMyBookings();

      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update booking locations';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
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
    updateBookingStatus,
    updateBookingLocations,
    removeBooking,
    getBookingById,
    getBookingsByUser,
    // Driver functions
    fetchDriverBookings,
    driverAcceptBooking,
    driverUpdateStatus,
    driverShareLocation,
    // Location tracking functions
    startLocationTracking,
    stopLocationTracking,
    updateDriverLocation,
    locationTracking,
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
