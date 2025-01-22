import React, { useEffect, useState, useRef } from 'react'
import {
  Select,
  MenuItem,
  Dialog,
} from "@mui/material"
import { format } from "date-fns"
import "../../../styles/variables.scss"
import { FILE_URL } from '../../../config/apiConfig'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'

// Icon
import { Icon } from '../../../components/icons/Icon'
import { Download } from 'lucide-react'
import RiArrowRightSFill from "~icons/ri/arrow-right-s-fill"
import RiArrowLeftSFill from "~icons/ri/arrow-left-s-fill"

// Modules
import LocationDetailDialog from '../../search/detail/location-detail/LocationDetail'

// API
import { fetchLastRecognitionsThunk, fetchSystemStatusThunk, fetchVehicleCountThunk, dowloadFileThunk } from "../../../features/live-view-real-time/liveViewRealTimeSlice"

// Types
import { CameraDetailSettings } from "../../../features/camera-settings/cameraSettingsTypes"
import { 
  VehicleCountData, 
  ConnectionResult, 
  SystemStatusData,
  LastRecognitionData,
} from "../../../features/live-view-real-time/liveViewRealTimeTypes"
import { DirectionDetail } from "../../../features/api/types";

// Services
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"

// Component
import Loading from "../../../components/loading/Loading"

// Utils
import { reformatString, isEquals } from "../../../utils/comonFunction"
import { PopupMessage } from "../../../utils/popupMessage"

dayjs.extend(buddhistEra)

interface CCTVSideBarProp {
  setCollapse: (status: boolean) => void
  cameraSetting: CameraDetailSettings[]
  setUpdateLastRecognition: (data: LastRecognitionData | null) => void
  setUpdateSpecialPlate: (data: LastRecognitionData) => void
}

