import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRegistrationTypes } from "./registrationTypesAPI";
import { RegistrationTypesData } from "./registrationTypesTypes";
import { Status } from "../../constants/statusEnum"

interface RegistrationTypesState {
  registrationTypes: RegistrationTypesData[];
  status: Status;
  error: string | null;
}

const initialState: RegistrationTypesState = {
  registrationTypes: [],
  status: Status.IDLE,
  error: null,
};

export const fetchRegistrationTypesThunk = createAsyncThunk(
  "registrationTypes/fetchRegistrationTypes",
  async () => {
    const response = await fetchRegistrationTypes();
    return response;
  }
);

const provinceSlice = createSlice({
  name: "registrationTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrationTypesThunk.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchRegistrationTypesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.registrationTypes = action.payload;
      })
      .addCase(fetchRegistrationTypesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch registrationTypes";
      });
  },
});

export default provinceSlice.reducer;
