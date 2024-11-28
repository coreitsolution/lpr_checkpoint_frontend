import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAgencies } from "./agenciesAPI";
import { Agencies } from "./agenciesTypes";
import { Status } from "../../constants/statusEnum"

interface AgenciesState {
  agencies: Agencies[];
  status: Status;
  error: string | null;
}

const initialState: AgenciesState = {
  agencies: [],
  status: Status.IDLE,
  error: null,
};

export const fetchAgenciesThunk = createAsyncThunk(
  "agencies/fetchAgencies",
  async () => {
    const response = await fetchAgencies();
    return response;
  }
);

const provinceSlice = createSlice({
  name: "agencies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgenciesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchAgenciesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.agencies = action.payload;
      })
      .addCase(fetchAgenciesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch agencies";
      });
  },
});

export default provinceSlice.reducer;