const CCTVSideBar: React.FC<CCTVSideBarProp> = ({setCollapse, cameraSetting, setUpdateLastRecognition, setUpdateSpecialPlate}) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>('lastRecognition')
  const [LPRCameraSetting, setLPRCameraSetting] = useState<number | ''>('')
  const buttonDowloadRefs = useRef<(HTMLButtonElement | null)[]>([])
  const vehicleInfoRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isOpenFullDirectionDialog, setOpenFullDirectionDialog] = useState(false)
  const [detailData, setDetailData] = useState<LastRecognitionData | null>(null)
  const [directionDetail, setDirectionDetail] = useState<DirectionDetail[]>([])
  const [compare, setIsCompare] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [LPRCameraDropdown, setLPRCameraDropdown] = useState<{ label: string, value: number }[]>([])
  const [lastRecognitionListData, setLastRecognitionListData] = useState<LastRecognitionData[]>([])
  const [vehicleCountListData, setVehicleCountListData] = useState<VehicleCountData[]>([])
  const [originalData, setOriginalData] = useState<LastRecognitionData[]>([])
  const [connectionListData, setConnectionListData] = useState<ConnectionResult[]>([])
  const [systemStatusListData, setSystemStatusListData] = useState<SystemStatusData[]>([])
  const [lprSpecialPlateData, setLprSpecialPlateData] = useState<LastRecognitionData[]>([])

  const dispatch: AppDispatch = useDispatch()
  const { liveViewRealTimeData, vehicleCountData, systemStatusData, connectionData } = useSelector(
    (state: RootState) => state.liveViewRealTimes
  )

  const tabIcon = {
    LastRecognitionIcon: "/icons/planing",
    VehicleCountIcon: "/icons/checklist",
    SystemStatusIcon: "/icons/system-status",
    ConnectionIcon: "/icons/connection",
  }

  const fetchLastRecognitions = async () => {
    try {
      const query: Record<string, string> = {
        "limit": "20",
        "orderBy": "id",
        "reverseOrder": "true",
      }
      await dispatch(fetchLastRecognitionsThunk(query))
    }
    catch (ex) {
      setLastRecognitionListData([])
      setOriginalData([])
      setUpdateLastRecognition(null)
    }
  }

  const fetchVehicleCount = async () => {
    try {
      const query: Record<string, string> = {
        "limit": "20",
        "orderBy": "id",
        "reverseOrder": "true",
      }
      await dispatch(fetchVehicleCountThunk(query))
    }
    catch (ex) {
      setVehicleCountListData([])
    }
  }

  const fetchSystemStatus = async () => {
    try {
      const query: Record<string, string> = {
        "limit": "100",
        "orderBy": "id",
        "reverseOrder": "true",
      }
      await dispatch(fetchSystemStatusThunk(query))
    }
    catch (ex) {
      setSystemStatusListData([])
    }
  }

  useEffect(() => {
    if (cameraSetting) {
      const dropdownData = cameraSetting.map(({ alpr_cam_id , cam_id }) => ({
        label: cam_id,
        value: alpr_cam_id,
      }))
      const newDropdownData = [ {label: "ทั้งหมด", value: 0} , ...dropdownData]
      setLPRCameraDropdown(newDropdownData)

      if (LPRCameraSetting === '' || !newDropdownData.find(item => item.value === LPRCameraSetting)) {
        setLPRCameraSetting(0)
      }
    }
    else {
      const defaultDropdown = [{ label: "ทั้งหมด", value: 0 }]
      setLPRCameraDropdown(defaultDropdown)
      setLPRCameraSetting(0)
    }
  }, [cameraSetting])

  useEffect(() => {
    if (liveViewRealTimeData && liveViewRealTimeData.data) {
      if (LPRCameraSetting === 0) {
        setLastRecognitionListData(liveViewRealTimeData.data)
      }
      else {
        const filterDataa = liveViewRealTimeData.data.filter((item) => item.camera_id === LPRCameraSetting)
        setLastRecognitionListData(filterDataa)
      }
      if (liveViewRealTimeData.data.length > 0 && !isEquals(liveViewRealTimeData.data, originalData)) {
        setOriginalData(liveViewRealTimeData.data)
        setUpdateLastRecognition(liveViewRealTimeData.data[0])
        const specialPlateDetect = liveViewRealTimeData.data.filter((row) => row.special_plate !== null && row.is_special_plate)
        if (!isEquals(specialPlateDetect, lprSpecialPlateData)) {
          setLprSpecialPlateData(specialPlateDetect)
          setUpdateSpecialPlate(specialPlateDetect[0])
        }
      }
    }
  }, [liveViewRealTimeData])

  useEffect(() => {
    if (vehicleCountData && vehicleCountData.data) {
      setVehicleCountListData(vehicleCountData.data)
    }
  }, [vehicleCountData])

  useEffect(() => {
    if (systemStatusData && systemStatusData.data) {
      setSystemStatusListData(systemStatusData.data)
    }
  }, [systemStatusData])

  useEffect(() => {
    setIsLoading(true)
    fetchLastRecognitions()
    fetchVehicleCount()
    fetchSystemStatus()
    // dispatch(fetchConnectionThunk())
    setIsCompare(false)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)

    const interval = setInterval(() => {
      fetchLastRecognitions()
      fetchVehicleCount()
      fetchSystemStatus()
      // dispatch(fetchConnectionThunk())
    }, 3000)

    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    if (connectionData) {
      setConnectionListData((prev) => [...prev, connectionData])
    }
  }, [connectionData])

  useEffect(() => {
    if (LPRCameraSetting === 0) {
      setLastRecognitionListData(originalData)
    }
    else {
      const filterData = originalData.filter((item) => item.camera_id === LPRCameraSetting)
      setLastRecognitionListData(filterData)
    }
  }, [LPRCameraSetting])

  const sortedConnectionList = [...connectionListData]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const handleDowloadButtonClick = async(event: React.MouseEvent, id: number) => {
    event.stopPropagation()
    try {
      const param: Record<string, string> = {
        "lprDataId": id.toString()
      }
      const result = await dispatch(dowloadFileThunk(param)).unwrap()
      
      if (result && result.data) {
        if (result.data.zipUrl) {
          const fullUrl = `${FILE_URL}${result.data.zipUrl}`
          window.open(fullUrl, '_blank')
          return
        }
      }
    } 
    catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      PopupMessage("การดาวน์โหลดล้มเหลว", errorMessage, 'error');
    }    
  }

  const handleVehicleInfoClick = async (event: React.MouseEvent, item: LastRecognitionData) => {
    event.stopPropagation()
    setIsLoading(true)
    setDetailData(item)
    setDirectionDetail(directionDetail)
    setOpenFullDirectionDialog(true)

    setTimeout(async () => {
      setIsLoading(false)
    }, 500)
  }

  const handleFullDirectionDialogClose = () => {
    setOpenFullDirectionDialog(false)
  }

  const handleOnButtonClick = (componentName: string) => {
    setSelectedMenu(componentName)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  const createStatusButton = (status: number) => {
    let statusName
    let statusColor
    if (status === 1) {
      statusName = "Waiting"
      statusColor = "bg-sunglow"
    }
    else if (status === 2) {
      statusName = "Success"
      statusColor = "bg-fruitSalad"
    }
    else if (status === 3) {
      statusName = "Fail"
      statusColor = "bg-cinnabar"
    }
    else {
      statusName = "Unknown"
      statusColor = "bg-darkGray"
    }
    return (
      <label 
        className={`w-[65px] h-[20px] inline-flex items-center text-[12px] justify-center align-middle rounded
          ${statusColor}`}
      >
        {
          statusName
        }
      </label>
    )
  }

  useEffect(() => {
    if (selectedMenu === "collapse") {
      setCollapse(true)
    }
    else {
      setCollapse(false)
    }
  }, [selectedMenu])

  return (
    <div>
      <div
        className={`${
          selectedMenu === ("collapse") ? "hidden" : "flex"
        } w-[510px] h-[30px] transition-all duration-300`}
      >
        {isLoading && <Loading />}
        <div className='flex'>
          {/* Last Recognition Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20
            [clip-path:polygon(0_0,100%_0,calc(100%-10px)_100%,0_100%)]" />
            <button
              type="button"
              onClick={() => handleOnButtonClick("lastRecognition")}
              className={ `relative flex items-center space-x-2 pl-2 pr-4 py-1
              [clip-path:polygon(0_0,calc(100%-10px)_0,100%_100%,0_100%)] 
              ${selectedMenu === "lastRecognition" ? 
                "bg-[var(--background-color)] border-[1px] border-dodgerBlue group-hover:bg-slate-500" : 
                "bg-geyser group-hover:white text-black"}`
              }
            >
              <div>
                <div className="flex items-center">
                  <img 
                    src={`${tabIcon.LastRecognitionIcon}${ selectedMenu === "lastRecognition" ? "-active" : "" }.png`}
                    alt="Last Recognition" 
                    className='w-[20px] h-[20px]' 
                  />
                  <span 
                    className={`ml-[2px] text-[11px] ${selectedMenu === "lastRecognition" ? "text-white" : "bg-geyser"}`}
                  >
                    Last Recognition
                  </span>
                </div>
              </div>
            </button>
          </div>
          {/* Vehicle Count Button */}
          <div className="relative group -ml-[3px]">
            <div className="absolute inset-0 bg-blue-500/20
            transform skew-x-[20deg] origin-left rounded-r-lg" />
            <button
              type="button"
              onClick={() => handleOnButtonClick("vehicleCount")}
              className={`relative flex items-center space-x-2 pl-2 pr-4 py-1
              transform skew-x-[20deg] origin-left 
              ${selectedMenu === "vehicleCount" ? 
                "bg-[var(--background-color)] border-[1px] border-dodgerBlue group-hover:bg-slate-500" : 
                "bg-geyser group-hover:white text-black"}`
              }
            >
              <div className='-skew-x-[20deg]'>
                <div className="flex items-center">
                  <img 
                    src={`${tabIcon.VehicleCountIcon}${ selectedMenu === "vehicleCount" ? "-active" : "" }.png`}
                    alt="Vehicle Count" 
                    className='w-[20px] h-[20px]' 
                  />
                  <span 
                    className={`ml-[2px] text-[11px] ${selectedMenu === "vehicleCount" ? "text-white" : "bg-geyser"}`}
                  >
                    Vehicle Count
                  </span>
                </div>
              </div>
            </button>
          </div>
          {/* System Status Button */}
          <div className="relative group ml-[1.64px]">
            <div className="absolute inset-0 bg-blue-500/20 
            transform skew-x-[20deg] origin-left rounded-r-lg" />
            <button
              type="button"
              onClick={() => handleOnButtonClick("systemStatus")}
              className={`relative flex items-center space-x-2 pl-2 pr-4 py-1
              transform skew-x-[20deg] origin-left 
              ${selectedMenu === "systemStatus" ? 
                "bg-[var(--background-color)] border-[1px] border-dodgerBlue group-hover:bg-slate-500" : 
                "bg-geyser group-hover:white text-black"}`
              }
            >
              <div className='-skew-x-[20deg]'>
                <div className="flex items-center">
                  <img 
                    src={`${tabIcon.SystemStatusIcon}${ selectedMenu === "systemStatus" ? "-active" : "" }.png`} 
                    alt="System Status" 
                    className='w-[20px] h-[20px]' 
                  />
                  <span 
                    className={`ml-[2px] text-[11px] ${selectedMenu === "systemStatus" ? "text-white" : "bg-geyser"}`}
                  >
                    System Status
                  </span>
                </div>
              </div>
            </button>
          </div>
          {/* Connection Button */}
          <div className="relative group ml-[1.64px]">
            <div className="absolute inset-0 bg-blue-500/20 
            transform skew-x-[20deg] origin-left rounded-r-lg" />
            <button
              type="button"
              onClick={() => handleOnButtonClick("connection")}
              className={`relative flex items-center space-x-2 pl-2 pr-4 py-1
              transform skew-x-[20deg] origin-left
              ${selectedMenu === "connection" ? 
                "bg-[var(--background-color)] border-[1px] border-dodgerBlue group-hover:bg-slate-500" : 
                "bg-geyser group-hover:white text-black"}`
              }
            >
              <div className='-skew-x-[20deg]'>
                <div className="flex items-center">
                  <img 
                    src={`${tabIcon.ConnectionIcon}${ selectedMenu === "connection" ? "-active" : "" }.png`} 
                    alt="Connection" 
                    className='w-[20px] h-[20px]' 
                  />
                  <span 
                    className={`ml-[2px] text-[11px] ${selectedMenu === "connection" ? "text-white" : "bg-geyser"}`}
                  >
                    Connection
                  </span>
                </div>
              </div>
            </button>
          </div>
          {/* Collapse Button */}
          <div className="relative group ml-[1.4px]">
            <div className="absolute inset-0 bg-blue-500/20 transform origin-left" />
            <button
              type="button"
              onClick={() => handleOnButtonClick("collapse")}
              className="relative flex items-center space-x-2 pl-2 pr-[11px] bg-cornflower group-hover:bg-cornflower/50
              transform skew-x-[20deg] origin-left"
            >
              <div className='-skew-x-[20deg]'>
                <div className="flex">
                  <RiArrowRightSFill className="w-[30px] h-[28px]" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={selectedMenu === ("collapse") ? "hidden" : 'flex w-[510px] h-full' }>
        {/* lastRecognition */}
        <div className={ selectedMenu === "lastRecognition" ? "w-full" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <label className='flex justify-start text-white'>LPR Camera</label>
              <Select
                name="select-lpr-camera-setting" 
                value={LPRCameraSetting}
                onChange={(e) => setLPRCameraSetting(Number(e.target.value))}
                style={{ backgroundColor: "#fff", color: "#000", width: "100%", height: "30px" }}
              >
                {
                  LPRCameraDropdown && LPRCameraDropdown.length > 0 ? 
                  LPRCameraDropdown.map((item, index) => (
                    <MenuItem 
                      key={index} 
                      value={item.value} 
                      style={{ backgroundColor: `${index % 2 === 0 ? 'white' : 'whiteSmoke'}` }} 
                      className={`cursor-pointer`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'lightgray'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : 'whiteSmoke'
                      }}
                    >
                      { item.label }
                    </MenuItem>
                  ))
                  : null
                }
              </Select>
              <div className='h-[calc(100vh-200px)] mt-[10px] overflow-y-auto text-white'>
              {
                lastRecognitionListData && lastRecognitionListData.length > 0 ?
                lastRecognitionListData.map((item, index) => (
                  <div 
                    key={index}
                    className='grid grid-cols-2 text-[14px] w-full border-[1px] border-geyser'
                    ref={el => vehicleInfoRefs.current[index] = el}
                    onClick={(e) => handleVehicleInfoClick(e, item)}
                  >
                    <div className='w-full h-full text-center'>
                      <label className='ml-1'>{`${item.plate} ${item.region_info.name_th ? item.region_info.name_th : ""}`}</label>
                      <div className='flex h-[100px] w-full'>
                        <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                          <img 
                            key={`vehicle_img_${item.id}_${item.vehicle_image}`}
                            src={`${FILE_URL}${item.vehicle_image}?t=${Date.now()}`} 
                            alt="Vehicle Image"
                            className="w-full h-full" 
                          />
                        </div>
                        <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                          <img 
                            key={`plate_img_${item.id}_${item.plate_image}`}
                            src={`${FILE_URL}${item.plate_image}?t=${Date.now()}`} 
                            alt="Plate Image"
                            className="w-full h-[50%]" 
                          />
                        </div>
                      </div>
                    </div>
                    <div 
                      className="w-full h-full relative"
                    >
                      <div className='bg-celti text-center'>
                        <label className="px-1">{dayjs(item.epoch_start).format('DD-MM-BBBB HH:mm:ss')}</label>
                        <label className="px-1 border-l-[1px] border-white">{`${item.plate_confidence}%`}</label>
                      </div>
                      <div className="h-[100px] relative flex flex-col p-1 pl-2">
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">ประเภท</span>
                          <span className="mx-1">:</span>
                          <span className='w-[135px] truncate' title={reformatString(item.vehicle_body_type)}>{reformatString(item.vehicle_body_type)}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">ยี่ห้อ</span>
                          <span className="mx-1">:</span>
                          <span className='w-[135px] truncate' title={reformatString(item.vehicle_make)}>{reformatString(item.vehicle_make)}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">สี</span>
                          <span className="mx-1">:</span>
                          <span className='w-[135px] truncate' title={reformatString(item.vehicle_color)}>{reformatString(item.vehicle_color)}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">รุ่น</span>
                          <span className="mx-1">:</span>
                          <span className='w-[135px] truncate' title={reformatString(item.vehicle_make_model)}>{reformatString(item.vehicle_make_model)}</span>
                        </div>
                        <div className='absolute bottom-0 right-0'>
                          <button 
                            type='button'
                            ref={el => buttonDowloadRefs.current[index] = el}
                            onClick={(e) => handleDowloadButtonClick(e, item.id)}
                          >
                            <Icon icon={Download} size={25} color="dodgerBlue" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                : ""
              }
              </div>
            </div>
          </div>
          <Dialog open={isOpenFullDirectionDialog} onClose={() => {}} className="absolute z-50">
            <LocationDetailDialog
              detailData={detailData}
              close={handleFullDirectionDialogClose}
              isCompare={compare}
            />
          </Dialog>
        </div>
        {/* Vehicle Count */}
        <div className={ selectedMenu === "vehicleCount" ? "" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <div className="w-full h-[calc(100vh-138px)] overflow-y-auto relative">
                <table className="w-full text-white text-center">
                  {/* Table Header */}
                  <thead className="text-[14px] sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80">
                    <tr className="border-b-[1px] border-celtic">
                      <td className="border-r-[1px] border-celtic" colSpan={2}>
                        ช่วงเวลา
                      </td>
                      <td colSpan={3}>จำนวน</td>
                    </tr>
                    <tr className="h-[30px]">
                      <td className="w-[150px]">เริ่ม</td>
                      <td className="border-l-[2px] border-white w-[150px]">ถึง</td>
                      <td className="w-[100px] border-l-[1px] border-celtic">
                        ยานพาหนะ
                      </td>
                      <td className="border-l-[2px] border-white text-wrap w-[100px]">
                        ยานพาหนะ เฝ้าระวัง
                      </td>
                      <td className="border-l-[2px] border-white w-[100px]">รวม</td>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody className='text-[12px]'>
                    {vehicleCountListData && vehicleCountListData.length > 0
                      ? vehicleCountListData.map((item, index) => (
                          <tr
                            key={`vehicle-count-${index + 1}`}
                            className="h-[35px] border-b-[1px] border-dashed border-darkGray"
                          >
                            <td className="bg-celtic">{dayjs(item.start_time).format('DD/MM/BBBB (HH:mm)')}</td>
                            <td className="bg-tuna">{dayjs(item.end_time).format('DD/MM/BBBB (HH:mm)')}</td>
                            <td className="bg-celtic">{item.lpr_count}</td>
                            <td className="bg-tuna">{item.special_plates_count}</td>
                            <td className="bg-celtic">{item.total_count}</td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* System Status */}
        <div className={ selectedMenu === "systemStatus" ? "w-full" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <div className="w-full h-[calc(100vh-138px)] overflow-y-auto relative">
                <table className="text-[14px] w-full text-white">
                  {/* Table Body */}
                  <tbody>
                    {systemStatusListData && systemStatusListData.length > 0
                      ? systemStatusListData.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`h-[35px] border-b-[1px] border-dashed border-darkGray 
                              ${ index % 2 === 0 ? 'bg-celtic' : 'bg-tuna'}`}
                          >
                            <td className='text-start pl-[5px]'>{format(new Date(item.createdAt), "HH:mm:ss")} <span>&#62;</span> {item.details}</td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Connection */}
        <div className={ selectedMenu === "connection" ? "w-full" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <div className="w-full h-[calc(100vh-138px)] overflow-y-auto relative">
                <table className="w-full text-white text-center">
                  {/* Table Header */}
                  <thead className="sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80 text-[12px]">
                    <tr className='bg-swamp h-[30px]'>
                      <td>วันเวลาส่งข้อมูล</td>
                      <td>IP Server</td>
                      <td>Port</td>
                      <td>Host</td>
                      <td>ส่งสำเร็จ</td>
                      <td>คงค้าง</td>
                      <td>สถานะ</td>
                    </tr>
                  </thead>
                  {/* Table Body */}
                  <tbody className='text-[12px]'>
                    {sortedConnectionList && sortedConnectionList.length > 0
                      ? sortedConnectionList.map((item) => (
                          <tr
                            key={item.id}
                            className="h-[35px] border-b-[1px] border-dashed border-darkGray"
                          >
                            <td className="bg-celtic w-[26%]">{dayjs(item.sendingTime).format('DD/MM/BBBB (HH:mm:ss)')}</td>
                            <td className="bg-tuna w-[18%]">{item.ipServer}</td>
                            <td className="bg-celtic">{item.port}</td>
                            <td className="bg-tuna">{item.host}</td>
                            <td className="bg-celtic">{formatPrice(item.sendCompleted)}</td>
                            <td className="bg-tuna">{formatPrice(item.pending)}</td>
                            <td className="bg-celtic w-[15%]">
                              {
                                createStatusButton(item.status)
                              }
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          selectedMenu === ("collapse") ? "flex" : "hidden"
        } mb-[2px] h-[60px]`}
      >
        <button
          type="button"
          onClick={() => setSelectedMenu("lastRecognition")}
          className="w-[50px] bg-gradient-to-r from-cornflower to-bahamaBlue group-hover:bg-white rounded-l-[5px]"
        >
          <div>
            <div className="flex">
              <RiArrowLeftSFill className="w-[30px] h-[30px]" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default CCTVSideBar