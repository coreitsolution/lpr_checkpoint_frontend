import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCheckpoints,
  postCheckpointSetting,
} from "./checkpointSettingsAPI";
import {
  CheckpointResponse,
  NewCheckpointSetting,
} from "./checkpointSettingsTypes";
import { Status } from "../../constants/statusEnum";

interface CheckpointSettingsState {
  checkpointSetting: CheckpointResponse | null;
  checkpointStatus: Status;
  checkpointError: string | null;
}

const initialState: CheckpointSettingsState = {
  checkpointSetting: null,
  checkpointStatus: Status.IDLE,
  checkpointError: null,
};

export const fetchCheckpointSettingsThunk = createAsyncThunk(
  "checkpointSettings/fetchCheckpointSettings",
  async (param?: Record<string, string>) => {
    const response = await fetchCheckpoints(param);
    return response;
  }
);

export const postCheckpointSettingThunk = createAsyncThunk<CheckpointResponse, NewCheckpointSetting, { rejectValue: string }>(
  "checkpointSettings/postCheckpointSetting",
  async (newSetting: NewCheckpointSetting, { rejectWithValue }) => {
    try {
      const response = await postCheckpointSetting(newSetting);
      return response;
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to post camera setting");
    }
  }
);

const checkpointSettingsSlice = createSlice({
  name: "checkpointSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckpointSettingsThunk.pending, (state) => {
        state.checkpointStatus = Status.LOADING;
        state.checkpointError = null;
      })
      .addCase(fetchCheckpointSettingsThunk.fulfilled, (state, action) => {
        state.checkpointStatus = Status.SUCCEEDED;
        state.checkpointSetting = action.payload;
      })
      .addCase(fetchCheckpointSettingsThunk.rejected, (state, action) => {
        state.checkpointStatus = Status.FAILED;
        state.checkpointError = action.error.message || "Failed to fetch checkpoint settings";
      })

      .addCase(postCheckpointSettingThunk.pending, (state) => {
        state.checkpointStatus = Status.LOADING;
        state.checkpointError = null;
      })
      .addCase(postCheckpointSettingThunk.fulfilled, (state, action) => {
        state.checkpointStatus = Status.SUCCEEDED;
        state.checkpointSetting = action.payload;
      })
      .addCase(postCheckpointSettingThunk.rejected, (state, action) => {
        state.checkpointStatus = Status.FAILED;
        state.checkpointError = action.error.message || "Failed to post checkpoint settings";
      })
  },
})

export default checkpointSettingsSlice.reducer;