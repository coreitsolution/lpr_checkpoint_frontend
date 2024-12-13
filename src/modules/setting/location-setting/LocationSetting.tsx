import React, {useState, useCallback} from 'react'

// Components
import TextBox from '../../../components/text-box/TextBox'
import BaseMap from '../../../components/base-map/BaseMap'
import Loading from "../../../components/loading/Loading"

// Hooks
import { useMapSearch } from "../../../hooks/useGoogleMapSearch"

// Types
import { SearchResult } from '../../../types/index'

// Popup
import PopupMessage from "../../../utils/popupMessage"

interface LocationSettingProps {
  closeDialog: () => void
  comfirmPoint: (result: SearchResult) => void
}
const LocationSetting: React.FC<LocationSettingProps> = ({closeDialog, comfirmPoint}) => {
  const [searchText, setSearchText] = useState("")
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const {
    searchPlace,
    isSearching,
    searchError,
    searchResults,
  } = useMapSearch(map)

  const handleMapLoad = useCallback((mapInstance: google.maps.Map | null) => {
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
      comfirmPoint(searchResults[0])
      closeDialog()
    }
    else {
      PopupMessage("", "โปรดเลือกสถานที่", "warning")
    }
  }

  return (
    <div id='location-setting'>
      {isSearching && <Loading />}
      <div className="bg-black text-white p-[5px] w-full">
        <div className='grid grid-cols-2 mb-5'>
          <div className='col-start-2'>
            <TextBox
              id="search-location"
              label="ค้นหาสถานที่"
              placeHolder=""
              className="w-full"
              value={searchText}
              onChange={(e: any) => handleSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              isError={ searchError ? true : false}
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
            <span className='ml-[5px]'>Point</span>
          </button>
          <button 
            type="button" 
            className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded" 
            onClick={closeDialog}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationSetting