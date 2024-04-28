import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Autocomplete,
  Libraries,
  DirectionsRenderer,
  Marker,
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

interface DriverState {
  position: {
    lat: number;
    lng: number;
  };
  driverDirection: google.maps.DirectionsResult | null;
  driverDistance: string | null;
  driverDuration: string | null;
  isVisible: boolean;
}

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

  const [radius, setRadius] = useState(1000);

  const [direction, setDirection] =
    useState<google.maps.DirectionsResult | null>(null);

  const [distance, setDistance] = useState<string | undefined | null>(null);

  const [duration, setDuration] = useState<string | undefined | null>(null);

  const [driver, setDriver] = useState<DriverState>({
    position: { lat: 0, lng: 0 },
    driverDirection: null,
    driverDistance: null,
    driverDuration: null,
    isVisible: false,
  });

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const originRef = useRef<HTMLInputElement>(null);

  const destinationRef = useRef<HTMLInputElement>(null);

  const [libraries] = useState<Libraries>(["places"]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    version: "weekly",
    libraries: libraries,
  });

  // re-center user position and sets origin to from destination
  const handleCenterUserPosition: React.MouseEventHandler<
    HTMLButtonElement
  > = async (e) => {
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

  const calculateAndSetRoute = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!originRef.current?.value || !destinationRef.current?.value) {
      return;
    }
    const directionServices: google.maps.DirectionsService =
      new google.maps.DirectionsService();

    try {
      const routeRequest = {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      const routeResponse: google.maps.DirectionsResult | null =
        await new Promise((resolve, reject) => {
          directionServices.route(routeRequest, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              resolve(response);
            } else {
              reject(new Error("Failed to retrieve destination direction"));
            }
          });
        });

      setDirection(routeResponse);
      setDistance(routeResponse?.routes[0].legs[0].distance?.text);
      setDuration(routeResponse?.routes[0].legs[0].duration?.text);

      if (userPosition) {
        const nearByDriver = {
          lat: userPosition.lat + 0.007,
          lng: userPosition.lng + 0.0025,
        };

        const userLatLng = new google.maps.LatLng(userPosition);

        const distanceToDriver =
          google.maps.geometry.spherical.computeDistanceBetween(
            userLatLng,
            new google.maps.LatLng(nearByDriver),
          );

        setDriver((prevState) => ({
          ...prevState,
          position: nearByDriver,
          isVisible: distanceToDriver <= radius,
        }));

        if (distanceToDriver <= radius) {
          await calculateRouteDriverToRider(nearByDriver, userPosition);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to calculate driver to rider and used as nested function
  const calculateRouteDriverToRider = async (
    driverPosition: Coordinates,
    userPosition: Coordinates,
  ) => {
    if (!userPosition || !driverPosition) {
      console.error("internal error");
      return;
    }

    const directionServices: google.maps.DirectionsService =
      new google.maps.DirectionsService();

    const request: google.maps.DirectionsRequest = {
      origin: driverPosition,
      destination: userPosition,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    try {
      const response: google.maps.DirectionsResult = await new Promise(
        (resolve, reject) => {
          directionServices.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              resolve(result as google.maps.DirectionsResult);
            } else {
              reject(new Error("Failed to retrieve destination direction"));
            }
          });
        },
      );

      setDriver((prevState) => ({
        ...prevState,
        driverDirection: response as google.maps.DirectionsResult,
        driverDistance: response?.routes[0].legs[0].distance?.text ?? null,
        driverDuration: response?.routes[0].legs[0].duration?.text ?? null,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const moveCarAlongRoute = (path) => {
    let step = 0;
    const numSteps = 100;
    const moveRate = path.length / numSteps;

    const interValId = setInterval(() => {
      step += 1;

      if (step > numSteps) {
        clearInterval(interValId);
      } else {
        const nextPosition = path[Math.floor(step * numSteps)];
        setDriver({ ...driver, position: nextPosition });
      }
    }, 100);
  };

  // clear rider request
  const clearRequest = () => {
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
        {direction ? (
          <div className="border-2 h-full flex flex-col relative">
            <div>{driver.driverDuration}</div>
            <div>{driver.driverDistance}</div>
          </div>
        ) : (
          <form
            onSubmit={calculateAndSetRoute}
            className="h-full flex flex-col justify-center items-center"
          >
            <label htmlFor="origin-form" className="sr-only">
              Origin
            </label>
            {/* from input or ping location */}
            <div className="w-[90%]  relative">
              <Autocomplete>
                <input
                  ref={originRef}
                  name="origin-form"
                  id="origin-form"
                  type="text"
                  placeholder="ride from"
                  className="w-full  h-10 focus:ring-0 focus:ring-offset-0 focus:outline-none placeholder:capitalize placeholder:text-slate-400 placeholder:px-2 placeholder:text-start text-start text-slate-500 flex justify-start items-center px-2 rounded-lg border-2 border-slate-200"
                />
              </Autocomplete>
              <div className="h-full w-10 absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-500 rounded-r-lg border-2">
                <div className="flex h-full justify-center items-center">
                  <button
                    type="button"
                    onClick={handleCenterUserPosition}
                    className="flex transition-all duration-200 ease-in-out bg-white h-3 w-3 rounded-full hover:animate-ping hover:scale-110 cursor-pointer"
                  ></button>
                </div>
              </div>
            </div>

            <label htmlFor="destination-form" className="sr-only">
              Destination
            </label>
            <div className="w-[90%]">
              <Autocomplete>
                <input
                  ref={destinationRef}
                  name="destination-form"
                  id="destination-form"
                  type="text"
                  placeholder="ride to"
                  className="mt-4 w-full h-10 focus:ring-0 focus:ring-offset-0 focus:outline-none placeholder:capitalize placeholder:text-slate-400 placeholder:px-2 placeholder:text-start rounded-lg border-2 border-slate-200"
                />
              </Autocomplete>
            </div>

            <button
              type="submit"
              className="flex justify-center items-center mt-4 h-8 w-20 rounded-lg text-white text-center bg-indigo-500 capitalize transition-transform duration-200 ease-out hover:scale-105 cursor-pointer"
            >
              request
            </button>
          </form>
        )}

        <small className="flex  p-2 text-center justify-center items-center  capitalize">
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

        {mapRef.current && userPosition && driver.isVisible && (
          <Marker position={driver.position} />
        )}
      </GoogleMap>
    </div>
  );
}
