import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchSpecialSuspectPeopleData, 
  deleteSpecialSuspectPeopleData, 
  putSpecialSuspectPeopleData,
  postSpecialSuspectPeopleData,
} from "./SuspectPeopleDataAPI";
import { SuspectPeopleRespondsDetail, SuspectPeopleData, NewSuspectPeople, SuspectPeopleDetail } from "./SuspectPeopleDataTypes";
import { Status } from "../../constants/statusEnum";

// State interface
interface RegistrationDataState {
  specialSuspectPeopleData: SuspectPeopleData | null;
  specialSuspectPeopleDetail: SuspectPeopleRespondsDetail[];
  specialSuspectPeopleStatus: Status;
  specialSuspectPeopleError: string | null;
}

// Initial state
const initialState: RegistrationDataState = {
  specialSuspectPeopleData: null,
  specialSuspectPeopleDetail: [],
  specialSuspectPeopleStatus: Status.IDLE,
  specialSuspectPeopleError: null,
};

// Async thunks
export const fetchSpecialSuspectPeopleDataThunk = createAsyncThunk(
  "suspectPeople/fetchSpecialSuspectPeopleData",
  async (param?: Record<string, string>) => {
    return await fetchSpecialSuspectPeopleData(param);
  }
);

export const postSpecialSuspectPeopleDataThunk = createAsyncThunk<SuspectPeopleRespondsDetail, NewSuspectPeople, { rejectValue: string }>(
  "suspectPeople/postSpecialSuspectPeopleData",
  async (newSetting: NewSuspectPeople, { rejectWithValue }) => {
    try {
      return await postSpecialSuspectPeopleData(newSetting);
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to post special suspect people data.");
    }
  }
);

export const deleteSpecialSuspectPeopleDataThunk = createAsyncThunk<number, number, { rejectValue: string }>(
  "suspectPeople/deleteSpecialSuspectPeopleData",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteSpecialSuspectPeopleData(id);
      return id;
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to delete special suspect people data.");
    }
  }
);

export const putSpecialSuspectPeopleDataThunk = createAsyncThunk<SuspectPeopleRespondsDetail, SuspectPeopleDetail, { rejectValue: string }>(
  "suspectPeople/putSpecialSuspectPeopleData",
  async (updated: SuspectPeopleDetail, { rejectWithValue }) => {
    try {
      return await putSpecialSuspectPeopleData(updated);
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to update special suspect people data.");
    }
  }
);

// Slice
const suspectPeopleSlice = createSlice({
  name: "suspectPeople",
  initialState,
  reducers: {
    clearSuspectPeopleData: (state) => {
      state.specialSuspectPeopleStatus = Status.IDLE;
      state.specialSuspectPeopleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch special suspect people data
      .addCase(fetchSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.specialSuspectPeopleStatus = Status.LOADING;
        state.specialSuspectPeopleError = null;
      })
      .addCase(fetchSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.specialSuspectPeopleStatus = Status.SUCCEEDED;
        state.specialSuspectPeopleData = action.payload;
      })
      .addCase(fetchSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.specialSuspectPeopleStatus = Status.FAILED;
        state.specialSuspectPeopleError = action.error.message || "Failed to fetch special suspect people data.";
      })

      // Post special suspect person data
      .addCase(postSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.specialSuspectPeopleStatus = Status.LOADING;
        state.specialSuspectPeopleError = null;
      })
      .addCase(postSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.specialSuspectPeopleStatus = Status.SUCCEEDED;
        state.specialSuspectPeopleDetail.push(action.payload);
      })
      .addCase(postSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.specialSuspectPeopleStatus = Status.FAILED;
        state.specialSuspectPeopleError = action.payload || "Failed to post special suspect person data.";
      })

      // Delete special suspect person data
      .addCase(deleteSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.specialSuspectPeopleStatus = Status.LOADING;
        state.specialSuspectPeopleError = null;
      })
      .addCase(deleteSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.specialSuspectPeopleStatus = Status.SUCCEEDED;
        state.specialSuspectPeopleDetail = state.specialSuspectPeopleDetail.filter(
          (data) => data.id !== action.payload
        );
      })
      .addCase(deleteSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.specialSuspectPeopleStatus = Status.FAILED;
        state.specialSuspectPeopleError = action.payload || "Failed to delete special suspect person data.";
      })

      // Put special suspect person data
      .addCase(putSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.specialSuspectPeopleStatus = Status.LOADING;
        state.specialSuspectPeopleError = null;
      })
      .addCase(putSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.specialSuspectPeopleStatus = Status.SUCCEEDED;
        const index = state.specialSuspectPeopleDetail.findIndex((setting) => setting.id === action.payload.id);
        if (index !== -1) {
          state.specialSuspectPeopleDetail[index] = action.payload;
        }
      })
      .addCase(putSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.specialSuspectPeopleStatus = Status.FAILED;
        state.specialSuspectPeopleError = action.payload || "Failed to update special suspect person data.";
      })
  },
});

export const { clearSuspectPeopleData } = suspectPeopleSlice.actions;
export default suspectPeopleSlice.reducer;
