import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { Province } from "./provinceTypes";
import { provinces } from "../../mocks/mockProvinces";

export const fetchProvinces = async (): Promise<Province[]> => {
  if (isDevEnv) {
    return Promise.resolve(provinces);
  }
  return await fetchClient<Province[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};
