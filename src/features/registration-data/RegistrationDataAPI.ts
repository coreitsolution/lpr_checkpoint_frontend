import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { NewSpecialPlates, SpecialPlatesData, SpecialPlatesRespondsDetail, SpecialPlatesDetail } from "./RegistrationDataTypes"
import { specialRegistrationdata } from "../../mocks/mockRegistrationData"

let mockSpecialRegistrationData = [...specialRegistrationdata]

export const fetchSpecialPlatesData = async (param?: Record<string, string>): Promise<SpecialPlatesData> => {
  if (isDevEnv) {
    const data = {
      countAll: mockSpecialRegistrationData.length,
      data: mockSpecialRegistrationData
    }
    return Promise.resolve(data)
  }
  return await fetchClient<SpecialPlatesData>(combineURL(API_URL, "/special-plates/get"), {
    method: "GET",
    queryParams: param,
  });
}

export const postSpecialRegistrationData = async (newSetting: NewSpecialPlates): Promise<SpecialPlatesRespondsDetail> => {
  if (isDevEnv) {
    const ids = mockSpecialRegistrationData.map(setting => setting.id)
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    const settingWithId: SpecialPlatesRespondsDetail = { 
      ...newSetting, 
      id: newId,
      special_plate_images: [],
      special_plate_files: [],
      arrest_warrant_date: newSetting.arrest_warrant_date ? newSetting.arrest_warrant_date : "",
      arrest_warrant_expire_date: newSetting.arrest_warrant_expire_date ? newSetting.arrest_warrant_expire_date : "",
    }
    if (Object.isExtensible(mockSpecialRegistrationData)) {
      mockSpecialRegistrationData.push(settingWithId);
    } else {
      mockSpecialRegistrationData = [...mockSpecialRegistrationData, settingWithId];
    }
    return Promise.resolve(settingWithId)
  }
  return await fetchClient<SpecialPlatesRespondsDetail>(combineURL(API_URL, "/special-plates/create"), {
      method: "POST",
      body: JSON.stringify(newSetting),
    });
}

export const deleteSpecialPlatesData = async (id: number): Promise<void> => {
  if (isDevEnv) {
    const index = mockSpecialRegistrationData.findIndex((data) => data.id === id)
    if (index !== -1) {
      mockSpecialRegistrationData = mockSpecialRegistrationData.filter(data => data.id !== id);
    }
    return Promise.resolve()
  }
  const body = { id: id }
  return await fetchClient<void>(
    combineURL(API_URL, `/special-plates/delete`),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  )
}

export const putSpecialPlateData = async (updated: SpecialPlatesDetail): Promise<SpecialPlatesRespondsDetail> => {
  if (isDevEnv) {
    const index = mockSpecialRegistrationData.findIndex((data) => data.id === updated.id)
    if (index === -1) {
      return Promise.reject(new Error("Setting not found in mock data"))
    }

    if (!Object.isExtensible(mockSpecialRegistrationData)) {
      mockSpecialRegistrationData = [...mockSpecialRegistrationData];
    }
    
    mockSpecialRegistrationData[index] = { ...mockSpecialRegistrationData[index], ...updated }
    return Promise.resolve(mockSpecialRegistrationData[index])
  }

  return await fetchClient<SpecialPlatesRespondsDetail>(
    combineURL(API_URL, `/special-plates/update`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }
  )
}