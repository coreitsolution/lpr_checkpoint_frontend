import { useRef, useState } from 'react';
import L, { Map as LeafletMap } from 'leaflet';
import { MapConfig } from '../types/index';
import { DEFAULT_MAP_CONFIG } from '../constants/map';

export const useMap = (config: Partial<MapConfig> = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);

  const initMap = (element: HTMLDivElement) => {
    try {
      setIsLoading(true);

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const map = L.map(element).setView(
        [config.center?.lat ?? DEFAULT_MAP_CONFIG.center.lat, config.center?.lng ?? DEFAULT_MAP_CONFIG.center.lng],
        config.zoom ?? DEFAULT_MAP_CONFIG.zoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstance.current = map;
    } 
    catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize map'));
    } 
    finally {
      setIsLoading(false);
    }
  };

  return {
    initMap,
    isLoading,
    error,
    mapInstance: mapInstance.current,
  };
};
