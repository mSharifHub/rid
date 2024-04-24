import { useJsApiLoader, GoogleMap, Circle } from "@react-google-maps/api";
import { useCallback, useEffect, useState, useRef } from "react";

// coordinates types
type Coordinates = {
  lat: number;
  lng: number;
};

const defaultCircleOptions = {
  strokeOpacity: 0.1,
  strokeWeight: 2,
  fillColor: "blue",
  fillOpacity: 0.12,
};

export default function MapComponent() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
  const [zoom, setZoom] = useState<number>(10);
  const [radius, setRadius] = useState(300);
  const [onPing, setOnPing] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(pos);
        if (mapRef.current) {
          setUserPosition(pos);
          mapRef.current!.setCenter(pos);

          const timer = setInterval(() => {
            setZoom((prev) => {
              if (prev >= 15) {
                clearInterval(timer);
                return prev;
              } else {
                return prev + 1;
              }
            });
          }, 200);

          return () => clearInterval(timer);
        }
      },
      (error) => console.error("error getting location", error),
      { enableHighAccuracy: true },
    );
  }, [zoom]);

  if (!isLoaded) {
    return (
      <div className="min-h-full min-w-full flex justify-center items-center">
        <div className="w-1/2 h-1/2 bg-slate-300 animate-pulse"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-medium text-red-600">
          Error loading Google Maps
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative flex flex-col">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
        <form className="shadow-xl">
          <label htmlFor="destination-form" />
          <input
            name="destination-form"
            id="destination-form"
            type="text"
            placeholder="enter destination"
            className=" w-80  h-10 focus:ring-0 focus:ring-offset-0  focus:outline-none placeholder:capitalize placeholder:text-slate-400  placeholder:px-2  placeholder:text-start  rounded-lg"
          />
          <button className=" h-full w-10 absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-500 rounded-r-lg  ">
            <div className="flex justify-center items-center">
              <div
                onMouseEnter={() => setOnPing(true)}
                onClick={() => mapRef.current?.setCenter(userPosition!)}
                className=" transition-all duration-200 ease-in-out bg-white h-5 w-5 rounded-full hover:animate-ping hover:scale-110 cursor-pointer"
              />
            </div>
          </button>

          {/* google auto complete*/}
        </form>
      </div>
      <GoogleMap
        onLoad={(map): void => {
          mapRef.current = map; // Set the map reference
        }}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={userPosition || mapRef.current?.getCenter() || undefined}
        zoom={zoom}
      >
        {mapRef.current && userPosition && (
          <Circle
            center={userPosition}
            radius={radius}
            options={defaultCircleOptions}
          />
        )}
      </GoogleMap>
    </div>
  );
}
