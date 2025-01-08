import React, { useState, useEffect } from "react"
import {
  SelectChangeEvent,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"

// Types
import { FilterSpecialSuspectPeople } from "../../../features/api/types";

// Components
import { Checkbox } from "../../../components/ui/checkbox"
import SelectBox from '../../../components/select-box/SelectBox'
import TextBox from '../../../components/text-box/TextBox'
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist"
import AutoComplete from "../../../components/auto-complete/AutoComplete"

// API
import { 
  fetchCameraSettingsThunk,
} from "../../../features/camera-settings/cameraSettingsSlice"

interface SearchFilterProps {
  setFilterData: (filterData: FilterSpecialSuspectPeople) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({setFilterData}) => {

  const dispatch: AppDispatch = useDispatch()
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [plateConfidence, setPlateConfidence] = useState("")
  const [selectedNamePrefix, setNamePrefix] = useState<string>('')
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
  const [namePrefixOptions, setNamePrefixOptions] = useState<{ label: string, value: number }[]>([])
  const [checkpointOptions, setCheckpointOptions] = useState<{ label: string, value: number }[]>([])
  const { registrationTypes, commonPrefixes } = useSelector(
    (state: RootState) => state.dropdown
  )

  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )

  useEffect(() => {
    dispatch(fetchCameraSettingsThunk())
  }, [dispatch])

  const filterData: FilterSpecialSuspectPeople = {
    namePrefix: Number(selectedNamePrefix),
    firstname: firstname,
    lastname: lastname,
    faceConfidence: checkedPlateConfidence === 0 ? 0 : Number(plateConfidence),
    selectedStartDate: selectedStartDate,
    selectedEndDate: selectedEndDate,
    checkpoint: selectedCheckpoint,
    selectedRegistrationType: registrationTypes?.data?.find((row) => row.id === selectedRegistrationType)?.title_en || 'all',
  }

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

  useEffect(() => {
    if (commonPrefixes && commonPrefixes.data) {
      const options = commonPrefixes.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }))
      setNamePrefixOptions(options)
    }
  }, [commonPrefixes])

  const handleReset = () => {
    setFirstname("")
    setLastname("")
    setNamePrefix('')
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

  const handleNamePrefixChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setNamePrefix(value ? value.value : 0)
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
              src="/icons/warning-person.png"
              alt="Search Filter"
              className="w-[22px] h-[22px] ml-[10px]"
            />
            <span className="flex justify-start text-[15px] ml-[15px]">เงื่อนไขการค้นหา</span>
          </div>

          {/* Form */}
          <div className="p-[10px] h-[84vh] overflow-auto">
            <div className="grid grid-cols-1 my-[5px]">
              <label className="text-[15px]">วันที่เริ่มต้น-สิ้นสุด</label>
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
            <div className="grid grid-cols-1 my-[5px]">
              <AutoComplete 
                id="name-prefix-select"
                sx={{ marginTop: "10px"}}
                value={selectedNamePrefix}
                onChange={handleNamePrefixChange}
                options={namePrefixOptions}
                label="คำนำหน้า"
                labelFontSize="15px"
                placeholder="กรุณาระบุคำนำหน้า"
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <TextBox
                sx={{ marginTop: "5px" }}
                id="firstname"
                label="ชื่อ"
                placeHolder=""
                className="w-full"
                labelFontSize="15px"
                textFieldFontSize="15px"
                value={firstname}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstname(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 my-[5px]">
              <TextBox
                sx={{ marginTop: "5px" }}
                id="lastname"
                label="นามสกุล"
                placeHolder=""
                className="w-full"
                labelFontSize="15px"
                textFieldFontSize="15px"
                value={lastname}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastname(event.target.value)}
              />
            </div>
            <div>
              <label className="text-[15px]">ความแม่นยำ</label>
              <div className="grid grid-cols-2 mt-[10px]">
                <div className="flex justify-start items-center">
                  <Checkbox
                    id="percent-checkbox"
                    className="border-[1px] border-white mr-[10px] w-[30px] h-[30px] data-[state=checked]:bg-white data-[state=checked]:text-black [&>span>svg]:h-6 [&>span>svg]:w-6"
                  />
                  <span className="text-[20px] mr-[10px]">&#37;</span>
                  <span className="text-[20px]">&gt;&#61;</span>
                </div>
                <TextBox
                  sx={{ marginTop: "0px" }}
                  id="percent-accuracy"
                  placeHolder=""
                  className="w-full"
                  labelFontSize="15px"
                  textFieldFontSize="15px"
                />
              </div>
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
                id="select-people-type"
                className="w-full"
                value={selectedRegistrationType}
                onChange={(event: SelectChangeEvent<any>) => setSelectedRegistrationType(event.target.value)}
                options={registrationTypesOptions}
                label="กลุ่มบุคคล"
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
