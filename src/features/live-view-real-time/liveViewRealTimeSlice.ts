import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchLastRecognitions, fetchVehicleCount, fetchConnection, fetchSystemStatus, dowloadFile } from "./liveViewRealTimeAPI"
import { LastRecognitionResult, LastRecognitionData, VehicleCountResult, ConnectionResult, SystemStatusResult } from "./liveViewRealTimeTypes"
import { Status } from "../../constants/statusEnum"

interface LiveViewRealTimesState {
  liveViewRealTimeData: LastRecognitionResult | null
  vehicleCountData: VehicleCountResult | null
  connectionData: ConnectionResult | null
  systemStatusData: SystemStatusResult | null
  dowloadPath: string
  status: Status
  error: string | null
}

const initialState: LiveViewRealTimesState = {
  liveViewRealTimeData: null,
  vehicleCountData: null,
  connectionData: null,
  systemStatusData: null,
  dowloadPath: "",
  status: Status.IDLE,
  error: null,
}

export const fetchLastRecognitionsThunk = createAsyncThunk(
  "liveViewRealTimes/fetchLastRecognitions",
  async (param?:string) => {
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
  async () => {
    const response = await fetchSystemStatus()
    return response
  }
)

export const fetchVehicleCountThunk = createAsyncThunk(
  "liveViewRealTimes/fetchVehicleCount",
  async () => {
    const response = await fetchVehicleCount()
    return response
  }
)

export const dowloadFileThunk = createAsyncThunk(
  "liveViewRealTimes/dowloadData",
  async (dowloadData: LastRecognitionData) => {
    const response = await dowloadFile(dowloadData)
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
        state.error = action.error.message || "Failed to fetch liveViewRealTime"
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
        state.error = action.error.message || "Failed to fetch vehicleCountData"
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
        state.error = action.error.message || "Failed to fetch systemStatusData"
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
