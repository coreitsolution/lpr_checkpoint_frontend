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

export interface SpecialPlatesData {
  message?: string
  status?: string
  success?: string
  countAll?: number
  data?: SpecialPlatesRespondsDetail[]
}

export interface SpecialPlatesDetail {
  id: number
  plate_group: string
  plate_number: string
  province_id: number
  plate_class_id: number
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
  createdAt?: string,
  updatedAt?: string,
}

export interface ImportSpecialPlatesDetail {
  id: number
  plate_group: string
  plate_number: string
  province_id: number
  plate_class_id: number
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
  active: number
  createdAt?: string,
  updatedAt?: string,
}

export interface SpecialPlatesRespondsDetail {
  id: number
  plate_group: string
  plate_number: string
  province_id: number
  plate_class_id: number
  case_number: string
  arrest_warrant_date: string
  arrest_warrant_expire_date: string
  behavior: string
  case_owner_name: string
  case_owner_agency: string
  case_owner_phone: string
  special_plate_images: FileRespondsData[]
  special_plate_files: FileRespondsData[]
  visible: number
  active: number
  createdAt?: string,
  updatedAt?: string,
}

export type NewSpecialPlates = Omit<SpecialPlatesDetail, 'id'>