import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { RegistrationTypesData } from "./registrationTypesTypes";
import { registrationTypesData } from "../../mocks/mockRegistrationTypes";

export const fetchRegistrationTypes = async (): Promise<RegistrationTypesData[]> => {
  if (isDevEnv) {
    return Promise.resolve(registrationTypesData);
  }
  return await fetchClient<RegistrationTypesData[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};
