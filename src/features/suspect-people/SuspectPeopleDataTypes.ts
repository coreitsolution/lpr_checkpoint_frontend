import { FileUploadDetail } from "../../features/file-upload/fileUploadTypes"

export interface FileData {
  title: string
  url: string
}

export interface FileRespondsData {
  createdAt: string;
  id: number;
  notes: string | null;
  special_plate_id: number;
  title: string;
  updatedAt: string;
  url: string;
}

export interface NewFileRespondsData {
  createdAt: string;
  title: string;
  url: string;
}

export interface SuspectPeopleData {
  message?: string
  status?: string
  success?: string
  countAll?: number
  data?: SuspectPeopleRespondsDetail[]
}

export interface SuspectPeopleDetail {
  id: number
  title_id: number
  firstname: string
  lastname: string
  idcard_number: string
  address: string
  province_id: number
  district_id: number
  subdistrict_id: number
  zipcode: string
  person_class_id: number
  case_number: string
  arrest_warrant_date: string
  arrest_warrant_expire_date: string
  behavior: string
  case_owner_name: string
  case_owner_agency: string
  case_owner_phone: string
  imagesData: FileData[]
  filesData: FileData[]
  visible: number
  active: number
  notes: string
  createdAt?: string,
  updatedAt?: string,
}

export interface ImportSuspectPeopleDetail {
  id: number
  name_prefix_id: number
  name_prefix: string
  firstname: string
  lastname: string
  nation_number: string
  address: string
  province_id: number
  province?: string
  district_id: number
  district?: string
  sub_district_id: number
  sub_district?: string
  postal_code: string
  person_class_id: number
  person_class?: string
  case_number: string
  arrest_warrant_date: string
  arrest_warrant_expire_date: string
  behavior: string
  case_owner_name: string
  case_owner_agency: string
  case_owner_phone: string
  imagesData: string
  filesData: string
  visible: number
  activeString?: string
  active: number
  imagesUploadedData?: FileUploadDetail
  fileUploadedData?: FileUploadDetail
  createdAt?: string,
  updatedAt?: string,
  cannotImport?: boolean
}

export interface ImportSuspectPeople {
  id: number
  name_prefix: string
  firstname: string
  lastname: string
  nation_number: string
  address: string
  province: string
  district: string
  sub_district: string
  postal_code: string
  person_class: string
  case_number: string
  arrest_warrant_date: string
  arrest_warrant_expire_date: string
  behavior: string
  case_owner_name: string
  case_owner_agency: string
  case_owner_phone: string
  imagesData: string
  filesData: string
  active: string
}

export interface SuspectPeopleRespondsDetail {
  id: number
  title_id: number
  firstname: string
  lastname: string
  idcard_number: string
  address: string
  province_id: number
  district_id: number
  subdistrict_id: number
  zipcode: string
  person_class_id: number
  case_number: string
  arrest_warrant_date: string
  arrest_warrant_expire_date: string
  behavior: string
  case_owner_name: string
  case_owner_agency: string
  case_owner_phone: string
  watchlist_images: FileRespondsData[]
  watchlist_files: FileRespondsData[]
  visible: number
  active: number
  notes: string
  createdAt?: string,
  updatedAt?: string,
}

export type NewSuspectPeople = Omit<SuspectPeopleDetail, 'id'>