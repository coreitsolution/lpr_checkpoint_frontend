import { DataStatusData } from "../features/data-status/dataStatusTypes";

export const dataStatusData: DataStatusData[] = [
  {
    id: 1,
    status: 'Active',
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(), 
  },
  {
    id: 2,
    status: 'Inactive',
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString(), 
  },
];