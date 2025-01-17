import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import {
  SettingData,
  SettingDetail,
} from "./settingsTypes"
import {
  mockSettings,
} from "../../mocks/mockSettings"

export const fetchSettings = async (param?: Record<string, string>): Promise<SettingData> => {
  if (isDevEnv) {
    let filterData:SettingDetail[] = []
    if (param && param.filter && param.filter === "key:live_view_count") {
      filterData = mockSettings.filter((row) => row.key === "live_view_count")
    }
    else if (param && param.filter && param.filter === "key:checkpoint_name") {
      filterData = mockSettings.filter((row) => row.key === "checkpoint_name")
    }
    const data = {
      data: filterData
    }
    return Promise.resolve(data)
  }
  return await fetchClient<SettingData>(combineURL(API_URL, "/settings/get"), {
    method: "GET",
    queryParams: param,
  })
}

export const putSettings = async (updatedSetting: SettingDetail): Promise<SettingDetail> => {
  if (isDevEnv) {
    const index = mockSettings.findIndex(
      (setting) => setting.id === updatedSetting.id
    )
    if (index === -1) {
      return Promise.reject(new Error("Setting not found in mock data"))
    }
    mockSettings[index] = { ...mockSettings[index], ...updatedSetting }
    return Promise.resolve(mockSettings[index])
  }
  return await fetchClient<SettingDetail>(combineURL(API_URL, "/settings/update"), {
    method: "PATCH",
    body: JSON.stringify(updatedSetting),
  })
}
