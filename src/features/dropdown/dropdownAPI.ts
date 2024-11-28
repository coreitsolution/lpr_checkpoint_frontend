import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { Province, Agencies, RegistrationTypesData, DataStatusData } from "./dropdownTypes";
import { provinces } from "../../mocks/mockProvinces";
import { agenciesData } from "../../mocks/mockAgencies";
import { dataStatusData } from "../../mocks/mockDataStatus";
import { registrationTypesData } from "../../mocks/mockRegistrationTypes";


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
    return Promise.resolve(provinces);
  }
  return await fetchClient<Province[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

