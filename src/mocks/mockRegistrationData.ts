import { SpecialRegistrationData } from "../features/registration-data/RegistrationDataTypes"
import { FilesData } from "../features/api/types"
import dayjs from "dayjs";

export const specialRegistrationdata: SpecialRegistrationData[] = [
  {
    id: 1,
    letter_category: "ขข",
    car_registration: "999",
    province_id: 1,
    images: [
      "/images/real-time-mock-image/car1.png",
      "/images/real-time-mock-image/car1-plate.png"
    ],
    case_id: "7898878",
    start_arrest_date: "10/01/2024",
    end_arrest_date: "10/01/2024",
    behavior1: "ลักลอบขนแรงงานต่างด้าว",
    behavior2: "",
    data_owner: "นายสุรพล พลวิวัฒน์",
    phone: "081-111-1111",
    registration_type_id: 1,
    agency_id: 1,
    status_id: 1,
    created_at: "2024-11-20 16:38:07",
    updated_at: "2024-11-20 16:38:07",
  },
  {
    id: 2,
    letter_category: "ขพ",
    car_registration: "9998",
    province_id: 2,
    images: [
      "/images/real-time-mock-image/car2.png",
      "/images/real-time-mock-image/car2-plate.png"
    ],
    case_id: "7898878",
    start_arrest_date: "10/01/2024",
    end_arrest_date: "10/01/2024",
    behavior1: "ลักลอบขนแรงงานต่างด้าว",
    behavior2: "",
    data_owner: "นายสุรพล พลวิวัฒน์",
    phone: "081-111-1111",
    registration_type_id: 1,
    agency_id: 1,
    status_id: 1,
    created_at: "2024-11-20 16:38:07",
    updated_at: "2024-11-20 16:38:07",
  }
]

export const filesData: FilesData[] = [
  {
    id: 1,
    extra_registration_id: 1,
    file_name: "file.pdf",
    file_path: "blob:http://localhost:3000/1be680a6-39cd-4376-8ea4-0213a7fb40f5",
    file_import_date: "2024-11-20 00:00:00",
  }
]