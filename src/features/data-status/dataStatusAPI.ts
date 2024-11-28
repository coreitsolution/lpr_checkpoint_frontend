import { fetchClient } from "../../utils/fetchClient";
import { isDevEnv } from "../../config/environment";
import { DataStatusData } from "./dataStatusTypes";
import { dataStatusData } from "../../mocks/mockDataStatus";

export const fetchDataStatus = async (): Promise<DataStatusData[]> => {
  if (isDevEnv) {
    return Promise.resolve(dataStatusData);
  }
  return await fetchClient<DataStatusData[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
};
