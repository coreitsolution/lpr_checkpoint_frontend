import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { DetectPerson } from "./detectPersonTypes";
import { detectPersonData } from "../../mocks/mockDetectPersonData";

export const fetchPerson = async (): Promise<DetectPerson[]> => {
  if (isDevEnv) {
    return Promise.resolve(detectPersonData);
  }
  return await fetchClient<DetectPerson[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};
