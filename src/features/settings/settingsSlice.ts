import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSettings,
  putSettings,
} from "./settingsAPI";
import {
  SettingData,
  SettingDetail,
} from "./settingsTypes";
import { Status } from "../../constants/statusEnum";

interface SettingsState {
  settingData: SettingData | null;
  settingDataDetail: SettingDetail | null;
  status: Status;
  error: string | null;
}

const initialState: SettingsState = {
  settingData: null,
  settingDataDetail: null,
  status: Status.IDLE,
  error: null,
};

export const fetchSettingsThunk = createAsyncThunk(
  "settings/fetchSettings",
  async (param?:Record<string, string>) => {
    const response = await fetchSettings(param);
    return response;
  }
);

export const putSettingsThunk = createAsyncThunk(
  "settings/putSettings",
  async (updateSetting: SettingDetail) => {
    const response = await putSettings(updateSetting);
    return response;
  }
);

const settingsSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Setting
      .addCase(fetchSettingsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchSettingsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.settingData = action.payload;
      })
      .addCase(fetchSettingsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch setting data";
      })
      .addCase(putSettingsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(putSettingsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.settingDataDetail = action.payload;
      })
      .addCase(putSettingsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to put camera setting";
      })
  },
});

export default settingsSlice.reducer;
