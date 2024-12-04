import React, { useEffect, useState, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
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

// Types
import {
  SearchResult,
} from "../../features/api/types"
import { fetchVehicles } from "../../features/search/searchSlice"

// Services
import { apiService } from '../../features/api/apiService'
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"

// Component
import Loading from "../../components/loading/Loading"

interface CCTVSideBarProp {
  setCollapse: (status: boolean) => void
}

const CCTVSideBar: React.FC<CCTVSideBarProp> = ({setCollapse}) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>('lastRecognition')
  const [LPRCameraSetting, setLPRCameraSetting] = useState(0)
  const buttonDowloadRefs = useRef<(HTMLButtonElement | null)[]>([])
  const vehicleInfoRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isOpenFullDirectionDialog, setOpenFullDirectionDialog] = useState(false)
  const [detailData, setDetailData] = useState<SearchResult>()
  const [compareData, setCompareData] = useState<SearchResult[]>([])
  const [compare, setIsCompare] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch: AppDispatch = useDispatch()
  const { vehicles, status, error } = useSelector(
    (state: RootState) => state.vehicles
  )

  const tabIcon = {
    LastRecognitionIcon: "/icons/planing",
    VehicleCountIcon: "/icons/checklist",
    SystemStatusIcon: "/icons/system-status",
    ConnectionIcon: "/icons/connection",
  }
  // Mock Data
  const [LPRCameraDropdown, setLPRCameraDropdown] = useState([
    { id: 0, value: 0, name: 'ทั้งหมด' },
    { id: 1, value: 1, name: 'LPR Camera 1' },
    { id: 2, value: 2, name: 'LPR Camera 2' },
    { id: 3, value: 3, name: 'LPR Camera 3' },
    { id: 4, value: 4, name: 'LPR Camera 4' },
  ])

  // Mock Data
  const [vehicleCountList, setVehicleCountList] = useState([
    { 
      id: 0, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 1, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 2, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 3, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 4, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 5, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 6, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 7, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 8, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 9, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 10, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 11, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 12, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 13, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 14, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 15, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 16, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 17, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 18, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 19, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 20, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 21, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 22, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 23, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 24, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 25, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 26, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 27, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 28, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 29, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 30, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 31, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 32, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 33, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 34, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 35, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 36, 
      startTime: "28/06/2024 (07:00)", 
      endTime: "28/06/2024 (08:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
    { 
      id: 37, 
      startTime: "28/06/2024 (06:00)", 
      endTime: "28/06/2024 (07:00)", 
      vehicle: 0,
      watchOutVehicle: 0,
      summary: 0,
    },
  ])

  // Mock Data
  const [systemStatusList, setSystemStatusList] = useState([
    { 
      id: 1, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 2, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 3, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 4, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 5, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 6, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 7, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 8, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 9, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 10, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 11, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 12, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 13, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 14, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 15, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 16, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 17, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 18, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 19, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 20, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 21, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 22, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 23, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 24, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 25, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 26, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 27, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 28, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 29, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
    { 
      id: 30, 
      time: "07:20:28", 
      message: "cdsFeedData: Field’facelist_id_alert’ not found", 
    },
  ])

  // Mock Data
  const [connectionList, setConnectionList] = useState([
    { 
      id: 0, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 1
    },
    { 
      id: 1, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 2
    },
    { 
      id: 2, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 3
    },
    { 
      id: 3, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 4
    },
    { 
      id: 4, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 1
    },
    { 
      id: 5, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 2
    },
    { 
      id: 6, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 3
    },
    { 
      id: 7, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 4
    },
    { 
      id: 8, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 1
    },
    { 
      id: 9, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 2
    },
    { 
      id: 10, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 3
    },
    { 
      id: 11, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 4
    },
    { 
      id: 12, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 1
    },
    { 
      id: 13, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 2
    },
    { 
      id: 14, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 3
    },
    { 
      id: 15, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 4
    },
    { 
      id: 16, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 1
    },
    { 
      id: 17, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 2
    },
    { 
      id: 18, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 3
    },
    { 
      id: 19, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 4
    },
    { 
      id: 20, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 1
    },
    { 
      id: 21, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 2
    },
    { 
      id: 22, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 3
    },
    { 
      id: 23, 
      sendingTime: "28/06/2024 (18:30:00)", 
      ipServer: "190.168.0.199", 
      port: 20,
      host: 199,
      sendCompleted: 12500,
      pending: 4500,
      status: 4
    },
  ])

  const sortedVehicleCountList = [...vehicleCountList]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const sortedSystemStatusList = [...systemStatusList]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const sortedConnectionList = [...connectionList]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const sortedRecognitionData = [...vehicles]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

  const handleDowloadButtonClick = (event: React.MouseEvent, index: number) => {
    event.stopPropagation()
    alert(`Download Clicked ${index}`)
  }

  const handleVehicleInfoClick = async (event: React.MouseEvent, index: number, id: number) => {
    event.stopPropagation()
    setIsLoading(true)

    setTimeout(async () => {
      const data = await apiService.get("searchData", id)
      setDetailData(data)
      const compareData = await apiService.postWithIds("getCompareData", data)
      setCompareData(compareData)
      setOpenFullDirectionDialog(true)
      setIsLoading(false)
    }, 500);
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
        <div className={ selectedMenu === "lastRecognition" ? "" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <label className='flex justify-start text-white'>LPR Camera</label>
              <Select 
                name="select-lpr-camera-setting" 
                value={LPRCameraSetting.toString()}
                onValueChange={(value) => setLPRCameraSetting(Number(value))}
              >
                <SelectTrigger className="w-full h-[35px] text-black my-[20px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {
                    LPRCameraDropdown && LPRCameraDropdown.length > 0 ? 
                    LPRCameraDropdown.map((item, index) => (
                      <SelectItem key={item.id} value={item.value.toString()} className={ index % 2 === 0 ? 'bg-white' : 'bg-whiteSmoke'}>{ item.name }</SelectItem>
                    ))
                    : null
                  }
                </SelectContent>
              </Select>
              <div className='h-[71.2vh] overflow-y-scroll text-white'>
              {
                sortedRecognitionData && sortedRecognitionData.length > 0 ?
                sortedRecognitionData.map((item, index) => (
                  <div 
                    className='grid grid-cols-2 text-[14px] w-full border-[1px] border-geyser'
                    ref={el => vehicleInfoRefs.current[index] = el}
                    onClick={(e) => handleVehicleInfoClick(e, index, item.id)}
                  >
                    <div className='w-full h-full text-center'>
                      <label className='ml-1'>{item.plate}</label>
                      <div className='grid grid-cols-2 h-[100px] w-full'>
                        <img key={index + "_1"} src={item.pathImage} alt={`image-${index}`} className="inline-flex items-center justify-center align-middle w-full h-full" />
                        <img key={index + "_2"} src={item.pathImage} alt={`image-${index}`} className="inline-flex items-center justify-center align-middle w-full h-full" />
                      </div>
                    </div>
                    <div 
                      className="w-full h-full"
                    >
                      <div className='bg-celti text-center'>
                        <label className="px-1">{format(item.vehicle.date, "dd/MM/yyyy hh:mm:ss")}</label>
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
                            <td className='text-start pl-[5px]'>{item.time} <span>&#62;</span> {item.message}</td>
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