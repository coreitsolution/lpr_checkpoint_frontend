import React, { useState, useEffect } from "react"
import {
  SelectChangeEvent,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"

// Types
import { FilterSpecialPlates } from "../../../features/api/types"
import { VehicleModelsDetail } from "../../../features/dropdown/dropdownTypes"

// Components
import SelectBox from '../../../components/select-box/SelectBox'
import TextBox from '../../../components/text-box/TextBox'
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist"
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import AutoCompleteMultiple, { OptionType } from "../../../components/auto-complete/AutoCompleteMultiple"

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
  const [selectedProvince, setSelectedProvince] = useState<string | ''>('')
  const [selectedCarType, setSelectedCarType] = useState<string | ''>('')
  const [selectedCarBrand, setSelectedCarBrand] = useState<string | ''>('')
  const [selectedCarModel, setSelectedCarModel] = useState<string | ''>('')
  const [selectedCarColor, setSelectedCarColor] = useState<string | ''>('')
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<OptionType[]>([])
  const [selectedRegistrationType, setSelectedRegistrationType] = useState<number | ''>('')
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [registrationTypesOptions, setRegistrationTypesOptions] = useState<{ label: string, value: number }[]>([])
  const [provincesOptions, setProvincesOptions] = useState<{ label: string, value: string }[]>([])
  const [carTypesOptions, setCarTypesOptions] = useState<{ label: string, value: string }[]>([])
  const [carBrandsOptions, setCarBrandsOptions] = useState<{ label: string, value: string }[]>([])
  const [carOriModelsOptions, setOriCarModelsOptions] = useState<VehicleModelsDetail[]>([])
  const [carModelsOptions, setCarModelsOptions] = useState<{ label: string, value: string }[]>([])
  const [carColorsOptions, setCarColorsOptions] = useState<{ label: string, value: string }[]>([])
  const [checkpointOptions, setCheckpointOptions] = useState<{ label: string, value: string }[]>([])
  const { registrationTypes, vehicleColors, vehicleMakes, vehicleModels, regions, vehicleBodyTypesTh } = useSelector(
    (state: RootState) => state.dropdown
  )

  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )

  useEffect(() => {
    dispatch(fetchCameraSettingsThunk())
  }, [dispatch])

  const filterData: FilterSpecialPlates = {
    plateGroup: letterCategory,
    plateNumber: carRegistration,
    regionCode: selectedProvince,
    vehicleBodyTypeTH: selectedCarType.replace("all", ""),
    vehicleMake: selectedCarBrand.replace("all", ""),
    vehicleModel: selectedCarModel.replace("all", ""),
    vehicleColor: selectedCarColor.replace("all", ""),
    startDate: selectedStartDate ? selectedStartDate.toUTCString() : "",
    endDate: selectedEndDate ? selectedEndDate.toUTCString() : "",
    camIdList: selectedCheckpoint.map((item) => item.value),
    plateTypeId: selectedRegistrationType || 0,
  }

  useEffect(() => {
    if (regions && regions.data) {
      const options = regions.data.map((row) => ({
        label: row.name_th,
        value: row.code,
      }))
      setProvincesOptions(options)
    }
  }, [regions])

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }))
      setRegistrationTypesOptions([{label: "ทั้งหมด", value: 0}, ...options])
      setSelectedRegistrationType(0)
    }
  }, [registrationTypes])

  useEffect(() => {
    if (cameraSettings && cameraSettings.data) {
      const options = cameraSettings.data.map((row) => ({
        label: row.cam_id,
        value: row.cam_id,
      }))
      setCheckpointOptions(options.sort((a, b) => { return a.label.localeCompare(b.label) }))
    }
  }, [cameraSettings])

  useEffect(() => {
    if (vehicleBodyTypesTh && vehicleBodyTypesTh.data) {
      const options = vehicleBodyTypesTh.data.map((row) => ({
        label: row.body_type_th,
        value: row.body_type_th,
      }))
      setCarTypesOptions([{label: "ทุกประเภท", value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })])
      setSelectedCarType('all')
    }
  }, [vehicleBodyTypesTh])

  useEffect(() => {
    if (vehicleColors && vehicleColors.data) {
      const options = vehicleColors.data.map((row) => ({
        label: row.color_th,
        value: row.color,
      }))
      setCarColorsOptions([{label: "ทุกสี", value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })])
      setSelectedCarColor('all')
    }
  }, [vehicleColors])

  useEffect(() => {
    if (vehicleMakes && vehicleMakes.data) {
      const options = vehicleMakes.data.map((row) => ({
        label: row.make_en,
        value: row.make,
      }))
      setCarBrandsOptions([{label: "ทุกยี่ห้อ", value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })])
      setSelectedCarBrand('all')
    }
  }, [vehicleMakes])

  useEffect(() => {
    if (vehicleModels && vehicleModels.data) {
      const options = vehicleModels.data.map((row) => ({
        label: row.model_en,
        value: row.model,
      }))
      setOriCarModelsOptions(vehicleModels.data)
      setCarModelsOptions(([{label: "ทุกรุ่น", value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })]))
      setSelectedCarModel('all')
    }
  }, [vehicleModels])

  useEffect(() => {
    if (selectedCarBrand && selectedCarBrand !== 'all' && carOriModelsOptions) {
      setCarModelsOptions(carOriModelsOptions.filter((row) => row.make === selectedCarBrand).map((row) => ({
        label: row.model_en,
        value: row.model
      })).sort((a, b) => { return a.label.localeCompare(b.label) }))
    }
    else if (selectedCarBrand && selectedCarBrand === 'all' && carOriModelsOptions) {
      const options = carOriModelsOptions.map((row) => ({
        label: row.model_en,
        value: row.model,
      }))
      setCarModelsOptions(([{label: "ทุกรุ่น", value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })]))
    }
    
  }, [selectedCarBrand])

  const handleReset = () => {
    setLetterCategory("")
    setCarRegistration("")
    setSelectedProvince("")
    setSelectedRegistrationType(0)
    setSelectedCarType('all')
    setSelectedCarBrand('all')
    setSelectedCarModel('all')
    setSelectedCarColor('all')
    setSelectedStartDate(null)
    setSelectedEndDate(null)
    setSelectedCheckpoint([])
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
    setSelectedCarType(value ? value.value : "all")
  };

  const handleCarBrandChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCarBrand(value ? value.value : "all")
  };

  const handleCarModelChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCarModel(value ? value.value : "all")
  };

  const handleCarColorChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedCarColor(value ? value.value : "all")
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
          <div className="p-[10px] h-[88vh] overflow-auto">
            <div className="grid grid-cols-1">
              <AutoCompleteMultiple 
                id="select-checkpoint"
                sx={{ marginTop: "5px"}}
                value={selectedCheckpoint}
                onChange={(_, newValue) => {
                  setSelectedCheckpoint([
                    ...newValue,
                  ]);
                }}
                options={checkpointOptions}
                label="จุดตรวจ"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <DatePickerBuddhist
                value={selectedStartDate}
                sx={{
                  marginTop: "5px",
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
                label="วันที่เริ่มต้น"
                labelTextSize="15px"
                isWithTime={true}
                onChange={(value) => setSelectedStartDate(value)}
              >
              </DatePickerBuddhist>
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <DatePickerBuddhist
                value={selectedEndDate}
                sx={{
                  marginTop: "5px",
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
                label="วันที่สิ้นสุด"
                labelTextSize="15px"
                isWithTime={true}
                onChange={(value) => setSelectedEndDate(value)}
              >
              </DatePickerBuddhist>
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
                sx={{ marginTop: "5px"}}
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
                sx={{ marginTop: "5px"}}
                value={selectedCarType}
                onChange={handleCarTypeChange}
                options={carTypesOptions}
                label="ประเภทรถ"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-2 my-[5px] gap-1">
              <AutoComplete 
                id="select-car-brand"
                sx={{ marginTop: "5px"}}
                value={selectedCarBrand}
                onChange={handleCarBrandChange}
                options={carBrandsOptions}
                label="ยี่ห้อ"
                labelFontSize="15px"
                title={selectedCarBrand !== "all" ? carBrandsOptions.find((row) => row.value === selectedCarBrand)?.label : ""}
              />
              <AutoComplete 
                id="select-car-model"
                sx={{ marginTop: "5px"}}
                value={selectedCarModel}
                onChange={handleCarModelChange}
                options={carModelsOptions}
                label="รุ่นรถ"
                labelFontSize="15px"
                title={selectedCarModel !== "all" ? carModelsOptions.find((row) => row.value === selectedCarModel)?.label : ""}
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="select-car-color"
                sx={{ marginTop: "5px"}}
                value={selectedCarColor}
                onChange={handleCarColorChange}
                options={carColorsOptions}
                label="สี"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <SelectBox
                sx={{ marginTop: "5px", height: "40px", fontSize: "15px" }}
                id="select-registrations-type"
                className="w-full"
                value={selectedRegistrationType}
                onChange={(event: SelectChangeEvent<any>) => setSelectedRegistrationType(event.target.value)}
                options={registrationTypesOptions}
                label="กลุ่มทะเบียน"
                labelFontSize="15px"
              />
            </div>
            <div id="button-group" className="flex justify-center mt-[20px]">
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
