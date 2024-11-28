export interface FilesData {
  id: number | null
  extra_registration_id: number | null
  file_name: string
  file_path: string
  file_import_date: Date
}

export interface ExtraRegistrationData {
  id: number
  behavior1: string
  behavior2: string
  car_registration: string
  case_id: string
  created_at: Date
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
  updated_at: Date
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