import { Officer } from "../api/types"

export interface CameraSettings {
  id: number
  camera_status: string
  checkpoint_id: string
  checkpoint: string
  latitude: string
  longitude: string
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
  officer: Officer
  created_at: Date
  updated_at: Date
}