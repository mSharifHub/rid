import { useEffect, useRef, useState } from "react";

interface Position {
  lat: number;
  lng: number;
}

export default function Map() {
  const [map, setMap] = useState<google.maps.Map>();
  const [circle, setCircle] = useState<google.maps.Circle>();
  const [carMarker, setCarMarker] =
    useState<google.maps.marker.AdvancedMarkerElement>();
  const ref = useRef<HTMLDivElement>(null);

  const setNearPosition = (baseLocation: Position): Position => {
    return {
      lat: baseLocation.lat + (Math.random() - 3) * 2,
      lng: baseLocation.lng + (Math.random() - 3) * 2,
    };
  };

  useEffect(() => {
    if (!map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const initMap = new google.maps.Map(ref.current as HTMLElement, {
          center: userPosition,
          zoom: 15,
        });
        setMap(initMap);

        const radiusCircle = new google.maps.Circle({
          strokeColor: "blue",
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: "blue",
          fillOpacity: 0.1,
          map: initMap,
          center: userPosition,
          radius: 100, // meters
        });

        setCircle(radiusCircle);

        const carPosition = setNearPosition(userPosition);

        const initCarMarker = new google.maps.marker.AdvancedMarkerElement({
          position: carPosition,
          map: initMap,
          title: "car marker",
        });
        setCarMarker(initCarMarker);
      });
    }
  }, [map]);

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout>;
    if (map) {
      const maxZoom = 15;
      let zoomLevel = map.getZoom();
      const zoomInQuickly = () => {
        if (zoomLevel !== undefined && zoomLevel < maxZoom) {
          map.setZoom(++zoomLevel); // Increment and set the zoom level
          timeOut = setTimeout(zoomInQuickly, 200); // Set the next zoom step to occur quickly
        }
      };

      zoomInQuickly(); // Start the zooming process
    }
    return () => clearTimeout(timeOut);
  }, [map]);

  useEffect(() => {
    if (circle) {
      let radius = 300;
      const minRadius = 200;
      let focusing = true;

      const interval = setInterval(() => {
        if (focusing) {
          radius -= 10;

          if (radius <= minRadius) {
            focusing = false;
          }
        }

        circle.setRadius(radius);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [circle]);

  return (
    <>
      <div
        ref={ref}
        style={{ height: "100%", width: "80vw", minHeight: "80vh" }}
      ></div>
    </>
  );
}
