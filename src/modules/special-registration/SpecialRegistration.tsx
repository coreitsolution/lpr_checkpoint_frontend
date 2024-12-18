import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import PopupMessage from "../../utils/popupMessage"
import ManageExtraRegistration from "../manage-extra-registration/ManageExtraRegistration"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { FILE_URL } from '@/config/apiConfig'

// Icon
import { Icon } from '../../components/icons/Icon'
import { Pencil, Trash2, Plus, Upload } from 'lucide-react'

// Types
import {
  SpecialPlatesRespondsDetail
} from '../../features/registration-data/RegistrationDataTypes'
import { FilterSpecialRegistration } from "../../features/api/types"


// API
import { 
  fetchDataStatusThunk,
  fetchProvincesThunk,
  fetchRegistrationTypesThunk
} from "../../features/dropdown/dropdownSlice"
import { 
  fetchSpecialPlateDataThunk,
  deleteSpecialPlateDataThunk
} from "../../features/registration-data/RegistrationDataSlice"

 // Context
import { useHamburger } from "../../context/HamburgerContext"

// Component
import Loading from "../../components/loading/Loading"
import SearchFilter from "../search-filter/SearchFilter"

function ExtraRegistration() {
  const dispatch: AppDispatch = useDispatch()
  const { specialPlatesData, status, error } = useSelector(
    (state: RootState) => state.registrationData
  )

  const [isAddRegistationOpen, setIsAddRegistationOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalData, setOriginalData] = useState<SpecialPlatesRespondsDetail[]>([])
  const [specialRegistrationsList, setSpecialRegistrationsList] = useState<SpecialPlatesRespondsDetail[]>([])
  const [selectedRow, setSelectedRow] = useState<SpecialPlatesRespondsDetail | null>(null)
  const { isOpen } = useHamburger()
  const [isLoading, setIsLoading] = useState(false)

  const { provinces, dataStatus, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  const handleEditClick = (item: SpecialPlatesRespondsDetail) => {
    setSelectedRow(item)
    setIsAddRegistationOpen(true)
    setIsEditMode(true)
  }

  const handleAddClick = () => {
    setIsEditMode(false)
    setIsAddRegistationOpen(true)
  }

  const handleDeleteClick = async (id: number) => {
    try {
      await dispatch(deleteSpecialPlateDataThunk(id))
      PopupMessage("ลบข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ", 'success')
    } 
    catch (error) {
      PopupMessage("ลบข้อมูลไม่สำเร็จ", "ข้อมูลไม่สามารถลบได้", "error")
    }
  }

  const setFilterData = (filterData: FilterSpecialRegistration) => {
    setIsLoading(true)
    const {
      letterCategory,
      carRegistration,
      selectedProvince,
      selectedRegistrationType,
      agency,
      selectedStatus,
    } = filterData
  
    if (
      !letterCategory &&
      !carRegistration &&
      !selectedProvince &&
      !selectedRegistrationType &&
      !agency &&
      (selectedStatus === 2 || selectedStatus === "")
    ) {
      setSpecialRegistrationsList(originalData)
      setIsLoading(false)
      return
    }
  
    const filteredData = originalData.filter((row) => {
      const isProvinceMatch = !selectedProvince || row.province_id === selectedProvince;
      const isStatusMatch = selectedStatus === 2 || selectedStatus === "" || row.active === selectedStatus;
      const isAgencyMatch = !agency || row.case_owner_agency.includes(agency);
      const isPlateClassMatch = !selectedRegistrationType || row.plate_class_id === selectedRegistrationType;
      const isLetterCategoryMatch = !letterCategory || row.plate_group.includes(letterCategory);
      const isCarRegistrationMatch = !carRegistration || row.plate_number.includes(carRegistration);
  
      return isProvinceMatch && isStatusMatch && isAgencyMatch && isPlateClassMatch && isLetterCategoryMatch && isCarRegistrationMatch;
    });
  
    setSpecialRegistrationsList(filteredData)
    setIsLoading(false)
  }

  const handleImportClick = () => {
    
  }

  useEffect(() => {
    setIsLoading(false)
  }, [specialRegistrationsList])

  useEffect(() => {
    dispatch(fetchSpecialPlateDataThunk())

    if (!isAddRegistationOpen) {
      setIsLoading(true)
      setTimeout(async () => {
        dispatch(fetchSpecialPlateDataThunk())
        setIsLoading(false)
      }, 500)
    }
    dispatch(fetchProvincesThunk())
    dispatch(fetchRegistrationTypesThunk())
    dispatch(fetchDataStatusThunk())
  }, [dispatch, isAddRegistationOpen])

  useEffect(() => {
    if (specialPlatesData && specialPlatesData.data) {
      setSpecialRegistrationsList(specialPlatesData.data)
      setOriginalData(specialPlatesData.data)
    }
    else {
      setSpecialRegistrationsList([])
      setOriginalData([])
    }
  }, [specialPlatesData])

  return (
    <div className={`main-content pe-3 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div id="extra-registration" className="grid grid-cols-1 w-[85%]">
        <div id="head" className="flex h-[50px] justify-between">
          <div className="flex flex-col">
            <p className="text-[20px] text-white">รายการทะเบียนพิเศษ</p>
            <p className="text-[14px] text-white">{`จำนวน ${specialRegistrationsList.length} รายการ`}</p>
          </div>
          <div className="flex items-end space-x-2">
            <button 
              type="button" 
              className="flex justify-center items-center bg-white text-dodgerBlue w-[120px] h-[35px] rounded hover:bg-slate-200"
              onClick={handleImportClick}
            >
              <Icon icon={Upload} size={20} color="dodgerBlue" />
              <span className="ml-[8px] text-[15px]">นำเข้าข้อมูล</span>
            </button>
            <button 
              type="button" 
              className="flex justify-center items-center bg-dodgerBlue text-white w-[150px] h-[35px] rounded hover:bg-sky-400"
              onClick={handleAddClick}
            >
              <Icon icon={Plus} size={20} color="#FFFFFF" />
              <span className="ml-[8px] text-[15px]">เพิ่มทะเบียนพิเศษ</span>
            </button>
          </div>
        </div>
        <div id="body" className="mt-[10px]">
          <table className="w-full text-[15px]">
            <thead>
              <tr className="h-[50px] bg-swamp border-none">
                <th className="text-center text-white">ทะเบียน</th>
                <th className="text-center text-white">รูป</th>
                <th className="text-center text-white">กลุ่มทะเบียน</th>
                <th className="text-center text-white">วันที่เพิ่ม</th>
                <th className="text-center text-white">วันที่แก้ไข</th>
                <th className="text-center text-white">เจ้าของข้อมูล</th>
                <th className="text-center text-white">หน่วยงาน</th>
                <th className="text-center text-white">สถานะ</th>
                <th className="w-[120px] text-center text-white"></th>
              </tr>
            </thead>
            <tbody className="text-white">
              {
                specialRegistrationsList && specialRegistrationsList.length > 0 ? 
                specialRegistrationsList.map((item) => (
                  <tr key={item.id} className="h-[80px] border-b border-b-[1px] border-dashed border-darkGray">
                    <td className="pl-[10px] w-[280px] text-start bg-celtic">
                      {  
                        item.plate_group + " " + item.plate_number + " " + provinces?.data?.find((row) => row.id === item.province_id)?.name_th
                      }
                    </td>
                    <td className="text-center bg-tuna w-[200px]">
                      {
                        Array.isArray(item.special_plate_images) && item.special_plate_images.length > 0 ? 
                        (
                          <div>
                            {
                              item.special_plate_images.map((image, index) => (
                                <img key={index} src={`${FILE_URL}${image.url}`} alt={`image-${index}`} className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]" />
                              ))
                            }
                          </div>
                        ) : 
                        (
                          <p>--</p>
                        )
                      }
                    </td>
                    <td className="text-start bg-celtic">
                      {
                        <p className="pl-[10px]">{registrationTypes?.data?.find((row) => row.id === item.plate_class_id)?.title_en}</p>
                      }
                    </td>
                    <td className="text-center bg-tuna">{format(new Date(item.createdAt ? item.createdAt : ""), "dd/MM/yyyy")}</td>
                    <td className="text-center bg-celtic">{format(new Date(item.updatedAt ? item.updatedAt : ""), "dd/MM/yyyy")}</td>
                    <td className="text-center bg-tuna">
                      {
                        item.case_owner_name === "" ? "ไม่ระบุตัวตน" : item.case_owner_name
                      }
                    </td>
                    <td className="text-center bg-celtic">
                      {
                        item.case_owner_agency
                      }
                    </td>
                    <td className="bg-tuna align-middle text-center">
                      <label 
                        className={`w-[80px] h-[30px] inline-flex items-center justify-center align-middle rounded
                          ${
                            dataStatus.find((row) => row.id === item.active)?.id === 1
                              ? "bg-fruitSalad" 
                              : "bg-nobel"
                          }`}
                      >
                        {
                          dataStatus.find((row) => row.id === item.active)?.status
                        }
                      </label>
                    </td>
                    <td className="text-center bg-celtic">
                      <button className="mr-[10px]" onClick={() => handleEditClick(item)}>
                        <Icon icon={Pencil} size={20} color="#FFFFFF" />
                      </button>
                      <button onClick={() => handleDeleteClick(item.id)}>
                        <Icon icon={Trash2} size={20} color="#FFFFFF" />
                      </button>
                    </td>
                  </tr>
                )) : null
              }
            </tbody>
          </table>
        </div>
        <div id="search-filter" className="w-[14%] fixed right-0 top-0 pt-[95px] h-full">
          <SearchFilter 
            setFilterData={setFilterData}
          />
        </div>
        <Dialog open={isAddRegistationOpen} onClose={() => {}} className="relative z-50">
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
            <DialogPanel className="space-y-4 border bg-[var(--background-color)] p-5 max-w-[80%] bg-black text-white">
              <div className="flex justify-between">
                <DialogTitle className="text-[28px]">จัดการทะเบียนพิเศษ</DialogTitle>
              </div>
              <ManageExtraRegistration 
                closeDialog={() => setIsAddRegistationOpen(false)} 
                selectedRow={selectedRow}
                isEditMode={isEditMode}
              />
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default ExtraRegistration