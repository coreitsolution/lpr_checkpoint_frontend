export interface CheckPointViewModel {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

export interface VehicleViewModel {
  id: number;
  plate: string;
  location: string;
  type: string;
  brand: string;
  color: string;
  model: string;
  date: string; // Date in string format, e.g., "2024-06-28"
  time: string; // Time in string format, e.g., "20:12:04"
  accuracy: string; // Accuracy as a percentage in string format, e.g., "98%"
  imgCar: string; // Path to car image
  imgPlate: string; // Path to plate image
  isBackList?: boolean;
}

export interface CheckPointVehicleViewModel {
  carId: number;
  checkpointId: number;
  carDetail: VehicleViewModel;
}

export interface AreaViewModel {
  id: number;
  name: string;
  region: string;
}

export interface ProvinceViewModel {
  id: number;
  name: string;
  areaId: number;
}

export interface StationViewModel {
  id: number;
  name: string;
  provinceId: number;
  lat: number;
  lon: number;
}

// search
export interface SearchResult {
  isSelected: boolean;
  id: number;
  plate: string;
  location: string;
  pathImage: string;
  pathImageVehicle: string;
  directionString: string;
  brand: string;
  model: string;
  color: string;
  directionDetail: DirectionDetail[];
  periodTime: string;
  map: MapPosition[];
  vehicle: VehicleViewModel;
  ownerPerson: OwnerInformation;
  benefitPerson: BenefitInformation;
}

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface DirectionDetail {
  color: string;
  direction: string;
  dateTime: string;
}

export interface OwnerInformation {
  name: string;
  nationNumber: number;
  address: string;
}

export interface BenefitInformation {
  name: string;
  nationNumber: number;
  address: string;
}

export interface FilesData {
  id: number | null
  extra_registration_id: number | null
  file_name: string
  file_path: string
  file_import_date: string
}

export type NewFilesData = Omit<FilesData, 'id'>

export interface ExtraRegistrationData {
  id: number
  behavior1: string
  behavior2: string
  car_registration: string
  case_id: string
  created_at: string
  data_owner: string
  end_arrest_date: Date | undefined
  images: string[]
  letter_category: string
  phone: string
  province_id: number
  registration_type_id: number
  start_arrest_date: Date | undefined
  agency_id: number
  status_id: number
  updated_at: string
}

export interface AgenciesData {
  id: number
  agency: string
  phone: string
  address: string
  latitude: string
  longitude: string
  created_at: Date
  updated_at: Date
}

export interface DataStatusData {
  id: number
  status: string
  created_at: Date
  updated_at: Date
}

export interface ProvincesData {
  id: number
  province_name: string
  province_name_thai: string
  province_code: string
  createdAt: Date
}

export interface RegistrationTypesData {
  id: number
  registration_type: string
  created_at: Date
  updated_at: Date
}

export interface Officer {
  prefix: string
  name: string
  surname: string
  position: string
  phone: string
}

export interface FilterSpecialRegistration {
  letterCategory: string
  carRegistration: string
  selectedProvince: string
  selectedRegistrationType: string
  selectedAgency: string
  selectedStatus: string
}