import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Status } from "../../constants/statusEnum";
import { 
  fetchRegistrationTypes,
  fetchDataStatus,
  fetchProvinces,
  fetchPoliceDivisions,
  fetchDistricts,
  fetchSubDistricts,
  fetchPersonTitles,
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
  PersonTitles,
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
  personTitles: PersonTitles | null;
  positions: OfficerPositions | null;
  regions: Regions | null;
  streamEncodes: StreamEncodes | null;
  vehicleBodyTypes: VehicleBodyTypes | null;
  vehicleBodyTypesTh: VehicleBodyTypesTh | null;
  vehicleColors: VehicleColors | null;
  vehicleMakes: VehicleMakes | null;
  vehicleModels: VehicleModels | null;
  personTypes: PersonTypes | null;
  dropdownStatus: Status;
  dropdownError: string | null;
}

const initialState: DropdownState = {
  provinces: null,
  dataStatus: [],
  registrationTypes: null,
  policeDivisions:null,
  districts: null,
  subDistricts: null,
  personTitles: null,
  positions: null,
  regions: null,
  streamEncodes: null,
  vehicleBodyTypes: null,
  vehicleBodyTypesTh: null,
  vehicleColors: null,
  vehicleMakes: null,
  vehicleModels: null,
  personTypes: null,
  dropdownStatus: Status.IDLE,
  dropdownError: null,
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

export const fetchPersonTitlesThunk = createAsyncThunk(
  "personTitles/fetchPersonTitles",
  async (param?: Record<string, string>) => {
    const response = await fetchPersonTitles(param);
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
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchProvincesThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.provinces = action.payload;
      })
      .addCase(fetchProvincesThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch provinces";
      });

    builder
      .addCase(fetchDataStatusThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchDataStatusThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.dataStatus = action.payload;
      })
      .addCase(fetchDataStatusThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch dataStatus";
      });

    builder
      .addCase(fetchRegistrationTypesThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchRegistrationTypesThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.registrationTypes = action.payload;
      })
      .addCase(fetchRegistrationTypesThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch registrationTypes";
      });

    builder
      .addCase(fetchPoliceDivisionsThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchPoliceDivisionsThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.policeDivisions = action.payload;
      })
      .addCase(fetchPoliceDivisionsThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch policeDivisions";
      });

    builder
      .addCase(fetchDistrictsThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchDistrictsThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.districts = action.payload;
      })
      .addCase(fetchDistrictsThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch districts";
      });
    
    builder
      .addCase(fetchSubDistrictsThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchSubDistrictsThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.subDistricts = action.payload;
      })
      .addCase(fetchSubDistrictsThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch subDistricts";
      });

    builder
      .addCase(fetchPersonTitlesThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchPersonTitlesThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.personTitles = action.payload;
      })
      .addCase(fetchPersonTitlesThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch personTitles";
      });

    builder
      .addCase(fetchPositionThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchPositionThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.positions = action.payload;
      })
      .addCase(fetchPositionThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch positions";
      });

    builder
      .addCase(fetchRegionsThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchRegionsThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.regions = action.payload;
      })
      .addCase(fetchRegionsThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch regions";
      });

    builder
      .addCase(fetchStreamEncodesThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchStreamEncodesThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.streamEncodes = action.payload;
      })
      .addCase(fetchStreamEncodesThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch stream encodes";
      });

    builder
      .addCase(fetchVehicleBodyTypesThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchVehicleBodyTypesThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.vehicleBodyTypes = action.payload;
      })
      .addCase(fetchVehicleBodyTypesThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch vehicle body types";
      });

    builder
      .addCase(fetchVehicleBodyTypesThThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchVehicleBodyTypesThThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.vehicleBodyTypesTh = action.payload;
      })
      .addCase(fetchVehicleBodyTypesThThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch vehicle body types only Thai";
      });

    builder
      .addCase(fetchVehicleColorsThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchVehicleColorsThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.vehicleColors = action.payload;
      })
      .addCase(fetchVehicleColorsThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch vehicle colors";
      });

    builder
      .addCase(fetchVehicleMakesThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchVehicleMakesThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.vehicleMakes = action.payload;
      })
      .addCase(fetchVehicleMakesThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch vehicle makes";
      });

    builder
      .addCase(fetchVehicleModelsThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchVehicleModelsThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.vehicleModels = action.payload;
      })
      .addCase(fetchVehicleModelsThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch vehicle models";
      });

    builder
      .addCase(fetchPersonTypesThunk.pending, (state) => {
        state.dropdownStatus = Status.LOADING;
        state.dropdownError = null;
      })
      .addCase(fetchPersonTypesThunk.fulfilled, (state, action) => {
        state.dropdownStatus = Status.SUCCEEDED;
        state.personTypes = action.payload;
      })
      .addCase(fetchPersonTypesThunk.rejected, (state, action) => {
        state.dropdownStatus = Status.FAILED;
        state.dropdownError = action.error.message || "Failed to fetch personTypes";
      });
  },
});

export default dropdownSlice.reducer;
