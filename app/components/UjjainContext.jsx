"use client"
import { createContext, useContext, useState, useEffect } from "react"

const UjjainContext = createContext()

export const useUjjain = () => {
  const context = useContext(UjjainContext)
  if (!context) {
    throw new Error("useUjjain must be used within UjjainProvider")
  }
  return context
}

export const UjjainProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState(null)
 const brand= {
  name:'Explore Ujjain',
  image:'/logo.png',
  description:'',
  icon:'',
  email:'exploreujjain@gmail.com',
  mobile:'9232 398 239'

 }


    const cars = [
      {
        id: 1,
        name: "Maruti Swift Dzire",
        category: "economy",
        image: "/swi.png",
        rating: 4.8,
        reviews: 234,
        price: 1200,
        originalPrice: 1500,
        seats: 4,
        fuel: "Petrol",
        transmission: "Manual",
        features: ["AC", "Music System", "GPS"],
        driver: {
          name: "Ramesh Kumar",
          rating: 4.9,
          experience: "8 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Perfect for city tours and temple visits. Comfortable and fuel-efficient.",
        availability: "Available",
      },
      {
        id: 2,
        name: "Toyota Innova Crysta",
        category: "premium",
        image: "/inn3.png",
        rating: 4.9,
        reviews: 189,
        price: 2500,
        originalPrice: 3000,
        seats: 7,
        fuel: "Diesel",
        transmission: "Automatic",
        features: ["AC", "Music System", "GPS", "Reclining Seats"],
        driver: {
          name: "Suresh Patel",
          rating: 4.8,
          experience: "12 years",
          languages: ["Hindi", "English", "Gujarati"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Spacious and comfortable for family trips and group tours.",
        availability: "Available",
      },
      {
        id: 3,
        name: "Mahindra Scorpio",
        category: "suv",
        image: "/sco.png",
        rating: 4.7,
        reviews: 156,
        price: 2200,
        originalPrice: 2800,
        seats: 7,
        fuel: "Diesel",
        transmission: "Manual",
        features: ["AC", "Music System", "GPS", "4WD"],
        driver: {
          name: "Vikash Singh",
          rating: 4.7,
          experience: "10 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Robust SUV perfect for outstation trips and rough terrains.",
        availability: "Available",
      },
      {
        id: 4,
        name: "Honda City",
        category: "premium",
        image: "/cit.png",
        rating: 4.8,
        reviews: 198,
        price: 1800,
        originalPrice: 2200,
        seats: 5,
        fuel: "Petrol",
        transmission: "Automatic",
        features: ["AC", "Music System", "GPS", "Sunroof"],
        driver: {
          name: "Ajay Sharma",
          rating: 4.9,
          experience: "9 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Stylish and comfortable sedan for premium travel experience.",
        availability: "Available",
      },
      {
        id: 5,
        name: "Mercedes E-Class",
        category: "luxury",
        image: "/mer.png",
        rating: 5.0,
        reviews: 87,
        price: 5000,
        originalPrice: 6000,
        seats: 5,
        fuel: "Petrol",
        transmission: "Automatic",
        features: ["AC", "Premium Sound", "GPS", "Leather Seats", "WiFi"],
        driver: {
          name: "Rohit Gupta",
          rating: 5.0,
          experience: "15 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Ultimate luxury experience for VIP temple visits and special occasions.",
        availability: "Limited",
      },
      {
        id: 6,
        name: "Tata Nexon",
        category: "economy",
        image: "/nex.png",
        rating: 4.6,
        reviews: 143,
        price: 1500,
        originalPrice: 1800,
        seats: 5,
        fuel: "Petrol",
        transmission: "Manual",
        features: ["AC", "Music System", "GPS"],
        driver: {
          name: "Manoj Kumar",
          rating: 4.6,
          experience: "6 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Compact SUV perfect for small families and couples.",
        availability: "Available",
      },{
        id: 7,
        name: "Mahindra Bolero",
        category: "suv",
        image: "/bol.png",
        rating: 4.2,
        reviews: 143,
        price: 1500,
        originalPrice: 1800,
        seats: 7,
        fuel: "Petrol",
        transmission: "Manual",
        features: ["Music System", "GPS","4WD", ],
        driver: {
          name: "Manoj Kumar",
          rating: 4.6,
          experience: "6 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Ecconomy SUV perfect for 7 members and friends.",
        availability: "Available",
      },{
        id: 8,
        name: "Ertiga",
        category: "premium",
        image: "/nex.png",
        rating: 4.6,
        reviews: 143,
        price: 1500,
        originalPrice: 1800,
        seats: 8,
        fuel: "Petrol",
        transmission: "Manual",
        features: ["AC", "Music System", "GPS","Reclining Seats"],
        driver: {
          name: "Manoj Kumar",
          rating: 4.6,
          experience: "6 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Spacious and comfortable for family trips and group tours.",
        availability: "Available",
      },{
        id:9,
        name: "Jeep Wrangler",
        category: "suv",
        image: "/jee.png",
        rating: 4.6,
        reviews: 143,
        price: 1500,
        originalPrice: 1800,
        seats: 5,
        fuel: "Deisel",
        transmission: "Manual",
        features: [ "Music System", "GPS","4WD"],
        driver: {
          name: "Manoj Kumar",
          rating: 4.6,
          experience: "6 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Prefect SUV for outer courage and feel the nature.",
        availability: "Available",
      },{
        id: 10,
        name: "Jeew Open",
        category: "suv",
        image: "/jee1.png",
        rating: 4.6,
        reviews: 143,
        price: 1500,
        originalPrice: 1800,
        seats: 4,
        fuel: "Deisel",
        transmission: "Manual",
        features: [ "Music System", "GPS","4WD"],
        driver: {
          name: "Manoj Kumar",
          rating: 4.6,
          experience: "6 years",
          languages: ["Hindi", "English"],
          image: "/placeholder.svg?height=50&width=50",
        },
        description: "Compact SUV perfect for small families and couples.",
        availability: "Available",
      },
    ]


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
        description: "Luxury hotel with stunning temple views and premium amenities for a comfortable stay.",
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
        description: "Experience traditional hospitality in this beautifully designed heritage property.",
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
        description: "Comfortable and affordable accommodation perfect for budget-conscious travelers.",
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
        description: "Well-appointed mid-range hotel offering excellent value for money.",
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
        amenities: ["Free WiFi", "AC", "Restaurant", "Swimming Pool", "Spa", "Gym"],
        features: ["River View", "Luxury Suites", "Fine Dining"],
        description: "Premium luxury hotel with breathtaking river views and world-class amenities.",
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
        description: "Simple and clean accommodation right next to the temple for convenient darshan.",
        availability: "Available",
        roomTypes: ["Standard", "AC Room"],
      },
    ]

 const places = [
    {
      id: 1,
      name: "Mahakaleshwar Temple",
      subtitle: "One of 12 Jyotirlingas",
      category: "temples",
      image: ["/mahakal4.jpeg","/mahakal2.jpeg","/mahakal3.jpeg","/mahakal1.jpeg","/mahakal5.jpeg",],
      rating: 4.9,
      reviews: 2847,
      description:
        "One of the twelve Jyotirlingas, this ancient temple is dedicated to Lord Shiva and is the most sacred site in Ujjain.",
      timings: "4:00 AM - 11:00 PM",
      entryFee: "Free",
      bestTime: "Early morning for Bhasma Aarti",
      highlights: ["Bhasma Aarti", "Jyotirlinga Darshan", "Evening Aarti"],
      location: "Mahakaleshwar Temple Road, Ujjain",
    },
    {
      id: 2,
      name: "Ram Ghat",
      subtitle: "Witness the grand spiritual gathering",
      category: "ghats",
      image: ["/ramghat1.jpeg","/ramghat2.jpeg"],
      rating: 4.8,
      reviews: 1523,
      description: "Sacred bathing ghat on the Shipra River, famous for its evening aarti and spiritual atmosphere.",
      timings: "24 Hours",
      entryFee: "Free",
      bestTime: "Evening for Ganga Aarti",
      highlights: ["Evening Aarti", "Holy Bath", "Boat Rides"],
      location: "Shipra River, Ujjain",
    },
    {
      id: 3,
      name: "Kal Bhairav Temple",
      subtitle: "Experience the spritual heart of India",
      category: "temples",
      image: ["/kalbhairawa.jpeg"],
      rating: 4.7,
      reviews: 1876,
      description:
        "Ancient temple dedicated to Kal Bhairav, known for its unique tradition of offering liquor to the deity.",
      timings: "5:00 AM - 10:00 PM",
      entryFee: "Free",
      bestTime: "Morning and Evening",
      highlights: ["Unique Offerings", "Ancient Architecture", "Spiritual Significance"],
      location: "Bhairav Garh, Ujjain",
    },
    {
      id: 4,
      name: "Vedh Shala (Observatory)",
      subtitle: "Visit the Historical Observatory",
      category: "historical",
      image: ["/vedshala.jpeg","/vedshala2.jpg"],
      rating: 4.6,
      reviews: 987,
      description:
        "Historic astronomical observatory built by Maharaja Jai Singh II, showcasing ancient Indian astronomy.",
      timings: "6:00 AM - 6:00 PM",
      entryFee: "₹10",
      bestTime: "Morning",
      highlights: ["Ancient Instruments", "Astronomical Knowledge", "Historical Significance"],
      location: "Observatory Road, Ujjain",
    },
    {
      id: 5,
      name: "Harsiddhi Temple",
      subtitle: "Witness the grand spiritual gathering",
      category: "temples",
      image: ["/harsiddhi.jpeg"],
      rating: 4.8,
      reviews: 1654,
      description:
        "One of the 51 Shakti Peethas, this temple is dedicated to Goddess Harsiddhi and is known for its spiritual power.",
      timings: "5:00 AM - 10:00 PM",
      entryFee: "Free",
      bestTime: "During Navratri",
      highlights: ["Shakti Peetha", "Navratri Celebrations", "Divine Energy"],
      location: "Harsiddhi Temple Road, Ujjain",
    },
    {
      id: 6,
      name: "Chintaman Ganesh Temple",
      category: "temples",
      image: ["/chintaman.jpeg"],
      rating: 4.7,
      reviews: 1432,
      description: "Famous Ganesh temple known for fulfilling devotees wishes and removing obstacles from their lives.",
      timings: "5:00 AM - 10:00 PM",
      entryFee: "Free",
      bestTime: "Tuesday and Wednesday",
      highlights: ["Wish Fulfillment", "Ancient Idol", "Peaceful Atmosphere"],
      location: "Chintaman Ganesh Road, Ujjain",
    },
    {
      id: 7,
      name: "Mangalnath Temple",
      category: "temples",
      image: ["/mangalnath1.JPEG","/mangalnath2.WEBP"],
      rating: 4.6,
      reviews: 1098,
      description:
        "Believed to be the birthplace of Mars (Mangal), this temple is significant for astrological remedies.",
      timings: "6:00 AM - 8:00 PM",
      entryFee: "Free",
      bestTime: "Tuesday",
      highlights: ["Mars Birthplace", "Astrological Significance", "Remedial Worship"],
      location: "Mangalnath Road, Ujjain",
    },
    {
      id: 8,
      name: "Sandipani Ashram",
      category: "cultural",
      image: ["/sandipani.jpeg"],
      rating: 4.5,
      reviews: 876,
      description: "Sacred ashram where Lord Krishna and Balram received their education from Guru Sandipani.",
      timings: "6:00 AM - 6:00 PM",
      entryFee: "Free",
      bestTime: "Morning",
      highlights: ["Krishna Connection", "Educational Heritage", "Peaceful Environment"],
      location: "Sandipani Nagar, Ujjain",
    },
  ]


   const serviceData = {
    "temple-tour-packages": {
      title: "Temple Tour Packages",
      subtitle: "Complete Spiritual Journey Experience",
      description: "Explore all major temples of Ujjain with our expertly crafted tour packages. Experience the divine energy of sacred places with professional guidance and comfortable transportation.",
      image: "/placeholder.svg?height=400&width=800",
      features: [
        "Visit all 12 major temples in Ujjain",
        "Professional local guide included",
        "Comfortable AC transportation",
        "Flexible timing options",
        "Photography assistance",
        "Prasad and offerings arrangement",
        "24/7 support during tour",
        "Customizable itinerary"
      ],
      packages: [
        {
          name: "Half Day Temple Tour",
          duration: "4-5 hours",
          temples: 6,
          price: 1500,
          includes: ["Transport", "Guide", "Water bottles"]
        },
        {
          name: "Full Day Temple Tour",
          duration: "8-10 hours",
          temples: 12,
          price: 2500,
          includes: ["Transport", "Guide", "Lunch", "Water bottles", "Photography"]
        },
        {
          name: "Premium Spiritual Experience",
          duration: "2 days",
          temples: 15,
          price: 5000,
          includes: ["Transport", "Guide", "Meals", "Accommodation", "Special darshan arrangements"]
        }
      ],
      testimonials: [
        {
          name: "Rajesh Kumar",
          rating: 5,
          comment: "Excellent service! The guide was very knowledgeable about temple history and rituals."
        },
        {
          name: "Priya Sharma",
          rating: 5,
          comment: "Perfect arrangement for Bhasma Aarti. Highly recommended for spiritual seekers."
        }
      ]
    },
    "kumbh-mela-packages": {
      title: "Kumbh Mela Packages",
      subtitle: "Experience the Grand Spiritual Gathering",
      description: "Be part of the world's largest religious gathering with our comprehensive Kumbh Mela packages. We provide complete arrangements for accommodation, transportation, and guided experiences.",
      image: "/placeholder.svg?height=400&width=800",
      features: [
        "Premium tent accommodation near ghats",
        "VIP darshan arrangements",
        "Expert guidance on rituals",
        "Safe and secure transportation",
        "Group and individual packages",
        "Medical assistance available",
        "Cultural program access",
        "Photography and videography services"
      ],
      packages: [
        {
          name: "Basic Kumbh Experience",
          duration: "3 days",
          temples: 8,
          price: 8000,
          includes: ["Tent stay", "Meals", "Transport", "Guide"]
        },
        {
          name: "Premium Kumbh Package",
          duration: "5 days",
          temples: 12,
          price: 15000,
          includes: ["Deluxe tent", "All meals", "AC transport", "VIP darshan", "Cultural programs"]
        },
        {
          name: "Luxury Kumbh Experience",
          duration: "7 days",
          temples: 15,
          price: 25000,
          includes: ["Luxury accommodation", "All meals", "Private transport", "Personal guide", "Special ceremonies"]
        }
      ],
      testimonials: [
        {
          name: "Amit Patel",
          rating: 5,
          comment: "Once in a lifetime experience! Perfect arrangements and great hospitality."
        },
        {
          name: "Sunita Devi",
          rating: 5,
          comment: "Felt blessed to be part of Kumbh Mela. Excellent service by Ujjain Travel team."
        }
      ]
    }
  }

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("ujjain-favorites")
    const savedBookings = localStorage.getItem("ujjain-bookings")
    const savedReviews = localStorage.getItem("ujjain-reviews")

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedBookings) setBookings(JSON.parse(savedBookings))
    if (savedReviews) setReviews(JSON.parse(savedReviews))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ujjain-favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("ujjain-bookings", JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem("ujjain-reviews", JSON.stringify(reviews))
  }, [reviews])

  const addToFavorites = (item) => {
    setFavorites((prev) => [...prev.filter((fav) => fav.id !== item.id), item])
  }

  const removeFromFavorites = (itemId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== itemId))
  }

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [newBooking, ...prev])
    return newBooking
  }

  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    setReviews((prev) => [newReview, ...prev])
    return newReview
  }

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const result = await installPrompt.userChoice
      if (result.outcome === "accepted") {
        setInstallPrompt(null)
      }
    }
  }

  const value = {
    user,
    setUser,
    favorites,
    addToFavorites,
    removeFromFavorites,
    bookings,
    addBooking,places,brand,
    reviews,
    addReview,
    isOnline,
    installPrompt,
    installApp,cars, hotels,serviceData,
  }

  return <UjjainContext.Provider value={value}>{children}</UjjainContext.Provider>
}
