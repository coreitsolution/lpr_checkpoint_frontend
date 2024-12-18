import { BenefitInformation, DirectionDetail, MapPosition, OwnerInformation, VehicleViewModel } from "../api/types"
export interface LastRecognitionResult {
  data?: LastRecognitionData[]
}

export interface LastRecognitionData {
  id: number;
  registration_type?: string;
  agent_type: string;
  agent_uid: string;
  agent_version: string;
  app_version: string;
  camera_id: number;
  company_id: string;
  country: string;
  data_type: string;
  epoch_end: string;
  epoch_start: string;
  frame_end: number;
  frame_start: number;
  gps_latitude: number | null;
  gps_longitude: number | null;
  is_parked: string;
  lane: string;
  orientation: string;
  orientation_confidence: string;
  overview_image: string;
  overview_image_height: number;
  overview_image_width: number;
  plate: string;
  plate_confidence: string;
  plate_image: string;
  plate_x1: number;
  plate_x2: number;
  plate_x3: number;
  plate_x4: number;
  plate_y1: number;
  plate_y2: number;
  plate_y3: number;
  plate_y4: number;
  processing_time_ms: string;
  region: string;
  region_confidence: string;
  site_id: number;
  site_name: string;
  source_image_height: number;
  source_image_width: number;
  sync_date: string;
  sync_date_time_ms: string;
  sync_state: string;
  travel_direction: number;
  user_data: string;
  vehicle_body_type: string;
  vehicle_body_type_confidence: string;
  vehicle_color: string;
  vehicle_color_confidence: string;
  vehicle_image: string;
  vehicle_make: string;
  vehicle_make_confidence: string;
  vehicle_make_model: string;
  vehicle_make_model_confidence: string;
  vehicle_make_year: string;
  vehicle_make_year_confidence: string;
  vehicle_region_height: number;
  vehicle_region_width: number;
  vehicle_region_x: number;
  vehicle_region_y: number;
}

export interface VehicleCountResult {
  id: number
  startTime: string
  endTime: string
  vehicle: number
  watchOutVehicle: number
  summary: number
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
  id: number
  time: string
  message: string
}