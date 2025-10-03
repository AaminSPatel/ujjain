import { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";

export default function RouteLine({ pickup, dropoff }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!pickup || !dropoff) return;

    console.log("pickup", pickup, "dropoff", dropoff);

    const fetchRoute = async () => {
      try {
        console.log("Sending coords to ORS:", [
  [pickup.lng, pickup.lat],
  [dropoff.lng, dropoff.lat],
]);

        const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQ2Mzc2NzJiOTg1NTQ5YTY5NjZhZDNiZjM4ZjI5MjAxIiwiaCI6Im11cm11cjY0In0=", // replace with your key
          },
          body: JSON.stringify({
            coordinates: [
              [pickup.lng, pickup.lat],   // ORS expects [lng, lat]
              [dropoff.lng, dropoff.lat], // ORS expects [lng, lat]
            ],
          }),
        });

        if (!res.ok) {
          console.error("ORS error:", res.status, res.statusText);
          return;
        }

        const data = await res.json();

        if (
          data &&
          data.features &&
          data.features[0] &&
          data.features[0].geometry
        ) {
          const geometry = data.features[0].geometry;
          const decoded = polyline.decode(geometry); // [[lat, lng], [lat, lng], ...]
          setRouteCoords(decoded);
        } else {
          console.error("No route geometry found in ORS response:", data);
        }
      } catch (err) {
        console.error("Route fetch error:", err);
      }
    };

    fetchRoute();
  }, [pickup, dropoff]);

  return routeCoords.length > 0 ? (
    <Polyline positions={routeCoords} color="blue" weight={4} />
  ) : null;
}
