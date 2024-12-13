import React, { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

// Modules
import CameraSetting from './camera-setting/CameraSetting'
import SensorSetting from './sensor-setting/SensorSetting'

// Context
import { useHamburger } from "../../context/HamburgerContext"

// Icon
import { Icon } from '../../components/icons/Icon'
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Component
import Loading from "../../components/loading/Loading"

// API
import { 
  fetchCameraSettingsThunk,
  putCameraDetailSettingsThunk,
  deleteCameraSettingThunk
} from "../../features/camera-settings/cameraSettingsSlice"

// Types
import { CameraSettings, CameraDetailSetting } from "../../features/camera-settings/cameraSettingsTypes"

// Pop-up
import PopupMessage from "../../utils/popupMessage"

const Setting = () => {
  const dispatch: AppDispatch = useDispatch()
  const { cameraSetting, status, error } = useSelector(
    (state: RootState) => state.cameraSettings
  )
  const { isOpen } = useHamburger()
  const [isCameraSettingOpen, setIsCameraSettingOpen] = useState(false)
  const [isSensorSettingOpen, setIsSensorSettingOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [cameraDetailSettingData, setCameraDetailSettingData] = useState<CameraDetailSetting | null>(null)
  const [selectedRow, setSelectedRow] = useState<CameraSettings | null>(null)
  const [cameraSettingSelect] = useState([
    {name: "แสดงผล 1 หน้าจอ", value: 1},
    {name: "แสดงผล 2 หน้าจอ", value: 2},
    {name: "แสดงผล 3 หน้าจอ", value: 3},
    {name: "แสดงผล 4 หน้าจอ", value: 4},
  ])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchCameraSettingsThunk())
  }, [dispatch])

  useEffect(() => {
    if (cameraSetting) {
      setCameraDetailSettingData(cameraSetting)
    }
  }, [cameraSetting])

  const renderStatus = (status: number) => (
    <span className={`px-2 py-1 rounded inline-block w-[80px] text-[15px] ${
      status === 1 ? 'bg-fruitSalad' : 'bg-nobel'
    } text-white`}>
      {status === 1 ? "ON" : "OFF"}
    </span>
  )

  const formatNumber = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  const handleEditClick = (item: CameraSettings) => {
    setSelectedRow(item)
    setIsCameraSettingOpen(true)
    setIsEditMode(true)
  }

  const handleSensorSettingClick = (item: CameraSettings) => {
    setSelectedRow(item)
    setIsSensorSettingOpen(true)
  }

  const handleCameraButtonClick = (status: boolean) => {
    setSelectedRow(null)
    setIsCameraSettingOpen(status)
    setIsEditMode(false)
  }

  const handleDeleteClick = async (id: number) => {
    await dispatch(deleteCameraSettingThunk(id))
    PopupMessage("ลบข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ", 'success')
  }

  const handleScreenSelect = async (value: number) => {
    setCameraDetailSettingData((prev) => ({
      ...prev,
      screen: value,
      id: prev?.id ?? 0,
      cameraSettings: prev?.cameraSettings ?? [],
    }))
    if (cameraDetailSettingData) {
      let updateData = cameraDetailSettingData
      updateData = {
        ...cameraDetailSettingData, 
        screen: value,
        id: cameraDetailSettingData?.id ?? 0,
        cameraSettings: cameraDetailSettingData?.cameraSettings ?? [],
      }
      await dispatch(putCameraDetailSettingsThunk(updateData))
      PopupMessage("", "บันทึกข้อมูลสำเร็จ", 'success')
    }
  }

  return (
    <div id="setting" className={`main-content pe-6 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-300`}>
      {isLoading && <Loading />}
      <div className='flex flex-col pt-10 mb-[30px]'>
        <label className='text-white mb-4'>ตั้งค่าหน้าจอแสดงผล</label>
        <Select
          value={cameraDetailSettingData?.screen ? cameraDetailSettingData?.screen : 1}
          onChange={(e) => handleScreenSelect(e.target.value as number)}
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
          <div className={`${cameraSetting && cameraSetting.cameraSettings.length < 4 ? "bg-dodgerBlue" : "bg-nobel"} rounded-[5px]`}>
            <Button
              onClick={() => handleCameraButtonClick(true)}
              disabled={cameraSetting && cameraSetting.cameraSettings.length >= 4 ? true : false}
            >
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
              {cameraSetting?.cameraSettings.map((camera, index) => (
                <tr key={camera.id} className="border-b h-[30px] text-[15px] text-white">
                  <td className="px-4 py-2 text-center bg-celtic">{index + 1}</td>
                  <td className="px-4 py-2 text-center bg-tuna">
                    {renderStatus(camera.camera_status)}
                  </td>
                  <td className="px-4 py-2 bg-celtic">{camera.checkpoint_id}</td>
                  <td className="px-4 py-2 bg-tuna">{camera.latitude + ", " + camera.longtitude}</td>
                  <td className="px-4 py-2 text-end bg-celtic">{formatNumber(camera.number_of_detections)}</td>
                  <td className="px-4 py-2 bg-tuna flex justify-center">
                    <Button onClick={() => handleSensorSettingClick(camera)}>
                      <img 
                        src={`/icons/sensor-setting${camera.sensor_setting ? "-green" : ""}.png`}
                        style={{ height: "30px", width: "30px" }} 
                        alt="Sensor Setting" 
                      />
                    </Button>
                  </td>
                  <td className="px-4 py-2 bg-celtic">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditClick(camera)}
                      >
                        <Icon icon={Pencil} size={20} color="white"></Icon>
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(camera.id)}
                      >
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
      {/* Camera Setting Dialog */}
      <Dialog open={isCameraSettingOpen} onClose={() => setIsCameraSettingOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
          <DialogPanel 
          className="space-y-4 border p-5 bg-black text-white 
          w-full min-w-[700px] h-full max-h-[900px] overflow-y-auto"
          >
            <div className="flex justify-between">
              <DialogTitle className="text-[28px]">ตั้งค่ากล้อง</DialogTitle>
            </div>
            <CameraSetting 
              closeDialog={() => setIsCameraSettingOpen(false)} 
              selectedRow={selectedRow}
              isEditMode={isEditMode}
            />
          </DialogPanel>
        </div>
      </Dialog>
      {/* Sensor Setting Dialog */}
      <Dialog open={isSensorSettingOpen} onClose={() => setIsSensorSettingOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
          <DialogPanel 
          className="space-y-4 border bg-[var(--background-color)] p-5 bg-black text-white 
          w-[50%] min-w-[700px] h-full max-h-[860px] overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <DialogTitle className="text-[28px]">ตั้งค่าเซ็นเซอร์</DialogTitle>
              <button
                onClick={() => setIsSensorSettingOpen(false)} 
                className="text-white bg-transparent border-0 text-[28px]"
              >
                &times;
              </button>
            </div>
            <SensorSetting 
              closeDialog={() => setIsSensorSettingOpen(false)} 
              selectedRow={selectedRow}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default Setting