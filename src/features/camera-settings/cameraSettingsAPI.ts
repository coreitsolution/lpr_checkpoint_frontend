import { API_URL, STREAM_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import {
  CameraSettings,
  NewCameraDetailSettings,
  CameraDetailSettings,
  CameraScreenSettingDetail,
  CameraScreenSetting,
  StartStopStream,
} from "./cameraSettingsTypes"
import {
  cameraDetailSettingsData,
  cameraScreenSettingDetail,
} from "../../mocks/mockCameraSettings"

let mockData = {data:[...cameraDetailSettingsData]}
let mockDataDetail = [...cameraDetailSettingsData]
let mockScreenSetting = {data:[...cameraScreenSettingDetail]}

export const fetchCameraSettings = async (): Promise<CameraSettings> => {
  if (isDevEnv) {
    return Promise.resolve(mockData)
  }
  return await fetchClient<CameraSettings>(combineURL(API_URL, "/cameras/get"), {
    method: "GET",
  })
}

export const postCameraSetting = async (
  newSetting: NewCameraDetailSettings
): Promise<CameraDetailSettings> => {
  if (isDevEnv) {
    const ids = mockDataDetail.map((setting) => setting.id)
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    // const settingWithId: CameraDetailSettings = { ...newSetting, id: newId }
    // mockData.push(settingWithId)
    return Promise.resolve(mockDataDetail[mockDataDetail.length - 1])
  }
  return await fetchClient<CameraDetailSettings>(combineURL(API_URL, "/cameras/create"), {
    method: "POST",
    body: JSON.stringify(newSetting),
  })
}

export const putCameraSetting = async (
  updatedSetting: CameraDetailSettings
): Promise<CameraDetailSettings> => {
  if (isDevEnv) {
    const index = mockDataDetail.findIndex(
      (setting) => setting.id === updatedSetting.id
    )
    if (index === -1) {
      return Promise.reject(new Error("Setting not found in mock data"))
    }
    mockDataDetail[index] = { ...mockDataDetail[index], ...updatedSetting }
    return Promise.resolve(mockDataDetail[index])
  }

  return await fetchClient<CameraDetailSettings>(combineURL(API_URL, "/cameras/update"), {
    method: "PATCH",
    body: JSON.stringify(updatedSetting),
  })
}

export const deleteCameraSetting = async (id: number): Promise<void> => {
  if (isDevEnv) {
    const index = mockDataDetail.findIndex((setting) => setting.id === id)
    if (index !== -1) {
      mockDataDetail.splice(index, 1)
    }
    return Promise.resolve()
  }

  return await fetchClient<void>(combineURL(API_URL, `/cameras/delete/${id}`), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
}

export const fetchCameraScreenSettings = async (param?: string): Promise<CameraScreenSetting> => {
  if (isDevEnv) {
    return Promise.resolve(mockScreenSetting)
  }
  const url = param ? `/settings/get${param}` : "/settings/get"
  return await fetchClient<CameraScreenSetting>(combineURL(API_URL, url), {
    method: "GET",
  })
}

export const putCameraScreenSettings = async (updatedSetting: CameraScreenSettingDetail): Promise<CameraScreenSettingDetail> => {
  if (isDevEnv) {
    // const index = mockData.findIndex(
    //   (setting) => setting.id === updatedSetting.id
    // )
    // if (index === -1) {
    //   return Promise.reject(new Error("Setting not found in mock data"))
    // }
    // mockData[index] = { ...mockData[index], ...updatedSetting }
    // return Promise.resolve(mockData[index])
  }
  return await fetchClient<CameraScreenSettingDetail>(combineURL(API_URL, "/settings/update"), {
    method: "PATCH",
    body: JSON.stringify(updatedSetting),
  })
}

export const startStream = async (uid: StartStopStream) => {
  if (isDevEnv) {

  }
  return await fetchClient(combineURL(STREAM_URL, "/live/start"), {
    method: "POST",
    body: JSON.stringify(uid),
  })
}

export const stopStream = async (uid: StartStopStream) => {
  if (isDevEnv) {

  }
  return await fetchClient(combineURL(STREAM_URL, "/live/stop"), {
    method: "POST",
    body: JSON.stringify(uid),
  })
}

export const restartStream = async () => {
  if (isDevEnv) {

  }
  return await fetchClient(combineURL(STREAM_URL, "/live/restart-all"), {
    method: "POST",
  })
}