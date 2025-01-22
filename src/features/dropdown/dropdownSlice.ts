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
  fetchPositions,
  fetchRegions,
  fetchStreamEncodes,
  fetchVehicleBodyTypes,
  fetchVehicleBodyTypesTh,
  fetchVehicleColors,
  fetchVehicleMakes,
  fetchVehicleModels,
  fetchPersonTypes,
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
  CommonTitles,
  Regions,
  StreamEncodes,
  VehicleBodyTypes,
  VehicleBodyTypesTh,
  VehicleColors,
  VehicleMakes,
  VehicleModels,
  PersonTypes,
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
  regions: Regions | null;
  streamEncodes: StreamEncodes | null;
  vehicleBodyTypes: VehicleBodyTypes | null;
  vehicleBodyTypesTh: VehicleBodyTypesTh | null;
  vehicleColors: VehicleColors | null;
  vehicleMakes: VehicleMakes | null;
  vehicleModels: VehicleModels | null;
  personTypes: PersonTypes | null;
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
  regions: null,
  streamEncodes: null,
  vehicleBodyTypes: null,
  vehicleBodyTypesTh: null,
  vehicleColors: null,
  vehicleMakes: null,
  vehicleModels: null,
  personTypes: null,
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
  async (param?: Record<string, string>) => {
    const response = await fetchProvinces(param);
    return response;
  }
);

export const fetchRegistrationTypesThunk = createAsyncThunk(
  "registrationTypes/fetchRegistrationTypes",
  async (param?: Record<string, string>) => {
    const response = await fetchRegistrationTypes(param);
    return response;
  }
);

export const fetchPoliceDivisionsThunk = createAsyncThunk(
  "policeDivisions/fetchPoliceDivisions",
  async (param?: Record<string, string>) => {
    const response = await fetchPoliceDivisions(param);
    return response;
  }
);

export const fetchDistrictsThunk = createAsyncThunk(
  "districts/fetchDistricts",
  async (param?: Record<string, string>) => {
    const response = await fetchDistricts(param);
    return response;
  }
);

export const fetchSubDistrictsThunk = createAsyncThunk(
  "subDistricts/fetchSubDistricts",
  async (param?: Record<string, string>) => {
    const response = await fetchSubDistricts(param);
    return response;
  }
);

export const fetchCommonPrefixesThunk = createAsyncThunk(
  "namePrefixes/fetchCommonPrefixes",
  async (param?: Record<string, string>) => {
    const response = await fetchCommonPrefixes(param);
    return response;
  }
);

export const fetchOfficerPrefixesThunk = createAsyncThunk(
  "namePrefixes/fetchOfficerPrefixes",
  async (param?: Record<string, string>) => {
    const response = await fetchOfficerPrefixes(param);
    return response;
  }
);

export const fetchPositionThunk = createAsyncThunk(
  "position/fetchPositions",
  async (param?: Record<string, string>) => {
    const response = await fetchPositions(param);
    return response;
  }
);

export const fetchRegionsThunk = createAsyncThunk(
  "regions/fetchRegions",
  async (param?: Record<string, string>) => {
    const response = await fetchRegions(param);
    return response;
  }
);

export const fetchStreamEncodesThunk = createAsyncThunk(
  "streamEncodes/fetchStreamEncodes",
  async () => {
    const response = await fetchStreamEncodes();
    return response;
  }
);

export const fetchVehicleBodyTypesThunk = createAsyncThunk(
  "vehicleBodyTypes/fetchVehicleBodyTypes",
  async (param?: Record<string, string>) => {
    const response = await fetchVehicleBodyTypes(param);
    return response;
  }
);

export const fetchVehicleBodyTypesThThunk = createAsyncThunk(
  "vehicleBodyTypes/fetchVehicleBodyTypesTh",
  async (param?: Record<string, string>) => {
    const response = await fetchVehicleBodyTypesTh(param);
    return response;
  }
);

export const fetchVehicleColorsThunk = createAsyncThunk(
  "vehicleColors/fetchVehicleColors",
  async (param?: Record<string, string>) => {
    const response = await fetchVehicleColors(param);
    return response;
  }
);

export const fetchVehicleMakesThunk = createAsyncThunk(
  "vehicleMakes/fetchVehicleMakes",
  async (param?: Record<string, string>) => {
    const response = await fetchVehicleMakes(param);
    return response;
  }
);

export const fetchVehicleModelsThunk = createAsyncThunk(
  "vehicleModels/fetchVehicleModels",
  async (param?: Record<string, string>) => {
    const response = await fetchVehicleModels(param);
    return response;
  }
);

export const fetchPersonTypesThunk = createAsyncThunk(
  "personTypes/fetchPersonTypes",
  async (param?: Record<string, string>) => {
    const response = await fetchPersonTypes(param);
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

    builder
      .addCase(fetchRegionsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchRegionsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.regions = action.payload;
      })
      .addCase(fetchRegionsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch regions";
      });

    builder
      .addCase(fetchStreamEncodesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchStreamEncodesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.streamEncodes = action.payload;
      })
      .addCase(fetchStreamEncodesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch stream encodes";
      });

    builder
      .addCase(fetchVehicleBodyTypesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchVehicleBodyTypesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.vehicleBodyTypes = action.payload;
      })
      .addCase(fetchVehicleBodyTypesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch vehicle body types";
      });

    builder
      .addCase(fetchVehicleBodyTypesThThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchVehicleBodyTypesThThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.vehicleBodyTypesTh = action.payload;
      })
      .addCase(fetchVehicleBodyTypesThThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch vehicle body types only Thai";
      });

    builder
      .addCase(fetchVehicleColorsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchVehicleColorsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.vehicleColors = action.payload;
      })
      .addCase(fetchVehicleColorsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch vehicle colors";
      });

    builder
      .addCase(fetchVehicleMakesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchVehicleMakesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.vehicleMakes = action.payload;
      })
      .addCase(fetchVehicleMakesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch vehicle makes";
      });

    builder
      .addCase(fetchVehicleModelsThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchVehicleModelsThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.vehicleModels = action.payload;
      })
      .addCase(fetchVehicleModelsThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch vehicle models";
      });

    builder
      .addCase(fetchPersonTypesThunk.pending, (state) => {
        state.status = Status.LOADING;
        state.error = null;
      })
      .addCase(fetchPersonTypesThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.personTypes = action.payload;
      })
      .addCase(fetchPersonTypesThunk.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch personTypes";
      });
  },
});

export default dropdownSlice.reducer;
