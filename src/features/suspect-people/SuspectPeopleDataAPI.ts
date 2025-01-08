import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { NewSuspectPeople, SuspectPeopleData, SuspectPeopleRespondsDetail, SuspectPeopleDetail } from "./SuspectPeopleDataTypes"
import { suspectPeopleDetail } from "../../mocks/mockSuspectPeopleData"

let mockSpecialSuspectPeopleData = [...suspectPeopleDetail]

export const fetchSpecialSuspectPeopleData = async (param?: Record<string, string>): Promise<SuspectPeopleData> => {
  if (isDevEnv) {
    const data = {
      data: mockSpecialSuspectPeopleData
    }
    return Promise.resolve(data)
  }
  return await fetchClient<SuspectPeopleData>(combineURL(API_URL, "/watchlist/get"), {
    method: "GET",
    queryParams: param,
  });
}

export const postSpecialSuspectPeopleData = async (newSetting: NewSuspectPeople): Promise<SuspectPeopleRespondsDetail> => {
  if (isDevEnv) {
    const ids = mockSpecialSuspectPeopleData.map(setting => setting.id)
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    const settingWithId: SuspectPeopleRespondsDetail = { 
      ...newSetting, 
      id: newId,
      special_suspect_person_images: [],
      special_suspect_person_files: []
    }
    if (Object.isExtensible(mockSpecialSuspectPeopleData)) {
      mockSpecialSuspectPeopleData.push(settingWithId);
    } else {
      mockSpecialSuspectPeopleData = [...mockSpecialSuspectPeopleData, settingWithId];
    }
    return Promise.resolve(settingWithId)
  }
  return await fetchClient<SuspectPeopleRespondsDetail>(combineURL(API_URL, "/watchlist/create"), {
      method: "POST",
      body: JSON.stringify(newSetting),
    });
}

export const deleteSpecialSuspectPeopleData = async (id: number): Promise<void> => {
  if (isDevEnv) {
    const index = mockSpecialSuspectPeopleData.findIndex((data) => data.id === id)
    if (index !== -1) {
      mockSpecialSuspectPeopleData = mockSpecialSuspectPeopleData.filter(data => data.id !== id);
    }
    return Promise.resolve()
  }
  const body = { id: id }
  return await fetchClient<void>(
    combineURL(API_URL, `/watchlist/delete`),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  )
}

export const putSpecialSuspectPeopleData = async (updated: SuspectPeopleDetail): Promise<SuspectPeopleRespondsDetail> => {
  if (isDevEnv) {
    const index = mockSpecialSuspectPeopleData.findIndex((data) => data.id === updated.id)
    if (index === -1) {
      return Promise.reject(new Error("Setting not found in mock data"))
    }

    if (!Object.isExtensible(mockSpecialSuspectPeopleData)) {
      mockSpecialSuspectPeopleData = [...mockSpecialSuspectPeopleData];
    }
    
    mockSpecialSuspectPeopleData[index] = { ...mockSpecialSuspectPeopleData[index], ...updated }
    return Promise.resolve(mockSpecialSuspectPeopleData[index])
  }

  return await fetchClient<SuspectPeopleRespondsDetail>(
    combineURL(API_URL, `/watchlist/update`),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }
  )
}