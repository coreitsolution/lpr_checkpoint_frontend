import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchCameraSettings, postCameraSetting, putCameraSetting, deleteCameraSetting, putCameraDetailSettings, postStartStream } from "./cameraSettingsAPI"
import { CameraSettings, NewCameraSettings, CameraDetailSetting, ReqStream, StreamDetail } from "./cameraSettingsTypes"
import { Status } from "../../constants/statusEnum"

interface CameraSettingsState {
  cameraSetting: CameraDetailSetting | null
  streamDetail: StreamDetail[] | null
  status: Status
  error: string | null
}

const initialState: CameraSettingsState = {
  cameraSetting: null,
  streamDetail: null,
  status: Status.IDLE,
  error: null,
}

export const postStartStreamThunk = createAsyncThunk(
  "cameraSettings/postStartStream",
  async (reqStream: ReqStream[]) => {
    const response = await postStartStream(reqStream)
    return response as StreamDetail[];
  }
)

export const fetchCameraSettingsThunk = createAsyncThunk(
  "cameraSettings/fetchCameraSettings",
  async () => {
    const response = await fetchCameraSettings()
    return response
  }
)

export const postCameraSettingThunk = createAsyncThunk(
  "cameraSettings/postCameraSetting",
  async (newSetting: NewCameraSettings) => {
    const response = await postCameraSetting(newSetting)
    return response
  }
)

export const putCameraSettingThunk = createAsyncThunk(
  "cameraSettings/putCameraSetting",
  async (updateSetting: CameraSettings) => {
    const response = await putCameraSetting(updateSetting)
    return response
  }
)

export const putCameraDetailSettingsThunk = createAsyncThunk(
  "cameraSettings/putCameraDetailSettings",
  async (updateSetting: CameraDetailSetting) => {
    const response = await putCameraDetailSettings(updateSetting)
    return response
  }
)

export const deleteCameraSettingThunk = createAsyncThunk(
  "cameraSettings/deleteCameraSetting",
  async (id: number) => {
    await deleteCameraSetting(id)
    return id // Return the ID to remove the deleted item from the state
  }
)

const cameraSettingsSlice = createSlice({
  name: "cameraSetting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCameraSettingsThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(fetchCameraSettingsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.cameraSetting = action.payload
      })
      .addCase(fetchCameraSettingsThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch cameraSettings"
      })
      .addCase(postCameraSettingThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(postCameraSettingThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.cameraSetting?.cameraSettings.push(action.payload)
      })
      .addCase(postCameraSettingThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to post camera setting"
      })
      .addCase(putCameraSettingThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(putCameraSettingThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        if (state.cameraSetting) {
          const index = state.cameraSetting.cameraSettings.findIndex(
            (setting) => setting.id === action.payload.id
          )
          if (index !== -1) {
            state.cameraSetting.cameraSettings[index] = action.payload
          }
        }
      })
      .addCase(putCameraSettingThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to put camera setting"
      })

      .addCase(putCameraDetailSettingsThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(putCameraDetailSettingsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        if (state.cameraSetting) {
          state.cameraSetting = action.payload // Directly replace the cameraSetting object
        }
      })
      .addCase(putCameraDetailSettingsThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to put camera setting"
      })

      .addCase(deleteCameraSettingThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(deleteCameraSettingThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        if (state.cameraSetting) {
          state.cameraSetting.cameraSettings = state.cameraSetting.cameraSettings.filter(
            (setting) => setting.id !== action.payload
          )
        }
      })
      .addCase(deleteCameraSettingThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to delete camera setting"
      })

      .addCase(postStartStreamThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(postStartStreamThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.streamDetail = (action.payload)
      })
      .addCase(postStartStreamThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to post camera setting"
      })
  },
})

export default cameraSettingsSlice.reducer
