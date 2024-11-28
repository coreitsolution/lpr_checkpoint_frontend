import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { mockUserManagementData } from "../../mocks/mockUserManagementData";
import { User } from "./userManagementTypes";

export const fetchUserAPI = async (): Promise<User[]> => {
  if (isDevEnv) {
    return Promise.resolve(mockUserManagementData);
  }
  return await fetchClient<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};

// export const addUserAPI = async (user: Omit<User, "id">): Promise<User> => {
//   return await fetchClient<User>("https://jsonplaceholder.typicode.com/users", {
//     method: "POST",
//     body: JSON.stringify(user),
//   });
// };
