import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSettings,
  putSettings,
  fetchSettingsShort,
} from "./settingsAPI";
import {
  SettingData,
  SettingDetail,
  SettingDataShort
} from "./settingsTypes";
import { Status } from "../../constants/statusEnum";

interface SettingsState {
  settingData: { live_view_count: SettingData | null, checkpoint_name: SettingData | null };
  settingDataDetail: SettingDetail | null;
  settingDataShort: SettingDataShort | null;
  settingsStatus: Status;
  settingsError: string | null;
}

const initialState: SettingsState = {
  settingData: { live_view_count: null, checkpoint_name: null },
  settingDataShort: null,
  settingDataDetail: null,
  settingsStatus: Status.IDLE,
  settingsError: null,
};

export const fetchSettingsThunk = createAsyncThunk(
  "settings/fetchSettings",
  async (param?:Record<string, string>) => {
    const response = await fetchSettings(param);
    return { data: response, key: param?.filter};
  }
);

export const fetchSettingsShortThunk = createAsyncThunk(
  "settings/fetchSettingsShort",
  async (param?:Record<string, string>) => {
    const response = await fetchSettingsShort(param);
    return response;
  }
);

export const putSettingsThunk = createAsyncThunk<SettingDetail, SettingDetail, { rejectValue: string }>(
  "settings/putSettings",
  async (updateSetting: SettingDetail, { rejectWithValue }) => {
    try {
      const response = await putSettings(updateSetting);
      return response;
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to update setting data.");
    }
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
        state.settingsStatus = Status.LOADING;
        state.settingsError = null;
      })
      .addCase(fetchSettingsThunk.fulfilled, (state, action) => {
        state.settingsStatus = Status.SUCCEEDED;
        if (action.payload.key === "key:live_view_count") {
          state.settingData.live_view_count = action.payload.data
        } 
        else if (action.payload.key === "key:checkpoint_name") {
          state.settingData.checkpoint_name = action.payload.data
        }
      })
      .addCase(fetchSettingsThunk.rejected, (state, action) => {
        state.settingsStatus = Status.FAILED;
        state.settingsError = action.error.message || "Failed to fetch setting data";
      })
      .addCase(putSettingsThunk.pending, (state) => {
        state.settingsStatus = Status.LOADING;
        state.settingsError = null;
      })
      .addCase(putSettingsThunk.fulfilled, (state, action) => {
        state.settingsStatus = Status.SUCCEEDED;
        state.settingDataDetail = action.payload;
      })
      .addCase(putSettingsThunk.rejected, (state, action) => {
        state.settingsStatus = Status.FAILED;
        state.settingsError = action.payload || "Failed to put camera setting";
      })

      .addCase(fetchSettingsShortThunk.pending, (state) => {
        state.settingsStatus = Status.LOADING;
        state.settingsError = null;
      })
      .addCase(fetchSettingsShortThunk.fulfilled, (state, action) => {
        state.settingsStatus = Status.SUCCEEDED;
        state.settingDataShort = action.payload;
      })
      .addCase(fetchSettingsShortThunk.rejected, (state, action) => {
        state.settingsStatus = Status.FAILED;
        state.settingsError = action.error.message || "Failed to fetch setting short data";
      })
  },
});

export default settingsSlice.reducer;
