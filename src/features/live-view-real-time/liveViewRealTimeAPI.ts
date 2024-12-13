import { fetchClient } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { LastRecognitionResult, VehicleCountResult, ConnectionResult, SystemStatusResult } from "./liveViewRealTimeTypes"
import { lastRecognitionData, vehicleCountData, connectionData, systemStatusData } from "../../mocks/mockLiveViewRealTimes"

export const fetchLastRecognitions = async (): Promise<LastRecognitionResult> => {
  if (isDevEnv) {
    return Promise.resolve(lastRecognitionData)
  }
  return await fetchClient<LastRecognitionResult>(
    "https://jsonplaceholder.typicode.com/users"
  )
}

export const fetchVehicleCount = async (): Promise<VehicleCountResult> => {
  if (isDevEnv) {
    return Promise.resolve(vehicleCountData)
  }
  return await fetchClient<VehicleCountResult>(
    "https://jsonplaceholder.typicode.com/users"
  )
}

export const fetchConnection = async (): Promise<ConnectionResult> => {
  if (isDevEnv) {
    return Promise.resolve(connectionData)
  }
  return await fetchClient<ConnectionResult>(
    "https://jsonplaceholder.typicode.com/users"
  )
}

export const fetchSystemStatus = async (): Promise<SystemStatusResult> => {
  if (isDevEnv) {
    return Promise.resolve(systemStatusData)
  }
  return await fetchClient<SystemStatusResult>(
    "https://jsonplaceholder.typicode.com/users"
  )
}

export const dowloadFile = async (dowloadData: LastRecognitionResult): Promise<string> => {
  if (isDevEnv) {
    return Promise.resolve("/zip/example.zip")
  }
  return await fetchClient<string>(
    "https://jsonplaceholder.typicode.com/users"
  )
}