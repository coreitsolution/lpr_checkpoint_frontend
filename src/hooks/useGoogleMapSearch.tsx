import { useState, useCallback, useEffect } from 'react'
import { SearchResult } from '../types/index'
import { parseCoordinates } from '../utils/coordinates'
import { useMarkerManager } from './useMarkerManager'

export const useMapSearch = (map: google.maps.Map | null) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const markerManager = useMarkerManager(map)

  const searchPlace = useCallback(async (query: string) => {
    setSearchResults([])
    if (!map) return
    
    setIsSearching(true)
    setSearchError(null)
    
    try {
      // First check if input is coordinates
      const coordinates = parseCoordinates(query)
      if (coordinates) {
        const result: SearchResult = {
          name: `${coordinates.lat}, ${coordinates.lng}`,
          location: coordinates
        }
        setSearchResults([result])
        map.panTo(coordinates)
        map.setZoom(18)
        await markerManager.createMarker(coordinates)
        return
      }

      // If not coordinates, search for place
      const { Geocoder } = (await google.maps.importLibrary("geocoding")) as google.maps.GeocodingLibrary
      const geocoder = new Geocoder()
      
      const response = await geocoder.geocode({ address: query })
      
      if (response.results.length === 0) {
        setSearchError('No results found')
        setSearchResults([])
        return
      }

      const results: SearchResult[] = response.results.map(result => ({
        name: result.formatted_address,
        location: result.geometry.location.toJSON(),
        placeId: result.place_id
      }))

      setSearchResults([results[0]])
      map.panTo(results[0].location)
      map.setZoom(18)
      await markerManager.createMarker(results[0].location)
    } 
    catch (error) {
      setSearchError('Error searching for place')
      setSearchResults([])
    } 
    finally {
      setIsSearching(false)
    }
  }, [map, markerManager])

  const goToPlace = useCallback((result: SearchResult) => {
    if (!map) return
    
    map.panTo(result.location)
    map.setZoom(15)
  }, [map])

  const handleClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return

    const location = event.latLng.toJSON()
    const result: SearchResult = {
      name: `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`,
      location: location,
    }

    setSearchResults([result])

    await markerManager.createMarker(location)
  }, [markerManager])

  useEffect(() => {
    if (!map) return

    map.addListener("click", handleClick)

    // Cleanup listener on unmount or map change
    return () => {
      google.maps.event.clearListeners(map, "click")
    }
  }, [map, markerManager])

  return {
    searchPlace,
    goToPlace,
    searchResults,
    isSearching,
    searchError
  }
}