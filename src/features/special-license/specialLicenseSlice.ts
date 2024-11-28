import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "../../constants/statusEnum";
import { SpecialLicense } from "./specialLicenseTypes";
import { fetchLicense } from "./specialLicenseAPI";

interface SpecialLicenseState {
  licenses: SpecialLicense[];
  status: Status;
  error: string | null;
}

const initialState: SpecialLicenseState = {
  licenses: [],
  status: Status.IDLE,
  error: null,
};

export const fetchSpecialLicense = createAsyncThunk(
  "license/fetchLicenses",
  async () => {
    const response = await fetchLicense();
    return response;
  }
);

const SpecialLicenseSlice = createSlice({
  name: "license",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialLicense.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchSpecialLicense.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.licenses = action.payload;
      })
      .addCase(fetchSpecialLicense.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default SpecialLicenseSlice.reducer;