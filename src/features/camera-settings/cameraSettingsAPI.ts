import { getUrls } from '../../config/runtimeConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import {
  CameraSettings,
  NewCameraDetailSettings,
  CameraSettingsData,
  StartStopStream,
} from "./cameraSettingsTypes"
import {
  cameraDetailSettingsData,
  cameraSettingsData,
} from "../../mocks/mockCameraSettings"

let mockData = [...cameraDetailSettingsData]
let mockDataDetail = [...cameraDetailSettingsData]
let mockCameraSettingData = [...cameraSettingsData]

export const fetchCameraSettings = async (param?: Record<string, string>): Promise<CameraSettings> => {
  const { API_URL } = getUrls();
  if (isDevEnv) {
    const data = {
      data: mockData,
      pagination: {
        page: 1,
        maxPage: 1,
        limit: 10,
        count: 1,
        countAll: 1,
      },
    }
    return Promise.resolve(data)
  }
  return await fetchClient<CameraSettings>(combineURL(API_URL, "/cameras/get"), {
    method: "GET",
    queryParams: param,
  })
}

export const postCameraSetting = async (
  newSetting: NewCameraDetailSettings
): Promise<CameraSettingsData> => {
  const { API_URL } = getUrls();
  try {
    if (isDevEnv) {
      const ids = mockDataDetail.map((setting) => setting.id)
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
      const settingWithId: CameraSettingsData = { 
        ...newSetting, 
        id: newId,
        checkpoint_uid: newId,
        stream_encode_id: 1,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
      };
  
      mockCameraSettingData.push(settingWithId);
      return Promise.resolve({
        ...mockDataDetail[mockDataDetail.length - 1],
        latitude: Number(mockDataDetail[mockDataDetail.length - 1].latitude),
        longitude: Number(mockDataDetail[mockDataDetail.length - 1].longitude),
      });
    }
    return await fetchClient<CameraSettingsData>(combineURL(API_URL, "/cameras/create"), {
      method: "POST",
      body: JSON.stringify(newSetting),
    })
  } 
  catch (error) {
    throw new Error((error as { message: string }).message || "Unknown error occurred while posting data.")
  }
}

export const putCameraSetting = async (
  updatedSetting: CameraSettingsData
): Promise<CameraSettingsData> => {
  const { API_URL } = getUrls();
  try {
    if (isDevEnv) {
      const index = mockDataDetail.findIndex(
        (setting) => setting.id === updatedSetting.id
      )
      if (index === -1) {
        return Promise.reject(new Error("Setting not found in mock data"))
      }
      mockDataDetail[index] = {
        ...mockDataDetail[index],
        ...updatedSetting,
        latitude: String(updatedSetting.latitude),
        longitude: String(updatedSetting.longitude)
      };
      
      return Promise.resolve({
        ...mockDataDetail[index],
        latitude: Number(mockDataDetail[index].latitude),
        longitude: Number(mockDataDetail[index].longitude)
      } as CameraSettingsData);
    }
  
    return await fetchClient<CameraSettingsData>(combineURL(API_URL, "/cameras/update"), {
      method: "PATCH",
      body: JSON.stringify(updatedSetting),
    })
  } 
  catch (error) {
    throw new Error((error as { message: string }).message || "Unknown error occurred while updating data.")
  }
}

export const deleteCameraSetting = async (id: number): Promise<void> => {
  const { API_URL } = getUrls();
  if (isDevEnv) {
    const index = mockDataDetail.findIndex((setting) => setting.id === id)
    if (index !== -1) {
      mockDataDetail.splice(index, 1)
    }
    return Promise.resolve()
  }

  const deleteId = { id: id }
  return await fetchClient<void>(combineURL(API_URL, `/cameras/delete`), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deleteId),
  })
}

export const startStream = async (uid: StartStopStream) => {
  const { STREAM_URL } = getUrls();
  if (isDevEnv) {

  }
  return await fetchClient(combineURL(STREAM_URL, "/live/start"), {
    method: "POST",
    body: JSON.stringify(uid),
    isStream: true,
  })
}

export const stopStream = async (uid: StartStopStream) => {
  const { STREAM_URL } = getUrls();
  if (isDevEnv) {

  }
  return await fetchClient(combineURL(STREAM_URL, "/live/stop"), {
    method: "POST",
    body: JSON.stringify(uid),
    isStream: true,
  })
}

export const restartStream = async () => {
  const { SERVICE_1_URL } = getUrls();
  if (isDevEnv) {

  }
  return await fetchClient(combineURL(SERVICE_1_URL, "/services/restart-live"), {
    method: "POST",
    isService1: true,
  })
}