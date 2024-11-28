import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { Agencies } from "./agenciesTypes";
import { agenciesData } from "../../mocks/mockAgencies";

export const fetchAgencies = async (): Promise<Agencies[]> => {
  if (isDevEnv) {
    return Promise.resolve(agenciesData);
  }
  return await fetchClient<Agencies[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};
