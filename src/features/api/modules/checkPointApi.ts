import { apiService } from "../apiService";
import { ENDPOINTS } from "../endpoints";
import {
  CheckPointViewModel,
  CheckPointVehicleViewModel,
  AreaViewModel,
  ProvinceViewModel,
  StationViewModel,
} from "../types";

export const checkPoint = {
  getAll: (): Promise<CheckPointViewModel[]> =>
    apiService.get(ENDPOINTS.checkpoint),

  getVehicleByCheckPoint: (
    checkpointIds: number[]
  ): Promise<CheckPointVehicleViewModel[]> =>
    apiService.post(ENDPOINTS.vehicleByCheckpointIds, { checkpointIds }),

  getAllVehicleAllCheckpoint: (): Promise<CheckPointVehicleViewModel[]> =>
    apiService.get(ENDPOINTS.allVehicleAllCheckPoint),

  getArea: (): Promise<AreaViewModel[]> => apiService.get(ENDPOINTS.area),

  getProvince: (): Promise<ProvinceViewModel[]> =>
    apiService.get(ENDPOINTS.province),

  getStation: (): Promise<StationViewModel[]> =>
    apiService.get(ENDPOINTS.station),

};
