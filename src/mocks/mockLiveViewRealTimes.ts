import { LastRecognitionResult, VehicleCountResult, SystemStatusResult, ConnectionResult } from "../features/live-view-real-time/liveViewRealTimeTypes"

export const lastRecognitionData: LastRecognitionResult = 
{
  id: 1,
  registration_type: "Black List",
  cameraName: "CAM-102",
  plate: "3กฎ 1233 กรุงเทพมหานคร",
  location: "Bangkok",
  pathImageVehicle: "/images/real-time-mock-image/car1.png",
  pathImage: "/images/real-time-mock-image/car1-plate.png",
  directionString: "Bangkok -> Nakhon Pathom",
  directionDetail: [
    { color: "red", direction: "North", dateTime: "2024-11-01 08:00:00" },
    { color: "blue", direction: "West", dateTime: "2024-11-01 09:30:00" },
  ],
  periodTime: "2024-11-01 08:00:00 to 2024-11-01 10:00:00",
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
  vehicle: {
    id: 1,
    plate: "ABC-1234",
    location: "Tokyo, Japan",
    type: "Sedan",
    brand: "Toyota",
    color: "White",
    model: "Camry",
    date: "2024-06-28",
    time: "20:12:04",
    accuracy: "98%",
    imgCar: "/images/real-time-mock-image/car1.png",
    imgPlate: "/images/real-time-mock-image/car1-plate.png",
  },
  brand: "Toyota",
    color: "White",
    model: "Camry",
  ownerPerson: {
    name: "John Doe",
    nationNumber: 1234567890123,
    address: "123 Main Street, Bangkok, Thailand",
  },
  agency: {
    id: 1,
    agency: 'หน่วยงานที่ 1',
    phone: '0123456789',
    address: '123 Street',
    latitude: '13.7563',
    longitude: '100.5018',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  benefitPerson: {
    name: "Jane Doe",
    nationNumber: 9876543210987,
    address: "456 Elm Street, Bangkok, Thailand",
  },
}

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