import { API_URL, STREAM_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import {
  CameraSettings,
  NewCameraDetailSettings,
  CameraDetailSettings,
  StartStopStream,
} from "./cameraSettingsTypes"
import {
  cameraDetailSettingsData,
} from "../../mocks/mockCameraSettings"

let mockData = {data:[...cameraDetailSettingsData]}
let mockDataDetail = [...cameraDetailSettingsData]

export const fetchCameraSettings = async (param?: Record<string, string>): Promise<CameraSettings> => {
  if (isDevEnv) {
    return Promise.resolve(mockData)
  }
  return await fetchClient<CameraSettings>(combineURL(API_URL, "/cameras/get"), {
    method: "GET",
    queryParams: param,
  })
}

export const postCameraSetting = async (
  newSetting: NewCameraDetailSettings
): Promise<CameraDetailSettings> => {
  if (isDevEnv) {
    const ids = mockDataDetail.map((setting) => setting.id)
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    const settingWithId: CameraDetailSettings = { 
      ...newSetting, 
      latitude: newSetting.latitude.toString(),
      longitude: newSetting.longitude.toString(),
      id: newId,
      cam_uid: '', 
      alpr_cam_id: 0, 
      detecion_count: 0,
      sample_image_url: '',
      live_server_url: '', 
      live_stream_url: '',
      wsport: 0, 
      streaming: false, 
      alive: 0,
      last_online: null,
      last_check: null,
      stream_encode: {
        id: 1,
        name: "H265",
        gstreamer_format: "",
        visible: true,
        active: true,
      },
      stream_encode_id: 1,
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
    };

    mockDataDetail.push(settingWithId);
    return Promise.resolve(mockDataDetail[mockDataDetail.length - 1]);
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

  const deleteId = { id: id }
  return await fetchClient<void>(combineURL(API_URL, `/cameras/delete`), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deleteId),
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