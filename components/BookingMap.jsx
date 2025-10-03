"use client";

import { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 23.2599, // Default Ujjain location
  lng: 75.7849,
};

export default function BookingMap({
  bookingData,
  setBookingData,
}) {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handlePlaceChanged = (type) => {
    const place =
      type === "pickup"
        ? pickupRef.current.getPlace()
        : dropoffRef.current.getPlace();

    if (!place.geometry) return;

    setBookingData((prev) => ({
      ...prev,
      [type + "Location"]: {
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      },
    }));

    if (
      bookingData.pickupLocation.coordinates.lat &&
      bookingData.dropoffLocation.coordinates.lat
    ) {
      calculateRoute();
    }
  };

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: bookingData.pickupLocation.coordinates,
        destination: bookingData.dropoffLocation.coordinates,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="space-y-3">
        <Autocomplete onLoad={(ref) => (pickupRef.current = ref)} onPlaceChanged={() => handlePlaceChanged("pickup")}>
          <input
            type="text"
            placeholder="Enter pickup location"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </Autocomplete>

        <Autocomplete onLoad={(ref) => (dropoffRef.current = ref)} onPlaceChanged={() => handlePlaceChanged("dropoff")}>
          <input
            type="text"
            placeholder="Enter drop-off location"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </Autocomplete>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
