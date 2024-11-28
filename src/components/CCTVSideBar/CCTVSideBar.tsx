import React, { useState } from 'react'
import LastRecognitionIcon from "../../assets/icon/planing.png"
import LastRecognitionBIcon from "../../assets/icon/planing-b.png"
import VehicleCountIcon from "../../assets/icon/checklist.png"
import VehicleCountWIcon from "../../assets/icon/checklist-w.png"
import SystemStatusIcon from "../../assets/icon/system-status.png"
import ConnectionIcon from "../../assets/icon/connection.png"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import Car1 from "../../assets/img/cctv3.png"
import Car2 from "../../assets/img/cctv4.png"
import { ReactComponent as DowloadIcon } from "../../assets/svg/download-icon.svg"
import { ReactComponent as RightArrowIcon } from "../../assets/svg/right-arrow-icon.svg"

const CCTVSideBar = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>('lastRecognition')
  const [LPRCameraSetting, setLPRCameraSetting] = useState(0)
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

  // Mock Data
  const [lastRecognitionData, setLastRecognitionData] = useState([
    { 
      id: 0, 
      name: '2ฒผ 3654  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car2
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 1, 
      name: '66-4578  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car1
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 2, 
      name: '2ฒผ 3654  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car2
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 3, 
      name: '66-4578  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car1
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 4, 
      name: '2ฒผ 3654  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car2
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 5, 
      name: '66-4578  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car1
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 6, 
      name: '2ฒผ 3654  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car2
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 7, 
      name: '66-4578  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car1
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 8, 
      name: '2ฒผ 3654  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car2
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 9, 
      name: '66-4578  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car1
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 10, 
      name: '2ฒผ 3654  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car2
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 11, 
      name: '66-4578  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car1
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 12, 
      name: '2ฒผ 3654  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car2
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
    },
    { 
      id: 13, 
      name: '66-4578  กรุงเทพมหานคร', 
      dateTime: "2024-06-28  20:12:04", 
      matchPercent: 98,
      img: [
        Car1,
        Car1
      ],
      carInfo: {
        carType: "รถยนต์",
        carBrand: "TOYOTA",
        carColor: "ขาว",
        carModel: "Hilux_Revo",
      }
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

  const sortedRecognitionData = [...lastRecognitionData]
  .sort((a, b) => b.id - a.id)
  .slice(0, 20)

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

  return (
    <div>
      <div
        className={`${
          selectedMenu === ("collapse") ? "hidden" : "flex"
        } w-[510px] h-[30px] mt-[22px] mb-[2px] transition-all duration-300`}
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
                    src={ selectedMenu === "lastRecognition" ? LastRecognitionIcon : LastRecognitionBIcon } 
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
                    src={ selectedMenu === "vehicleCount" ? VehicleCountWIcon : VehicleCountIcon }
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
                  <img src={SystemStatusIcon} alt="System Status" className='w-[20px] h-[20px]' />
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
                  <img src={ConnectionIcon} alt="Connection" className='w-[20px] h-[20px]' />
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
                  <RightArrowIcon className='w-[20px] h-[20px]' />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={selectedMenu === ("collapse") ? "hidden" : 'flex w-[510px] h-full' }>
        {/* lastRecognition */}
        <div className={ selectedMenu === "lastRecognition" ? "" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <label className='flex justify-start'>LPR Camera</label>
              <Select 
                name="select-lpr-camera-setting" 
                value={LPRCameraSetting.toString()}
                onValueChange={(value) => setLPRCameraSetting(Number(value))}
              >
                <SelectTrigger className="w-full h-[35px] text-black my-[20px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {
                    LPRCameraDropdown && LPRCameraDropdown.length > 0 ? 
                    LPRCameraDropdown.map((item, index) => (
                      <SelectItem key={item.id} value={item.value.toString()} className={ index % 2 === 0 ? 'bg-white' : 'bg-whiteSmoke'}>{ item.name }</SelectItem>
                    ))
                    : null
                  }
                </SelectContent>
              </Select>
              <div className='h-[71.2vh] overflow-y-scroll'>
              {
                sortedRecognitionData && sortedRecognitionData.length > 0 ?
                sortedRecognitionData.map((item) => (
                  <div className='grid grid-cols-2 text-[14px] w-full border-[1px] border-geyser'>
                    <div className='w-full h-full'>
                      <label>{item.name}</label>
                      <div className='grid grid-cols-2 h-[100px] w-full'>
                        {
                          item.img.map((image, index) => (
                            <img key={index} src={image} alt={`image-${index}`} className="inline-flex items-center justify-center align-middle w-full h-full" />
                          ))
                        }
                      </div>
                    </div>
                    <div className="w-full h-full">
                      <div className='bg-celti'>
                        <label className="px-1">{item.dateTime}</label>
                        <label className="px-1 border-l-[1px] border-white">{`${item.matchPercent}%`}</label>
                      </div>
                      <div className="h-[100px] relative flex flex-col p-1 pl-2">
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">ประเภท</span>
                          <span className="mx-1">:</span>
                          <span>{item.carInfo.carType}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">ยี่ห้อ</span>
                          <span className="mx-1">:</span>
                          <span>{item.carInfo.carBrand}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">สี</span>
                          <span className="mx-1">:</span>
                          <span>{item.carInfo.carColor}</span>
                        </div>
                        <div className="flex mb-[2px]">
                          <span className="w-[55px] text-left">รุ่น</span>
                          <span className="mx-1">:</span>
                          <span>{item.carInfo.carModel}</span>
                        </div>
                        <div className='absolute bottom-0 right-0'>
                          <button type='button'>
                            <DowloadIcon className='w-[25px] h-[25px]' style={{ color: 'dodgerBlue' }} />
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
        </div>
        {/* Vehicle Count */}
        <div className={ selectedMenu === "vehicleCount" ? "" : "hidden"}>
          {/* Content */}
          <div className='flex p-[12px] border-[1px] border-dodgerBlue'>
            <div className='flex flex-col w-full h-full'>
              <div className="w-full h-[82vh] overflow-y-auto relative">
                <table className="text-[14px] w-full">
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
                <table className="text-[14px] w-full">
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
                <table className="w-full">
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
        } absolute right-0 top-2 h-[60px]`}
      >
        <button
          type="button"
          onClick={() => setSelectedMenu("lastRecognition")}
          className="bg-gradient-to-r from-cornflower to-bahamaBlue group-hover:bg-white rounded-l-lg"
        >
          <div>
            <div className="flex">
              <RightArrowIcon className="w-[25px] h-[20px]" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default CCTVSideBar