import { fetchClient } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { SpecialRegistrationData, NewSpecialRegistrationData } from "./RegistrationDataTypes"
import { specialRegistrationdata, filesData } from "../../mocks/mockRegistrationData"
import { FilesData, NewFilesData } from "../../features/api/types"

let mockSpecialRegistrationData = [...specialRegistrationdata]
let mockFilesData = [...filesData]

export const fetchSpecialRegistrationData = async (): Promise<SpecialRegistrationData[]> => {
  if (isDevEnv) {
    return Promise.resolve(mockSpecialRegistrationData)
  }
  return await fetchClient<SpecialRegistrationData[]>(
    "https://jsonplaceholder.typicode.com/users"
  )
}

export const postSpecialRegistrationData = async (newSetting: NewSpecialRegistrationData): Promise<SpecialRegistrationData> => {
  if (isDevEnv) {
    const ids = mockSpecialRegistrationData.map(setting => setting.id)
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    const settingWithId: SpecialRegistrationData = { ...newSetting, id: newId }
    if (Object.isExtensible(mockSpecialRegistrationData)) {
      mockSpecialRegistrationData.push(settingWithId);
    } else {
      mockSpecialRegistrationData = [...mockSpecialRegistrationData, settingWithId];
    }
    return Promise.resolve(settingWithId)
  }
  return await fetchClient<SpecialRegistrationData>(
    "https://jsonplaceholder.typicode.com/users",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSetting),
    }
  )
}

export const deleteSpecialRegistrationData = async (id: number): Promise<void> => {
  if (isDevEnv) {
    const index = mockSpecialRegistrationData.findIndex((data) => data.id === id)
    if (index !== -1) {
      mockSpecialRegistrationData = mockSpecialRegistrationData.filter(data => data.id !== id);
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

export const postFilesData = async (newFile: NewFilesData[]): Promise<FilesData[]> => {
  if (isDevEnv) {
    const ids = mockFilesData.map(setting => setting.id)
    let newId = ids.length > 0 ? Math.max(...ids.filter(id => id !== null) as number[]) + 1 : 1

    const newFilesWithId: FilesData[] = newFile.map(file => ({
      ...file,
      id: newId++,
    }))
    mockFilesData.push(...newFilesWithId)
    return Promise.resolve(newFilesWithId)
  }
  return await fetchClient<FilesData[]>(
    "https://jsonplaceholder.typicode.com/users",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFile),
    }
  )
}

export const fetchFilesData = async (id: number): Promise<FilesData[]> => {
  if (isDevEnv) {
    const filterFilesData = mockFilesData.filter(data => data.extra_registration_id === id);
    return Promise.resolve(filterFilesData)
  }
  return await fetchClient<FilesData[]>(
    "https://jsonplaceholder.typicode.com/users"
  )
}

export const deleteFilesData = async (id: number): Promise<void> => {
  if (isDevEnv) {
    const index = mockFilesData.findIndex((data) => data.id === id)
    if (index !== -1) {
      mockFilesData = mockFilesData.filter(data => data.id !== id);
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

export const putSpecialRegistrationData = async (updated: SpecialRegistrationData): Promise<SpecialRegistrationData> => {
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

  return await fetchClient<SpecialRegistrationData>(
    `https://jsonplaceholder.typicode.com/users/${updated.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }
  )
}