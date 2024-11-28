import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCameraSettings } from "./cameraSettingsAPI";
import { CameraSettings } from "./cameraSettingsTypes";
import { Status } from "../../constants/statusEnum"

interface CameraSettingsState {
  cameraSetting: CameraSettings[];
  status: Status;
  error: string | null;
}

const initialState: CameraSettingsState = {
  cameraSetting: [],
  status: Status.IDLE,
  error: null,
};

export const fetchCameraSettingsThunk = createAsyncThunk(
  "cameraSettings/fetchCameraSettings",
  async () => {
    const response = await fetchCameraSettings();
    return response;
  }
);

const provinceSlice = createSlice({
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
        state.cameraSetting = action.payload;
      })
      .addCase(fetchCameraSettingsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch cameraSettings";
      });
  },
});

export default provinceSlice.reducer;
