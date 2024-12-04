import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
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
import { provinces } from "../../mocks/mockProvinces";
import { agenciesData } from "../../mocks/mockAgencies";
import { dataStatusData } from "../../mocks/mockDataStatus";
import { registrationTypesData } from "../../mocks/mockRegistrationTypes";
import { policeDivisions } from "../../mocks/mockPoliceDivisions";
import { districts } from "../../mocks/mockDistricts";
import { subDistricts } from "../../mocks/mockSubDistricts";
import { namePrefixes } from "../../mocks/mockNamePrefixes";
import { positions } from "../../mocks/mockPositions";


export const fetchAgencies = async (): Promise<Agencies[]> => {
  if (isDevEnv) {
    return Promise.resolve(agenciesData);
  }
  return await fetchClient<Agencies[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchRegistrationTypes = async (): Promise<RegistrationTypesData[]> => {
  if (isDevEnv) {
    return Promise.resolve(registrationTypesData);
  }
  return await fetchClient<RegistrationTypesData[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchDataStatus = async (): Promise<DataStatusData[]> => {
  if (isDevEnv) {
    return Promise.resolve(dataStatusData);
  }
  return await fetchClient<DataStatusData[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchProvinces = async (): Promise<Province[]> => {
  if (isDevEnv) {
    return Promise.resolve(provinces.sort((a, b) => (a.name_th > b.name_th ? -1 : 1)));
  }
  return await fetchClient<Province[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchPoliceDivisions = async (): Promise<PoliceDivisions[]> => {
  if (isDevEnv) {
    return Promise.resolve(policeDivisions);
  }
  return await fetchClient<PoliceDivisions[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchDistricts = async (): Promise<Districts[]> => {
  if (isDevEnv) {
    return Promise.resolve(districts.sort((a, b) => (a.name_th > b.name_th ? -1 : 1)))
  }
  return await fetchClient<Districts[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchSubDistricts = async (districtId: number): Promise<SubDistricts[]> => {
  if (isDevEnv) {
    return Promise.resolve(
      subDistricts.filter((subDistrict) => subDistrict.district_id === districtId).sort((a, b) => (a.name_th > b.name_th ? -1 : 1))
    );
  }

  // Fetch subdistricts from the API in non-development environments
  const allSubDistricts = await fetchClient<SubDistricts[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  // Filter the fetched data by districtId
  return allSubDistricts.filter((subDistrict) => subDistrict.district_id === districtId);
};

export const fetchNamePrefixes = async (): Promise<NamePrefixes[]> => {
  if (isDevEnv) {
    return Promise.resolve(namePrefixes);
  }
  return await fetchClient<NamePrefixes[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

export const fetchPositions = async (): Promise<Positions[]> => {
  if (isDevEnv) {
    return Promise.resolve(positions);
  }
  return await fetchClient<Positions[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};