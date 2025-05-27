import { useState, useCallback, useEffect } from 'react';
import { Map as LeafletMap } from 'leaflet';
import { SearchResult } from '../types/index';
import { parseCoordinates } from '../utils/coordinates';
import { useMarkerManager } from './useMarkerManager';

export const useMapSearch = (map: LeafletMap | null) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const markerManager = useMarkerManager(map);

  const searchPlace = useCallback(async (query: string, isCurrentLocation = false) => {
    setSearchResults([]);
    if (!map) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const coordinates = parseCoordinates(query);
      if (isCurrentLocation) {
        if (coordinates) {
          const result: SearchResult = {
            name: `${coordinates.lat}, ${coordinates.lng}`,
            location: coordinates
          };
          setSearchResults([result]);
          map.setView([coordinates.lat, coordinates.lng], 17);
          markerManager.createMarker(coordinates);
          return;
        }
      }

      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!data.length) {
        setSearchError('No results found');
        return;
      }

      const result = {
        name: data[0].display_name,
        location: {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        },
      };

      setSearchResults([result]);
      map.setView([result.location.lat, result.location.lng], 18);
      markerManager.createMarker(result.location);
    } 
    catch (error) {
      setSearchError('Error searching for place');
    } 
    finally {
      setIsSearching(false);
    }
  }, [map, markerManager]);

  const handleClick = useCallback((event: L.LeafletMouseEvent) => {
    const latlng = event.latlng;
    const result: SearchResult = {
      name: `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`,
      location: latlng
    };

    setSearchResults([result]);
    markerManager.createMarker(latlng);
  }, [markerManager]);

  useEffect(() => {
    if (!map) return;
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, handleClick]);

  return {
    searchPlace,
    searchResults,
    isSearching,
    searchError,
  };
};
