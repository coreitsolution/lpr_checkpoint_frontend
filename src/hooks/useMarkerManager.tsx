import { useState } from 'react';
import L, { Marker, Map as LeafletMap, LatLngExpression } from 'leaflet';
import { MarkerManager } from '../types';

export const useMarkerManager = (map: LeafletMap | null): MarkerManager => {
  const [currentMarker, setCurrentMarker] = useState<Marker | null>(null);

  const clearMarker = () => {
    if (currentMarker) {
      map?.removeLayer(currentMarker);
      setCurrentMarker(null);
    }
  };

  const createMarker = (location: LatLngExpression) => {
    if (!map) return;

    clearMarker();

    const latLng = L.latLng(location);
    const lat = latLng.lat.toFixed(5);
    const lng = latLng.lng.toFixed(5);

    const htmlContent = `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        background-color: transparent;
        width: auto; 
        height: auto;
        pointer-events: none;
      ">
        <img src="/svg/map-pin-icon.svg" style="width: 30px; height: 40px;" />
        <div style="
          color: white; 
          background-color: black; 
          padding: 5px 10px; 
          border-radius: 5px; 
          font-size: 14px; 
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
          margin-top: 4px;
          pointer-events: none;
          width: 150px;
        ">
          ${lat}, ${lng}
        </div>
      </div>
    `;


    const icon = L.divIcon({
      html: htmlContent,
      className: '',
      iconAnchor: [15, 40],
    });

    const marker = L.marker(location, { icon }).addTo(map);
    setCurrentMarker(marker);
  };

  return {
    currentMarker,
    clearMarker,
    createMarker
  };
};
