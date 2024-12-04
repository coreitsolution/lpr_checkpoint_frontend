import { useRef, useEffect, useState } from "react"
import { MapProps } from "../../types/index"
import { DEFAULT_DIMENSIONS, DEFAULT_MAP_CONFIG } from "../../constants/map"
import { useGoogleMap } from "../../hooks/useGoogleMap"

// Components
import Loading from "../../components/loading/Loading"

const BaseMap: React.FC<MapProps> = ({
  height = DEFAULT_DIMENSIONS.height,
  width = DEFAULT_DIMENSIONS.width,
  panControl = DEFAULT_MAP_CONFIG.panControl,
  zoomControl = DEFAULT_MAP_CONFIG.zoomControl,
  mapTypeControl = DEFAULT_MAP_CONFIG.mapTypeControl,
  streetViewControl = DEFAULT_MAP_CONFIG.streetViewControl,
  fullscreenControl = DEFAULT_MAP_CONFIG.fullscreenControl,
  onMapLoad,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const { initMap, isLoading, error, mapInstance } = useGoogleMap({
    panControl: panControl,
    zoomControl: zoomControl, 
    mapTypeControl: mapTypeControl,
    streetViewControl: streetViewControl,
    fullscreenControl: fullscreenControl, 
  })
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      initMap(mapRef.current)
    }
  }, [])

  useEffect(() => {
    if (onMapLoad) {
      onMapLoad(mapInstance)
    }
  }, [mapInstance, onMapLoad])

  if (error) {
    return <div className="text-red-500">Failed to load map: {error.message}</div>
  }

  return (
    <div>
      { isLoading && <Loading /> }
      <div
        ref={mapRef}
        id="map"
        className="relative"
        style={{
          width,
          height,
          position: "absolute",
          top: isFullScreen ? 0 : 0,
          left: isFullScreen ? 0 : 0,
          zIndex: 1,
        }}
      />
    </div>
  )
}

export default BaseMap