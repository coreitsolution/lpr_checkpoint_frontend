import { Agencies } from "../features/agencies/agenciesTypes";

export const agenciesData: Agencies[] = [
  {
    id: 1,
    agency: 'หน่วยงานที่ 1',
    phone: '0123456789',
    address: '123 Street',
    latitude: '13.7563',
    longitude: '100.5018',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    agency: 'หน่วยงานที่ 2',
    phone: '0123456789',
    address: '123 Street',
    latitude: '13.753924',
    longitude: '100.506335',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
