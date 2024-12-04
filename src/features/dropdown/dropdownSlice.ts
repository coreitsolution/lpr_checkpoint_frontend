import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Status } from "../../constants/statusEnum";
import { 
  fetchAgencies, 
  fetchRegistrationTypes,
  fetchDataStatus,
  fetchProvinces,
  fetchPoliceDivisions,
  fetchDistricts,
  fetchSubDistricts,
  fetchNamePrefixes,
  fetchPositions
} from "./dropdownAPI";
import { 
  Province,
  Agencies,
  RegistrationTypesData,
  DataStatusData,
  PoliceDivisions,
  Districts,
  SubDistricts,
  NamePrefixes,
  Positions
} from "./dropdownTypes";

interface DropdownState {
  provinces: Province[];
  agencies: Agencies[];
  dataStatus: DataStatusData[];
  registrationTypes: RegistrationTypesData[];
  policeDivisions: PoliceDivisions[];
  districts: Districts[];
  subDistricts: SubDistricts[];
  namePrefixes: NamePrefixes[];
  positions: Positions[];
  status: Status;
  error: string | null;
}

const initialState: DropdownState = {
  provinces: [],
  agencies: [],
  dataStatus: [],
  registrationTypes: [],
  policeDivisions:[],
  districts: [],
  subDistricts: [],
  namePrefixes: [],
  positions: [],
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

export const fetchPoliceDivisionsThunk = createAsyncThunk(
  "policeDivisions/fetchPoliceDivisions",
  async () => {
    const response = await fetchPoliceDivisions();
    return response;
  }
);

export const fetchDistrictsThunk = createAsyncThunk(
  "districts/fetchDistricts",
  async () => {
    const response = await fetchDistricts();
    return response;
  }
);

export const fetchSubDistrictsThunk = createAsyncThunk(
  "subDistricts/fetchSubDistricts",
  async (districtId: number) => {
    const response = await fetchSubDistricts(districtId);
    return response;
  }
);

export const fetchNamePrefixesThunk = createAsyncThunk(
  "namePrefixes/fetchNamePrefixes",
  async () => {
    const response = await fetchNamePrefixes();
    return response;
  }
);

export const fetchPositionThunk = createAsyncThunk(
  "position/fetchPositions",
  async () => {
    const response = await fetchPositions();
    return response;
  }
);

const dropdownSlice = createSlice({
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

    builder
      .addCase(fetchPoliceDivisionsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchPoliceDivisionsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.policeDivisions = action.payload;
      })
      .addCase(fetchPoliceDivisionsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch policeDivisions";
      });

    builder
      .addCase(fetchDistrictsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchDistrictsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.districts = action.payload;
      })
      .addCase(fetchDistrictsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch districts";
      });
    
    builder
      .addCase(fetchSubDistrictsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchSubDistrictsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.subDistricts = action.payload;
      })
      .addCase(fetchSubDistrictsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch subDistricts";
      });

    builder
      .addCase(fetchNamePrefixesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchNamePrefixesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.namePrefixes = action.payload;
      })
      .addCase(fetchNamePrefixesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch namePrefixes";
      });

    builder
      .addCase(fetchPositionThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchPositionThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.positions = action.payload;
      })
      .addCase(fetchPositionThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch positions";
      });
  },
});

export default dropdownSlice.reducer;
