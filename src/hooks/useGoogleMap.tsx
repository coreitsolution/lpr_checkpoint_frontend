import { useRef, useState } from 'react'
import { MapConfig } from '../types/index'
import { DEFAULT_MAP_CONFIG } from '../constants/map'

export const useGoogleMap = (config: Partial<MapConfig> = {}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)

  const initMap = async (element: HTMLDivElement) => {
    try {
      setIsLoading(true)
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary
      
      mapInstance.current = new Map(element, {
        ...DEFAULT_MAP_CONFIG,
        ...config
      })
    } 
    catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize map'))
    } 
    finally {
      setIsLoading(false)
    }
  }

  return {
    initMap,
    isLoading,
    error,
    mapInstance: mapInstance.current
  }
}