export interface Province {
  id: number;
  name_th: string;
  name_en: string;
}

export interface Agencies {
  id: number
  agency: string
  phone: string
  address: string
  latitude: string
  longitude: string
  created_at: Date
  updated_at: Date
}

export interface RegistrationTypesData {
  id: number
  registration_type: string
  created_at: Date
  updated_at: Date
}

export interface DataStatusData {
  id: number
  status: string
  created_at: Date
  updated_at: Date
}