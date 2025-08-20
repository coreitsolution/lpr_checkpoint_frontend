import { useEffect, useRef, useState } from "react";
import "./map.scss";
import L, { Map as LeafletMap } from "leaflet";
import { MapPosition } from "../../features/api/types";

interface Coordinate {
  lat: number;
  lng: number;
}

interface MapProps {
  coordinates?: MapPosition[];
  compareCoordinates?: Coordinate[][];
  height?: string;
  width?: string;
  isCompare?: boolean;
}

function Map({
  coordinates,
  compareCoordinates = [],
  height = "100%",
  width = "100%",
  isCompare = false,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Prevent re-initializing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current).setView([13, 100], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    drawDirectionAndMarker(map);

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isCompare]);

  const drawDirectionAndMarker = (map: LeafletMap) => {
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFA500", "#800080"];

    if (isCompare && compareCoordinates.length > 0) {
      const bounds = L.latLngBounds([]);

      compareCoordinates.forEach((coordinateSet, index) => {
        const latlngs = coordinateSet.map((c) => {
          const latlng = L.latLng(c.lat, c.lng);
          bounds.extend(latlng);
          return latlng;
        });

        const color = colors[index % colors.length];

        // Draw polyline
        L.polyline(latlngs, {
          color,
          weight: 3,
          opacity: 0.8,
        }).addTo(map);

        // Add custom markers
        coordinateSet.forEach((coord, coordIndex) => {
          let label = coordIndex === 0 ? "Start" :
                      coordIndex === coordinateSet.length - 1 ? "Stop" :
                      `${coordIndex + 1}`;

          const divIcon = L.divIcon({
            className: "price-tag",
            html: `<div style="background-color: ${color};">${label}</div>`,
          });

          L.marker([coord.lat, coord.lng], { icon: divIcon }).addTo(map);
        });
      });

      map.fitBounds(bounds);
    } else if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds([]);
      const latlngs = coordinates.map((c) => {
        const latlng = L.latLng(c.lat, c.lng);
        bounds.extend(latlng);
        return latlng;
      });

      // Draw polyline
      L.polyline(latlngs, {
        color: "#FF0000",
        weight: 3,
        opacity: 0.8,
      }).addTo(map);

      coordinates.forEach((coord) => {
        const icon = L.icon({
          iconUrl: "/svg/map-pin-icon.svg",
          iconSize: [30, 40],
        });

        L.marker([coord.lat, coord.lng], { icon }).addTo(map);
      });

      map.fitBounds(bounds);
    }
  };

  return (
    <div
      ref={mapRef}
      id="map"
      style={{
        width: width,
        height: height,
        position: "absolute",
        top: isFullScreen ? 0 : "20px",
        left: isFullScreen ? 0 : undefined,
        zIndex: 1,
      }}
    />
  );
}

export default Map;
