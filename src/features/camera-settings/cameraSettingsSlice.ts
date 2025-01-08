import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCameraSettings,
  postCameraSetting,
  putCameraSetting,
  deleteCameraSetting,
  startStream,
  stopStream,
  restartStream,
} from "./cameraSettingsAPI";
import {
  CameraSettings,
  NewCameraDetailSettings,
  CameraDetailSettings,
  StreamDetail,
  StartStopStream,
} from "./cameraSettingsTypes";
import { Status } from "../../constants/statusEnum";

interface CameraSettingsState {
  cameraDetailSetting: CameraDetailSettings[];
  cameraSettings: CameraSettings | null;
  streamDetail: StreamDetail[];
  status: Status;
  error: string | null;
}

const initialState: CameraSettingsState = {
  cameraSettings: null,
  cameraDetailSetting: [],
  streamDetail: [],
  status: Status.IDLE,
  error: null,
};

export const fetchCameraSettingsThunk = createAsyncThunk(
  "cameraSettings/fetchCameraSettings",
  async (param?: Record<string, string>) => {
    const response = await fetchCameraSettings(param);
    return response;
  }
);

export const postCameraSettingThunk = createAsyncThunk(
  "cameraSettings/postCameraSetting",
  async (newSetting: NewCameraDetailSettings) => {
    const response = await postCameraSetting(newSetting);
    return response;
  }
);

export const putCameraSettingThunk = createAsyncThunk(
  "cameraSettings/putCameraSetting",
  async (updateSetting: CameraDetailSettings) => {
    const response = await putCameraSetting(updateSetting);
    return response;
  }
);

export const deleteCameraSettingThunk = createAsyncThunk(
  "cameraSettings/deleteCameraSetting",
  async (id: number) => {
    await deleteCameraSetting(id);
    return id;
  }
);

export const postStartStreamThunk = createAsyncThunk(
  "cameraSettings/startStream",
  async (uid: StartStopStream) => {
    const response = await startStream(uid);
    return response;
  }
);

export const postStopStreamThunk = createAsyncThunk(
  "cameraSettings/stopStream",
  async (uid: StartStopStream) => {
    const response = await stopStream(uid);
    return response;
  }
);

export const postRestartStreamThunk = createAsyncThunk(
  "cameraSettings/restartStream",
  async () => {
    const response = await restartStream();
    return response;
  }
);


const cameraSettingsSlice = createSlice({
  name: "cameraSetting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCameraSettingsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchCameraSettingsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.cameraSettings = action.payload;
      })
      .addCase(fetchCameraSettingsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch cameraSettings";
      })
      .addCase(postCameraSettingThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(postCameraSettingThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.cameraDetailSetting.push(action.payload);
      })
      .addCase(postCameraSettingThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to post camera setting";
      })
      .addCase(putCameraSettingThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(putCameraSettingThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        const index = state.cameraDetailSetting.findIndex(
          (setting) => setting.id === action.payload.id
        );
        if (index !== -1) {
          state.cameraDetailSetting[index] = action.payload;
        }
      })
      .addCase(putCameraSettingThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to put camera setting";
      })

      .addCase(deleteCameraSettingThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(deleteCameraSettingThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        if (state.cameraDetailSetting) {
          state.cameraDetailSetting = state.cameraDetailSetting.filter(
            (setting) => setting.id !== action.payload
          );
        }
      })
      .addCase(deleteCameraSettingThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to delete camera setting";
      })

      // .addCase(postStartStreamThunk.pending, (state) => {
      //   state.status = Status.LOADING;
      //   state.error = null;
      // })
      // .addCase(postStartStreamThunk.fulfilled, (state, action) => {
      //   state.status = Status.SUCCEEDED;
      //   state.streamDetail = action.payload;
      // })
      // .addCase(postStartStreamThunk.rejected, (state, action) => {
      //   state.status = Status.FAILED;
      //   state.error = action.error.message || "Failed to post camera setting";
      // })
      // Stream
      .addCase(postStartStreamThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(postStartStreamThunk.fulfilled, (state) => {
        state.status = Status.SUCCEEDED;
      })
      .addCase(postStartStreamThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to post start stream";
      })

      .addCase(postStopStreamThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(postStopStreamThunk.fulfilled, (state) => {
        state.status = Status.SUCCEEDED;
      })
      .addCase(postStopStreamThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to post stop stream";
      })

      .addCase(postRestartStreamThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(postRestartStreamThunk.fulfilled, (state) => {
        state.status = Status.SUCCEEDED;
      })
      .addCase(postRestartStreamThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to post restart stream";
      })
  },
});

export default cameraSettingsSlice.reducer;
