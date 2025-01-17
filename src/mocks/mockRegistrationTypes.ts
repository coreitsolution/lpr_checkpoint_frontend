import { RegistrationTypesDetail, RegistrationTypes } from "../features/dropdown/dropdownTypes";
export const registrationTypesData: RegistrationTypesDetail[] = [
  {
    "id": 3,
    "title_en": "Blacklist",
    "title_th": "บุคคลเฝ้าระวัง",
    "visible": 1,
    "active": 1
  },
  {
    "id": 2,
    "title_en": "Member",
    "title_th": "สมาชิก",
    "visible": 1,
    "active": 1
  },
  {
    "id": 1,
    "title_en": "VIP",
    "title_th": "บุคคลสำคัญ",
    "visible": 1,
    "active": 1
  }
];

export const registrationTypes: RegistrationTypes = 
  {
    data: registrationTypesData
  };

