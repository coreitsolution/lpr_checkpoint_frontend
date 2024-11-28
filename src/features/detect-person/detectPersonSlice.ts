import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "../../constants/statusEnum";
import { DetectPerson } from "./detectPersonTypes";
import { fetchPerson } from "./detectPersonAPI";

interface DetectPersonState {
  persons: DetectPerson[];
  status: Status;
  error: string | null;
}

const initialState: DetectPersonState = {
  persons: [],
  status: Status.IDLE,
  error: null,
};

export const fetchPersons = createAsyncThunk(
  "detectPerson/fetchPerson",
  async () => {
    const response = await fetchPerson();
    return response;
  }
);

const detectPersonsSlice = createSlice({
  name: "detectPerson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersons.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchPersons.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.persons = action.payload;
      })
      .addCase(fetchPersons.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default detectPersonsSlice.reducer;
