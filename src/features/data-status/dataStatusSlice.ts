import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDataStatus } from "./dataStatusAPI";
import { DataStatusData } from "./dataStatusTypes";
import { Status } from "../../constants/statusEnum"

interface DataStatusState {
  dataStatus: DataStatusData[];
  status: Status;
  error: string | null;
}

const initialState: DataStatusState = {
  dataStatus: [],
  status: Status.IDLE,
  error: null,
};

export const fetchDataStatusThunk = createAsyncThunk(
  "dataStatus/fetchDataStatus",
  async () => {
    const response = await fetchDataStatus();
    return response;
  }
);

const provinceSlice = createSlice({
  name: "dataStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataStatusThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchDataStatusThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.dataStatus = action.payload;
      })
      .addCase(fetchDataStatusThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch dataStatus";
      });
  },
});

export default provinceSlice.reducer;
