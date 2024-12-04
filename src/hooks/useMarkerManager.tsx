import { useState } from 'react';
import { MarkerManager } from '../types';

export const useMarkerManager = (map: google.maps.Map | null): MarkerManager => {
  const [currentMarker, setCurrentMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const clearMarker = () => {
    if (currentMarker) {
      currentMarker.map = null;
      setCurrentMarker(null);
    }
  };

  const createMarker = async (location: google.maps.LatLngLiteral) => {
    if (!map) return;

    clearMarker();

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

    const label = document.createElement("label")
    label.textContent = `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
    label.style.color = "white"
    label.style.width = "150px"
    label.style.backgroundColor = "black"
    label.style.padding = "5px 10px"
    label.style.borderRadius = "5px"
    label.style.fontSize = "14px"
    label.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.3)"
    label.style.left = "20px"
    label.style.bottom = "-20px"
    label.style.position = "absolute"

    container.appendChild(mapPinIcon)
    container.appendChild(label)
    
    const marker = new AdvancedMarkerElement({
      map,
      position: location,
      content: container
    });

    setCurrentMarker(marker);
  };

  return {
    currentMarker,
    clearMarker,
    createMarker
  };
};