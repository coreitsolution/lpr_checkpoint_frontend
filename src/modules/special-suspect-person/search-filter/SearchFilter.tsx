import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  SelectChangeEvent,
} from "@mui/material"

// Types
import { FilterSpecialPeople } from "../../../features/api/types";

// Components
import TextBox from '../../../components/text-box/TextBox'
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import SelectBox from "../../../components/select-box/SelectBox"

interface SearchFilterProps {
  setFilterData: (filterData: FilterSpecialPeople) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({setFilterData}) => {

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [selectedPersonType, setSelectedPersonType] = useState<number | ''>('')
  const [selectedNamePrefix, setSelectedNamePrefix] = useState<string>("")
  const [agencyText, setAgencyText] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<number | ''>('')
  const [registrationTypesOptions, setRegistrationTypesOptions] = useState<{ label: string; value: number; }[]>([])
  const [dataStatusOptions, setDataStatusOptions] = useState<{ label: string; value: number; }[]>([])
  const [namePrefixOptions, setNamePrefixOptions] = useState<{ label: string; value: number; }[]>([])

  const filterData: FilterSpecialPeople = {
    selectedNamePrefix: selectedNamePrefix,
    firstname: firstname,
    lastname: lastname,
    selectedPersonType: selectedPersonType,
    agency: agencyText,
    selectedStatus: selectedStatus,
  }

  const { dataStatus, registrationTypes, commonPrefixes } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }));
      setRegistrationTypesOptions([{label: "ทุกประเภท", value: 0}, ...options])
    }
  }, [registrationTypes])

  useEffect(() => {
    if (dataStatus) {
      const options = dataStatus.map((row) => ({
        label: row.status,
        value: row.id,
      }));
      setDataStatusOptions([{label: "ทุกสถานะ", value: 2}, ...options])
    }
  }, [dataStatus])

  useEffect(() => {
    if (commonPrefixes && commonPrefixes.data) {
      const options = commonPrefixes.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }));
      setNamePrefixOptions(options)
    }
  }, [commonPrefixes])
  
  useEffect(() => {
    if (dataStatusOptions && dataStatusOptions.length > 0) {
      setSelectedStatus(2)
    }
    if (registrationTypesOptions && registrationTypesOptions.length > 0) {
      setSelectedPersonType(0)
    }
  }, [dataStatusOptions, registrationTypesOptions])

  const handleReset = () => {
    setSelectedPersonType(0)
    setAgencyText("")
    setSelectedStatus(2)
    setFirstname("")
    setLastname("")
  }

  const handleSearch = () => {
    setFilterData(filterData)
  }

  const handleNamePrefixChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    setSelectedNamePrefix(value ? value.value : '')
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
              src="/icons/warning-person.png"
              alt="Search Filter"
              className="w-[22px] h-[22px] ml-[10px]"
            />
            <span className="flex justify-start text-[15px] ml-[15px]">เงื่อนไขการค้นหา</span>
          </div>

          <div className="h-[80vh] overflow-y-auto">
            {/* Form */}
            <div className="p-[10px]">
              <div className="grid grid-cols-1 my-[10px]">
                <AutoComplete 
                  id="name-prefix"
                  sx={{ marginTop: "10px"}}
                  value={selectedNamePrefix}
                  onChange={handleNamePrefixChange}
                  options={namePrefixOptions}
                  label="คำนำหน้า"
                  labelFontSize="15px"
                  placeholder="กรุณาระบุคำนำหน้า"
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <TextBox
                  sx={{ marginTop: "5px" }}
                  id="name"
                  label="ชื่อ"
                  placeHolder=""
                  className="w-full"
                  value={firstname}
                  labelFontSize="15px"
                  textFieldFontSize="15px"
                  onChange={(e: any) => setFirstname(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <TextBox
                  sx={{ marginTop: "5px" }}
                  id="last-name"
                  label="นามสกุล"
                  placeHolder=""
                  className="w-full"
                  value={lastname}
                  labelFontSize="15px"
                  textFieldFontSize="15px"
                  onChange={(e: any) => setLastname(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <SelectBox
                  sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
                  id="select-registrations-type"
                  className="w-full"
                  value={selectedPersonType}
                  onChange={(event: SelectChangeEvent<any>) => setSelectedPersonType(event.target.value)}
                  options={registrationTypesOptions}
                  label="ประเภทบุคคล"
                  labelFontSize="15px"
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <TextBox
                  sx={{ marginTop: "5px" }}
                  id="agency"
                  label="หน่วยงานเจ้าของข้อมูล"
                  placeHolder=""
                  className="w-full"
                  value={agencyText}
                  labelFontSize="15px"
                  textFieldFontSize="15px"
                  onChange={(e: any) => setAgencyText(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 my-[10px]">
                <SelectBox
                  sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
                  id="select-status"
                  className="w-full"
                  value={selectedStatus}
                  onChange={(event: SelectChangeEvent<any>) => setSelectedStatus(event.target.value)}
                  options={dataStatusOptions}
                  label="สถานะข้อมูล"
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
    </div>
  )
}

export default SearchFilter
