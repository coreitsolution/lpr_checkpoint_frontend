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
  created_at: string
  updated_at: string
}

export interface RegistrationTypesData {
  id: number
  registration_type: string
  created_at: string
  updated_at: string
}

export interface DataStatusData {
  id: number
  status: string
  created_at: string
  updated_at: string
}

export interface PoliceDivisions {
  id: number
  police_division: string
}

export interface Districts {
  id: number
  province_id: number
  name_th: string
  name_en: string
}

export interface SubDistricts {
  id: number
  province_id: number
  district_id: number
  name_th: string
  name_en: string
}

export interface NamePrefixes {
  id: number
  name_th: string
  name_en: string
}

export interface Positions {
  id: number
  name_th: string
  name_en: string
}