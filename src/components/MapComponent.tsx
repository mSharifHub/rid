import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Autocomplete,
  Libraries,
  DirectionsRenderer,
} from "@react-google-maps/api";

import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

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
const libraries = ["places"] as Libraries;

export default function MapComponent() {
  const mapRef = useRef<google.maps.Map | null>(null);

  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);

  const [zoom, setZoom] = useState<number>(10);

  const [radius, setRadius] = useState(300);

  const [direction, setDirection] =
    useState<google.maps.DirectionsResult | null>(null);

  const [distance, setDistance] = useState<string | undefined | null>(null);

  const [duration, setDuration] = useState<string | undefined | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const originRef = useRef<HTMLInputElement>(null);

  const destinationRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    version: "weekly",
    libraries: libraries,
  });

  // recenter user position and sets origin to from destination
  const handleCenterUserPosition = async (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();

    if (!mapRef.current || !userPosition) return;

    mapRef.current!.panTo(userPosition);

    const geocoder = new google.maps.Geocoder();

    const LatLng = {
      lat: userPosition.lat,
      lng: userPosition.lng,
    };

    try {
      if (originRef.current) {
        const result = await geocoder.geocode({ location: LatLng });
        if (result.results[0]) {
          originRef.current.value = result.results[0].formatted_address;
        } else {
          console.error("error getting address", error);
        }
      }
    } catch (err) {
      console.error("error reversing address", err);
    }
  };

  const calculateRoute = async () => {
    // return early if values are empty
    if (
      originRef.current?.value === "" ||
      destinationRef.current?.value === ""
    ) {
      return;
    }

    if (originRef.current && destinationRef.current) {
      try {
        const directionServices: google.maps.DirectionsService =
          new google.maps.DirectionsService();
        const result: google.maps.DirectionsResult =
          await directionServices.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
          });
        if (result) {
          setDirection(result);
          setDistance(result.routes[0].legs[0].distance?.text);
          setDuration(result.routes[0].legs[0].duration?.text);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const clearRoute = () => {
    if (originRef.current && destinationRef.current) {
      setDirection(null);
      setDistance("");
      setDuration("");
      originRef.current.value = "";
      destinationRef.current.value = "";
    }
  };

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
        mapRef.current!.setCenter(pos);
      },
      (error) => console.error("error getting location", error),
      { enableHighAccuracy: true },
    );
  }, []);

  useEffect(() => {
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
    mapRef.current?.setZoom(zoom);
    return () => clearInterval(timer);
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
      {/* input container */}

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-white bg-opacity-75 w-[30rem] h-[15rem] rounded-lg">
        {/* input for from */}
        <Autocomplete>
          <form className="  flex justify-center items-center mt-10 mx-10 relative">
            <label htmlFor="origin-form" />
            <input
              ref={originRef}
              name="origin-form"
              id="origin-form"
              type="text"
              placeholder="ride from"
              value={originRef.current?.value}
              className=" w-full  h-10 focus:ring-0 focus:ring-offset-0  focus:outline-none placeholder:capitalize placeholder:text-slate-400  placeholder:px-2  placeholder:text-start  rounded-lg  border-2 border-slate-200"
            />

            <button className=" h-full w-10 absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-500 rounded-r-lg  ">
              <div className="flex justify-center items-center">
                <div
                  onClick={(e) => handleCenterUserPosition(e)}
                  className=" transition-all duration-200 ease-in-out bg-white h-3 w-3 rounded-full hover:animate-ping hover:scale-110 cursor-pointer"
                />
              </div>
            </button>
          </form>
        </Autocomplete>
        <Autocomplete>
          <form className="  flex justify-center items-center mt-10 mx-10 relative">
            <label htmlFor="destination-form" />
            <input
              ref={destinationRef}
              name="destination-form"
              id="destination-form"
              type="text"
              placeholder="ride to"
              className=" w-full  h-10 focus:ring-0 focus:ring-offset-0  focus:outline-none placeholder:capitalize placeholder:text-slate-400  placeholder:px-2  placeholder:text-start  rounded-lg  border-2 border-slate-200"
            />
          </form>
        </Autocomplete>
        <small className="flex text-center justify-center items-center mt-2 capitalize">
          powered by
          <FontAwesomeIcon
            icon={faGoogle}
            size="lg"
            className="text-red-600 mx-2"
          ></FontAwesomeIcon>
          APIS
        </small>
      </div>

      <GoogleMap
        onLoad={(map): void => {
          mapRef.current = map; // Set the map reference
        }}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={userPosition || mapRef.current?.getCenter() || undefined}
        zoom={zoom}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {mapRef.current && userPosition && (
          <Circle
            center={userPosition}
            radius={radius}
            options={defaultCircleOptions}
          />
        )}
        {mapRef.current && direction && (
          <DirectionsRenderer directions={direction} />
        )}
      </GoogleMap>
    </div>
  );
}
