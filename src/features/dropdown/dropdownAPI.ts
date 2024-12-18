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
} from "./dropdownTypes";
import { provinces } from "../../mocks/mockProvinces";
import { agenciesData } from "../../mocks/mockAgencies";
import { registrationTypes } from "../../mocks/mockRegistrationTypes";
import { policeDivisions } from "../../mocks/mockPoliceDivisions";
import { districts } from "../../mocks/mockDistricts";
import { subDistricts } from "../../mocks/mockSubDistricts";
import { namePrefixes } from "../../mocks/mockNamePrefixes";
import { positions } from "../../mocks/mockPositions";


export const fetchRegistrationTypes = async (param?: string): Promise<RegistrationTypes> => {
  if (isDevEnv) {
    return Promise.resolve(registrationTypes);
  }
  const url = param ? `/plate-classes/get${param}` : "/plate-classes/get";
  return await fetchClient<RegistrationTypes>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchDataStatus = async (): Promise<DataStatusData[]> => {
  const dataStatusDropdown = [
    {id:1, status: "Active"},
    {id:0, status: "Inactive"}
  ]
  return Promise.resolve(dataStatusDropdown);
};

export const fetchProvinces = async (param?: string): Promise<Provinces> => {
  if (isDevEnv) {
    return Promise.resolve(provinces);
  }
  const url = param ? `/provinces/get${param}` : "/provinces/get";
  return await fetchClient<Provinces>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchPoliceDivisions = async (param?: string): Promise<PoliceDivisions> => {
  if (isDevEnv) {
    // return Promise.resolve(policeDivisions.sort((a, b) => (a.localeCompare(b.police_division, "th"))));
  }
  const url = param ? `/police-regions/get${param}` : "/police-regions/get";
  return await fetchClient<PoliceDivisions>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchDistricts = async (param?: string): Promise<Districts> => {
  if (isDevEnv) {
    // return Promise.resolve(districts.sort((a, b) => (a.name_th.localeCompare(b.name_th, "th"))));
  }
  const url = param ? `/districts/get${param}` : "/districts/get";
  return await fetchClient<Districts>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchSubDistricts = async (param?: string): Promise<SubDistricts> => {
  if (isDevEnv) {
    // return Promise.resolve(subDistricts)
  }

  const url = param ? `/subdistricts/get${param}` : "/subdistricts/get";
  return await fetchClient<SubDistricts>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchCommonPrefixes = async (param?: string): Promise<CommonTitles> => {
  if (isDevEnv) {
    // return Promise.resolve(namePrefixes.sort((a, b) => (a.name_th.localeCompare(b.name_th, "th"))));
  }
  const url = param ? `/common-titles/get${param}` : "/common-titles/get";
  return await fetchClient<CommonTitles>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchOfficerPrefixes = async (param?: string): Promise<OfficerTitles> => {
  if (isDevEnv) {
    // return Promise.resolve(namePrefixes.sort((a, b) => (a.name_th.localeCompare(b.name_th, "th"))));
  }
  const url = param ? `/officer-titles/get${param}` : "/officer-titles/get";
  return await fetchClient<OfficerTitles>(combineURL(API_URL, url), {
    method: "GET",
  });
};

export const fetchPositions = async (param?: string): Promise<OfficerPositions> => {
  if (isDevEnv) {

    // return Promise.resolve(positions.sort((a, b) => (a.name_th.localeCompare(b.name_th, "th"))));
  }
  const url = param ? `/officer-positions/get${param}` : "/officer-positions/get";
  return await fetchClient<OfficerPositions>(combineURL(API_URL, url), {
    method: "GET",
  });
};