import { Officer } from "../api/types"
import { CustomShape } from "../../components/drawing-canvas/types"

export interface CameraDetailSetting {
  id: number
  screen: number
  cameraSettings: CameraSettings[]
}

export interface CameraSettings {
  id: number
  camera_status: number
  checkpoint_id: string
  checkpoint: string
  latitude: string
  longtitude: string
  number_of_detections: number
  police_division: string
  province: string
  district: string
  sub_district: string
  route: string
  rtsp_live_view: string
  rtsp_process: string
  stream_encode: string
  api_server: string
  pc_serial_number: string
  license: string
  api_server_status: number
  sync_data_status: number
  license_status: number
  sensor_setting?: CustomShape | null
  officer: Officer
  created_at?: string
  updated_at: string
}

export type NewCameraSettings = Omit<CameraSettings, 'id'>

export interface CreateCameraSettings {
  camera_status: number
  checkpoint_id: string
  checkpoint: string
  latitude: string
  longtitude: string
  number_of_detections: number
  police_division: string
  province: string
  district: string
  sub_district: string
  route: string
  rtsp_live_view: string
  rtsp_process: string
  stream_encode: string
  api_server: string
  pc_serial_number: string
  license: string
  api_server_status: number
  sync_data_status: number
  license_status: number
  sensor_setting?: CustomShape | null
  officer: Officer
  created_at: string
  updated_at: string
}