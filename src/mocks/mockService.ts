import {
  areaData,
  checkPointCarsData,
  checkPointCarsData2,
  checkPointData,
  provinceData,
  stationData,
  searchPlateData,
} from "./mockData";

const simulateFetch = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 1000));

export const mockService = {
  get: (endpoint: string, id?: number | string) => {
    if (endpoint.includes("checkpoint")) return simulateFetch(checkPointData);
    if (endpoint.includes("allVehicleAllCheckpoint"))
      return simulateFetch(checkPointCarsData);
    if (endpoint.includes("area")) return simulateFetch(areaData);
    if (endpoint.includes("province")) return simulateFetch(provinceData);
    if (endpoint.includes("station")) return simulateFetch(stationData);

    // Handle getting specific data by ID for searchData
    if (endpoint.includes("searchData")) {
      if (id !== undefined) {
        const specificData = searchPlateData.find((item) => item.id == id);
        return simulateFetch(specificData || null); // Return the found data or null if not found
      }
      return simulateFetch(searchPlateData); // Return all data if no ID is provided
    }

    return simulateFetch([]);
  },
  post: <T extends { ids: number[] }>(endpoint: string, data: T) => {
    if (endpoint.includes("vehicleByCheckpointIds"))
      return simulateFetch(checkPointCarsData2);
    if (endpoint.includes("getCompareData") && Array.isArray(data.ids)) {
      const compareResults = searchPlateData.filter((item) =>
        data.ids.includes(item.id)
      );
      return simulateFetch(compareResults);
    }
    return simulateFetch([]);
  },
  patch: <T>(endpoint: string, data: T) => simulateFetch(data),
  delete: (endpoint: string) => simulateFetch(null),
};
