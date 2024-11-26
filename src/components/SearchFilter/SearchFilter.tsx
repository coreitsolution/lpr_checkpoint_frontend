import React, { useState, useEffect } from "react"
import SearchFilterIcon from "../../assets/icon/search-filter.png"
import { ReactComponent as SearchIcon } from "../../assets/svg/search-icon.svg"
import { Input } from "../../components/ui/input"
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

import {
  fetchAgencies,
  fetchDataStatus,
  fetchProvinces,
  fetchRegistrationTypes,
} from '../../redux/slices/searchFilterSlice'

function SearchFilter() {

  const [letterCategory, setLetterCategory] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedRegistrationType, setSelectedRegistrationType] = useState("")
  const [selectedAgency, setSelectedAgency] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  const dispatch = useAppDispatch()
  const { agencies, dataStatus, provinces, registrationTypes } = useAppSelector(
    (state) => state.searchFilter
  )

  useEffect(() => {
    dispatch(fetchAgencies())
    dispatch(fetchDataStatus())
    dispatch(fetchProvinces())
    dispatch(fetchRegistrationTypes())
  }, [dispatch])

  const handleReset = () => {
    setLetterCategory("")
    setRegistrationNumber("")
    setSelectedProvince("")
    setSelectedRegistrationType("")
    setSelectedAgency("")
    setSelectedStatus("")
  }

  return (
    
    <div 
      className="flex-none mr-[3px] mb-[5px] p-[1px] bg-dodgerBlue h-full"
      style={{ 
        clipPath: "polygon(0% 0%, 60.1% 0%, 66.1% 2.6%, 100% 2.6%, 100% 100%, 0% 100%)",
      }}
    >
      <div 
        className="h-full bg-[var(--background-color)]"
        style={{
          clipPath: "polygon(0% 0%, 60% 0%, 66% 2.6%, 100% 2.6%, 100% 100%, 0% 100%)",
        }}
      >
        <div
          id="search-filter"
          className="grid grid-cols-1 w-[250px] pt-[5px] bg-[var(--background-color)]"
        >
          {/* Header */}
          <div className="grid grid-cols-[20px_200px]">
            <img
              src={SearchFilterIcon}
              alt="Search Filter"
              className="w-[20px] h-[20px] ml-[5px]"
            />
            <span className="flex justify-start text-[13px] ml-[20px]">เงื่อนไขการค้นหา</span>
          </div>

          {/* Form */}
          <div className="p-[10px]">
            <div className="grid grid-cols-1 my-[10px]">
              <label className="text-[12px] text-start mb-[10px]">หมวดอักษร</label>
              <Input type="text" className="w-full h-[29px] text-black" value={letterCategory} onChange={(e) => setLetterCategory(e.target.value)}/>
            </div>
            <div className="grid grid-cols-1 my-[10px]">
              <label className="text-[12px] text-start mb-[10px]">เลขทะเบียน</label>
              <Input type="text" className="w-full h-[29px] text-black" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 my-[10px]">
              <label className="text-[12px] text-start mb-[10px]">หมวดจังหวัด</label>
              <Select name="select-provices" value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="w-full h-[29px] text-black">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'white' }}>
                  {
                    provinces && provinces.length > 0 ? 
                    provinces.map((item) => (
                      <SelectItem key={item.id} value={item.province_code}>{ item.province_name_thai }</SelectItem>
                    ))
                    : null
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 my-[10px]">
              <label className="text-[12px] text-start mb-[10px]">ประเภททะเบียน</label>
              <Select name="select-car-registrations" value={selectedRegistrationType} onValueChange={setSelectedRegistrationType}>
                <SelectTrigger className="w-full h-[29px] text-black">
                  <SelectValue placeholder="เลือกประเภททะเบียน" />
                </SelectTrigger>
                <SelectContent>
                  {
                    registrationTypes && registrationTypes.length > 0 ? 
                    registrationTypes.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>{item.registration_type}</SelectItem>
                    ))
                    : null
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 my-[10px]">
              <label className="text-[12px] text-start mb-[10px]">หน่วยงานเจ้าของข้อมูล</label>
              <Select name="select-agencies" value={selectedAgency} onValueChange={setSelectedAgency}>
                <SelectTrigger className="w-full h-[29px] text-black">
                  <SelectValue placeholder="เลือกหน่วยงานเจ้าของข้อมูล" />
                </SelectTrigger>
                <SelectContent>
                  {
                    agencies && agencies.length > 0 ? 
                    agencies.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>{item.agency}</SelectItem>
                    ))
                    : null
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 my-[10px]">
              <label className="text-[12px] text-start mb-[10px]">สถานะข้อมูล</label>
              <Select name="select-status" value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full h-[29px] text-black">
                  <SelectValue placeholder="เลือกสถานะข้อมูล" />
                </SelectTrigger>
                <SelectContent>
                  {
                    dataStatus && dataStatus.length > 0 ? 
                    (
                      <>
                        <SelectItem key="3" value="3">ทุกสถานะ</SelectItem>
                        {
                          dataStatus.map((item) => (
                            <SelectItem key={item.id.toString()} value={item.id.toString()}>{item.status}</SelectItem>
                          ))
                        }
                      </>
                    )
                    : null
                  }
                </SelectContent>
              </Select>
            </div>
            <div id="button-group" className="flex justify-center mt-[30px]">
              <button 
                type="button" 
                className="flex justify-center items-center bg-dodgerBlue rounded w-[90px] h-[35px] mr-[10px]"
              >
                <SearchIcon className="w-[20px] h-[20px]" />
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
