import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment";
import { 
  Provinces, 
  RegistrationTypes, 
  DataStatusData,
  PoliceDivisions,
  Districts,
  SubDistricts,
  CommonTitles,
  OfficerTitles,
  OfficerPositions,
  Regions,
  StreamEncodes,
} from "./dropdownTypes";
import { provincesDetail } from "../../mocks/mockProvinces";
import { registrationTypes } from "../../mocks/mockRegistrationTypes";
import { policeDivisions } from "../../mocks/mockPoliceDivisions";
import { districts } from "../../mocks/mockDistricts";
import { subDistricts } from "../../mocks/mockSubDistricts";
import { namePrefixes } from "../../mocks/mockNamePrefixes";
import { positions } from "../../mocks/mockPositions";
import { officerPrefixes } from '../../mocks/mockOfficerPrefixes';
import { mockRegions } from '../../mocks/mockRegions';
import { streamEncodes } from '../../mocks/mockStreamEncodes';


export const fetchRegions = async (param?: Record<string, string>): Promise<Regions> => {
  if (isDevEnv) {
    const data = {
      data: mockRegions
    }
    return Promise.resolve(data);
  }
  return await fetchClient<Regions>(combineURL(API_URL, "/regions/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchRegistrationTypes = async (param?: Record<string, string>): Promise<RegistrationTypes> => {
  if (isDevEnv) {
    return Promise.resolve(registrationTypes);
  }
  return await fetchClient<RegistrationTypes>(combineURL(API_URL, "/plate-classes/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchDataStatus = async (): Promise<DataStatusData[]> => {
  const dataStatusDropdown = [
    {id:1, status: "Active"},
    {id:0, status: "Inactive"}
  ]
  return Promise.resolve(dataStatusDropdown);
};

export const fetchProvinces = async (param?: Record<string, string>): Promise<Provinces> => {
  if (isDevEnv) {
    const data = {
      data: provincesDetail.sort((a, b) => { return a.name_th.localeCompare(b.name_th)})
    }
    return Promise.resolve(data);
  }
  return await fetchClient<Provinces>(combineURL(API_URL, "/provinces/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchPoliceDivisions = async (param?: Record<string, string>): Promise<PoliceDivisions> => {
  if (isDevEnv) {
    const data = {
      data: policeDivisions
    }
    return Promise.resolve(data);
  }
  return await fetchClient<PoliceDivisions>(combineURL(API_URL, "/police-regions/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchDistricts = async (param?: Record<string, string>): Promise<Districts> => {
  if (isDevEnv) {
    const filters: Record<string, string> = param?.filter
    ? param.filter.split(",").reduce((acc, filterStr) => {
        const [key, value] = filterStr.split(":");
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>)
    : {};

    const filteredData = districts
      .filter((data) =>
        Object.entries(filters).every(([key, value]) => {
          switch (key) {
            case "province_id":
              return data.province_id === Number(value);
            default:
              return true;
          }
        })
      )
      .sort((a, b) => a.name_th.localeCompare(b.name_th)
    );

    const data = { data: filteredData };
    return Promise.resolve(data);
  }
  return await fetchClient<Districts>(combineURL(API_URL, "/districts/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchSubDistricts = async (param?: Record<string, string>): Promise<SubDistricts> => {
  if (isDevEnv) {
    const filters: Record<string, string> = param?.filter
    ? param.filter.split(",").reduce((acc, filterStr) => {
        const [key, value] = filterStr.split(":");
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>)
    : {};

    const filteredData = subDistricts
      .filter((data) =>
        Object.entries(filters).every(([key, value]) => {
          switch (key) {
            case "province_id":
              return data.province_id === Number(value);
            case "district_id":
              return data.district_id === Number(value);
            default:
              return true;
          }
        })
      )
      .sort((a, b) => a.name_th.localeCompare(b.name_th)
    );

    const data = { data: filteredData };
    return Promise.resolve(data);
  }

  return await fetchClient<SubDistricts>(combineURL(API_URL, "/subdistricts/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchCommonPrefixes = async (param?: Record<string, string>): Promise<CommonTitles> => {
  if (isDevEnv) {
    const data = {
      data: namePrefixes
    }
    return Promise.resolve(data);
  }
  return await fetchClient<CommonTitles>(combineURL(API_URL, "/common-titles/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchOfficerPrefixes = async (param?: Record<string, string>): Promise<OfficerTitles> => {
  if (isDevEnv) {
    const data = {
      data: officerPrefixes
    }
    return Promise.resolve(data);
  }
  return await fetchClient<OfficerTitles>(combineURL(API_URL, "/officer-titles/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchPositions = async (param?: Record<string, string>): Promise<OfficerPositions> => {
  if (isDevEnv) {
    const data = {
      data: positions
    }
    return Promise.resolve(data);
  }
  return await fetchClient<OfficerPositions>(combineURL(API_URL, "/officer-positions/get"), {
    method: "GET",
    queryParams: param,
  });
};

export const fetchStreamEncodes = async (param?: Record<string, string>): Promise<StreamEncodes> => {
  if (isDevEnv) {
    const data = {
      data: streamEncodes
    }
    return Promise.resolve(data);
  }
  return await fetchClient<StreamEncodes>(combineURL(API_URL, "/stream-encodes/get"), {
    method: "GET",
    queryParams: param,
  });
};