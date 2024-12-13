export interface SpecialRegistrationData {
  id: number
  behavior1: string
  behavior2: string
  car_registration: string
  case_id: string
  created_at: string
  data_owner: string
  end_arrest_date: string
  images: string[]
  letter_category: string
  phone: string
  province_id: number
  registration_type_id: number
  start_arrest_date: string
  agency_id: number
  status_id: number
  updated_at: string
}

export type NewSpecialRegistrationData = Omit<SpecialRegistrationData, 'id'>