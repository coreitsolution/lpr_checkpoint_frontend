import React, { useState, useEffect } from "react"
import {
  SelectChangeEvent,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"

// Types
import { FilterSpecialPlates } from "../../../features/api/types"

// Components
import SelectBox from '../../../components/select-box/SelectBox'
import TextBox from '../../../components/text-box/TextBox'
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist"
import AutoComplete from "../../../components/auto-complete/AutoComplete"

// API
import { 
  fetchCameraSettingsThunk,
} from "../../../features/camera-settings/cameraSettingsSlice"

interface SearchFilterProps {
  setFilterData: (filterData: FilterSpecialPlates) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({setFilterData}) => {
  const dispatch: AppDispatch = useDispatch()
  const [letterCategory, setLetterCategory] = useState("")
  const [carRegistration, setCarRegistration] = useState("")
  const [plateConfidence, setPlateConfidence] = useState("")
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCarType, setSelectedCarType] = useState<string>('')
  const [selectedCarBrand, setSelectedCarBrand] = useState<string>('')
  const [selectedCarModel, setSelectedCarModel] = useState<string>('')
  const [selectedCarColor, setSelectedCarColor] = useState<string>('')
  const [selectedCarLane, setSelectedCarLane] = useState<string>('')
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('')
  const [checkedPlateConfidence, setCheckedPlateConfidence] = useState<number>(0)
  const [selectedRegistrationType, setSelectedRegistrationType] = useState<number>(0)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [registrationTypesOptions, setRegistrationTypesOptions] = useState<{ label: string, value: number }[]>([])
  const [provincesOptions, setProvincesOptions] = useState<{ label: string, value: string }[]>([])
  const [carTypesOptions] = useState<{ label: string, value: number }[]>([])
  const [carBrandsOptions] = useState<{ label: string, value: number }[]>([])
  const [carModelsOptions] = useState<{ label: string, value: number }[]>([])
  const [carColorsOptions] = useState<{ label: string, value: number }[]>([])
  const [checkpointOptions, setCheckpointOptions] = useState<{ label: string, value: number }[]>([])
  const { provinces, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )

  useEffect(() => {
    dispatch(fetchCameraSettingsThunk())
  }, [dispatch])

  const filterData: FilterSpecialPlates = {
    letterCategory: letterCategory,
    carRegistration: carRegistration,
    selectedProvince: selectedProvince,
    selectedCarType: selectedCarType,
    selectedCarBrand: selectedCarBrand,
    selectedCarModel: selectedCarModel,
    selectedCarColor: selectedCarColor,
    selectedCarLane: selectedCarLane,
    plateConfidence: checkedPlateConfidence === 0 ? 0 : Number(plateConfidence),
    selectedStartDate: selectedStartDate,
    selectedEndDate: selectedEndDate,
    selectedCheckpoint: selectedCheckpoint,
    selectedRegistrationType: registrationTypes?.data?.find((row) => row.id === selectedRegistrationType)?.title_en || 'all',
  }

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: row.name_th,
        value: row.name_th,
      }))
      setProvincesOptions(options)
    }
  }, [provinces])

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }))
      setRegistrationTypesOptions([{label: "ทั้งหมด", value: 0}, ...options])
    }
  }, [registrationTypes])

  useEffect(() => {
    if (cameraSettings && cameraSettings.data) {
      const options = cameraSettings.data.map((row) => ({
        label: row.checkpoint_name,
        value: row.id,
      }))
      setCheckpointOptions(options.sort((a, b) => { return a.label.localeCompare(b.label) }))
    }
  }, [cameraSettings])

  const handleReset = () => {
    setLetterCategory("")
    setCarRegistration("")
    setSelectedProvince('')
    setSelectedRegistrationType(0)
    setPlateConfidence("")
    setSelectedCarType('')
    setSelectedCarBrand('')
    setSelectedCarModel('')
    setSelectedCarColor('')
    setSelectedCarLane('')
    setCheckedPlateConfidence(0)
    setSelectedStartDate(null)
    setSelectedEndDate(null)
  }

  const handleSearch = () => {
    setFilterData(filterData)
  }

  const handleProvicesChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedProvince(value ? value.value : 0)
  };

  const handleCarTypeChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCarType(value ? value.value : 0)
  };

  const handleCarBrandChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCarBrand(value ? value.value : 0)
  };

  const handleCarModelChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCarModel(value ? value.value : 0)
  };

  const handleCarColorChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCarColor(value ? value.value : 0)
  };

  const handleCheckPointChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCheckpoint(value ? value.value : 0)
  };

  return (
    
    <div 
      className="flex-none mr-[3px] mb-[5px] p-[1px] bg-dodgerBlue h-full"
      style={{ 
        clipPath: "polygon(0% 0%, 152px 0%, 160px 25px, 100% 25px, 100% 100%, 0% 100%)",
      }}
    >
      <div 
        className="h-full bg-[var(--background-color)]"
        style={{
          clipPath: "polygon(0% 0%, 150px 0%, 158px 25px, 100% 25px, 100% 100%, 0% 100%)",
        }}
      >
        <div
          id="search-filter"
          className="grid grid-cols-1 w-full pt-[5px] bg-[var(--background-color)]"
        >
          {/* Header */}
          <div className="grid grid-cols-[20px_200px]">
            <img
              src="/icons/search-car.png"
              alt="Search Filter"
              className="w-[22px] h-[22px] ml-[10px]"
            />
            <span className="flex justify-start text-[15px] ml-[15px]">เงื่อนไขการค้นหา</span>
          </div>

          {/* Form */}
          <div className="p-[10px] h-[84vh] overflow-auto">
            <div className="grid grid-cols-1 my-[5px]">
              <label>วันที่เริ่มต้น-สิ้นสุด</label>
              <div className="grid grid-cols-2 gap-1">
                {/* Start Date */}
                <DatePickerBuddhist
                  value={selectedStartDate}
                  sx={{
                    marginTop: "10px",
                    borderRadius: "5px",
                    backgroundColor: "white",
                    "& .MuiTextField-root": {
                      height: "fit-content",
                    },
                    "& .MuiOutlinedInput-input": {
                      fontSize: 14
                    }
                  }}
                  className="w-full"
                  id="start-date"
                  onChange={(value) => setSelectedStartDate(value)}
                >
                </DatePickerBuddhist>
                {/* End Date */}
                <DatePickerBuddhist
                  value={selectedEndDate}
                  sx={{
                    marginTop: "10px",
                    borderRadius: "5px",
                    backgroundColor: "white",
                    "& .MuiTextField-root": {
                      height: "fit-content",
                    },
                    "& .MuiOutlinedInput-input": {
                      fontSize: 14
                    }
                  }}
                  className="w-full"
                  id="end-date"
                  onChange={(value) => setSelectedEndDate(value)}
                >
                </DatePickerBuddhist>
              </div>
            </div>
            <div className="grid grid-cols-2 my-[5px] gap-1">
              <TextBox
                sx={{ marginTop: "5px" }}
                id="plate-character"
                label="หมวดอักษร"
                placeHolder=""
                className="w-full"
                labelFontSize="15px"
                textFieldFontSize="15px"
                value={letterCategory}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLetterCategory(event.target.value)}
              />
              <TextBox
                sx={{ marginTop: "5px" }}
                id="registration-number"
                label="เลขทะเบียน"
                placeHolder=""
                className="w-full"
                labelFontSize="15px"
                textFieldFontSize="15px"
                value={carRegistration}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCarRegistration(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="provice-select"
                sx={{ marginTop: "10px"}}
                value={selectedProvince}
                onChange={handleProvicesChange}
                options={provincesOptions}
                label="หมวดจังหวัด"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="select-car-type"
                sx={{ marginTop: "10px"}}
                value={selectedCarType}
                onChange={handleCarTypeChange}
                options={carTypesOptions}
                label="ประเภทรถ"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="select-car-brand"
                sx={{ marginTop: "10px"}}
                value={selectedCarBrand}
                onChange={handleCarBrandChange}
                options={carBrandsOptions}
                label="ยี่ห้อ"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="select-car-model"
                sx={{ marginTop: "10px"}}
                value={selectedCarModel}
                onChange={handleCarModelChange}
                options={carModelsOptions}
                label="รุ่นรถ"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="select-car-color"
                sx={{ marginTop: "10px"}}
                value={selectedCarColor}
                onChange={handleCarColorChange}
                options={carColorsOptions}
                label="สี"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="select-checkpoint"
                sx={{ marginTop: "10px"}}
                value={selectedCheckpoint}
                onChange={handleCheckPointChange}
                options={checkpointOptions}
                label="จุดตรวจ"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <SelectBox
                sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
                id="select-registrations-type"
                className="w-full"
                value={selectedRegistrationType}
                onChange={(event: SelectChangeEvent<any>) => setSelectedRegistrationType(event.target.value)}
                options={registrationTypesOptions}
                label="ประเภททะเบียน"
                labelFontSize="15px"
              />
            </div>
            <div id="button-group" className="flex justify-center mt-[15px]">
              <button 
                type="button" 
                className="flex justify-center items-center bg-dodgerBlue rounded w-[90px] h-[35px] mr-[10px]"
                onClick={handleSearch}
              >
                <img 
                  src="/svg/search-icon.svg"
                  alt="Search Icon" 
                  className='w-[20px] h-[20px]' 
                />
                <span className="ml-[5px]">ค้นหา</span>
              </button>
              <button 
                type="button" 
                className="bg-white text-dodgerBlue rounded border-[1px] border-dodgerBlue w-[90px] h-[35px]"
                onClick={handleReset}
              >
                ล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilter
