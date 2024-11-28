import {
  CheckPointViewModel,
  VehicleViewModel,
  CheckPointVehicleViewModel,
  AreaViewModel,
  ProvinceViewModel,
  StationViewModel,
  SearchResult,
} from "../features/api/types";

export const checkPointData: CheckPointViewModel[] = [
  { id: 1, name: "ด่านตรวจพยุหะคีรี", lat: 15.6255, lon: 100.1261 },
  { id: 2, name: "ด่านตรวจมวกเหล็ก", lat: 14.7026, lon: 101.2109 },
  { id: 3, name: "ด่านตรวจอรัญประเทศ", lat: 13.6926, lon: 102.5064 },
  { id: 4, name: "ด่านตรวจเขาเขียว", lat: 13.2848, lon: 101.0712 },
  { id: 5, name: "ด่านตรวจคลองลึก", lat: 13.8317, lon: 102.0814 },
  { id: 6, name: "ด่านตรวจเขาใหญ่", lat: 14.4329, lon: 101.3728 },
  { id: 7, name: "ด่านตรวจพยุหะ", lat: 15.6068, lon: 100.1377 },
  { id: 8, name: "ด่านตรวจห้วยยอด", lat: 7.8197, lon: 99.6484 },
  { id: 9, name: "ด่านตรวจอุตรดิตถ์", lat: 17.6202, lon: 100.0944 },
  { id: 10, name: "ด่านตรวจแม่สาย", lat: 20.4338, lon: 99.8824 },
];

export const checkPointCarsData: CheckPointVehicleViewModel[] = Array.from(
  { length: 20 },
  (_, i) => ({
    carId: i + 1,
    checkpointId: (i % 5) + 1,
    carDetail: {
      id: i + 1,
      plate: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(
        Math.random() * 9999
      )}`,
      location: "กรุงเทพมหานคร",
      type: i % 3 === 0 ? "รถบรรทุก" : i % 3 === 1 ? "รถยนต์" : "รถตู้",
      brand: i % 2 === 0 ? "TOYOTA" : "NISSAN",
      color: i % 2 === 0 ? "ขาว" : "บรอนซ์",
      model: i % 2 === 0 ? "Hilux_Revo" : "D-Max",
      date: "2024-06-28",
      time: `20:${Math.floor(Math.random() * 59)
        .toString()
        .padStart(2, "0")}:${Math.floor(Math.random() * 59)
        .toString()
        .padStart(2, "0")}`,
      accuracy: `${90 + Math.floor(Math.random() * 10)}%`,
      imgCar: `/images/real-time-mock-image/car${(i % 5) + 1}-plate.png`,
      imgPlate: `/images/real-time-mock-image/car${(i % 5) + 1}.png`,
      isBackList: i % 4 === 0,
    },
  })
);

export const checkPointCarsData2: CheckPointVehicleViewModel[] = Array.from(
  { length: 20 },
  (_, i) => ({
    carId: i + 1,
    checkpointId: (i % 5) + 1,
    carDetail: {
      id: i + 1,
      plate: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(
        Math.random() * 9999
      )}`,
      location: "กรุงเทพมหานคร",
      type: i % 3 === 0 ? "รถบรรทุก" : i % 3 === 1 ? "รถยนต์" : "รถตู้",
      brand: i % 2 === 0 ? "TOYOTA" : "NISSAN",
      color: i % 2 === 0 ? "น้ำเงิน" : "บรอนซ์",
      model: i % 2 === 0 ? "Corolla" : "Hilux_Revo",
      date: "2024-06-28",
      time: `20:${Math.floor(Math.random() * 59)
        .toString()
        .padStart(2, "0")}:${Math.floor(Math.random() * 59)
        .toString()
        .padStart(2, "0")}`,
      accuracy: `${95 + Math.floor(Math.random() * 5)}%`,
      imgCar: `/images/real-time-mock-image/car${(i % 5) + 1}-plate.png`,
      imgPlate: `/images/real-time-mock-image/car${(i % 5) + 1}.png`,
      isBackList: i % 3 === 0,
    },
  })
);

export const carData: VehicleViewModel[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: i + 1,
    plate: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(
      Math.random() * 9999
    )}`,
    location: "กรุงเทพมหานคร",
    type: i % 3 === 0 ? "รถบรรทุก" : i % 3 === 1 ? "รถยนต์" : "รถตู้",
    brand: i % 2 === 0 ? "TOYOTA" : "ISUZU",
    color: i % 2 === 0 ? "ขาว" : "บรอนซ์",
    model: i % 2 === 0 ? "Hilux_Revo" : "Corolla",
    date: "2024-06-28",
    time: `20:${Math.floor(Math.random() * 59)
      .toString()
      .padStart(2, "0")}:${Math.floor(Math.random() * 59)
      .toString()
      .padStart(2, "0")}`,
    accuracy: `${90 + Math.floor(Math.random() * 10)}%`,
    imgCar: `/images/real-time-mock-image/car${(i % 5) + 1}-plate.png`,
    imgPlate: `/images/real-time-mock-image/car${(i % 5) + 1}.png`,
  })
);

export const areaData: AreaViewModel[] = [
  { id: 1, name: "ภาคเหนือ", region: "North" },
  { id: 2, name: "ภาคกลาง", region: "Central" },
  { id: 3, name: "ภาคตะวันออกเฉียงเหนือ", region: "Northeast" },
  { id: 4, name: "ภาคใต้", region: "South" },
];

export const provinceData: ProvinceViewModel[] = [
  { id: 1, name: "เชียงใหม่", areaId: 1 },
  { id: 2, name: "กรุงเทพมหานคร", areaId: 2 },
  { id: 3, name: "ขอนแก่น", areaId: 3 },
  { id: 4, name: "ภูเก็ต", areaId: 4 },
];

export const stationData: StationViewModel[] = [
  { id: 1, name: "สถานี A", provinceId: 1, lat: 18.7953, lon: 98.9986 },
  { id: 2, name: "สถานี B", provinceId: 2, lat: 13.7563, lon: 100.5018 },
  { id: 3, name: "สถานี C", provinceId: 3, lat: 16.4322, lon: 102.8236 },
  { id: 4, name: "สถานี D", provinceId: 4, lat: 7.8804, lon: 98.3923 },
];

export const searchPlateData: SearchResult[] = [
  {
    isSelected: true,
    id: 1,
    plate: "3กฎ 1234 กรุงเทพมหานคร",
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
    benefitPerson: {
      name: "Jane Doe",
      nationNumber: 9876543210987,
      address: "456 Elm Street, Bangkok, Thailand",
    },
  },
  {
    isSelected: false,
    id: 2,
    plate: "3กฎ 234 กรุงเทพมหานคร",
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
      id: 2,
      plate: "ABC-1234",
      location: "Tokyo, Japan",
      type: "Sedan",
      brand: "Benz",
      color: "Black",
      model: "Camry",
      date: "2024-06-28",
      time: "20:12:04",
      accuracy: "98%",
      imgCar: "/images/real-time-mock-image/car1.png",
      imgPlate: "/images/real-time-mock-image/car1-plate.png",
    },
    brand: "Benz",
      color: "Black",
      model: "Camry",
    ownerPerson: {
      name: "John Doe",
      nationNumber: 1234567890123,
      address: "123 Main Street, Bangkok, Thailand",
    },
    benefitPerson: {
      name: "Jane Doe",
      nationNumber: 9876543210987,
      address: "456 Elm Street, Bangkok, Thailand",
    },
  },
];
