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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [logistics, setLogistics] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL 

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("ujjain_token");
    const storedUser = localStorage.getItem("ujjain_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login for demo - replace with actual API call
      if (email === "admin@ujjain.com" && password === "admin123") {
        const mockUser = {
          id: "1",
          name: "Admin User",
          fullName: "Admin User",
          email: "admin@ujjain.com",
          mobile: "9876543210",
          address: "Ujjain, Madhya Pradesh, India",
          role: "admin",
          profilePic: null,
        };
        const mockToken = "mock-jwt-token";

        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem("ujjain_token", mockToken);
        localStorage.setItem("ujjain_user", JSON.stringify(mockUser));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      // Mock signup for demo - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      // Check if email already exists (mock check)
      if (userData.email === "admin@ujjain.com") {
        throw new Error("Email already exists");
      }

      const newUser = {
        id: Date.now().toString(),
        name: userData.fullName,
        fullName: userData.fullName,
        email: userData.email,
        mobile: userData.mobile,
        address: userData.address,
        role: "admin",
        profilePic: null,
        createdAt: new Date().toISOString(),
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem("ujjain_token", mockToken);
      localStorage.setItem("ujjain_user", JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Mock profile update - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      let profilePicUrl = user.profilePic;

      // If there's a new profile picture, simulate upload
      if (profileData.profilePic) {
        // In real implementation, you would upload to a service like AWS S3, Cloudinary, etc.
        profilePicUrl = URL.createObjectURL(profileData.profilePic);
      }

      const updatedUser = {
        ...user,
        fullName: profileData.fullName,
        name: profileData.fullName,
        email: profileData.email,
        mobile: profileData.mobile,
        address: profileData.address,
        profilePic: profilePicUrl,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      localStorage.setItem("ujjain_user", JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ujjain_token");
    localStorage.removeItem("ujjain_user");
  };

  const brand = {
    name: "Explore Ujjain",
    image: "/logo.png",
    description: "",
    icon: "",
    email: "exploreujjain@gmail.com",
    mobile: "9232 398 239",
  };

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

  const fetchBookings = async () => {
    try {
      const data = await BookingService.getAll();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const addBooking = async (bookingData) => {
    await BookingService.create(bookingData);
    fetchBookings();
  };

  const changeBookingStatus = async (id, status) => {
    await BookingService.updateStatus(id, status);
    fetchBookings();
  };

  const removeBooking = async (id) => {
    await BookingService.delete(id);
    fetchBookings();
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
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const removeReview = async (id) => {
    await ReviewService.delete(id);
    fetchReviews();
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

  //USERS
  const fetchUsers = async () => {
    try {
      const data = await UserService.getAll();
      console.log(data, "users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const addUser = async (userData) => {
    await UserService.create(userData);
    fetchUsers();
  };

  const updateUser = async (id, userData) => {
    await UserService.update(id, userData);
    fetchUsers();
  };

  const removeUser = async (id) => {
    await UserService.delete(id);
    fetchUsers();
  };

  // USE EFFECTS - Fetch initial data
  useEffect(() => {
    fetchPlaces();
    fetchCars();
    fetchBlogs();
    fetchBookings();
    fetchContacts();
    fetchHotels();
    fetchLogistics();
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
    const savedFavorites = localStorage.getItem("ujjain-favorites");
    const savedBookings = localStorage.getItem("ujjain-bookings");
    const savedReviews = localStorage.getItem("ujjain-reviews");

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ujjain-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("ujjain-bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("ujjain-reviews", JSON.stringify(reviews));
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

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("ujjain_token");
    const storedUser = localStorage.getItem("ujjain_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const apiCall = async (endpoint, method, data) => {
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
  };
  const value = {
    user,
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
    addBlog,
    removeBlog,
    bookings,
    fetchBookings,
    addBooking,
    changeBookingStatus,
    removeBooking,
    contacts,
    fetchContacts,
    addContact,
    removeContact,
    login,
    logout,
    apiCall,
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
    fetchReviews,
    removeReview,
    fetchContacts,
    removeContact,
    users,
    fetchUsers,
    addUser,
    updateUser,
    removeUser,
  };

  return (
    <UjjainContext.Provider value={value}>{children}</UjjainContext.Provider>
  );
};
