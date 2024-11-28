import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import PopupMessage from "../../utils/popupMessage"
import { ReactComponent as ImportIcon } from "../../assets/svg/import-icon.svg"
import { ReactComponent as PlusIcon } from "../../assets/svg/plus-icon.svg"
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete-icon.svg"
import { ReactComponent as EditIcon } from "../../assets/svg/edit-icon.svg"
import ManageExtraRegistration from "../ManageExtraRegistration/ManageExtraRegistration"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import axios  from 'axios'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

import {
  ExtraRegistrationData
} from '../../types'

import {
  fetchAgencies,
  fetchDataStatus,
  fetchProvinces,
  fetchRegistrationTypes,
} from '../../redux/slices/searchFilterSlice'

function ExtraRegistration() {
  const [isAddRegistationOpen, setIsAddRegistationOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [extraRegistrations, setExtraRegistrations] = useState<ExtraRegistrationData[]>([])
  const [selectedRow, setSelectedRow] = useState<ExtraRegistrationData | null>(null)

  const apiUrl = process.env.REACT_APP_API_URL

  const dispatch = useAppDispatch()
  const { agencies, dataStatus, registrationTypes, provinces } = useAppSelector(
    (state) => state.searchFilter
  )

  const handleEditClick = (item: ExtraRegistrationData) => {
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
      const response = await axios.delete(`${apiUrl}/registrationInformation/${id}`)
      if (response.status === 200) {
        setExtraRegistrations((prev) => prev.filter((item) => item.id !== id))
        PopupMessage("ลบข้อมูลสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
      } 
      else {
        PopupMessage("ลบข้อมูลไม่สำเร็จ", "ข้อมูลไม่สามารถลบได้", "error")
      }
    } 
    catch (error) {
      PopupMessage("ลบข้อมูลไม่สำเร็จ", "ข้อมูลไม่สามารถลบได้", "error")
    }
  }

  useEffect(() => {
    const fetchRegistrationInformationData = async () => {
      try {
        const response = await axios.get<ExtraRegistrationData[]>(`${apiUrl}/registrationInformation`)
        setExtraRegistrations(response.data)
      } 
      catch (err) {
        PopupMessage("ดึงข้อมูลไม่สำเร็จ", "ไม่สามารถดึงข้อมูลการลงทะเบียนได้", "error")
      }
    }

    if (!isAddRegistationOpen) {
      fetchRegistrationInformationData()
    }
    dispatch(fetchAgencies())
    dispatch(fetchDataStatus())
    dispatch(fetchProvinces())
    dispatch(fetchRegistrationTypes())
  }, [apiUrl, dispatch, isAddRegistationOpen])

  return (
    <div id="extra-registration" className="grid grid-cols-1 m-[5px] w-full">
      <div id="head" className="flex h-[50px] justify-between">
        <div>
          <p className="text-[20px]">รายการทะเบียนพิเศษ</p>
        </div>
        <div className="flex items-end space-x-2">
          <button type="button" className="flex justify-center items-center bg-white text-dodgerBlue w-[120px] h-[35px] rounded hover:bg-slate-200">
            <ImportIcon className="w-[20px] h-[20px]" />
            <span className="ml-[8px] text-[15px]">นำเข้าข้อมูล</span>
          </button>
          <button 
            type="button" 
            className="flex justify-center items-center bg-dodgerBlue text-white w-[170px] h-[35px] rounded hover:bg-sky-400"
            onClick={handleAddClick}
          >
            <PlusIcon className="w-[20px] h-[20px]" />
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
          <tbody>
            {
              extraRegistrations && extraRegistrations.length > 0 ? 
              extraRegistrations.map((item) => (
                <tr key={item.id} className="h-[80px] border-b border-b-[1px] border-dashed border-darkGray">
                  <td className="pl-[10px] w-[280px] text-start bg-celtic">
                    {  
                      item.letter_category + " " + item.car_registration + " " + provinces.find((row) => row.id === item.province_id)?.province_name_thai
                    }
                  </td>
                  <td className="text-center bg-tuna w-[200px]">
                    {
                      Array.isArray(item.images) && item.images.length > 0 ? 
                      (
                        <div>
                          {
                            item.images.map((image, index) => (
                              <img key={index} src={image} alt={`image-${index}`} className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]" />
                            ))
                          }
                        </div>
                      ) : 
                      (
                        <p>--</p>
                      )
                    }
                  </td>
                  <td className="text-center bg-celtic">
                    {
                      registrationTypes.find((row) => row.id === item.registration_type_id)?.registration_type
                    }
                  </td>
                  <td className="text-center bg-tuna">{format(item.created_at, "dd/MM/yyyy")}</td>
                  <td className="text-center bg-celtic">{format(item.updated_at, "dd/MM/yyyy")}</td>
                  <td className="text-center bg-tuna">
                    {
                      item.data_owner === "" ? "ไม่ระบุตัวตน" : item.data_owner
                    }
                  </td>
                  <td className="text-center bg-celtic">
                    {
                      agencies.find((row) => row.id === item.agency_id)?.agency
                    }
                  </td>
                  <td className="bg-tuna align-middle text-center">
                    <label 
                      className={`w-[80px] h-[30px] inline-flex items-center justify-center align-middle rounded
                        ${
                          dataStatus.find((row) => row.id === item.status_id)?.status.toLowerCase() === "active"
                            ? "bg-fruitSalad" 
                            : "bg-nobel"
                        }`}
                    >
                      {
                        dataStatus.find((row) => row.id === item.status_id)?.status
                      }
                    </label>
                  </td>
                  <td className="text-center bg-celtic">
                    <button className="mr-[10px]">
                      <EditIcon 
                        className="w-[20px] h-[20px]" 
                        onClick={() => handleEditClick(item)}
                      />
                    </button>
                    <button>
                      <DeleteIcon 
                        className="w-[20px] h-[20px]"
                        onClick={() => handleDeleteClick(item.id)}
                      />
                    </button>
                  </td>
                </tr>
              )) : null
            }
          </tbody>
        </table>
      </div>
      <Dialog open={isAddRegistationOpen} onClose={() => setIsAddRegistationOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm">
          <DialogPanel className="space-y-4 border bg-[var(--background-color)] p-5 max-w-[80%]">
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
  )
}

export default ExtraRegistration