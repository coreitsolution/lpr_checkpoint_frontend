import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  fetchLastRecognitions,
  fetchVehicleCount,
  fetchConnection,
  fetchSystemStatus,
  dowloadFile,
} from "./liveViewRealTimeAPI"
import {
  LastRecognitionResult,
  ZipDowload,
  VehicleCountResult,
  ConnectionResult,
  SystemStatusResult,
} from "./liveViewRealTimeTypes"
import { Status } from "../../constants/statusEnum"

interface LiveViewRealTimesState {
  liveViewRealTimeData: LastRecognitionResult | null
  vehicleCountData: VehicleCountResult | null
  connectionData: ConnectionResult | null
  systemStatusData: SystemStatusResult | null
  dowloadPath: ZipDowload | null
  status: Status
  error: string | null
}

const initialState: LiveViewRealTimesState = {
  liveViewRealTimeData: null,
  vehicleCountData: null,
  connectionData: null,
  systemStatusData: null,
  dowloadPath: null,
  status: Status.IDLE,
  error: null,
}

export const fetchLastRecognitionsThunk = createAsyncThunk(
  "liveViewRealTimes/fetchLastRecognitions",
  async (param?: Record<string, string>) => {
    const response = await fetchLastRecognitions(param)
    return response
  }
)

export const fetchConnectionThunk = createAsyncThunk(
  "liveViewRealTimes/fetchConnection",
  async () => {
    const response = await fetchConnection()
    return response
  }
)

export const fetchSystemStatusThunk = createAsyncThunk(
  "liveViewRealTimes/fetchSystemStatus",
  async (param?: Record<string, string>) => {
    const response = await fetchSystemStatus(param)
    return response
  }
)

export const fetchVehicleCountThunk = createAsyncThunk(
  "liveViewRealTimes/fetchVehicleCount",
  async (param?: Record<string, string>) => {
    const response = await fetchVehicleCount(param)
    return response
  }
)

export const dowloadFileThunk = createAsyncThunk(
  "liveViewRealTimes/dowloadData",
  async (param?: Record<string, string>) => {
    const response = await dowloadFile(param)
    return response
  }
)

const liveViewRealTimesSlice = createSlice({
  name: "liveViewRealTimes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastRecognitionsThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(fetchLastRecognitionsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.liveViewRealTimeData = action.payload
      })
      .addCase(fetchLastRecognitionsThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error =
          action.error.message || "Failed to fetch liveViewRealTime"
      })

      .addCase(fetchVehicleCountThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(fetchVehicleCountThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.vehicleCountData = action.payload
      })
      .addCase(fetchVehicleCountThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error =
          action.error.message || "Failed to fetch vehicleCountData"
      })

      .addCase(fetchConnectionThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(fetchConnectionThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.connectionData = action.payload
      })
      .addCase(fetchConnectionThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch connectionData"
      })

      .addCase(fetchSystemStatusThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(fetchSystemStatusThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.systemStatusData = action.payload
      })
      .addCase(fetchSystemStatusThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error =
          action.error.message || "Failed to fetch systemStatusData"
      })

      // Dowload file
      .addCase(dowloadFileThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(dowloadFileThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.dowloadPath = action.payload
      })
      .addCase(dowloadFileThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch dowloadPath"
      })
  },
})

export default liveViewRealTimesSlice.reducer
