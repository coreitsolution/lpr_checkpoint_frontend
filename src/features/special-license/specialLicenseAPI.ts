import { isDevEnv } from "../../config/environment";
import mockSpecialLicenses from "../../mocks/mockSpecialLicenseData";
import { fetchClient } from "../../utils/fetchClient";
import { SpecialLicense } from "./specialLicenseTypes";

export const fetchLicense = async (): Promise<SpecialLicense[]> => { 
    if (isDevEnv) {
        return Promise.resolve(mockSpecialLicenses);
    }
    return await fetchClient<SpecialLicense[]>('/api/special-licenses')
}