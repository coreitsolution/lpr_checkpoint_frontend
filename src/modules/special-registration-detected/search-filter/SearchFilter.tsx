import React, { useState, useEffect } from "react"
import {
  SelectChangeEvent,
} from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"

// Types
import { FilterSpecialPlates } from "../../../features/api/types"
import { VehicleModelsDetail } from "../../../features/dropdown/dropdownTypes"

// Components
import SelectBox from '../../../components/select-box/SelectBox'
import TextBox from '../../../components/text-box/TextBox'
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist"
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import AutoCompleteMultiple, { OptionType } from "../../../components/auto-complete/AutoCompleteMultiple"

// i18n
import { useTranslation } from "react-i18next";

interface SearchFilterProps {
  setFilterData: (filterData: FilterSpecialPlates) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({setFilterData}) => {
  // i18n
  const { t, i18n } = useTranslation();

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
  const { registrationTypes, vehicleColors, vehicleMakes, vehicleModels, regions, vehicleBodyTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )

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
        label: i18n.language === "th" ? row.name_th : row.name,
        value: row.code,
      }))
      setProvincesOptions(options)
    }
  }, [regions, i18n.language])

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }))
      setRegistrationTypesOptions([{label: t('text.all'), value: 0}, ...options])
      setSelectedRegistrationType(0)
    }
  }, [registrationTypes, i18n.language])

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
    if (vehicleBodyTypes && vehicleBodyTypes.data) {
      const options = vehicleBodyTypes.data.map((row) => ({
        label: i18n.language === "th" ? row.body_type_th : row.body_type_en,
        value: i18n.language === "th" ? row.body_type_th : row.body_type_en,
      }))
      setCarTypesOptions([{label: t('text.all-type'), value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })])
      setSelectedCarType('all')
    }
  }, [vehicleBodyTypes, i18n.language])

  useEffect(() => {
    if (vehicleColors && vehicleColors.data) {
      const options = vehicleColors.data.map((row) => ({
        label: i18n.language === "th" ? row.color_th : row.color_en,
        value: row.color,
      }))
      setCarColorsOptions([{label: t('text.all-color'), value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })])
      setSelectedCarColor('all')
    }
  }, [vehicleColors, i18n.language])

  useEffect(() => {
    if (vehicleMakes && vehicleMakes.data) {
      const options = vehicleMakes.data.map((row) => ({
        label: row.make_en,
        value: row.make,
      }))
      setCarBrandsOptions([{label: t('text.all-brand'), value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })])
      setSelectedCarBrand('all')
    }
  }, [vehicleMakes, i18n.language])

  useEffect(() => {
    if (vehicleModels && vehicleModels.data) {
      const options = vehicleModels.data.map((row) => ({
        label: row.model_en,
        value: row.model,
      }))
      setOriCarModelsOptions(vehicleModels.data)
      setCarModelsOptions(([{label: t('text.all-model'), value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })]))
      setSelectedCarModel('all')
    }
  }, [vehicleModels, i18n.language])

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
      setCarModelsOptions(([{label: t('text.all-model'), value: 'all'}, ...options.sort((a, b) => { return a.label.localeCompare(b.label) })]))
    }
    
  }, [selectedCarBrand, i18n.language])

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
            <span className="flex justify-start text-[15px] ml-[15px]">{t('screen.search-condition')}</span>
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
                label={t('component.checkpoint')}
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
                label={t('component.start-date')}
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
                label={t('component.end-date')}
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
                label={t('component.plate-character')}
                placeholder=""
                labelFontSize="15px"
                value={letterCategory}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLetterCategory(event.target.value)}
              />
              <TextBox
                sx={{ marginTop: "5px" }}
                id="registration-number"
                label={t('component.plate-number')}
                placeholder=""
                labelFontSize="15px"
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
                label={t('component.province-category')}
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
                label={t('component.car-type')}
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
                label={t('component.brand')}
                labelFontSize="15px"
                title={selectedCarBrand !== "all" ? carBrandsOptions.find((row) => row.value === selectedCarBrand)?.label : ""}
              />
              <AutoComplete 
                id="select-car-model"
                sx={{ marginTop: "5px"}}
                value={selectedCarModel}
                onChange={handleCarModelChange}
                options={carModelsOptions}
                label={t('component.car-model')}
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
                label={t('component.color')}
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
                label={t('component.plate-group')}
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
                <span className="ml-[5px]">{t('button.search')}</span>
              </button>
              <button 
                type="button" 
                className="bg-white text-dodgerBlue rounded border-[1px] border-dodgerBlue w-[90px] h-[35px]"
                onClick={handleReset}
              >
                {t('button.clear-data')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilter
