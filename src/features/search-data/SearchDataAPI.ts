import { API_URL } from '../../config/apiConfig';
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { isDevEnv } from "../../config/environment"
import { SpecialPlateSearchResult, PdfDowload, SpecialSuspectPeopleSearchResult } from './SearchDataTypes';
import { specialPlateSearchData } from "../../mocks/mockSpecialPlateSearch"
import { specialSuspectPeopleSearchData } from '../../mocks/mockSpecialSuspectPeopleSearch';
import { DetactSpecialPlate } from "../../features/api/types";

let mockSpecialPlateSearchData = [...specialPlateSearchData]
let mockSpecialSuspectPeopleSearchData = [...specialSuspectPeopleSearchData]

export const fetchSpecialPlateSearchData = async (
  param?: Record<string, string>
): Promise<SpecialPlateSearchResult> => {
  if (isDevEnv) {
    let filters: Record<string, string> = {};

    if (param?.filter) {
      filters = param.filter.split(",").reduce((acc, filterStr) => {
        const [key, value] = filterStr.split(":");
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
    }

    const filteredData = mockSpecialPlateSearchData.filter((data) => {
      // Apply filtering logic based on parsed `filters`
      for (const [key, value] of Object.entries(filters)) {
        switch (key) {
          case "plate":
            if (!data.plate.includes(value)) return false;
            break;
          case "registration_type":
            if (data.registration_type !== value) return false;
            break;
          case "vehicle_color":
            if (data.vehicle_color !== value) return false;
            break;
          case "plate_confidence":
            if (parseFloat(data.plate_confidence.replace("%", "")) >= parseFloat(value)) return false;
            break;
          case "region":
            if (data.region_info.code !== value) return false;
            break;
          case "vehicle_body_type":
            if (data.vehicle_body_type !== value) return false;
            break;
          case "vehicle_make":
            if (data.vehicle_make !== value) return false;
            break;
          case "vehicle_make_model":
            if (data.vehicle_make_model !== value) return false;
            break;
          case "lane":
            if (data.lane !== value) return false;
            break;
          case "epoch_start":
            if (data.epoch_start !== value) return false;
            break;
          case "epoch_end":
            if (data.epoch_end !== value) return false;
            break;
          default:
            break;
        }
      }
      return true;
    });

    const limitedData = filteredData.slice(
      0,
      param?.limit ? parseInt(param.limit) : 100
    );

    return Promise.resolve({ data: limitedData, countAll: limitedData.length });
  }

  return await fetchClient<SpecialPlateSearchResult>(
    combineURL(API_URL, "/special-plates/search"),
    {
      method: "GET",
      queryParams: param,
    }
  );
};

export const dowloadPdfSpecialPlate = async (
  data: DetactSpecialPlate
): Promise<PdfDowload> => {
  if (isDevEnv) {
    const data: PdfDowload = {
      data: {
        pdfUrl: "/pdf/example.pdf"
      }
    }
    return Promise.resolve(data);
  }
  return await fetchClient<PdfDowload>(combineURL(API_URL, "/lpr-data/get-detect-special-plate-pdf"), {
    method: "GET",
    body: JSON.stringify(data),
  });
};

export const fetchSpecialSuspectPeopleSearchData = async (
  param?: Record<string, string>
): Promise<SpecialSuspectPeopleSearchResult> => {
  if (isDevEnv) {
    let filters: Record<string, string> = {};

    if (param?.filter) {
      filters = param.filter.split(",").reduce((acc, filterStr) => {
        const [key, value] = filterStr.split(":");
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
    }

    const filteredData = mockSpecialSuspectPeopleSearchData.filter((data) => {
      // Apply filtering logic based on parsed `filters`
      for (const [key, value] of Object.entries(filters)) {
        switch (key) {
          case "plate":
            if (!data.plate.includes(value)) return false;
            break;
          case "registration_type":
            if (data.registration_type !== value) return false;
            break;
          case "vehicle_color":
            if (data.vehicle_color !== value) return false;
            break;
          case "plate_confidence":
            if (parseFloat(data.plate_confidence.replace("%", "")) >= parseFloat(value)) return false;
            break;
          case "region":
            if (data.region_info.code !== value) return false;
            break;
          case "vehicle_body_type":
            if (data.vehicle_body_type !== value) return false;
            break;
          case "vehicle_make":
            if (data.vehicle_make !== value) return false;
            break;
          case "vehicle_make_model":
            if (data.vehicle_make_model !== value) return false;
            break;
          case "lane":
            if (data.lane !== value) return false;
            break;
          case "epoch_start":
            if (data.epoch_start !== value) return false;
            break;
          case "epoch_end":
            if (data.epoch_end !== value) return false;
            break;
          default:
            break;
        }
      }
      return true;
    });

    const limitedData = filteredData.slice(
      0,
      param?.limit ? parseInt(param.limit) : 100
    );

    return Promise.resolve({ data: limitedData, countAll: limitedData.length });
  }

  return await fetchClient<SpecialSuspectPeopleSearchResult>(
    combineURL(API_URL, "/special-plates/search"),
    {
      method: "GET",
      queryParams: param,
    }
  );
};

export const dowloadPdfSpecialSuspectPeople = async (
  data: DetactSpecialPlate
): Promise<PdfDowload> => {
  if (isDevEnv) {
    const data: PdfDowload = {
      data: {
        pdfUrl: "/pdf/example.pdf"
      }
    }
    return Promise.resolve(data);
  }
  return await fetchClient<PdfDowload>(combineURL(API_URL, "/lpr-data/get-detect-special-plate-pdf"), {
    method: "GET",
    body: JSON.stringify(data),
  });
};