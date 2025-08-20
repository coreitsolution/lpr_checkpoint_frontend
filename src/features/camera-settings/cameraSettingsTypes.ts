import { Officer } from "../api/types"
import { CustomShape } from "../../components/drawing-canvas/types"
import { StreamEncodesDetail } from "../dropdown/dropdownTypes"
import { Pagination } from "../../features/api/types"

export interface CameraSettings {
  message?: string
  status?: string
  success?: boolean
  pagination: Pagination
  data: CameraDetailSettings[]
}

export interface ReqStream {
  name: string
  streamUrl: string
  port: string
}

export interface StreamDetail {
  uid: string
  name: string
  streamUrl: string
  wsPort: string
  ffmpegOptions: FfmpegOptions
}

export interface FfmpegOptions {
  "-stats": string
  "-r": number
  "-vf": string
  "-preset": string
  "-tune": string
  "-reconnect": string
  "-reconnect_streamed": string
  "-reconnect_delay_max": string
}

export interface CameraScreenSettingDetail {
  id: number
  key: string
  name: string
  value: string
  description: string
  created_at: string
  updated_at: string
}

export interface CameraScreenSetting {
  message?: string
  status?: string
  success?: string
  data?: CameraScreenSettingDetail[]
}

export interface CameraDetailSettings {
  id: number
  cam_id: string
  cam_uid: string
  checkpoint_uid: number,
  checkpoint_name: string
  alpr_cam_id: number
  organization: string
  province_id: number
  district_id: number
  sub_district_id : number
  detecion_count: number
  sample_image_url?:string
  route: string
  latitude: string
  longitude: string
  rtsp_live_url: string
  rtsp_process_url: string
  stream_encode_id: number
  stream_encode: StreamEncodesDetail
  api_server_url: string
  live_server_url: string
  live_stream_url: string
  wsport: number
  pc_serial_number: string
  license_key: string
  officer_title_id: number
  officer_firstname: string
  officer_lastname: string
  officer_position_id: number
  officer_phone: string
  detection_area: string
  streaming: boolean
  visible: number
  active: number
  deleted: number
  alive: number
  last_online: string | null
  last_check: string | null
  createdAt: string
  updatedAt: string
}

export interface CameraSettingsDataResponse {
  message?: string
  status?: string
  success?: boolean
  pagination: Pagination
  data: CameraSettingsData[]
}

export interface CameraSettingsData {
  id: number
  checkpoint_uid: number,
  cam_id: string
  rtsp_live_url: string
  rtsp_process_url: string
  stream_encode_id: number
  api_server_url: string
  latitude: number;
  longitude: number;
  province_id: number
  district_id: number
  sub_district_id : number
  route: string
  visible: number
  active: number
  createdAt: string
  updatedAt: string
}

export interface NewCameraDetailSettings {
  cam_id: string
  rtsp_live_url: string
  rtsp_process_url: string
  stream_encode_id: number
  api_server_url: string
  latitude: number;
  longitude: number;
  province_id: number;
  district_id: number;
  sub_district_id : number;
  route: string;
  visible: number
  active: number
}

export interface CreateCameraSettings {
  camera_status: number
  checkpoint_uid: string
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

export interface StartStopStream {
  cam_uid: string
}