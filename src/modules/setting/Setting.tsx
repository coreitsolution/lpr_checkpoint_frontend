import React, { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"

// Context
import { useHamburger } from "../../context/HamburgerContext"
import { Value } from '@radix-ui/react-select'

// Icon
import { Icon } from '../../components/icons/Icon'
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Component
import Loading from "../../components/loading/Loading"

// API
import { 
  fetchCameraSettingsThunk,
} from "../../features/camera-settings/cameraSettingsSlice"

// Types
import { CameraSettings } from "../../features/camera-settings/cameraSettingsTypes"

const Setting = () => {
  const dispatch: AppDispatch = useDispatch()
  const { cameraSetting, status, error } = useSelector(
    (state: RootState) => state.cameraSettings
  )
  const { isOpen } = useHamburger()
  const [cameraSettingSelect] = useState([
    {name: "แสดงผล 1 หน้าจอ", value: 1},
    {name: "แสดงผล 2 หน้าจอ", value: 2},
    {name: "แสดงผล 3 หน้าจอ", value: 3},
    {name: "แสดงผล 4 หน้าจอ", value: 4},
  ])
  const [selectedValue, setSelectedValue] = useState(4)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchCameraSettingsThunk())
  }, [dispatch])

  const renderStatus = (status: string) => (
    <span className={`px-2 py-1 rounded inline-block w-[80px] text-[15px] ${
      status === 'ON' ? 'bg-fruitSalad' : 'bg-nobel'
    } text-white`}>
      {status}
    </span>
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  return (
    <div className={`main-content pe-6 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div className='flex flex-col pt-10 mb-[30px]'>
        <label className='text-white mb-4'>ตั้งค่าหน้าจอแสดงผล</label>
        <Select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value as number)}
          style={{ backgroundColor: "#fff", color: "#000", width: "500px", height: "40px" }}
        >
          {cameraSettingSelect.map((option, index) => (
            <MenuItem key={index + 1} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <div className='flex justify-between'>
          <label className='text-[25px] text-white'>รายการกล้อง</label>
          <div className='bg-nobel rounded-[5px]'>
            <Button>
              <Icon icon={Plus} size={25} color="white" />
              <span className='ml-[5px] text-white text-[15px]'>กล้อง</span>
            </Button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden mt-[15px]">
          <table className="w-full">
            <thead className="bg-swamp text-[15px] text-white">
              <tr>
                <th className="px-4 py-2">ลำดับ</th>
                <th className="px-4 py-2">สถานะกล้อง</th>
                <th className="px-4 py-2">จุดตรวจ (ID)</th>
                <th className="px-4 py-2">พิกัด</th>
                <th className="px-4 py-2">จำนวนที่ตรวจจับ</th>
                <th className="px-4 py-2">ตั้งค่าเซ็นเซอร์</th>
                <th className="px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {cameraSetting.map((camera, index) => (
                <tr key={camera.id} className="border-b h-[30px] text-[15px] text-white">
                  <td className="px-4 py-2 text-center bg-celtic">{index + 1}</td>
                  <td className="px-4 py-2 text-center bg-tuna">
                    {renderStatus(camera.camera_status)}
                  </td>
                  <td className="px-4 py-2 bg-celtic">{camera.checkpoint_id}</td>
                  <td className="px-4 py-2 bg-tuna">{camera.latitude + ", " + camera.longitude}</td>
                  <td className="px-4 py-2 text-end bg-celtic">{formatPrice(camera.number_of_detections)}</td>
                  <td className="px-4 py-2 bg-tuna flex justify-center">
                    <Button>
                      <img src="/icons/cctv-setting.png" style={{ height: "30px", width: "30px" }} alt="Sensor Setting" />
                    </Button>
                  </td>
                  <td className="px-4 py-2 bg-celtic">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Icon icon={Pencil} size={20} color="white"></Icon>
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Icon icon={Trash2} size={20} color="white"></Icon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Setting