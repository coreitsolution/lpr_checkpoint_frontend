import { LastRecognitionData, VehicleCountData, SystemStatusData, ConnectionResult } from "../features/live-view-real-time/liveViewRealTimeTypes"

export const lastRecognitionData: LastRecognitionData[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  camera_info: {
    id: 1,
    cam_id: "cam-106",
  },
  epoch_start: "2024-11-14T15:44:41.000Z",
  camera_id: 10000001,
  plate: "9กฐ22222",
  plate_confidence: "94.24",
  gps_latitude: 18.55,
  gps_longitude: 10.44,
  is_special_plate: i % 2 === 0,
  plate_image: "/lpr_images/2024-12-06/plate_images/20241206-135555.8IhJ9lKGAUWbggPO_plate.jpg",
  region_info: {
    id: 1,
    name_th: "กรุงเทพ",
  },
  vehicle_body_type: "motorcycle",
  vehicle_body_type_info: {
    id: 5,
    body_type: "motorcycle",
    body_type_th: "รถจักรยานยนต์ส่วนบุคคล",
  },
  vehicle_color: "white",
  vehicle_color_info: {
    id: 11,
    color: "white",
    color_th: "ขาว",
  },
  vehicle_image: "/lpr_images/2024-12-06/vehicle_images/20241206-135555.8IhJ9lKGAUWbggPO_vehicle.jpg",
  vehicle_make: "honda",
  vehicle_make_info: {
    id: 56,
    make: "honda",
    make_en: "Honda",
  },
  vehicle_make_model: "bmw_3-series",
  vehicle_model_info: {
    id: 82,
    make: "bmw",
    model: "bmw_3-series",
    model_en: "BMW 3 Series",
  },
  special_plate_id: 11,
  special_plate: {
    id: 11,
    plate_group: "1กศ",
    plate_number: "1270",
    province_id: 20,
    plate_class_id: 3,
    case_number: "5555555",
    arrest_warrant_date: "2024-12-20",
    arrest_warrant_expire_date: "2025-12-31",
    behavior: "-",
    case_owner_name: "นาย สมมุต",
    case_owner_agency: "หน่วยงานที่ 1",
    case_owner_phone: "081-111-1111",
    visible: 1,
    active: 1,
    deleted: true,
    deleted_by_id: 0,
    createdAt: "2024-12-20T04:34:16.000Z",
    updatedAt: "2025-01-08T09:46:17.000Z",
    deletedAt: "2025-01-08T09:46:17.000Z",
    plate_class_info: {
      id: 3,
      title_en: "Blacklist",
      title_th: "บุคคลเฝ้าระวัง",
      visible: 1,
      active: 1,
    },
  },
  map: [
    { lat: 13.7211, lng: 100.5287 }, // Sathorn
    { lat: 13.726, lng: 100.535 }, // Lumpini Park
    { lat: 13.7377, lng: 100.5521 }, // Asok Intersection
    { lat: 13.7448, lng: 100.5665 }, // Thonglor
    { lat: 13.7489, lng: 100.5778 }, // Ekkamai
    { lat: 13.7425, lng: 100.6013 }, // Phra Khanong
    { lat: 13.7279, lng: 100.6116 }, // On Nut
    { lat: 13.7212, lng: 100.6303 }, // Bang Na
    { lat: 13.7026, lng: 100.6455 }, // Srinagarindra
    { lat: 13.6924, lng: 100.6803 }, // King Rama IX Park
    { lat: 13.677, lng: 100.6931 }, // Near Seacon Square
    { lat: 13.6687, lng: 100.7285 }, // Lat Krabang Road
    { lat: 13.7246, lng: 100.7809 }, // Near Suvarnabhumi Airport (Lat Krabang Area)
  ],
  directionDetail: [
    { direction: "NSB 4_ขก_บ้านไผ่_ออก", dateTime: "10/10/2567 (12:00:00)" },
    { direction: "NSB 3_บัวลายหนองแวง_ออก", dateTime: "10/10/2567 (12:00:00)" },
    { direction: "NSB 3_โคกกรวด_ออก_1", dateTime: "10/10/2567 (12:00:00)" },
    { direction: "NSB 2_ฉช_สภแสนภูดาษ_เข้า", dateTime: "10/10/2567 (12:00:00)" },
  ]
}));


export const vehicleCountData: VehicleCountData = 
{ 
  start_time: "28/06/2024 (07:00)", 
  end_time: "28/06/2024 (08:00)", 
  lpr_count: 0,
  special_plates_count: 0,
  total_count: 0,
}

export const vehicleCountListFullData: VehicleCountData[] = Array.from(
  {length: 30}, 
  (_, index) => ({ 
    id: index + 1, 
    start_time: "28/06/2024 (07:00)", 
    end_time: "28/06/2024 (08:00)", 
    lpr_count: 0,
    special_plates_count: index,
    total_count: index,
  }
))

export const systemStatusData: SystemStatusData = 
{ 
  "id": 1,
  "category": "event",
  "title": "Plate detected",
  "details": "New plate found: ชอ368 กรุงเทพมหานคร 99.00%",
  "createdAt": "2024-12-23T14:36:57.000Z",
  "updatedAt": "2024-12-23T14:36:57.000Z"
}

export const systemStatusListFullData: SystemStatusData[] = Array.from(
  {length: 10}, 
  (_, index) => ({ 
    "id": index + 1,
    "category": "event",
    "title": "Plate detected",
    "details": "New plate found: ชอ368 กรุงเทพมหานคร 99.00%",
    "createdAt": "2024-12-23T14:36:57.000Z",
    "updatedAt": "2024-12-23T14:36:57.000Z" 
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