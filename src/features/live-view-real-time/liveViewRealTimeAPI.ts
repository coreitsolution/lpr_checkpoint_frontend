import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment";
import {
  LastRecognitionResult,
  VehicleCountResult,
  ConnectionResult,
  SystemStatusResult,
  ZipDowload,
} from "./liveViewRealTimeTypes";
import {
  lastRecognitionData,
  vehicleCountListFullData,
  connectionData,
  systemStatusListFullData,
} from "../../mocks/mockLiveViewRealTimes";

export const fetchLastRecognitions = async (
  param?: Record<string, string>
): Promise<LastRecognitionResult> => {
  if (isDevEnv) {
    const data = { data: param && param.filter === "is_special_plate:1" ? lastRecognitionData.filter((row) => row.is_special_plate === true) : lastRecognitionData}
    return Promise.resolve(data);
  }
  return await fetchClient<LastRecognitionResult>(combineURL(API_URL, "/lpr-data/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchVehicleCount = async (param?: Record<string, string>): Promise<VehicleCountResult> => {
  if (isDevEnv) {
    const data = {
      data: vehicleCountListFullData
    }
    return Promise.resolve(data);
  }
  return await fetchClient<VehicleCountResult>(combineURL(API_URL, "/lpr-data/get-vehicle-count"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchConnection = async (): Promise<ConnectionResult> => {
  if (isDevEnv) {
    return Promise.resolve(connectionData);
  }
  return await fetchClient<ConnectionResult>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchSystemStatus = async (param?: Record<string, string>): Promise<SystemStatusResult> => {
  if (isDevEnv) {
    const data = {
      data: systemStatusListFullData
    }
    return Promise.resolve(data);
  }
  return await fetchClient<SystemStatusResult>(combineURL(API_URL, "/logs/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const dowloadFile = async (
  param?: Record<string, string>
): Promise<ZipDowload> => {
  if (isDevEnv) {
    const data: ZipDowload = {
      data: {
        zipUrl: "/zip/example.zip"
      }
    }
    return Promise.resolve(data);
  }
  return await fetchClient<ZipDowload>(combineURL(API_URL, "/lpr-data/get-zipped-images-url"), {
    method: "GET",
    queryParams: param,
  });
};
