import { useEffect, useRef, useState } from "react";
import "./map.scss";
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
  const [isFullScreen, setIsFullScreen] = useState(false);

  async function initMap(): Promise<void> {
    var { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    var { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    if (!mapRef.current) return;

    var map = new Map(mapRef.current, {
      mapId: "6ff586e93e18149f",
      center: { lat: 13, lng: 100 },
      zoom: 5,
    });

    drawDirectionAndMarker(map, AdvancedMarkerElement);
  }

  const drawDirectionAndMarker = (map: google.maps.Map, AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement) => {
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFA500", "#800080"];

    if (isCompare && compareCoordinates.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      compareCoordinates.forEach((coordinateSet, index) => {
        const path: google.maps.LatLng[] = [];
        const color = colors[index % colors.length];

        coordinateSet.forEach((coord, coordIndex) => {
          const position = new google.maps.LatLng(coord.lat, coord.lng);
          bounds.extend(position);
          path.push(position);

          // if (
          //   !isFullScreen &&
          //   coordIndex !== 0 &&
          //   coordIndex !== coordinateSet.length - 1
          // ) {
          //   return;
          // }

          const label = document.createElement("div");
          label.className = "price-tag";
          label.style.backgroundColor = color;

          if (coordIndex === 0) {
            label.textContent = `Start`;
          } else if (coordIndex === coordinateSet.length - 1) {
            label.textContent = `Stop`;
          } else {
            label.textContent = `${coordIndex + 1}`;
          }

          new AdvancedMarkerElement({
            position,
            map,
            collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
            content: label,
          });
        });

        new google.maps.Polyline({
          path,
          map,
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 3,
        });
      });

      map.fitBounds(bounds);
    } 
    else if (coordinates && coordinates.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      const path: google.maps.LatLng[] = [];
      const color = "#FF0000";

      coordinates.forEach( async (coord) => {
        const position = new google.maps.LatLng(coord.lat, coord.lng);
        bounds.extend(position);
        path.push(position);
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary

        const container = document.createElement("div")
        container.style.position = "relative"
        container.style.display = "flex"
        container.style.alignItems = "center"
        container.style.justifyContent = "center"
        container.style.backgroundColor = "transparent"

        const mapPinIcon = document.createElement("img")
        mapPinIcon.src = '/svg/map-pin-icon.svg'
        mapPinIcon.style.width = "30px"
        mapPinIcon.style.height = "40px"

        container.appendChild(mapPinIcon)

        new AdvancedMarkerElement({
          map,
          position: coord,
          content: container
        });
      });

      new google.maps.Polyline({
        path,
        map,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });

      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    initMap();

    // Event listener for fullscreen change
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isCompare]);

  return (
    <div
      ref={mapRef}
      id="map"
      style={{
        width: width,
        height: height,
        position: "absolute",
        top: isFullScreen ? 0 : '20px',
        left: isFullScreen ? 0 : undefined,
        zIndex: 1,
      }}
    ></div>
  );
}

export default Map;
