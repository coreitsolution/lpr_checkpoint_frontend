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

export interface VehicleBodyTypes {
  message?: string
  status?: string
  success?: string
  data?: VehicleBodyTypeDetail[]
}

export interface VehicleBodyTypeDetail 
{
  id: number
  body_type: string
  body_type_en?: string
  body_type_th: string
  details?: string
  visible?: boolean
  active?: boolean
}

export interface VehicleBodyTypesTh {
  message?: string
  status?: string
  success?: string
  data?: VehicleBodyTypeThDetail[]
}

export interface VehicleBodyTypeThDetail 
{
  id: number
  body_type_th: string
}

export interface VehicleColors {
  message?: string
  status?: string
  success?: string
  data?: VehicleColorDetail[]
}

export interface VehicleColorDetail 
{
  id: number
  color: string
  color_en?: string
  color_th: string
  visible?: boolean
  active?: boolean
}

export interface VehicleMakes {
  message?: string
  status?: string
  success?: string
  data?: VehicleMakesDetail[]
}

export interface VehicleMakesDetail 
{
  id: number
  make: string
  make_en: string
  make_th?: string
  visible?: boolean
  active?: boolean
}

export interface VehicleModels {
  message?: string
  status?: string
  success?: string
  data?: VehicleModelsDetail[]
}

export interface VehicleModelsDetail 
{
  id: number
  make: string
  model: string
  model_en: string
  model_th?: string
  visible?: boolean
  active?: boolean
}