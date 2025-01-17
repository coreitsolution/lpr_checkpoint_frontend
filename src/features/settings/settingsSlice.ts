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
  settingData: { live_view_count: SettingData | null, checkpoint_name: SettingData | null };
  settingDataDetail: SettingDetail | null;
  status: Status;
  error: string | null;
}

const initialState: SettingsState = {
  settingData: { live_view_count: null, checkpoint_name: null },
  settingDataDetail: null,
  status: Status.IDLE,
  error: null,
};

export const fetchSettingsThunk = createAsyncThunk(
  "settings/fetchSettings",
  async (param?:Record<string, string>) => {
    const response = await fetchSettings(param);
    return { data: response, key: param?.filter};
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
        if (action.payload.key === "key:live_view_count") {
          state.settingData.live_view_count = action.payload.data
        } 
        else if (action.payload.key === "key:checkpoint_name") {
          state.settingData.checkpoint_name = action.payload.data
        }
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
