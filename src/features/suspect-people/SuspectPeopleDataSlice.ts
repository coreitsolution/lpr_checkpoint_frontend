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
  status: Status;
  error: string | null;
}

// Initial state
const initialState: RegistrationDataState = {
  specialSuspectPeopleData: null,
  specialSuspectPeopleDetail: [],
  status: Status.IDLE,
  error: null,
};

// Async thunks
export const fetchSpecialSuspectPeopleDataThunk = createAsyncThunk(
  "suspectPeople/fetchSpecialSuspectPeopleData",
  async (param?: Record<string, string>) => {
    return await fetchSpecialSuspectPeopleData(param);
  }
);

export const postSpecialSuspectPeopleDataThunk = createAsyncThunk(
  "suspectPeople/postSpecialSuspectPeopleData",
  async (newSetting: NewSuspectPeople) => {
    return await postSpecialSuspectPeopleData(newSetting);
  }
);

export const deleteSpecialSuspectPeopleDataThunk = createAsyncThunk(
  "suspectPeople/deleteSpecialSuspectPeopleData",
  async (id: number) => {
    await deleteSpecialSuspectPeopleData(id);
    return id;
  }
);

export const putSpecialSuspectPeopleDataThunk = createAsyncThunk(
  "suspectPeople/putSpecialSuspectPeopleData",
  async (updated: SuspectPeopleDetail) => {
    return await putSpecialSuspectPeopleData(updated);
  }
);

// Slice
const suspectPeopleSlice = createSlice({
  name: "suspectPeople",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch special suspect people data
      .addCase(fetchSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.specialSuspectPeopleData = action.payload;
      })
      .addCase(fetchSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch special suspect people data.";
      })

      // Post special suspect person data
      .addCase(postSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(postSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.specialSuspectPeopleDetail.push(action.payload);
      })
      .addCase(postSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to post special suspect person data.";
      })

      // Delete special suspect person data
      .addCase(deleteSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(deleteSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.specialSuspectPeopleDetail = state.specialSuspectPeopleDetail.filter(
          (data) => data.id !== action.payload
        );
      })
      .addCase(deleteSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to delete special suspect person data.";
      })

      // Put special suspect person data
      .addCase(putSpecialSuspectPeopleDataThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(putSpecialSuspectPeopleDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        const index = state.specialSuspectPeopleDetail.findIndex((setting) => setting.id === action.payload.id);
        if (index !== -1) {
          state.specialSuspectPeopleDetail[index] = action.payload;
        }
      })
      .addCase(putSpecialSuspectPeopleDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to update special suspect person data.";
      })
  },
});

export default suspectPeopleSlice.reducer;
