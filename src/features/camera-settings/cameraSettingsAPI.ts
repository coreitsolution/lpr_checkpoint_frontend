import { fetchClient } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { CameraSettings, NewCameraSettings, CameraDetailSetting } from "./cameraSettingsTypes"
import { cameraSettingsData, cameraDetailSettingsData } from "../../mocks/mockCameraSettings"

let mockData = [...cameraSettingsData]
let mockDataDetail = [...cameraDetailSettingsData]

export const fetchCameraSettings = async (): Promise<CameraDetailSetting> => {
  if (isDevEnv) {
    return Promise.resolve(mockDataDetail[0])
  }
  return await fetchClient<CameraDetailSetting>(
    "https://jsonplaceholder.typicode.com/users"
  )
}

export const postCameraSetting = async (newSetting: NewCameraSettings): Promise<CameraSettings> => {
  if (isDevEnv) {
    const ids = mockData.map(setting => setting.id)
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    const settingWithId: CameraSettings = { ...newSetting, id: newId }
    mockData.push(settingWithId)
    return Promise.resolve(settingWithId)
  }
  return await fetchClient<CameraSettings>(
    "https://jsonplaceholder.typicode.com/users",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSetting),
    }
  )
}

export const putCameraSetting = async (updatedSetting: CameraSettings): Promise<CameraSettings> => {
  if (isDevEnv) {
    const index = mockData.findIndex((setting) => setting.id === updatedSetting.id);
    if (index === -1) {
      return Promise.reject(new Error("Setting not found in mock data"));
    }
    mockData[index] = { ...mockData[index], ...updatedSetting };
    return Promise.resolve(mockData[index]);
  }

  return await fetchClient<CameraSettings>(
    `https://jsonplaceholder.typicode.com/users/${updatedSetting.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSetting),
    }
  );
};

export const putCameraDetailSettings = async (updatedSetting: CameraDetailSetting): Promise<CameraDetailSetting> => {
  if (isDevEnv) {
    const index = mockDataDetail.findIndex((setting) => setting.id === updatedSetting.id)
    if (index === -1) {
      return Promise.reject(new Error("Setting not found in mock data"))
    }
    mockDataDetail[index] = { ...mockDataDetail[index], ...updatedSetting }
    return Promise.resolve(mockDataDetail[index])
  }

  return await fetchClient<CameraDetailSetting>(
    `https://jsonplaceholder.typicode.com/users/${updatedSetting.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSetting),
    }
  )
}

export const deleteCameraSetting = async (id: number): Promise<void> => {
  if (isDevEnv) {
    const index = mockData.findIndex((setting) => setting.id === id)
    if (index !== -1) {
      mockData.splice(index, 1)
    }
    return Promise.resolve()
  }

  return await fetchClient<void>(
    `https://jsonplaceholder.typicode.com/users/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  )
}