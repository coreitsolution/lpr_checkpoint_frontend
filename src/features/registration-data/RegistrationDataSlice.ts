import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchSpecialPlatesData, 
  deleteSpecialPlatesData, 
  putSpecialPlateData,
  postSpecialRegistrationData,
} from "./RegistrationDataAPI";
import { SpecialPlatesDetail, SpecialPlatesData, NewSpecialPlates } from "./RegistrationDataTypes";
import { Status } from "../../constants/statusEnum";

// State interface
interface RegistrationDataState {
  specialPlatesData: SpecialPlatesData | null;
  specialPlatesDetail: SpecialPlatesDetail[];
  status: Status;
  error: string | null;
}

// Initial state
const initialState: RegistrationDataState = {
  specialPlatesData: null,
  specialPlatesDetail: [],
  status: Status.IDLE,
  error: null,
};

// Async thunks
export const fetchSpecialPlateDataThunk = createAsyncThunk(
  "registrationData/fetchSpecialPlateData",
  async (param?: string) => {
    return await fetchSpecialPlatesData(param);
  }
);

export const postSpecialRegistrationDataThunk = createAsyncThunk(
  "registrationData/postSpecialRegistrationData",
  async (newSetting: NewSpecialPlates) => {
    return await postSpecialRegistrationData(newSetting);
  }
);

export const deleteSpecialPlateDataThunk = createAsyncThunk(
  "registrationData/deleteSpecialRegistrationData",
  async (id: number) => {
    await deleteSpecialPlatesData(id);
    return id;
  }
);

export const putSpecialPlateDataThunk = createAsyncThunk(
  "registrationData/putSpecialRegistrationData",
  async (updated: SpecialPlatesDetail) => {
    return await putSpecialPlateData(updated);
  }
);

// Slice
const registrationDataSlice = createSlice({
  name: "registrationData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch special plates data
      .addCase(fetchSpecialPlateDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchSpecialPlateDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.specialPlatesData = action.payload;
      })
      .addCase(fetchSpecialPlateDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch special plates data.";
      })

      // Post special registration data
      .addCase(postSpecialRegistrationDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(postSpecialRegistrationDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.specialPlatesDetail.push(action.payload);
      })
      .addCase(postSpecialRegistrationDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to post special registration data.";
      })

      // Delete special registration data
      .addCase(deleteSpecialPlateDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(deleteSpecialPlateDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.specialPlatesDetail = state.specialPlatesDetail.filter(
          (data) => data.id !== action.payload
        );
      })
      .addCase(deleteSpecialPlateDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to delete special registration data.";
      })

      // Put special registration data
      .addCase(putSpecialPlateDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(putSpecialPlateDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        const index = state.specialPlatesDetail.findIndex((setting) => setting.id === action.payload.id);
        if (index !== -1) {
          state.specialPlatesDetail[index] = action.payload;
        }
      })
      .addCase(putSpecialPlateDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to update special registration data.";
      })
  },
});

export default registrationDataSlice.reducer;
