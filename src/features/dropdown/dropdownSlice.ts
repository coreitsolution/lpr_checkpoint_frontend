import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Status } from "../../constants/statusEnum";
import { 
  fetchAgencies, 
  fetchRegistrationTypes,
  fetchDataStatus,
  fetchProvinces,
} from "./dropdownAPI";
import { 
  Province,
  Agencies,
  RegistrationTypesData,
  DataStatusData
} from "./dropdownTypes";

interface DropdownState {
  provinces: Province[];
  agencies: Agencies[];
  dataStatus: DataStatusData[];
  registrationTypes: RegistrationTypesData[];
  status: Status;
  error: string | null;
}

const initialState: DropdownState = {
  provinces: [],
  agencies: [],
  dataStatus: [],
  registrationTypes: [],
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


export const fetchProvincesThunk = createAsyncThunk(
  "provinces/fetchProvinces",
  async () => {
    const response = await fetchProvinces();
    return response;
  }
);

export const fetchAgenciesThunk = createAsyncThunk(
  "agencies/fetchAgencies",
  async () => {
    const response = await fetchAgencies();
    return response;
  }
);

export const fetchRegistrationTypesThunk = createAsyncThunk(
  "registrationTypes/fetchRegistrationTypes",
  async () => {
    const response = await fetchRegistrationTypes();
    return response;
  }
);


const provinceSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvincesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchProvincesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.provinces = action.payload;
      })
      .addCase(fetchProvincesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch provinces";
      });

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

    builder
      .addCase(fetchRegistrationTypesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
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
