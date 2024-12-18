import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { SpecialPlatesDetail, NewSpecialPlates, SpecialPlatesData } from "./RegistrationDataTypes"
import { specialRegistrationdata, specialPlatesData } from "../../mocks/mockRegistrationData"

let mockSpecialRegistrationData = [...specialRegistrationdata]

export const fetchSpecialPlatesData = async (param?: string): Promise<SpecialPlatesData> => {
  if (isDevEnv) {
    return Promise.resolve(specialPlatesData)
  }
  const url = param ? `/special-plates/get${param}` : "/special-plates/get";
  return await fetchClient<SpecialPlatesData>(combineURL(API_URL, url), {
    method: "GET",
  });
}

export const postSpecialRegistrationData = async (newSetting: NewSpecialPlates): Promise<SpecialPlatesDetail> => {
  if (isDevEnv) {
    const ids = mockSpecialRegistrationData.map(setting => setting.id)
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    const settingWithId: SpecialPlatesDetail = { ...newSetting, id: newId }
    if (Object.isExtensible(mockSpecialRegistrationData)) {
      mockSpecialRegistrationData.push(settingWithId);
    } else {
      mockSpecialRegistrationData = [...mockSpecialRegistrationData, settingWithId];
    }
    return Promise.resolve(settingWithId)
  }
  return await fetchClient<SpecialPlatesDetail>(combineURL(API_URL, "/special-plates/create"), {
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
  return await fetchClient<void>(
    combineURL(API_URL, `/special-plates/delete/${id}`),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  )
}

export const putSpecialPlateData = async (updated: SpecialPlatesDetail): Promise<SpecialPlatesDetail> => {
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

  return await fetchClient<SpecialPlatesDetail>(
    combineURL(API_URL, `/special-plates/update`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }
  )
}