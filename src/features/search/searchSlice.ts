import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVehicleAPI } from "./searchAPI";
import { Status } from "../../constants/statusEnum"
import { SearchResult } from "./searchTypes";

interface VehicleState {
  vehicles: SearchResult[];
  status: Status;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  status: Status.IDLE,
  error: null,
};

export const fetchVehicles = createAsyncThunk(
  "vehicle/fetchVehicles",
  async () => {
    const response = await fetchVehicleAPI();
    return response;
  }
);

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default vehicleSlice.reducer;
