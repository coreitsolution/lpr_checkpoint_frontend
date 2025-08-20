import React, { useEffect, useState, useRef } from 'react'
import {
  Select,
  MenuItem,
} from "@mui/material"
import { format } from "date-fns"
import "../../../styles/variables.scss"
import { getUrls } from '../../../config/runtimeConfig';
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { fetchClient, combineURL } from "../../../utils/fetchClient"

// Icon
import { Icon } from '../../../components/icons/Icon'
import { Download } from 'lucide-react'
import RiArrowRightSFill from "~icons/ri/arrow-right-s-fill"
import RiArrowLeftSFill from "~icons/ri/arrow-left-s-fill"

// Modules
import LocationDetailDialog from '../../search/detail/location-detail/LocationDetail'

// Types
import { CameraDetailSettings } from "../../../features/camera-settings/cameraSettingsTypes"
import { 
  VehicleCountData, 
  ConnectionResult, 
  SystemStatusData,
  RealTimeLprData,
  VehicleCountResult,
  SystemStatusResult,
  ZipDownload,
} from "../../../features/live-view-real-time/liveViewRealTimeTypes"
import { DirectionDetail } from "../../../features/api/types";

// Services
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"

// Component
import Loading from "../../../components/loading/Loading"

// Utils
import { reformatString, isNumber, formatNumber } from "../../../utils/commonFunction"
import { PopupMessage } from "../../../utils/popupMessage"

// i18n
import { useTranslation } from "react-i18next";

dayjs.extend(buddhistEra)

interface CCTVSideBarProp {
  setCollapse: (status: boolean) => void
  cameraSetting: CameraDetailSettings[]
  setUpdateLastRecognition: (data: RealTimeLprData | null) => void
  setUpdateSpecialPlate: (data: RealTimeLprData) => void
}

