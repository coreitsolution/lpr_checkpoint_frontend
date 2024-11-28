import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { CameraSettings } from "./cameraSettingsTypes";
import { cameraSettingsData } from "../../mocks/mockCameraSettings";

export const fetchCameraSettings = async (): Promise<CameraSettings[]> => {
  if (isDevEnv) {
    return Promise.resolve(cameraSettingsData);
  }
  return await fetchClient<CameraSettings[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};
