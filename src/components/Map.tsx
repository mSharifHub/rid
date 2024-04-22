import { useEffect, useRef, useState } from "react";

export default function Map() {
  const [map, setMap] = useState<google.maps.Map>();
  const [circle, setCircle] = useState<google.maps.Circle>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !map) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const initialConfig = {
              center: pos,
              zoom: 10,
            };
            const newMap = new window.google.maps.Map(
              ref.current as HTMLDivElement,
              initialConfig,
            );
            setMap(newMap);
            const radiusCircle = new google.maps.Circle({
              strokeColor: "blue",
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: "blue",
              fillOpacity: 0.1,
              map: newMap,
              center: pos,
              radius: 100, // meters
            });

            setCircle(radiusCircle);
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
        );
      }
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
