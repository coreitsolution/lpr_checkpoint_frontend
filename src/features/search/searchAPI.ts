import { fetchClient } from "../../utils/fetchClient";
import { SearchResult } from "./searchTypes";
import { isDevEnv } from "../../config/environment";
import { searchPlateData } from "../../mocks/mockVehicleData";

export const fetchVehicleAPI = async (): Promise<SearchResult[]> => {
  if (isDevEnv) {
    return Promise.resolve(searchPlateData);
  }
  return await fetchClient<SearchResult[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

// export const addUserAPI = async (user: Omit<User, "id">): Promise<User> => {
//   return await fetchClient<User>("https://jsonplaceholder.typicode.com/users", {
//     method: "POST",
//     body: JSON.stringify(user),
//   });
// };
