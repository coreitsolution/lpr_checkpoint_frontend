import { getUrls } from '../../config/runtimeConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment";
import {
  LastRecognitionResult,
  VehicleCountResult,
  ConnectionResult,
  SystemStatusResult,
  ZipDownload,
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
  const { API_URL } = getUrls();
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
  const { API_URL } = getUrls();
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
  const { API_URL } = getUrls();
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

export const downloadFile = async (
  param?: Record<string, string>
): Promise<ZipDownload> => {
  const { API_URL } = getUrls();
  if (isDevEnv) {
    const data: ZipDownload = {
      data: {
        zipUrl: "/zip/example.zip"
      }
    }
    return Promise.resolve(data);
  }
  return await fetchClient<ZipDownload>(combineURL(API_URL, "/lpr-data/get-zipped-images-url"), {
    method: "GET",
    queryParams: param,
  });
};
