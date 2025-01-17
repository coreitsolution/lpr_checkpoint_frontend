import { VehicleBodyTypeDetail, VehicleColorDetail, VehicleMakesDetail, VehicleModelsDetail } from "../dropdown/dropdownTypes"
import { MapPosition, DirectionDetail } from "../api/types"
export interface LastRecognitionResult {
  message?: string
  status?: string
  success?: string
  data?: LastRecognitionData[]
}

export interface RegionInfo {
  id: number
  name_th: string
}

export interface LastRecognitionData {
  id: number
  camera_info: CameraInfo
  epoch_start: string
  camera_id: number
  plate: string
  plate_confidence: string
  gps_latitude: number
  gps_longitude: number
  is_special_plate: boolean
  plate_image: string
  region_info: RegionInfo
  vehicle_body_type: string
  vehicle_body_type_info: VehicleBodyTypeDetail
  vehicle_color: string
  vehicle_color_info: VehicleColorDetail
  vehicle_image: string
  vehicle_make: string
  vehicle_make_info: VehicleMakesDetail
  vehicle_make_model: string
  vehicle_model_info: VehicleModelsDetail
  special_plate_id: number
  special_plate: LprSpecialPlateDetail | null
  map?: MapPosition[]
  directionDetail?: DirectionDetail[]
}

export interface CameraInfo {
  id: number
  cam_id: string
}

export interface LprSpecialPlateDetail {
  id: number
  plate_class: PlateClass
  behavior: string
  case_owner_name: string
  case_owner_agency: string
}

export interface PlateClass {
  id: number
  title_en: string
}

export interface VehicleCountResult {
  message?: string
  status?: string
  success?: string
  data?: VehicleCountData[]
}

export interface VehicleCountData {
  start_time: string
  end_time: string
  lpr_count: number
  special_plates_count: number
  total_count: number
}

export interface ConnectionResult {
  id: number
  sendingTime: string
  ipServer: string
  port: number
  host: number
  sendCompleted: number
  pending: number
  status: number
}

export interface SystemStatusResult {
  message?: string
  status?: string
  success?: string
  data?: SystemStatusData[]
}

export interface SystemStatusData {
  id: number
  category: string
  title: string
  details: string
  createdAt: string
  updatedAt: string
}

export interface ZipDowload {
  message?: string
  status?: string
  success?: string
  data?: ZipDowloadDetail
}

export interface ZipDowloadDetail {
  zipUrl: string
}