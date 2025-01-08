export interface Regions {
  message?: string
  status?: string
  success?: string
  data?: RegionsDetail[]
}

export interface RegionsDetail 
{
  id: number
  code: string
  name: string
  name_th: string
  remark: string | null
}

export interface Provinces {
  message?: string
  status?: string
  success?: string
  data?: ProvincesDetail[]
}

export interface ProvincesDetail 
{
  id: number
  country_id: number
  province_code: string
  police_region_id: number,
  name_th: string
  name_en: string
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface RegistrationTypesDetail {
  id: number
  title_en: string
  title_th: string
  visible: number
  active: number
}

export interface RegistrationTypes {
  message?: string
  status?: string
  success?: string
  data?: RegistrationTypesDetail[]
}

export interface DataStatusData {
  id: number
  status: string
}

export interface PoliceDivisions {
  message?: string
  status?: string
  success?: string
  data?: PoliceDivisionsDetail[]
}

export interface PoliceDivisionsDetail {
  id: number
  title_en: string
  title_th: string
  active: number
}

export interface Districts {
  message?: string
  status?: string
  success?: string
  data?: DistrictsDetail[]
}

export interface DistrictsDetail {
  id: number
  province_id: number
  name_th: string
  name_en: string
  district_code: string
  zipcode: string
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface SubDistricts {
  message?: string
  status?: string
  success?: string
  data?: SubDistrictsDetail[]
}

export interface SubDistrictsDetail {
  id: number
  province_id: number
  district_id: number
  name_th: string
  name_en: string
  subdistrict_code: string
  zipcode: string
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface CommonTitles {
  message?: string
  status?: string
  success?: string
  data?: CommonDetail[]
}

export interface CommonDetail {
  id: number
  title_en: string
  title_th: string
  visible: number
  active: number
}

export interface OfficerTitles {
  message?: string
  status?: string
  success?: string
  data?: OfficerTitlesDetail[]
}

export interface OfficerTitlesDetail {
  id: number
  title_en: string
  title_th: string
  title_abbr_en: string
  title_abbr_th: string
  active: number
}

export interface OfficerPositions {
  message?: string
  status?: string
  success?: string
  data?: OfficerPositionsDetail[]
}

export interface OfficerPositionsDetail {
  id: number
  position_th: string
  position_en: string
  active: number
}

export interface StreamEncodes {
  message?: string
  status?: string
  success?: string
  data?: StreamEncodesDetail[]
}

export interface StreamEncodesDetail 
{
  id: number
  name: string
  gstreamer_format: string
  visible: boolean
  active: boolean
}