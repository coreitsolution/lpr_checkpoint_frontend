import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Status } from "../../constants/statusEnum";
import { 
  fetchRegistrationTypes,
  fetchDataStatus,
  fetchProvinces,
  fetchPoliceDivisions,
  fetchDistricts,
  fetchSubDistricts,
  fetchCommonPrefixes,
  fetchOfficerPrefixes,
  fetchPositions
} from "./dropdownAPI";
import { 
  Provinces,
  RegistrationTypes,
  DataStatusData,
  PoliceDivisions,
  Districts,
  SubDistricts,
  OfficerPositions,
  OfficerTitles,
  CommonTitles
} from "./dropdownTypes";

interface DropdownState {
  provinces: Provinces | null;
  dataStatus: DataStatusData[];
  registrationTypes: RegistrationTypes | null;
  policeDivisions: PoliceDivisions | null;
  districts: Districts | null;
  subDistricts: SubDistricts | null;
  commonPrefixes: CommonTitles | null;
  officerPrefixes: OfficerTitles | null;
  positions: OfficerPositions | null;
  status: Status;
  error: string | null;
}

const initialState: DropdownState = {
  provinces: null,
  dataStatus: [],
  registrationTypes: null,
  policeDivisions:null,
  districts: null,
  subDistricts: null,
  commonPrefixes: null,
  officerPrefixes: null,
  positions: null,
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
  async (param?: string) => {
    const response = await fetchProvinces(param);
    return response;
  }
);

export const fetchRegistrationTypesThunk = createAsyncThunk(
  "registrationTypes/fetchRegistrationTypes",
  async (param?: string) => {
    const response = await fetchRegistrationTypes(param);
    return response;
  }
);

export const fetchPoliceDivisionsThunk = createAsyncThunk(
  "policeDivisions/fetchPoliceDivisions",
  async (param?: string) => {
    const response = await fetchPoliceDivisions(param);
    return response;
  }
);

export const fetchDistrictsThunk = createAsyncThunk(
  "districts/fetchDistricts",
  async (param?: string) => {
    const response = await fetchDistricts(param);
    return response;
  }
);

export const fetchSubDistrictsThunk = createAsyncThunk(
  "subDistricts/fetchSubDistricts",
  async (param?: string) => {
    const response = await fetchSubDistricts(param);
    return response;
  }
);

export const fetchCommonPrefixesThunk = createAsyncThunk(
  "namePrefixes/fetchCommonPrefixes",
  async (param?: string) => {
    const response = await fetchCommonPrefixes(param);
    return response;
  }
);

export const fetchOfficerPrefixesThunk = createAsyncThunk(
  "namePrefixes/fetchOfficerPrefixes",
  async (param?: string) => {
    const response = await fetchOfficerPrefixes(param);
    return response;
  }
);

export const fetchPositionThunk = createAsyncThunk(
  "position/fetchPositions",
  async (param?: string) => {
    const response = await fetchPositions(param);
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
      .addCase(fetchCommonPrefixesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchCommonPrefixesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.commonPrefixes = action.payload;
      })
      .addCase(fetchCommonPrefixesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch commonPrefixes";
      });

    builder
      .addCase(fetchOfficerPrefixesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchOfficerPrefixesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.officerPrefixes = action.payload;
      })
      .addCase(fetchOfficerPrefixesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch officerPrefixes";
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
