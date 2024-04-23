import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface ClientPosition {
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    google: () => void;
  }
}

export default function MapComponent() {
  const [mapObj, setMapObj] = useState<google.maps.Map>();
  const [circle, setCircle] = useState<google.maps.Circle>();
  const mapRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const loader = new Loader({
    apiKey: apiKey,
    version: "weekly",
  });

  // Alert if permission is requested
  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        alert("You need to grant your browser permission");
      }
    });
  }, []);

  // Creates and Loads map
  useEffect(() => {
    const initializeMap = async (position: GeolocationPosition) => {
      const { Map } = (await google.maps.importLibrary(
        "maps",
      )) as google.maps.MapsLibrary;

      const userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const mapInstance = new Map(mapRef.current!, {
        center: userPosition,
        zoom: 10,
      });

      const radiusCircle = new google.maps.Circle({
        strokeColor: "blue",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "blue",
        fillOpacity: 0.1,
        map: mapInstance,
        center: userPosition,
        radius: 300, // meters
      });
      setMapObj(mapInstance);
      setCircle(radiusCircle);
    };

    if (!apiKey) {
      console.log("api key not loaded");
      return;
    }

    loader.load().then(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => initializeMap(position),
        () => alert("Error: Could not fetch your current location."),
        { enableHighAccuracy: true },
      );
    });
  }, []);

  useEffect(() => {
    let timerOut: ReturnType<typeof setTimeout>;

    if (mapObj) {
      const maxZoom = 15;
      let zoomLevel = mapObj.getZoom();
      const zoomOnLoad = () => {
        if (zoomLevel !== undefined && zoomLevel < maxZoom) {
          mapObj.setZoom(++zoomLevel);
          timerOut = setTimeout(zoomOnLoad, 200);
        }
      };

      zoomOnLoad();
    }
    return () => clearTimeout(timerOut);
  }, [mapObj]);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
}
