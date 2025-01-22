import { PersonTypesDetail, PersonTypes } from "../features/dropdown/dropdownTypes";
export const personTypesData: PersonTypesDetail[] = [
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

export const personTypes: PersonTypes = 
  {
    data: personTypesData
  };

