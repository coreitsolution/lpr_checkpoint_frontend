import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchSpecialPlatesData, 
  deleteSpecialPlatesData, 
  putSpecialPlateData,
  postSpecialRegistrationData,
} from "./RegistrationDataAPI";
import { SpecialPlatesRespondsDetail, SpecialPlatesData, NewSpecialPlates, SpecialPlatesDetail } from "./RegistrationDataTypes";
import { Status } from "../../constants/statusEnum";

// State interface
interface RegistrationDataState {
  specialPlatesData: SpecialPlatesData | null;
  specialPlatesDetail: SpecialPlatesRespondsDetail[];
  registrationDataStatus: Status;
  registrationDataError: string | null;
}

// Initial state
const initialState: RegistrationDataState = {
  specialPlatesData: null,
  specialPlatesDetail: [],
  registrationDataStatus: Status.IDLE,
  registrationDataError: null,
};

// Async thunks
export const fetchSpecialPlateDataThunk = createAsyncThunk(
  "registrationData/fetchSpecialPlateData",
  async (param?: Record<string, string>) => {
    return await fetchSpecialPlatesData(param);
  }
);

export const postSpecialRegistrationDataThunk = createAsyncThunk<SpecialPlatesRespondsDetail, NewSpecialPlates, { rejectValue: string }>(
  "registrationData/postSpecialRegistrationData",
  async (newSetting: NewSpecialPlates, { rejectWithValue }) => {
    try {
      return await postSpecialRegistrationData(newSetting);
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to post special registration data.");
    }
  }
);

export const deleteSpecialPlateDataThunk = createAsyncThunk<number, number, { rejectValue: string }>(
  "registrationData/deleteSpecialRegistrationData",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteSpecialPlatesData(id);
      return id;
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to delete special registration data.");
    }
  }
);

export const putSpecialPlateDataThunk = createAsyncThunk<SpecialPlatesRespondsDetail, SpecialPlatesDetail, { rejectValue: string }>(
  "registrationData/putSpecialRegistrationData",
  async (updated: SpecialPlatesDetail, { rejectWithValue }) => {
    try {
      return await putSpecialPlateData(updated);
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to put special registration data.");
    }
  }
);

// Slice
const registrationDataSlice = createSlice({
  name: "registrationData",
  initialState,
  reducers: {
    clearRegistrationData: (state) => {
      state.registrationDataStatus = Status.IDLE;
      state.registrationDataError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch special plates data
      .addCase(fetchSpecialPlateDataThunk.pending, (state) => {
        state.registrationDataStatus = Status.LOADING;
        state.registrationDataError = null;
      })
      .addCase(fetchSpecialPlateDataThunk.fulfilled, (state, action) => {
        state.registrationDataStatus = Status.SUCCEEDED;
        state.specialPlatesData = action.payload;
      })
      .addCase(fetchSpecialPlateDataThunk.rejected, (state, action) => {
        state.registrationDataStatus = Status.FAILED;
        state.registrationDataError = action.error.message || "Failed to fetch special plates data.";
      })

      // Post special registration data
      .addCase(postSpecialRegistrationDataThunk.pending, (state) => {
        state.registrationDataStatus = Status.LOADING;
        state.registrationDataError = null;
      })
      .addCase(postSpecialRegistrationDataThunk.fulfilled, (state, action) => {
        state.registrationDataStatus = Status.SUCCEEDED;
        state.specialPlatesDetail.push(action.payload);
      })
      .addCase(postSpecialRegistrationDataThunk.rejected, (state, action) => {
        state.registrationDataStatus = Status.FAILED;
        state.registrationDataError = action.payload || "Failed to post special registration data.";
      })

      // Delete special registration data
      .addCase(deleteSpecialPlateDataThunk.pending, (state) => {
        state.registrationDataStatus = Status.LOADING;
        state.registrationDataError = null;
      })
      .addCase(deleteSpecialPlateDataThunk.fulfilled, (state, action) => {
        state.registrationDataStatus = Status.SUCCEEDED;
        state.specialPlatesDetail = state.specialPlatesDetail.filter(
          (data) => data.id !== action.payload
        );
      })
      .addCase(deleteSpecialPlateDataThunk.rejected, (state, action) => {
        state.registrationDataStatus = Status.FAILED;
        state.registrationDataError = action.payload || "Failed to delete special registration data.";
      })

      // Put special registration data
      .addCase(putSpecialPlateDataThunk.pending, (state) => {
        state.registrationDataStatus = Status.LOADING;
        state.registrationDataError = null;
      })
      .addCase(putSpecialPlateDataThunk.fulfilled, (state, action) => {
        state.registrationDataStatus = Status.SUCCEEDED;
        const index = state.specialPlatesDetail.findIndex((setting) => setting.id === action.payload.id);
        if (index !== -1) {
          state.specialPlatesDetail[index] = action.payload;
        }
      })
      .addCase(putSpecialPlateDataThunk.rejected, (state, action) => {
        state.registrationDataStatus = Status.FAILED;
        state.registrationDataError = action.payload || "Failed to update special registration data.";
      })
  },
});

export const { clearRegistrationData } = registrationDataSlice.actions;
export default registrationDataSlice.reducer;
