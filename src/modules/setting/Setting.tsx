import { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"

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
  deleteCameraSettingThunk,
} from "../../features/camera-settings/cameraSettingsSlice"
import { 
  fetchSettingsThunk,
  putSettingsThunk
} from "../../features/settings/settingsSlice"

// Types
import { CameraDetailSettings, CameraScreenSettingDetail } from "../../features/camera-settings/cameraSettingsTypes"

// Pop-up
import { PopupMessage } from "../../utils/popupMessage"

const Setting = () => {
  const dispatch: AppDispatch = useDispatch()
  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )
  const { settingData } = useSelector(
    (state: RootState) => state.settingsData
  )
  const { isOpen } = useHamburger()
  const [isCameraSettingOpen, setIsCameraSettingOpen] = useState(false)
  const [isSensorSettingOpen, setIsSensorSettingOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [cameraDetailSettingData, setCameraDetailSettingData] = useState<CameraDetailSettings[]>([])
  const [selectedRow, setSelectedRow] = useState<CameraDetailSettings | null>(null)
  const [cameraScreenSettingDetail, setCameraScreenSettingDetail] = useState<CameraScreenSettingDetail | null>(null)
  const [selectedScreenValue, setSelectedScreenValue] = useState<number>(1)
  const [cameraSettingSelect] = useState([
    {name: "แสดงผล 1 หน้าจอ", value: 1},
    {name: "แสดงผล 2 หน้าจอ", value: 2},
    {name: "แสดงผล 3 หน้าจอ", value: 3},
    {name: "แสดงผล 4 หน้าจอ", value: 4},
  ])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchCameraSettingsThunk())
    dispatch(fetchSettingsThunk({
      "filter": "key:live_view_count"
    }))
  }, [dispatch])

  useEffect(() => {
    if (cameraSettings && cameraSettings.data) {
      setCameraDetailSettingData(cameraSettings.data)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }, [cameraSettings])

  useEffect(() => {
    if (settingData && settingData.live_view_count && settingData.live_view_count.data) {
      setCameraScreenSettingDetail(settingData.live_view_count.data[0])
      const numValue = Number(settingData.live_view_count.data[0].value) || 1
      setSelectedScreenValue(numValue)
    }
  }, [settingData])
  

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

  const handleEditClick = (item: CameraDetailSettings) => {
    setSelectedRow(item)
    setIsCameraSettingOpen(true)
    setIsEditMode(true)
  }

  const handleSensorSettingClick = (item: CameraDetailSettings) => {
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
    await fetchCameraSetting()
  }

  const handleSensorSettingScreenClose = async () => {
    setIsSensorSettingOpen(false)
    await fetchCameraSetting()
  }

  const handleCameraSettingScreenClose = async () => {
    setIsCameraSettingOpen(false)
    await fetchCameraSetting()
  }

  const handleScreenSelect = async (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value)

    if (cameraDetailSettingData.length < value) {
      PopupMessage("", "จำนวนกล้องน้อยกว่าจำนวนจอแสดงผล", "warning")
      return
    }

    setSelectedScreenValue(value)

    try {
      if (cameraScreenSettingDetail) {
        const updateData = { 
          ...cameraScreenSettingDetail,
          value: value.toString(),
        };
        await dispatch(
          putSettingsThunk(updateData)
        ).unwrap();

        PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success");
      }
    }
    catch (error) {
      PopupMessage("บันทึกข้อมูลไม่สำเร็จ", error instanceof Error ? error.message : String(error), "error")
    }
    await fetchCameraSetting()
  }

  const fetchCameraSetting = async () => {
    setIsLoading(true)
    await dispatch(fetchCameraSettingsThunk())
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  return (
    <div id="setting" className={`main-content pe-6 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-300`}>
      {isLoading && <Loading />}
      <div className='flex flex-col pt-10 mb-[30px]'>
        <label className='text-white mb-4'>ตั้งค่าหน้าจอแสดงผล</label>
        <Select
          value={selectedScreenValue}
          onChange={handleScreenSelect}
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
          <div className={`${cameraDetailSettingData.length < 4 ? "bg-dodgerBlue" : "bg-nobel"} rounded-[5px]`}>
            <Button
              onClick={() => handleCameraButtonClick(true)}
              disabled={cameraDetailSettingData.length >= 4 ? true : false}
            >
              <Icon icon={Plus} size={25} color="white" />
              <span className='ml-[5px] text-white text-[15px]'>กล้อง</span>
            </Button>
          </div>
        </div>
        <div className="rounded-lg overflow-y-auto h-[68vh] mt-[15px]">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80 text-[15px] text-white">
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
              {cameraDetailSettingData.map((camera, index) => (
                <tr key={camera.id} className="border-b h-[30px] text-[15px] text-white">
                  <td className="px-4 py-2 text-center bg-celtic">{index + 1}</td>
                  <td className="px-4 py-2 text-center bg-tuna">
                    {renderStatus(camera.alive)}
                  </td>
                  <td className="px-4 py-2 bg-celtic">{camera.cam_id}</td>
                  <td className="px-4 py-2 bg-tuna">{camera.latitude + ", " + camera.longitude}</td>
                  <td className="px-4 py-2 text-end bg-celtic">{formatNumber(camera.detecion_count)}</td>
                  <td className="px-4 py-2 bg-tuna flex justify-center">
                    <Button onClick={() => handleSensorSettingClick(camera)}>
                      <img 
                        src={`/icons/sensor-setting${camera.detection_area !== "" ? "-green" : ""}.png`}
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
      <Dialog open={isCameraSettingOpen} onClose={() => {}} className="absolute z-30">
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
          <div 
          className="space-y-4 border bg-black text-white 
          w-[90vw] min-w-[700px] h-full max-h-[900px] overflow-y-auto"
          >
            <div className="flex justify-between">
              <DialogTitle className="text-[28px]">ตั้งค่ากล้อง</DialogTitle>
            </div>
            <div className="px-5 pb-5">
              <CameraSetting 
                closeDialog={handleCameraSettingScreenClose} 
                selectedRow={selectedRow}
                isEditMode={isEditMode}
              />
            </div>
          </div>
        </div>
      </Dialog>
      {/* Sensor Setting Dialog */}
      <Dialog open={isSensorSettingOpen} onClose={() => {}} className="absolute z-30">
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
          <div 
          className="space-y-4 border bg-[var(--background-color)] bg-black text-white 
          w-[50%] min-w-[700px] h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <DialogTitle className="text-[28px]">ตั้งค่าเซ็นเซอร์</DialogTitle>
              <button
                onClick={handleSensorSettingScreenClose} 
                className="text-white bg-transparent border-0 text-[28px] pr-6"
              >
                &times;
              </button>
            </div>
            <div className="px-5 pb-5">
              <SensorSetting 
                closeDialog={handleSensorSettingScreenClose} 
                selectedRow={selectedRow}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default Setting