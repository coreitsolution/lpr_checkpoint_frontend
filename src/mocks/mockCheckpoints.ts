// Types
import { Checkpoint } from '../features/checkpoint-settings/checkpointSettingsTypes';

export const mockCheckpoint: Checkpoint = {
  id: 1,
  checkpoint_uid: "CHK-001",
  checkpoint_name: "Main City Checkpoint",
  checkpoint_ip: "192.168.1.10",
  organization: "City Security Department",
  province_id: 10,
  district_id: 5,
  subdistrict_id: 2,
  route: "Highway 21",
  latitude: 14.123456,
  longitude: 100.987654,
  serial_number: "SN-987654321",
  license_key: "LIC-ABC-1234567890",
  officer_title_id: 1,
  officer_firstname: "Somsak",
  officer_lastname: "Kittisak",
  officer_position: "Senior Officer",
  officer_phone: "0812345678",
  visible: 1,
  active: 1,
  deleted: 0,
  alive: 1,
  last_online: "2025-07-29T02:24:19.148Z",
  last_check: "2025-07-29T02:24:19.148Z",
  created_at: "2025-07-29T02:24:19.148Z",
  updated_at: "2025-07-29T02:24:19.148Z"
};
