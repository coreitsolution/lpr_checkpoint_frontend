import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment";
import {
  LastRecognitionResult,
  VehicleCountResult,
  ConnectionResult,
  SystemStatusResult,
  LastRecognitionData,
} from "./liveViewRealTimeTypes";
import {
  lastRecognitionData,
  vehicleCountData,
  connectionData,
  systemStatusData,
} from "../../mocks/mockLiveViewRealTimes";

export const fetchLastRecognitions = async (
  param?: string
): Promise<LastRecognitionResult> => {
  if (isDevEnv) {
    const data = { data: lastRecognitionData}
    return Promise.resolve(data);
  }
  const url = param ? `/lpr-data/get${param}` : "/lpr-data/get";
  return await fetchClient<LastRecognitionResult>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchVehicleCount = async (): Promise<VehicleCountResult> => {
  if (isDevEnv) {
    return Promise.resolve(vehicleCountData);
  }
  return await fetchClient<VehicleCountResult>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchConnection = async (): Promise<ConnectionResult> => {
  if (isDevEnv) {
    return Promise.resolve(connectionData);
  }
  return await fetchClient<ConnectionResult>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchSystemStatus = async (): Promise<SystemStatusResult> => {
  if (isDevEnv) {
    return Promise.resolve(systemStatusData);
  }
  return await fetchClient<SystemStatusResult>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const dowloadFile = async (
  dowloadData: LastRecognitionData
): Promise<string> => {
  if (isDevEnv) {
    return Promise.resolve("/zip/example.zip");
  }
  return await fetchClient<string>(
    "https://jsonplaceholder.typicode.com/users"
  );
};
