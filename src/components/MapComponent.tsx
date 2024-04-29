import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Libraries,
  DirectionsRenderer,
  Marker,
  Polyline,
} from "@react-google-maps/api";

import React, { useEffect, useState, useRef } from "react";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import RequestRideForm from "./RequestRideForm.tsx";
import RideModal from "./RideModal.tsx";

//Coordinates types
type Coordinates = {
  lat: number;
  lng: number;
};

//Driver Interface
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
  //Reference to use on the html element
  const mapRef = useRef<google.maps.Map | null>(null);

  //UseState to manipulate the user position. Geolocation used bellow
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);

  //This is the state to control the zoom
  const [zoom, setZoom] = useState<number>(10);

  //State to control the circle radius. This state is used to show only drivers within the radius
  const [radius, setRadius] = useState(1000);

  //State to store the user requested ride direction and is a google.maps.DirectionResul
  const [direction, setDirection] =
    useState<google.maps.DirectionsResult | null>(null);

  //State to store user distance
  const [distance, setDistance] = useState<string | undefined | null>(null);

  //State to store user ride request duration
  const [duration, setDuration] = useState<string | undefined | null>(null);

  //State to deal control modal to show
  const [requestSent, setRequestSent] = useState<boolean>(false);

  //State to deal control modal to show
  const [accepted, setAccepted] = useState<boolean>(false);

  //State to track path navigated
  const [navigatePath, setNavigatePath] = useState<google.maps.LatLng[]>([]);

  //Driver State
  const [driver, setDriver] = useState<DriverState>({
    position: { lat: 0, lng: 0 },
    driverDirection: null,
    driverDistance: null,
    driverDuration: null,
    isVisible: false,
  });

  //API key exported for .en. Key needed to use googleAPI
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  //Use ref for the form input originRef used with googleAuto complete
  const originRef = useRef<HTMLInputElement>(null);

  //Use ref for the form input destinationRef used with googleAuto complete
  const destinationRef = useRef<HTMLInputElement>(null);

  //`https://developers.google.com/maps/documentation/javascript/libraries`
  const [libraries] = useState<Libraries>(["places"]);

  //`https://www.npmjs.com/package/@googlemaps/js-api-loader`
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    version: "weekly",
    libraries: libraries,
  });

  const handleCenterUserPosition: React.MouseEventHandler<
    HTMLButtonElement
  > = async (e) => {
    e.preventDefault();

    // return if any error occurs from getting mapRef and user position
    if (!mapRef.current || !userPosition) return;

    //Re-centers  the map to the user position
    mapRef.current!.panTo(userPosition);

    //GeoCoder instance to  get  readable address from lat and lng
    const geocoder = new google.maps.Geocoder();

    // LatLng object with the expect values  for geocode request
    const LatLng = {
      lat: userPosition.lat,
      lng: userPosition.lng,
    };

    // Try and Catch block  to handle async request
    try {
      if (originRef.current) {
        const result = await geocoder.geocode({ location: LatLng });
        // result.results[0].formatted_address is where the address that correspond to the coordinates
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

  // Function to initiate ride request
  const handleAcceptRide = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (mapRef.current && driver.driverDirection) {
      setAccepted(true);
      // extracts the driver direction route to the rider
      const routePath = driver.driverDirection.routes[0].overview_path;
      // re-centers to the  driver location
      mapRef.current.panTo({
        lat: driver.position.lat,
        lng: driver.position.lng,
      });
      // restore zoom to the state zoom
      mapRef.current?.setZoom(zoom);
      // initiates car moving through routhPath coordinates
      moveCarAlongRoute(routePath);
    }
  };

  const generateDriverLocation = async (userPosition: Coordinates) => {
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
  };

  //Function to fetch User direction
  const fetchUserDirections = (routeRequest: google.maps.DirectionsRequest) => {
    return new Promise<google.maps.DirectionsResult>((resolve, reject) => {
      const directionServices = new google.maps.DirectionsService();
      directionServices.route(routeRequest, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response) {
          resolve(response);
        } else {
          reject(
            new Error(
              "Failed to retrieve destination direction. status: " + status,
            ),
          );
        }
      });
    });
  };

  // function to calculate and Set Route
  const calculateAndSetRoute = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    //state to control modal to show
    setRequestSent(true);

    // return if there is no origin or destination values
    if (!originRef.current?.value || !destinationRef.current?.value) {
      console.error("error getting location", event);
      return;
    }

    // Request body API. Check Google Docs
    const routeRequest = {
      // user input  address or the address obtained from   geolocation
      origin: originRef.current.value,
      // destination address. Google AutoComplete list
      destination: destinationRef.current.value,
      // travel mode set to driving. Check google documentation
      travelMode: google.maps.TravelMode.DRIVING,
    };

    try {
      const routeResponse = await fetchUserDirections(routeRequest);
      if (routeResponse) {
        setDirection(routeResponse);
        setDistance(routeResponse?.routes[0].legs[0].distance?.text);
        setDuration(routeResponse?.routes[0].legs[0].duration?.text);
      }
    } catch (err) {
      console.error("error fetching directions", err);
    }

    if (userPosition) {
      try {
        await generateDriverLocation(userPosition);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Function to calculate driver to rider and used as nested function
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

  // function to calculate remaining distance
  const calculateRemainingDistance = (
    nexPositionIndex: number,
    path: google.maps.LatLng[],
  ) => {
    let remainingDistance = 0;
    for (let i = nexPositionIndex; i < path.length - 1; i++) {
      remainingDistance +=
        google.maps.geometry.spherical.computeDistanceBetween(
          path[i],
          path[i + 1],
        );
    }
    remainingDistance = remainingDistance / 1609.34; // mile in meters
    const estimateTime = remainingDistance / 25;

    return {
      remainingDistance,
      estimateTime,
    };
  };

  const moveCarAlongRoute = (path: google.maps.LatLng[]) => {
    let step = 0;
    const numSteps = 200;
    const moveRate = path.length / numSteps;

    const intervalId = setInterval(() => {
      step++;
      if (step >= numSteps) {
        clearInterval(intervalId);
      } else {
        const nextPositionIndex = Math.floor(step * moveRate);
        const nextPosition = path[nextPositionIndex];

        // Destructure values
        const { estimateTime, remainingDistance } = calculateRemainingDistance(
          nextPositionIndex,
          path,
        );

        setDriver((prevState) => ({
          ...prevState,
          position: {
            lat: nextPosition.lat(),
            lng: nextPosition.lng(),
          },
          driverDistance: `${remainingDistance.toFixed(2)} miles`,
          driverDuration: `${(estimateTime * 60).toFixed(0)} minutes`,
        }));
        setNavigatePath(path.slice(0, nextPositionIndex + 1));
      }
    }, 200);
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
        if (mapRef.current) mapRef.current.setCenter(pos);
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
      {!requestSent ? (
        <RequestRideForm
          calculateAndSetRoute={calculateAndSetRoute}
          handleCenterUserPosition={handleCenterUserPosition}
          originRef={originRef}
          destinationRef={destinationRef}
        />
      ) : (
        !accepted && (
          <RideModal driver={driver}>
            <button
              onClick={handleAcceptRide}
              type="button"
              className=" w-[10rem] h-[3rem]  capitalize border-2 bg-slate-400 rounded-lg  font-bold text-white"
            >
              accept
            </button>
          </RideModal>
        )
      )}
      {accepted && (
        <div className="absolute h-8 w-[15rem] top-40 left-1/2 -translate-x-1/2 z-50  rounded-lg bg-slate-50 bg-opacity-80  border-2">
          <div className="flex flex-col h-full justify-around items-center font-bold capitalize text-slate-500">
            {driver.driverDuration && parseInt(driver.driverDuration) > 0 ? (
              <span>{driver.driverDuration} away</span>
            ) : (
              <span>arrived</span>
            )}
          </div>
        </div>
      )}
      <GoogleMap
        onLoad={(map): void => {
          mapRef.current = map;
          // Set the map reference
        }}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={userPosition || mapRef.current?.getCenter() || undefined}
        zoom={zoom}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          mapId: "main-map",
        }}
      >
        {mapRef.current && userPosition && !accepted && (
          <Circle
            center={userPosition}
            radius={radius}
            options={defaultCircleOptions}
          />
        )}

        {/* show user directions trip request */}
        {mapRef.current && direction && !accepted && (
          <DirectionsRenderer directions={direction} />
        )}

        {/* show driver directions trip request */}
        {mapRef.current && accepted && driver.driverDirection && (
          <DirectionsRenderer directions={driver.driverDirection} />
        )}

        {mapRef.current && accepted && navigatePath.length > 0 && (
          <Polyline
            path={navigatePath}
            options={{
              strokeColor: "green",
              strokeOpacity: 1,
              strokeWeight: 5,
            }}
          />
        )}

        {mapRef.current && userPosition && driver.isVisible && (
          <Marker
            position={driver.position}
            icon={{
              url: "https://img.icons8.com/isometric/100/taxi.png",
              scaledSize: new google.maps.Size(50, 50),
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
