import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  SelectChangeEvent,
} from "@mui/material"

// Types
import { FilterSpecialRegistration } from "../../../features/api/types";

// Components
import TextBox from '../../../components/text-box/TextBox'
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import SelectBox from "../../../components/select-box/SelectBox"

// i18n
import { useTranslation } from "react-i18next";

interface SearchFilterProps {
  setFilterData: (filterData: FilterSpecialRegistration) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({setFilterData}) => {

  // i18n
  const { t, i18n } = useTranslation();

  const [letterCategory, setLetterCategory] = useState("")
  const [carRegistration, setCarRegistration] = useState("")
  const [selectedProvince, setSelectedProvince] = useState<string | ''>('')
  const [selectedRegistrationType, setSelectedRegistrationType] = useState<number | ''>('')
  const [agencyText, setAgencyText] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<number | ''>('')
  const [registrationTypesOptions, setRegistrationTypesOptions] = useState<{ label: string; value: number; }[]>([]);
  const [provincesOptions, setProvincesOptions] = useState<{ label: string; value: number; }[]>([]);
  const [dataStatusOptions, setDataStatusOptions] = useState<{ label: string; value: number; }[]>([]);

  const filterData: FilterSpecialRegistration = {
    letterCategory: letterCategory,
    carRegistration: carRegistration,
    selectedProvince: selectedProvince,
    selectedRegistrationType: selectedRegistrationType,
    agency: agencyText,
    selectedStatus: selectedStatus,
  }
  const { dataStatus, provinces, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: i18n.language === "th" ? row.name_th : row.name_en,
        value: row.id,
      }));
      setProvincesOptions(options)
    }
  }, [provinces, i18n.language, i18n.isInitialized])

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }));
      setRegistrationTypesOptions([{label: t('text.all'), value: 0}, ...options])
      setSelectedRegistrationType(0)
    }
  }, [registrationTypes, i18n.language, i18n.isInitialized])

  useEffect(() => {
    if (dataStatus) {
      const options = dataStatus.map((row) => ({
        label: row.status,
        value: row.id,
      }));
      setDataStatusOptions([{label: t('text.all-status'), value: 2}, ...options])
      setSelectedStatus(2)
    }
  }, [dataStatus, i18n.language, i18n.isInitialized])

  const handleReset = () => {
    setLetterCategory("")
    setCarRegistration("")
    setSelectedProvince("")
    setSelectedRegistrationType(0)
    setAgencyText("")
    setSelectedStatus(2)
  }

  const handleSearch = () => {
    setFilterData(filterData)
  }

  const handleProvincesChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedProvince(value ? value.value : 0)
  }

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

          <div className="h-[80vh] overflow-y-auto">
            {/* Form */}
            <div className="p-[10px]">
              <div className="grid grid-cols-1 my-[10px]">
                <TextBox
                  sx={{ marginTop: "5px" }}
                  id="character"
                  label={t('component.plate-character')}
                  placeholder=""
                  value={letterCategory}
                  labelFontSize="15px"
                  onChange={(e: any) => setLetterCategory(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <TextBox
                  sx={{ marginTop: "5px" }}
                  id="registration-number"
                  label={t('component.plate-number')}
                  placeholder=""
                  value={carRegistration}
                  labelFontSize="15px"
                  onChange={(e: any) => setCarRegistration(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full">
                <AutoComplete 
                  id="province-select"
                  sx={{ marginTop: "10px"}}
                  value={selectedProvince}
                  onChange={handleProvincesChange}
                  options={provincesOptions}
                  label={t('component.province-category')}
                  labelFontSize="15px"
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <SelectBox
                  sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
                  id="select-registrations-type"
                  value={selectedRegistrationType}
                  onChange={(event: SelectChangeEvent<any>) => setSelectedRegistrationType(event.target.value)}
                  options={registrationTypesOptions}
                  label={t('component.plate-type')}
                  labelFontSize="15px"
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <TextBox
                  sx={{ marginTop: "5px" }}
                  id="agency"
                  label={t('component.owner-data-agency')}
                  placeholder=""
                  value={agencyText}
                  labelFontSize="15px"
                  onChange={(e: any) => setAgencyText(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <SelectBox
                  sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
                  id="select-status"
                  value={selectedStatus}
                  onChange={(event: SelectChangeEvent<any>) => setSelectedStatus(event.target.value)}
                  options={dataStatusOptions}
                  label={t('component.status-data')}
                  labelFontSize="15px"
                />
              </div>
              <div id="button-group" className="flex justify-center mt-[30px]">
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
    </div>
  )
}

export default SearchFilter
