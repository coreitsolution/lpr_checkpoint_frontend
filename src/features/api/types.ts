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
  color?: string;
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
  selectedProvince: number | string
  selectedRegistrationType: number | string
  agency: string
  selectedStatus: number | string
}

export interface FilterSpecialPeople {
  selectedNamePrefix: number | string
  firstname: string
  lastname: string
  selectedPersonType: number | string
  agency: string
  selectedStatus: number | string
}

export interface FilterSpecialPlatesBody {
  plateGroup: string
  plateNumber: string
  regionCode: string
  vehicleBodyTypeTH: string
  vehicleMake: string
  vehicleModel: string
  vehicleColor: string
  startDate: string
  endDate: string
  camIdList: string[]
  plateTypeId: number
  page: Number,
  limit: Number,
  orderBy?: string,
  reverseOrder?: boolean,
  includesVehicleInfo?: Number,
}

export type FilterSpecialPlates = Omit<FilterSpecialPlatesBody, "page" | "limit">

export interface FilterSpecialSuspectPeople {
  namePrefix: number
  firstname: string
  lastname: string
  faceConfidence: number
  selectedStartDate: Date | null
  selectedEndDate: Date | null
  selectedCheckpoint: string[]
  selectedRegistrationType: string
}

export interface DetactSpecialPlate {
  logo_text: string
  title_header: string
  title_check_point: string
  table_columns: DetactSpecialPlateColumns
  table_rows: DetactSpecialPlateRows[]
}

export interface DetactSpecialPlateColumns {
  plate_header: string
  image_header: string
  checkPoint_header: string
  vehicleType_header: string
  vehicleDetail_header: string
  accuracy_header: string
  registrationGroup_header: string
  dateTime_header: string
  lane_header: string
}

export interface DetactSpecialPlateRows {
  plate_data: string
  image_data: ImagesData
  checkPoint_data: string
  vehicleType_data: string
  vehicleDetail_data: string[]
  accuracy_data: string
  registrationGroup_data: string
  dateTime_data: string
  lane_data: string
}

export interface ImagesData {
  vehicle_image: string
  plate_image: string
}

export interface DocumentElementWithFullscreen extends HTMLElement {
  msRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  webkitRequestFullscreen?: () => Promise<void>
}

export interface DocumentWithFullscreen extends Document {
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitFullscreenElement?: Element
  msExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
}

export interface PdfDowload {
  statusCode?: number
  status?: string
  success?: boolean
  message?: string
  filePath: string
}