import { Pagination } from "../../features/api/types"

export interface Checkpoint {
  id: number;
  checkpoint_uid?: string;
  checkpoint_name: string;
  checkpoint_ip: string;
  organization: string;
  province_id: number;
  province_name?: string;
  district_id: number;
  district_name?: string;
  subdistrict_id: number;
  subdistrict_name?: string;
  route: string;
  latitude: number;
  longitude: number;
  serial_number: string;
  license_key: string;
  officer_title_id: number;
  officer_firstname: string;
  officer_lastname: string;
  officer_position: string;
  officer_phone: string;
  visible?: number;
  active?: number;
  deleted?: number;
  alive?: number;
  last_online?: string;
  last_check?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CheckpointResponse {
  message?: string
  status?: string
  success?: boolean
  pagination: Pagination
  data: Checkpoint[]
}

export type NewCheckpointSetting = Omit<Checkpoint, "id">;