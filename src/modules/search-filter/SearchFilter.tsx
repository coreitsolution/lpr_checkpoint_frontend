import React, { useState, useEffect } from "react"
import {
  SelectChangeEvent,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";

// Types
import { FilterSpecialRegistration } from "../../features/api/types";

// API
import {
  fetchProvincesThunk,
  fetchRegistrationTypesThunk,
  fetchDataStatusThunk,
} from '../../features/dropdown/dropdownSlice'

// Components
import SelectBox from '../../components/select-box/SelectBox'
import TextBox from '../../components/text-box/TextBox'

interface SearchFilterProps {
  setFilterData: (filterData: FilterSpecialRegistration) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({setFilterData}) => {

  const [letterCategory, setLetterCategory] = useState("")
  const [carRegistration, setCarRegistration] = useState("")
  const [selectedProvince, setSelectedProvince] = useState<number | ''>('')
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

  const dispatch: AppDispatch = useDispatch();
  const { dataStatus, provinces, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    dispatch(fetchRegistrationTypesThunk())
    dispatch(fetchProvincesThunk("?orderBy=name_th"))
    dispatch(fetchDataStatusThunk())
  }, [dispatch])

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }));
      setProvincesOptions(options)
    }
  }, [provinces])

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }));
      setRegistrationTypesOptions(options)
    }
  }, [registrationTypes])

  useEffect(() => {
    if (dataStatus && dataStatus) {
      const options = dataStatus.map((row) => ({
        label: row.status,
        value: row.id,
      }));
      setDataStatusOptions([{label: "ทุกสถานะ", value: 2}, ...options])
    }
  }, [dataStatus])

  const handleReset = () => {
    setLetterCategory("")
    setCarRegistration("")
    setSelectedProvince('')
    setSelectedRegistrationType('')
    setAgencyText("")
    setSelectedStatus('')
  }

  const handleSearch = () => {
    setFilterData(filterData)
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
            <span className="flex justify-start text-[15px] ml-[15px]">เงื่อนไขการค้นหา</span>
          </div>

          {/* Form */}
          <div className="p-[10px]">
            <div className="grid grid-cols-1 my-[10px]">
              <TextBox
                sx={{ marginTop: "5px" }}
                id="character"
                label="หมวดอักษร"
                placeHolder=""
                className="w-full"
                value={letterCategory}
                labelFontSize="15px"
                textFieldFontSize="15px"
                onChange={(e: any) => setLetterCategory(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 my-[10px]">
              <TextBox
                sx={{ marginTop: "5px" }}
                id="registration-number"
                label="เลขทะเบียน"
                placeHolder=""
                className="w-full"
                value={carRegistration}
                labelFontSize="15px"
                textFieldFontSize="15px"
                onChange={(e: any) => setCarRegistration(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 my-[10px]">
              <SelectBox
                sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
                id="select-provices"
                className="w-full"
                value={selectedProvince}
                onChange={(event: SelectChangeEvent<any>) => setSelectedProvince(event.target.value)}
                options={provincesOptions}
                label="หมวดจังหวัด"
                labelFontSize="15px"
              />
            </div>
            <div className="grid grid-cols-1 my-[10px]">
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
  )
}

export default SearchFilter
