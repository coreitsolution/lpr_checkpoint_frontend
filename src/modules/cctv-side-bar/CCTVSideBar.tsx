import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Select,
  MenuItem,
} from "@mui/material"
import { format } from "date-fns"
import "../../styles/variables.scss"

// Image
import Car1 from "/images/car_test.png"

// Icon
import { Icon } from '../../components/icons/Icon'
import { Download } from 'lucide-react'
import RiArrowRightSFill from "~icons/ri/arrow-right-s-fill"
import RiArrowLeftSFill from "~icons/ri/arrow-left-s-fill"

// Modules
import LocationDetailDialog from '../search/detail/location-detail/LocationDetail'

// API
import { fetchVehicles } from "../../features/search/searchSlice"
import { fetchLastRecognitionsThunk, fetchVehicleCountThunk, fetchSystemStatusThunk, fetchConnectionThunk, dowloadFileThunk } from "../../features/live-view-real-time/liveViewRealTimeSlice"

// Types
import {
  SearchResult,
} from "../../features/api/types"
import { CameraDetailSetting } from "../../features/camera-settings/cameraSettingsTypes"
import { LastRecognitionResult, VehicleCountResult, ConnectionResult, SystemStatusResult } from "../../features/live-view-real-time/liveViewRealTimeTypes"

// Services
import { apiService } from '../../features/api/apiService'
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"

// Component
import Loading from "../../components/loading/Loading"

interface CCTVSideBarProp {
  setCollapse: (status: boolean) => void
  cameraSetting: CameraDetailSetting | null
  setUpdateLastRecognition: (status: LastRecognitionResult) => void
}