const CCTVSideBar: React.FC<CCTVSideBarProp> = ({setCollapse, cameraSetting, setUpdateLastRecognition, setUpdateSpecialPlate}) => {
  // i18n
  const { t, i18n } = useTranslation();
  
  const [selectedMenu, setSelectedMenu] = useState<string | null>('lastRecognition')
  const [LPRCameraSetting, setLPRCameraSetting] = useState<number | ''>('')
  const buttonDownloadRefs = useRef<(HTMLButtonElement | null)[]>([])
  const vehicleInfoRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isOpenFullDirectionDialog, setOpenFullDirectionDialog] = useState(false)
  const [detailData, setDetailData] = useState<RealTimeLprData | null>(null)
  const [directionDetail, setDirectionDetail] = useState<DirectionDetail[]>([])
  const [compare, setIsCompare] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [LPRCameraDropdown, setLPRCameraDropdown] = useState<{ label: string, value: number }[]>([])
  const [lastRecognitionData, setLastRecognitionData] = useState<RealTimeLprData | null>(null)
  const [lastRecognitionListData, setLastRecognitionListData] = useState<RealTimeLprData[]>([])
  const [vehicleCountListData, setVehicleCountListData] = useState<VehicleCountData[]>([])
  const [connectionListData, setConnectionListData] = useState<ConnectionResult[]>([])
  const [systemStatusListData, setSystemStatusListData] = useState<SystemStatusData[]>([])

  const { FILE_URL, IMAGE_URL, API_URL } = getUrls();
  const { vehicleCountData, systemStatusData, connectionData } = useSelector(
    (state: RootState) => state.liveViewRealTimes
  )

  const { realtimeData } = useSelector(
    (state: RootState) => state.realtimeData
  )

  const tabIcon = {
    LastRecognitionIcon: "/icons/planing",
    VehicleCountIcon: "/icons/checklist",
    SystemStatusIcon: "/icons/system-status",
    ConnectionIcon: "/icons/connection",
  }

  const fetchVehicleCount = async () => {
    try {
      const query: Record<string, string> = {
        "limit": "20",
        "orderBy": "id",
        "reverseOrder": "true",
      }
      await fetchClient<VehicleCountResult>(combineURL(API_URL, "/lpr-data/get-vehicle-count"), {
        method: "GET",
        queryParams: query,
      });
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
      await fetchClient<SystemStatusResult>(combineURL(API_URL, "/logs/get"), {
        method: "GET",
        queryParams: query,
      });
    }
    catch (ex) {
      setSystemStatusListData([])
    }
  }

  useEffect(() => {
    if (cameraSetting) {
      const dropdownData = cameraSetting.map(({ alpr_cam_id ,cam_id }) => ({
        label: cam_id,
        value: alpr_cam_id,
      }))
      const newDropdownData = [ {label: t('text.all'), value: 0} , ...dropdownData]
      setLPRCameraDropdown(newDropdownData)

      if (LPRCameraSetting === '' || !newDropdownData.find(item => item.value === LPRCameraSetting)) {
        setLPRCameraSetting(0)
      }
    }
    else {
      const defaultDropdown = [{ label: t('text.all'), value: 0 }]
      setLPRCameraDropdown(defaultDropdown)
      setLPRCameraSetting(0)
    }
  }, [cameraSetting, i18n.language])

  useEffect(() => {
    if (lastRecognitionData) {
      setUpdateLastRecognition(lastRecognitionData)
      if (lastRecognitionData.isSpecialPlate === 1) {
        setUpdateSpecialPlate(lastRecognitionData)
      }
    }
  }, [lastRecognitionData])

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
    if (LPRCameraSetting === 0 || LPRCameraSetting === '') {
      setLastRecognitionListData(realtimeData)
    }
    else {
      const filterData = realtimeData.filter((item) => item.alprCamId === LPRCameraSetting)
      setLastRecognitionListData(filterData)
    }
  }, [realtimeData])

  useEffect(() => {
    if (realtimeData) {
      setLastRecognitionData(realtimeData[0])
    }
  }, [realtimeData])

  useEffect(() => {
    setIsLoading(true)
    fetchVehicleCount()
    fetchSystemStatus()
    setIsCompare(false)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)

    const interval = setInterval(() => {
      fetchVehicleCount()
      fetchSystemStatus()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (connectionData) {
      setConnectionListData((prev) => [...prev, connectionData])
    }
  }, [connectionData])

  useEffect(() => {
    if (LPRCameraSetting === 0) {
      setLastRecognitionListData(realtimeData)
    }
    else {
      const filterData = realtimeData.filter((item) => item.alprCamId === LPRCameraSetting)
      setLastRecognitionListData(filterData)
    }
  }, [LPRCameraSetting])

  const sortedConnectionList = [...connectionListData]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const handleDownloadButtonClick = async(event: React.MouseEvent, id: number) => {
    event.stopPropagation()
    try {
      const param: Record<string, string> = {
        "lprDataId": id.toString()
      }
      const result = await fetchClient<ZipDownload>(combineURL(API_URL, "/lpr-data/get-zipped-images-url"), {
        method: "GET",
        queryParams: param,
      });
      
      if (result && result.data) {
        if (result.data.zipUrl) {
          const fullUrl = `${FILE_URL}${result.data.zipUrl}`
          window.open(fullUrl, '_blank')
          return
        }
      }
    } 
    catch (error) {
      PopupMessage(t('message.error.download-failed'), "", 'error');
    }
  }

  const handleVehicleInfoClick = async (event: React.MouseEvent, item: RealTimeLprData) => {
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
                    {t('tab.last-recognition')}
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
                    {t('tab.vehicle-count')}
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
                    {t('tab.system-status')}
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
                    {t('tab.connection')}
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
              <label className='flex justify-start text-white'>{t('text.lpr-camera')}</label>
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
                      <label className='ml-1'>
                        {`
                          ${isNumber(item.plateGroup) && isNumber(item.plateNumber) ? 
                          `${item.plateGroup}-${item.plateNumber}` : 
                          `${item.plateGroup} ${item.plateNumber}`} 
                          ${item.regionNameTH}
                        `}
                      </label>
                      <div className='flex h-[100px] w-full'>
                        <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                          <img 
                            key={`vehicle_img_${index}_${item.vehicleImage}`}
                            src={`${IMAGE_URL}${item.vehicleImage}`} 
                            alt="Vehicle Image"
                            className="w-full h-full" 
                          />
                        </div>
                        <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                          <img 
                            key={`plate_img_${index}_${item.plateImage}`}
                            src={`${IMAGE_URL}${item.plateImage}`} 
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
                        <label className="px-1">{dayjs(item.detectionDatetime).format(i18n.language === 'th' ? 'DD/MM/BBBB HH:mm:ss' : 'DD-MM-YYYY HH:mm:ss')}</label>
                        <label className="px-1 border-l-[1px] border-white">{`${item.plateConfidence}%`}</label>
                      </div>
                      <div className="h-[100px] relative flex flex-col p-1 pl-2">
                        <div className="flex mb-[2px]">
                          <span className={`${i18n.language === "en" ? "w-[70px]": "w-[55px]"} text-left`}>{t('text.car-type')}</span>
                          <span className="mx-1">:</span>
                          <span className={`${i18n.language === "en" ? "w-[120px]": "w-[135px]"} truncate`} title={reformatString(item.bodyType)}>{reformatString(item.bodyType)}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className={`${i18n.language === "en" ? "w-[70px]": "w-[55px]"} text-left`}>{t('text.car-brand')}</span>
                          <span className="mx-1">:</span>
                          <span className={`${i18n.language === "en" ? "w-[120px]": "w-[135px]"} truncate`} title={reformatString(item.make)}>{reformatString(item.make)}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className={`${i18n.language === "en" ? "w-[70px]": "w-[55px]"} text-left`}>{t('text.car-color')}</span>
                          <span className="mx-1">:</span>
                          <span className={`${i18n.language === "en" ? "w-[120px]": "w-[135px]"} truncate`} title={reformatString(item.color)}>{reformatString(item.color)}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className={`${i18n.language === "en" ? "w-[70px]": "w-[55px]"} text-left`}>{t('text.car-model')}</span>
                          <span className="mx-1">:</span>
                          <span className={`${i18n.language === "en" ? "w-[120px]": "w-[135px]"} truncate`} title={reformatString(item.model)}>{reformatString(item.model)}</span>
                        </div>
                        <div className='absolute bottom-0 right-0'>
                          <button 
                            type='button'
                            ref={el => buttonDownloadRefs.current[index] = el}
                            onClick={(e) => handleDownloadButtonClick(e, item.id)}
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
          <LocationDetailDialog
            open={isOpenFullDirectionDialog}
            detailData={detailData}
            close={handleFullDirectionDialogClose}
            isCompare={compare}
          />
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
                        {t('table.column.time-range')}
                      </td>
                      <td colSpan={3}>{t('table.column.count')}</td>
                    </tr>
                    <tr className="h-[30px]">
                      <td className="w-[150px]">{t('table.column.start')}</td>
                      <td className="border-l-[2px] border-white w-[150px]">{t('table.column.end')}</td>
                      <td className="w-[100px] border-l-[1px] border-celtic">
                        {t('table.column.vehicle')}
                      </td>
                      <td className="border-l-[2px] border-white text-wrap w-[100px]">
                        {t('table.column.watch-list-vehicle')}
                      </td>
                      <td className="border-l-[2px] border-white w-[100px]">{t('table.column.total')}</td>
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
                            <td className="bg-celtic">{dayjs(item.start_time).format(i18n.language === 'th' ? 'DD/MM/BBBB (HH:mm)' : 'DD/MM/YYYY (HH:mm)')}</td>
                            <td className="bg-tuna">{dayjs(item.end_time).format(i18n.language === 'th' ? 'DD/MM/BBBB (HH:mm)' : 'DD/MM/YYYY (HH:mm)')}</td>
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
                      <td>{t('table.column.send-data-date-time')}</td>
                      <td>{t('table.column.ip-server')}</td>
                      <td>{t('table.column.port')}</td>
                      <td>{t('table.column.host')}</td>
                      <td>{t('table.column.send-successful')}</td>
                      <td>{t('table.column.remain')}</td>
                      <td>{t('table.column.status')}</td>
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
                            <td className="bg-celtic w-[26%]">{dayjs(item.sendingTime).format(i18n.language === 'th' ? 'DD/MM/BBBB (HH:mm:ss)' : 'DD/MM/YYYY (HH:mm:ss)')}</td>
                            <td className="bg-tuna w-[18%]">{item.ipServer}</td>
                            <td className="bg-celtic">{item.port}</td>
                            <td className="bg-tuna">{item.host}</td>
                            <td className="bg-celtic">{formatNumber(item.sendCompleted)}</td>
                            <td className="bg-tuna">{formatNumber(item.pending)}</td>
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