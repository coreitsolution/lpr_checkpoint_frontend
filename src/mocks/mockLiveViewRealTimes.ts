import { LastRecognitionData, VehicleCountResult, SystemStatusResult, ConnectionResult } from "../features/live-view-real-time/liveViewRealTimeTypes"

export const lastRecognitionData: LastRecognitionData[] = 
[{
  "id": 1,
  "agent_uid": "Testss",
  "agent_version": "4.1.10",
  "agent_type": "Tests",
  "app_version": "3",
  "data_type": "Tests",
  "company_id": "demo",
  "camera_id": 10000102,
  "site_id": 0,
  "site_name": "",
  "gps_latitude": null,
  "gps_longitude": null,
  "epoch_start": "2024-11-14T15:44:41.000Z",
  "epoch_end": "2024-11-14T15:44:42.000Z",
  "frame_start": 0,
  "frame_end": 16,
  "plate": "9กฐ1234",
  "plate_confidence": "94.24",
  "country": "th",
  "region": "th-10",
  "region_confidence": "99.00",
  "vehicle_body_type": "motorcycle",
  "vehicle_body_type_confidence": "98.96",
  "vehicle_make": "honda",
  "vehicle_make_confidence": "0.00",
  "vehicle_make_model": "honda_accordttttttttttttttt",
  "vehicle_make_model_confidence": "0.00",
  "vehicle_color": "black",
  "vehicle_color_confidence": "0.00",
  "vehicle_make_year": "2010-2014",
  "vehicle_make_year_confidence": "0.00",
  "orientation": "135",
  "orientation_confidence": "93.89",
  "travel_direction": 68,
  "source_image_width": 1920,
  "source_image_height": 1080,
  "overview_image": "/example.jpg",
  "overview_image_width": 560,
  "overview_image_height": 315,
  "vehicle_image": "/example.jpg",
  "vehicle_region_x": 695,
  "vehicle_region_y": 363,
  "vehicle_region_width": 324,
  "vehicle_region_height": 338,
  "plate_image": "/example.jpg",
  "plate_x1": 731,
  "plate_x2": 826,
  "plate_x3": 814,
  "plate_x4": 718,
  "plate_y1": 548,
  "plate_y2": 554,
  "plate_y3": 622,
  "plate_y4": 615,
  "is_parked": "0",
  "lane": "",
  "processing_time_ms": "11.65",
  "sync_date_time_ms": "0.00",
  "sync_state": "",
  "sync_date": "2024-11-14T15:44:47.000Z",
  "user_data": "Test"
}]

export const vehicleCountData: VehicleCountResult = 
{ 
  id: 0, 
  startTime: "28/06/2024 (07:00)", 
  endTime: "28/06/2024 (08:00)", 
  vehicle: 0,
  watchOutVehicle: 0,
  summary: 0,
}

export const vehicleCountListFullData: VehicleCountResult[] = Array.from(
  {length: 10}, 
  (_, index) => ({ 
    id: index + 1, 
    startTime: "28/06/2024 (07:00)", 
    endTime: "28/06/2024 (08:00)", 
    vehicle: 0,
    watchOutVehicle: index,
    summary: index,
  }
))

export const systemStatusData: SystemStatusResult = 
{ 
  id: 1, 
  time: "07:20:28", 
  message: "cdsFeedData: Field’facelist_id_alert’ not found", 
}

export const systemStatusListFullData: SystemStatusResult[] = Array.from(
  {length: 10}, 
  (_, index) => ({ 
    id: index + 1, 
    time: "07:20:28", 
    message: "cdsFeedData: Field’facelist_id_alert’ not found", 
  }
))

export const connectionData: ConnectionResult = 
{ 
  id: 0, 
  sendingTime: "28/06/2024 (18:30:00)", 
  ipServer: "190.168.0.199", 
  port: 20,
  host: 199,
  sendCompleted: 12500,
  pending: 4500,
  status: 1
}

export const connectionListFullData: ConnectionResult[] = Array.from(
  {length: 10}, 
  (_, index) => ({ 
    id: index + 1,
    sendingTime: "28/06/2024 (18:30:00)", 
    ipServer: "190.168.0.199", 
    port: 20,
    host: 199,
    sendCompleted: 12500,
    pending: 4500,
    status: index % 2 === 0 ? index === 5 ? 3 : 1 : 2
  }
))