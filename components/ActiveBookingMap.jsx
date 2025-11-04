"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  Circle
} from "@react-google-maps/api";
import {FaRoute, FaMapMarkerAlt, FaLocationArrow, FaCar, FaEye, FaEyeSlash, FaShareAlt } from "react-icons/fa";
import { useUjjain } from "./context/UjjainContext";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 23.2599,
  lng: 75.7849,
};

const libraries = [];

export default function ActiveBookingMap({ booking, userRole, onLocationUpdate }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { updateDriverLocation } = useUjjain();

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [driverDirections, setDriverDirections] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [remainingDuration, setRemainingDuration] = useState(null);
  const [distanceFromPickup, setDistanceFromPickup] = useState(null);
  const [showDistancePanel, setShowDistancePanel] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [locationRetries, setLocationRetries] = useState(0);
  const watchIdRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const lastLocationRef = useRef(null);

  const UPDATE_INTERVAL = 10000; // 10 seconds
  const MIN_DISTANCE = 50; // 50 meters

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

const pickupIcon =
  isLoaded && window.google
    ? {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <!-- Location pin -->
              <path d="M15 2C8.1 2 2.5 7.6 2.5 14.5C2.5 21.5 15 38 15 38C15 38 27.5 21.5 27.5 14.5C27.5 7.6 21.9 2 15 2Z" fill="#16a34a"/>
              <circle cx="15" cy="14" r="11" fill="white"/>
              <!-- Letter P -->
              <text x="15" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#16a34a" font-family="Arial, sans-serif">P</text>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(40,30),
        anchor: new window.google.maps.Point(20, 27),
      }
    : null;

const dropIcon =
  isLoaded && window.google
    ? {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <!-- Location pin -->
              <path d="M15 2C8.1 2 2.5 7.6 2.5 14.5C2.5 21.5 15 38 15 38C15 38 27.5 21.5 27.5 14.5C27.5 7.6 21.9 2 15 2Z" fill="#dc2626"/>
              <circle cx="15" cy="14" r="11" fill="white"/>
              <!-- Letter D -->
              <text x="15" y="18" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626" font-family="Arial, sans-serif">D</text>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(40, 30),
        anchor: new window.google.maps.Point(20, 27),
      }
    : null;

const driverCarIcon =
  isLoaded && window.google
    ? {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
           <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"
            fill="#040000" 
            transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)" 
            stroke="#040000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
            <path d="M766.976 508.736c80.576 0 152.448 32.128 199.232 82.176" fill="#AEBCC3"></path>
            <path d="M64.704 684.992c10.816 19.2 32.064 32.192 56.576 32.192h784.64c35.84 0 64.832-27.648 64.832-61.76v-17.408h-36.608a15.744 15.744 0 0 1-16.064-15.296V550.912a277.568 277.568 0 0 0-150.144-44.16h1.6l-55.04-0.256c-53.632-115.2-157.504-210.752-294.208-210.752-136.512 0-251.008 89.728-282.176 210.688h-16.832c-35.456 0-56.128 27.392-56.128 61.184" fill="#E8447A"></path><path d="M64.704 654.464h13.76a39.168 39.168 0 0 0 40.064-38.272v-17.6c0-21.12-17.92-38.208-40.064-38.208h-13.376" fill="#F5BB1D"></path><path d="M160 684.992a101.632 96.832 0 1 0 203.264 0 101.632 96.832 0 1 0-203.264 0Z" fill="#455963"></path><path d="M218.88 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3"></path><path d="M652.032 684.992a101.568 96.832 0 1 0 203.136 0 101.568 96.832 0 1 0-203.136 0Z" fill="#455963"></path><path d="M710.912 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3"></path><path d="M966.272 591.104v-0.192a257.92 257.92 0 0 0-48.192-40V622.72c0 8.448 7.232 15.296 16.064 15.296h36.608v-42.304l-4.48-4.608z" fill="#F5BB1D"></path><path d="M405.568 335.616c-104.896 6.336-191.296 76.8-216.64 170.816h216.64V335.616zM445.696 506.432h216.64c-41.216-86.848-117.12-159.616-216.64-170.048v170.048z" fill="#b3fffb"></path></g></svg>
           `),
           scaledSize: new window.google.maps.Size(40,30),
        anchor: new window.google.maps.Point(20, 22),
      }
    : null;
  // 📍 Show pickup → drop route
  useEffect(() => {
    if (!map || !booking?.pickupLocation?.coordinates || !booking?.dropoffLocation?.coordinates) return;
    if (!window.google?.maps?.DirectionsService) return;

    // Validate coordinates before using
    if (!isValidCoordinate(booking.pickupLocation.coordinates) || !isValidCoordinate(booking.dropoffLocation.coordinates)) {
      console.error("Invalid pickup or dropoff coordinates for directions");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: booking.pickupLocation.coordinates,
        destination: booking.dropoffLocation.coordinates,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [map, booking]);

  // 🚗 Driver directions and distance calculation (to pickup when accepted/in_progress, to drop when picked)
  useEffect(() => {
    if (!driverLocation || !isValidCoordinate(driverLocation)) return;
    if (!window.google?.maps?.DirectionsService) return;

    // Always show route to pickup location for active bookings
    let destination = booking?.pickupLocation?.coordinates;

    if (!destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: driverLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDriverDirections(result);
          // Extract distance and duration
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            setRemainingDistance(leg.distance?.text || null);
            setRemainingDuration(leg.duration?.text || null);
          }
        } else {
          console.error("Driver directions request failed:", status);
          setRemainingDistance(null);
          setRemainingDuration(null);
        }
      }
    );
  }, [driverLocation, booking?.pickupLocation?.coordinates, booking?.dropoffLocation?.coordinates, booking?.status]);

  // 📏 Calculate distance from driver to pickup when status is accepted or in_progress
  useEffect(() => {
    if (!driverLocation || !booking?.pickupLocation?.coordinates || !['accepted', 'in_progress'].includes(booking?.status)) {
      setDistanceFromPickup(null);
      return;
    }

    if (!window.google?.maps?.geometry?.spherical) return;

    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(driverLocation.lat, driverLocation.lng),
      new window.google.maps.LatLng(booking.pickupLocation.coordinates.lat, booking.pickupLocation.coordinates.lng)
    );

    // Convert to kilometers and format
    const distanceKm = (distance / 1000).toFixed(1);
    setDistanceFromPickup(`${distanceKm} km`);
  }, [driverLocation, booking?.pickupLocation?.coordinates, booking?.status]);

  // 🚗 Initialize driver location from booking data for both driver and passenger
  useEffect(() => {
    if (booking?.driverLocation?.coordinates && booking?.status !== 'completed') {
      const location = booking.driverLocation.coordinates;
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lng);
      if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) && isValidCoordinate({ lat, lng })) {
        setDriverLocation({ lat, lng });
      } else {
        console.error("Invalid driver location data:", location);
      }
    }
  }, [booking?.driverLocation, booking?.status, userRole]);

  // 🚗 Clear driver location when booking status becomes 'completed'
  useEffect(() => {
    if (booking?.status === 'completed') {
      setDriverLocation(null);
    }
  }, [booking?.status]);

  // 🚗 Driver live location tracking with improved accuracy
  useEffect(() => {
    if (userRole !== "driver" || !navigator.geolocation || booking?.status === 'completed') return;

    // Get initial location immediately for drivers with extended timeout and better retry logic
    const getInitialLocation = (retryCount = 0) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (isValidCoordinate(location)) {
            setDriverLocation(location);
            onLocationUpdate?.(location);
            updateDriverLocation(booking._id, location);
            setLocationError(null);
            setLocationRetries(0);
          }
        },
        (error) => {
          console.error("Error getting initial driver location:", error);

          if (error.code === error.TIMEOUT && retryCount < 3) {
            console.log(`Initial location timeout, retrying... (attempt ${retryCount + 1})`);
            // Increase delay between retries to give GPS more time to acquire signal
            setTimeout(() => getInitialLocation(retryCount + 1), 2000);
          } else {
            // Provide more user-friendly error messages
            let errorMessage = "Location unavailable";
            if (error.code === error.PERMISSION_DENIED) {
              errorMessage = "Location permission denied. Please enable location services.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              errorMessage = "Location unavailable. Check GPS settings.";
            } else if (error.code === error.TIMEOUT) {
              errorMessage = "Location timeout. Please try again.";
            }
            setLocationError(errorMessage);
            setLocationRetries(prev => prev + 1);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, // Increased from 20000 to 30000 for better reliability
          maximumAge: 60000,
        }
      );
    };

    getInitialLocation();

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        let location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Validate initial coordinates
        if (!isValidCoordinate(location)) {
          console.error("Invalid GPS coordinates received:", location);
          return;
        }

        // Use Nominatim for reverse geocoding to avoid third-party cookies
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`,
          );
          const data = await response.json();
          if (data && data.lat && data.lon) {
            // Use more precise coordinates from Nominatim if available
            location = {
              lat: parseFloat(data.lat),
              lng: parseFloat(data.lon),
            };
          }
        } catch (error) {
          console.warn("Nominatim geocoding failed, using raw GPS coordinates:", error);
        }

        // Validate coordinates after geocoding
        if (!isValidCoordinate(location)) {
          console.error("Invalid coordinates after geocoding:", location);
          return;
        }

        const now = Date.now();
        if (now - lastUpdateTimeRef.current < UPDATE_INTERVAL) return;

        if (lastLocationRef.current) {
          const distance =
            Math.sqrt(
              Math.pow(location.lat - lastLocationRef.current.lat, 2) +
                Math.pow(location.lng - lastLocationRef.current.lng, 2)
            ) * 111320;
          if (distance < MIN_DISTANCE) return;
        }

        setDriverLocation(location);
        lastLocationRef.current = location;
        lastUpdateTimeRef.current = now;
        onLocationUpdate?.(location);
        updateDriverLocation(booking._id, location);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(error.message || "Location tracking failed");
        setLocationRetries(prev => prev + 1);

        // Fallback: Try getting location with different options
        if (error.code === error.TIMEOUT && locationRetries < 3) {
          console.log("Location timeout, retrying with extended timeout...");
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              if (isValidCoordinate(location)) {
                setDriverLocation(location);
                updateDriverLocation(booking._id, location);
                setLocationError(null);
                setLocationRetries(0);
              }
            },
            (fallbackError) => {
              console.error("Fallback location failed:", fallbackError);
              setLocationError(fallbackError.message || "Location unavailable");
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 60000,
            }
          );
        } else if (locationRetries >= 3) {
          console.error("Maximum location retries exceeded");
          setLocationError("Unable to get location after multiple attempts");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [userRole, onLocationUpdate, updateDriverLocation, booking?._id]);

  // 👤 Passenger location tracking for sharing
  useEffect(() => {
    if (userRole !== "passenger" || !navigator.geolocation) return;

    const passengerWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
      },
      (error) => console.error("Error getting passenger location:", error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(passengerWatchId);
    };
  }, [userRole]);



  // 📍 Share location function
  const shareLocation = () => {
    if (!userLocation) {
      alert("Location not available. Please enable location services.");
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
    const message = `I'm currently at this location for my ride. Track me here: ${googleMapsUrl}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Current Location',
        text: message,
        url: googleMapsUrl,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(message).then(() => {
        alert("Location link copied to clipboard!");
      });
    }
  };

  // Helper function to validate coordinates
  const isValidCoordinate = (coord) => {
    return coord &&
           typeof coord.lat === 'number' &&
           typeof coord.lng === 'number' &&
           isFinite(coord.lat) &&
           isFinite(coord.lng) &&
           coord.lat >= -90 && coord.lat <= 90 &&
           coord.lng >= -180 && coord.lng <= 180;
  };

  // 🗺️ Fit map to all markers
  useEffect(() => {
    if (!map || !isLoaded || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();

    if (booking?.pickupLocation?.coordinates && isValidCoordinate(booking.pickupLocation.coordinates)) {
      bounds.extend(booking.pickupLocation.coordinates);
    }
    if (booking?.dropoffLocation?.coordinates && isValidCoordinate(booking.dropoffLocation.coordinates)) {
      bounds.extend(booking.dropoffLocation.coordinates);
    }
    if (driverLocation && isValidCoordinate(driverLocation)) {
      bounds.extend(driverLocation);
    }
    if (userLocation && isValidCoordinate(userLocation)) {
      bounds.extend(userLocation);
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15) map.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, booking, driverLocation, userLocation, isLoaded]);

  if (!isLoaded) {
  return (
    <div className="w-full h-60 md:h-64 lg:h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: false,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: "cooperative",
        }}
      >
        {/* Pickup Marker */}
        {booking?.pickupLocation?.coordinates && (
          <Marker position={booking.pickupLocation.coordinates} icon={pickupIcon} title="Pickup Location" />
        )}

        {/* Drop Marker */}
        {booking?.dropoffLocation?.coordinates && (
          <Marker position={booking.dropoffLocation.coordinates} icon={dropIcon} title="Drop-off Location" />
        )}

        {/* Driver Marker */}
        {driverLocation && booking?.status !== 'completed' && <Marker position={driverLocation} icon={driverCarIcon} title="Driver Location" />}

        {/* Accuracy Circle */}
        {driverLocation && booking?.status !== 'completed' && (
          <Circle
            center={driverLocation}
            radius={50}
            options={{
              fillColor: "#F97316",
              fillOpacity: 0.1,
              strokeColor: "#F97316",
              strokeOpacity: 0.3,
              strokeWeight: 1,
            }}
          />
        )}

        {/* Pickup → Drop Directions */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#c998d6",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Driver Directions to Pickup */}
        {driverDirections && booking?.status !== 'completed' && (
          <DirectionsRenderer
            directions={driverDirections}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#3B82F6",
                strokeWeight: 6,
                strokeOpacity: 0.9,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Legend */}
      <div className="absolute -top-7 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-1 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Pickup</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Drop-off</span>
          </div>
          {driverLocation && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Driver</span>
            </div>
          )}
        </div>
      </div>

      {/* Distance and Time Info Panel */}
      {(remainingDistance || remainingDuration || distanceFromPickup) && showDistancePanel && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowDistancePanel(false)}
              className="absolute -top-1 -right-1 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
              title="Hide distance info"
            >
              <FaEyeSlash className="text-gray-600 text-xs" />
            </button>
            <div className="space-y-2 pr-6">
              {distanceFromPickup && ['accepted', 'in_progress'].includes(booking?.status) && (
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-green-500 text-sm" />
                  <span className="text-xs text-gray-600">From Pickup:</span>
                  <span className="text-sm font-semibold text-gray-800">{distanceFromPickup}</span>
                </div>
              )}
              {remainingDistance && (
                <div className="flex items-center space-x-2">
                  <FaRoute className="text-orange-500 text-sm" />
                  <span className="text-xs text-gray-600">To Drop:</span>
                  <span className="text-sm font-semibold text-gray-800">{remainingDistance}</span>
                </div>
              )}
              {remainingDuration && (
                <div className="flex items-center space-x-2">
                  <FaLocationArrow className="text-blue-500 text-sm" />
                  <span className="text-xs text-gray-600">ETA:</span>
                  <span className="text-sm font-semibold text-gray-800">{remainingDuration}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button for Distance Panel */}
      {(remainingDistance || remainingDuration || distanceFromPickup) && !showDistancePanel && (
        <button
          onClick={() => setShowDistancePanel(true)}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          title="Show distance info"
        >
          <FaEye className="text-gray-600 text-sm" />
        </button>
      )}

      {/* Status Badges */}
      {userRole === "driver" && (
        <div className="absolute -bottom-10 left-4 bg-green-500 text-white px-2 py-1 rounded-2xl text-sm font-semibold shadow-lg flex items-center">
          <FaLocationArrow className="mr-2 animate-pulse" />
          Live Tracking ON
        </div>
      )}
      {userRole === "passenger" && driverLocation && (
        <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-2xl text-sm font-semibold shadow-lg flex items-center">
          <FaCar className="mr-2" />
          Driver Live Location
        </div>
      )}

      {/* Share Location Button for Passengers */}
      {userRole === "passenger" && userLocation && (
        <button
          onClick={shareLocation}
          className="absolute bottom-4 left-4 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-2xl text-sm font-semibold shadow-lg flex items-center transition-colors"
          title="Share your location"
        >
          <FaShareAlt className="mr-2" />
          Share Location
        </button>
      )}

      {/* Location Error Display */}
      {locationError && userRole === "driver" && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-2xl text-sm font-semibold shadow-lg flex items-center">
          <FaLocationArrow className="mr-2" />
          {locationError}
        </div>
      )}
    </div>
  );
}
