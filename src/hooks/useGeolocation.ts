import { useState, useCallback } from "react";

export type PermissionStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  city: string | null;
  zone: string | null;
  error: string | null;
  status: PermissionStatus;
}

// Reverse geocode approximation using known city bounding boxes
function inferCityAndZone(lat: number, lon: number): { city: string; zone: string } {
  const regions = [
    { city: "Delhi NCR", minLat: 28.4, maxLat: 28.9, minLon: 76.8, maxLon: 77.5, zones: ["Sector 18, Noida", "Connaught Place", "Dwarka", "Gurugram Sec 29"] },
    { city: "Mumbai", minLat: 18.9, maxLat: 19.3, minLon: 72.7, maxLon: 73.0, zones: ["Andheri West", "Bandra", "Powai", "Malad"] },
    { city: "Bangalore", minLat: 12.8, maxLat: 13.1, minLon: 77.4, maxLon: 77.8, zones: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout"] },
    { city: "Hyderabad", minLat: 17.2, maxLat: 17.6, minLon: 78.2, maxLon: 78.7, zones: ["Gachibowli", "Madhapur", "Jubilee Hills", "Kukatpally"] },
    { city: "Chennai", minLat: 12.9, maxLat: 13.2, minLon: 80.1, maxLon: 80.4, zones: ["Anna Nagar", "T. Nagar", "Adyar", "Velachery"] },
    { city: "Pune", minLat: 18.4, maxLat: 18.7, minLon: 73.7, maxLon: 74.0, zones: ["Kothrud", "Hinjewadi", "Viman Nagar", "Koregaon Park"] },
  ];

  for (const r of regions) {
    if (lat >= r.minLat && lat <= r.maxLat && lon >= r.minLon && lon <= r.maxLon) {
      const zone = r.zones[Math.floor(Math.random() * r.zones.length)];
      return { city: r.city, zone };
    }
  }

  return { city: "Delhi NCR", zone: "Sector 18, Noida" };
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    city: null,
    zone: null,
    error: null,
    status: "idle",
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, status: "unsupported", error: "GPS not supported on this device" }));
      return;
    }

    setState(s => ({ ...s, status: "loading", error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const { city, zone } = inferCityAndZone(latitude, longitude);
        setState({
          latitude,
          longitude,
          accuracy,
          city,
          zone,
          error: null,
          status: "granted",
        });
      },
      (err) => {
        setState(s => ({
          ...s,
          status: err.code === GeolocationPositionError.PERMISSION_DENIED ? "denied" : "idle",
          error:
            err.code === GeolocationPositionError.PERMISSION_DENIED
              ? "Location access denied. Please enable GPS permissions."
              : err.code === GeolocationPositionError.TIMEOUT
              ? "Location request timed out."
              : "Unable to detect your location.",
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, requestLocation };
}
