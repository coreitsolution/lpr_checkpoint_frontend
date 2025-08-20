import React, {useState, useCallback, useEffect} from 'react'
import { Map as LeafletMap } from 'leaflet';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"

// Components
import TextBox from '../../../components/text-box/TextBox'
import BaseMap from '../../../components/base-map/BaseMap'
import Loading from "../../../components/loading/Loading"

// Hooks
import { useMapSearch } from "../../../hooks/useOpenStreetMapSearch"

// Types
import { SearchResult } from '../../../types/index'

// Popup
import { PopupMessage } from "../../../utils/popupMessage"

// i18n
import { useTranslation } from "react-i18next";

interface LocationSettingProps {
  open: boolean
  closeDialog: () => void
  confirmPoint: (result: SearchResult) => void
  location?: {
    latitude: string,
    longitude: string,
  }
}
const LocationSetting: React.FC<LocationSettingProps> = ({open, closeDialog, confirmPoint, location}) => {
  // i18n
  const { t } = useTranslation();
  
  const [searchText, setSearchText] = useState("")
  const [map, setMap] = useState<LeafletMap | null>(null)

  const {
    searchPlace,
    isSearching,
    searchError,
    searchResults,
  } = useMapSearch(map)

  const handleMapLoad = useCallback((mapInstance: LeafletMap | null) => {
    setMap(mapInstance)
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchText(value)
    },
    [setSearchText]
  )

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        searchPlace(searchText)
      }
    },
    [searchText, searchPlace]
  )

  const handlePointButton = () => {
    if (searchResults && searchResults.length > 0) {
      confirmPoint(searchResults[0])
      closeDialog()
    }
    else {
      PopupMessage("", t('message.warning.please-select-location'), "warning")
    }
  }

  const showPosition = (pos: GeolocationPosition) => {
    const latLng = `${pos.coords.latitude}, ${pos.coords.longitude}`;
    searchPlace(latLng, true);
  };

  useEffect(() => {
    if (location && location.latitude && location.longitude && searchResults.length === 0 && !isSearching) {
      const latLng = `${location.latitude}, ${location.longitude}`
      setSearchText(latLng)
      searchPlace(latLng)
    }
    else if (navigator.geolocation && searchResults.length === 0 && !isSearching) {
      navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => console.error(t('message.error.fetching-location-error', { error: error })),
        { enableHighAccuracy: true }
      );
    }
  }, [location, searchPlace, searchResults, isSearching])

  return (
    <Dialog id='location-setting' open={open} maxWidth="xl" fullWidth>
      <DialogTitle className="text-[28px] bg-black">{t('screen.camera-location')}</DialogTitle>
      <DialogContent className='bg-black'>
        <div>
          {isSearching && <Loading />}
          <div className="bg-black text-white w-full">
            <div className='grid grid-cols-2 mb-5'>
              <div className='col-start-2'>
                <TextBox
                  id="search-location"
                  label={t('component.search-location')}
                  placeholder=""
                  className="w-full"
                  value={searchText}
                  onChange={(e: any) => handleSearchChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  error={ searchError ? true : false}
                  helperText={searchError}
                />
              </div>
            </div>
            <div className='h-[550px] relative border-[1px] border-dodgerBlue mb-[20px]'>
              <BaseMap 
                onMapLoad={handleMapLoad}
              />
            </div>
            <div className='flex items-center justify-end'>
              <button 
                type="button" 
                className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]" 
                onClick={handlePointButton}
              >
                <img src="/icons/map-pin.png" alt="Map Pin" className='w-[20px] h-[20px]' />
                <span className='ml-[5px]'>{t('button.point')}</span>
              </button>
              <button 
                type="button" 
                className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded" 
                onClick={closeDialog}
              >
                {t('button.cancel')}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LocationSetting