const CCTVSideBar: React.FC<CCTVSideBarProp> = ({setCollapse, cameraSetting, setUpdateLastRecognition}) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>('lastRecognition')
  const [LPRCameraSetting, setLPRCameraSetting] = useState("ทั้งหมด")
  const buttonDowloadRefs = useRef<(HTMLButtonElement | null)[]>([])
  const vehicleInfoRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isOpenFullDirectionDialog, setOpenFullDirectionDialog] = useState(false)
  const [detailData, setDetailData] = useState<SearchResult>()
  const [compareData, setCompareData] = useState<SearchResult[]>([])
  const [compare, setIsCompare] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [LPRCameraDropdown, setLPRCameraDropdown] = useState<{ id: number, name: string, value: string }[]>([])
  const [lastRecognitionListData, setLastRecognitionListData] = useState<LastRecognitionResult[]>([])
  const [originalData, setOriginalData] = useState<LastRecognitionResult[]>([])
  const [vehicleListData, setVehicleListData] = useState<VehicleCountResult[]>([])
  const [connectionListData, setConnectionListData] = useState<ConnectionResult[]>([])
  const [systemStatusListData, setSystemStatusListData] = useState<SystemStatusResult[]>([])

  const dispatch: AppDispatch = useDispatch()
  const { liveViewRealTimeData, vehicleCountData, systemStatusData, connectionData, status, error } = useSelector(
    (state: RootState) => state.liveViewRealTimes
  )

  const tabIcon = {
    LastRecognitionIcon: "/icons/planing",
    VehicleCountIcon: "/icons/checklist",
    SystemStatusIcon: "/icons/system-status",
    ConnectionIcon: "/icons/connection",
  }

  useEffect(() => {
    if (cameraSetting?.cameraSettings) {
      const dropdownData = cameraSetting.cameraSettings.map(({ id, checkpoint_id }) => ({
        id,
        name: checkpoint_id,
        value: checkpoint_id,
      }))
      const newDropdownData = [ {id: 0, name: "ทั้งหมด", value: "ทั้งหมด"} , ...dropdownData]
      setLPRCameraDropdown(newDropdownData)
    }
  }, [cameraSetting])

  useEffect(() => {
    dispatch(fetchLastRecognitionsThunk())
    dispatch(fetchVehicleCountThunk())
    dispatch(fetchSystemStatusThunk())
    dispatch(fetchConnectionThunk())

    const interval = setInterval(() => {
      dispatch(fetchLastRecognitionsThunk())
      dispatch(fetchVehicleCountThunk())
      dispatch(fetchSystemStatusThunk())
      dispatch(fetchConnectionThunk())
    }, 5000)

    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    if (liveViewRealTimeData) {
      setLastRecognitionListData((prev) => [...prev, liveViewRealTimeData])
      setOriginalData((prev) => [...prev, liveViewRealTimeData])
      setUpdateLastRecognition(liveViewRealTimeData)
    }
  }, [liveViewRealTimeData])

  useEffect(() => {
    if (vehicleCountData) {
      setVehicleListData((prev) => [...prev, vehicleCountData])
    }
  }, [vehicleCountData])

  useEffect(() => {
    if (systemStatusData) {
      setSystemStatusListData((prev) => [...prev, systemStatusData])
    }
  }, [systemStatusData])

  useEffect(() => {
    if (connectionData) {
      setConnectionListData((prev) => [...prev, connectionData])
    }
  }, [connectionData])

  useEffect(() => {
    if (LPRCameraSetting === "ทั้งหมด") {
      setLastRecognitionListData(originalData)
    }
    else {
      const filterDataa = originalData.filter((item) => item.cameraName === LPRCameraSetting)
      setLastRecognitionListData(filterDataa)
    }
  }, [LPRCameraSetting])

  const sortedVehicleCountList = [...vehicleListData]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const sortedSystemStatusList = [...systemStatusListData]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const sortedConnectionList = [...connectionListData]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const sortedRecognitionData = [...lastRecognitionListData]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const handleDowloadButtonClick = async(event: React.MouseEvent, index: number) => {
    event.stopPropagation()
    try {
      const result = await dispatch(dowloadFileThunk(sortedRecognitionData[index])).unwrap()
      
      if (result) {
        if (result.startsWith('/zip/')) {
          const baseUrl = window.location.origin
          const fullUrl = `${baseUrl}${result}`
          window.open(fullUrl, '_blank')
          return
        }

        // For production API response
        const response = await fetch(result)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        
        link.href = downloadUrl
        link.download = 'download.zip'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        window.URL.revokeObjectURL(downloadUrl)
      }
    } 
    catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download file. Please try again.')
    }
  }

  const handleVehicleInfoClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation()
    setIsLoading(true)

    setTimeout(async () => {
      const data = await apiService.get("searchData", id)
      setDetailData(data)
      const compareData = await apiService.postWithIds("getCompareData", data)
      setCompareData(compareData)
      setOpenFullDirectionDialog(true)
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

  useEffect(() => {
    dispatch(fetchVehicles())
  }, [dispatch])

  return (
    <div>
      {isLoading && <Loading />}
      <div
        className={`${
          selectedMenu === ("collapse") ? "hidden" : "flex"
        } w-[510px] h-[30px] pt-[42px] transition-all duration-300`}
      >
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
                "bg-geyser group-hover:white"}`
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
                "bg-geyser group-hover:white"}`
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
                "bg-geyser group-hover:white"}`
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
                "bg-geyser group-hover:white"}`
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
          <div className="relative group ml-[1.64px]">
            <div className="absolute inset-0 bg-blue-500/20 
            transform skew-x-[20deg] origin-left rounded-r-lg" />
            <button
              type="button"
              onClick={() => handleOnButtonClick("collapse")}
              className="relative flex items-center space-x-2 pl-2 pr-4 py-1 bg-cornflower group-hover:bg-cornflower/50
              transform skew-x-[20deg] origin-left"
            >
              <div className='-skew-x-[20deg]'>
                <div className="flex">
                  <RiArrowRightSFill className="w-[25px] h-[20px]" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={selectedMenu === ("collapse") ? "hidden" : 'flex w-[510px] h-full mt-[30px]' }>
        {/* lastRecognition */}
        <div className={ selectedMenu === "lastRecognition" ? "w-full" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <label className='flex justify-start text-white'>LPR Camera</label>
              <Select
                name="select-lpr-camera-setting" 
                value={LPRCameraSetting.toString()}
                onChange={(e) => setLPRCameraSetting(e.target.value)}
                style={{ backgroundColor: "#fff", color: "#000", width: "100%", height: "30px" }}
              >
                {
                  LPRCameraDropdown && LPRCameraDropdown.length > 0 ? 
                  LPRCameraDropdown.map((item, index) => (
                    <MenuItem 
                      key={item.id} 
                      value={item.name} 
                      style={{ backgroundColor: `${index % 2 === 0 ? 'white' : 'whiteSmoke'}` }} 
                      className={`cursor-pointer`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'lightgray'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : 'whiteSmoke'
                      }}
                    >
                      { item.name }
                    </MenuItem>
                  ))
                  : null
                }
              </Select>
              <div className='h-[76.2vh] mt-[10px] overflow-y-auto text-white'>
              {
                sortedRecognitionData && sortedRecognitionData.length > 0 ?
                sortedRecognitionData.map((item, index) => (
                  <div 
                    className='grid grid-cols-2 text-[14px] w-full border-[1px] border-geyser'
                    ref={el => vehicleInfoRefs.current[index] = el}
                    onClick={(e) => handleVehicleInfoClick(e, item.id)}
                  >
                    <div className='w-full h-full text-center'>
                      <label className='ml-1'>{item.plate}</label>
                      <div className='flex h-[100px] w-full'>
                        <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                          <img 
                            key={`${index}_1`} 
                            src={item.pathImageVehicle} 
                            alt={`image-${index}`} 
                            className="w-full h-full" 
                          />
                        </div>
                        <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                          <img 
                            key={`${index}_2`} 
                            src={item.pathImage} 
                            alt={`image-${index}`} 
                            className="w-full h-[50%]" 
                          />
                        </div>
                      </div>
                    </div>
                    <div 
                      className="w-full h-full"
                    >
                      <div className='bg-celti text-center'>
                        <label className="px-1">{format(new Date(item.vehicle.date), "dd/MM/yyyy hh:mm:ss")}</label>
                        <label className="px-1 border-l-[1px] border-white">{item.vehicle.accuracy}</label>
                      </div>
                      <div className="h-[100px] relative flex flex-col p-1 pl-2">
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">ประเภท</span>
                          <span className="mx-1">:</span>
                          <span>{item.vehicle.type}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">ยี่ห้อ</span>
                          <span className="mx-1">:</span>
                          <span>{item.vehicle.brand}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">สี</span>
                          <span className="mx-1">:</span>
                          <span>{item.vehicle.color}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">รุ่น</span>
                          <span className="mx-1">:</span>
                          <span>{item.vehicle.model}</span>
                        </div>
                        <div className='absolute bottom-0 right-0'>
                          <button 
                            type='button'
                            ref={el => buttonDowloadRefs.current[index] = el}
                            onClick={(e) => handleDowloadButtonClick(e, index)}
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
          {isOpenFullDirectionDialog ? (
            <LocationDetailDialog
              data={detailData}
              compareData={compareData}
              open={isOpenFullDirectionDialog}
              close={handleFullDirectionDialogClose}
              isCompare={compare}
              closeText='ยกเลิก'
              closeButtonCss='custom-close-btn'
            />
          ) : (
            <></>
          )}
        </div>
        {/* Vehicle Count */}
        <div className={ selectedMenu === "vehicleCount" ? "" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <div className="w-full h-[82vh] overflow-y-auto relative">
                <table className="text-[14px] w-full text-white text-center">
                  {/* Table Header */}
                  <thead className="sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80">
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
                  <tbody>
                    {sortedVehicleCountList && sortedVehicleCountList.length > 0
                      ? sortedVehicleCountList.map((item) => (
                          <tr
                            key={item.id}
                            className="h-[35px] border-b-[1px] border-dashed border-darkGray"
                          >
                            <td className="bg-celtic">{item.startTime}</td>
                            <td className="bg-tuna">{item.endTime}</td>
                            <td className="bg-celtic">{item.vehicle}</td>
                            <td className="bg-tuna">{item.watchOutVehicle}</td>
                            <td className="bg-celtic">{item.summary}</td>
                          </tr>
                        ))
                      : ""}
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
              <div className="w-full h-[82vh] overflow-y-auto relative">
                <table className="text-[14px] w-full text-white">
                  {/* Table Body */}
                  <tbody>
                    {sortedSystemStatusList && sortedSystemStatusList.length > 0
                      ? sortedSystemStatusList.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`h-[35px] border-b-[1px] border-dashed border-darkGray 
                              ${ index % 2 === 0 ? 'bg-celtic' : 'bg-tuna'}`}
                          >
                            <td className='text-start pl-[5px]'>{item.time} <span>&#62</span> {item.message}</td>
                          </tr>
                        ))
                      : ""}
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
              <div className="w-full h-[82vh] overflow-y-auto relative">
                <table className="w-full text-white text-center">
                  {/* Table Header */}
                  <thead className="text-[12px] sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80 text-[12px]">
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
                            <td className="bg-celtic w-[26%]">{item.sendingTime}</td>
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
                      : ""}
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
        } pt-[41px] mb-[2px] h-[100px]`}
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