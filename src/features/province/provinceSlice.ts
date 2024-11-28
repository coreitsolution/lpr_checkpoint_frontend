import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProvinces } from "./provinceAPI";
import { Province } from "./provinceTypes";
import { Status } from "../../constants/statusEnum"

interface ProvinceState {
  provinces: Province[];
  status: Status;
  error: string | null;
}

const initialState: ProvinceState = {
  provinces: [],
  status: Status.IDLE,
  error: null,
};

export const fetchProvincesThunk = createAsyncThunk(
  "provinces/fetchProvinces",
  async () => {
    const response = await fetchProvinces();
    return response;
  }
);

const provinceSlice = createSlice({
  name: "provinces",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvincesThunk.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchProvincesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.provinces = action.payload;
      })
      .addCase(fetchProvincesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch provinces";
      });
  },
});

export default provinceSlice.reducer;
