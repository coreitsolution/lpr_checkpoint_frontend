import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { Status } from "../../constants/statusEnum"

// Types
import { SpecialPlateSearchResult, SpecialSuspectPeopleSearchResult } from "./SearchDataTypes"
import { FilterSpecialPlatesBody, PdfDowload } from "../../features/api/types";

// API
import {
  dowloadPdfSpecialPlate,
  postSpecialPlateSearchData,
  fetchSpecialSuspectPeopleSearchData
} from "./SearchDataAPI"

interface SearchDataState {
  specialPlateSearchData: SpecialPlateSearchResult | null
  specialSuspectPeopleSearchData: SpecialSuspectPeopleSearchResult | null
  dowloadPath: PdfDowload | null
  searchDataStatus: Status
  searchDataError: string | null
}

const initialState: SearchDataState = {
  specialPlateSearchData: null,
  specialSuspectPeopleSearchData: null,
  dowloadPath: null,
  searchDataStatus: Status.IDLE,
  searchDataError: null,
}

export const postSpecialPlateSearchDataThunk = createAsyncThunk(
  "searchData/postSpecialPlateSearchData",
  async (body: FilterSpecialPlatesBody) => {
    const response = await postSpecialPlateSearchData(body)
    return response
  }
)

export const fetchSpecialSuspectPeopleSearchDataThunk = createAsyncThunk(
  "searchData/fetchSpecialSuspectPeopleSearchData",
  async (param?: Record<string, string>) => {
    const response = await fetchSpecialSuspectPeopleSearchData(param)
    return response
  }
)

export const dowloadPdfSpecialPlateThunk = createAsyncThunk(
  "searchData/dowloadPdfSpecialPlate",
  async() => {
    const response = await dowloadPdfSpecialPlate()
    return response
  }
)

const searchDataSlice = createSlice({
  name: "searchData",
  initialState,
  reducers: {
    clearSearchData: (state) => {
      state.searchDataStatus = Status.IDLE;
      state.specialPlateSearchData = null;
    },
  },
  extraReducers: (builder) => {
    // Special Plates
    builder
      .addCase(postSpecialPlateSearchDataThunk.pending, (state) => {
        state.searchDataStatus = Status.LOADING
      })
      .addCase(postSpecialPlateSearchDataThunk.fulfilled, (state, action) => {
        state.searchDataStatus = Status.SUCCEEDED
        state.specialPlateSearchData = action.payload
      })
      .addCase(postSpecialPlateSearchDataThunk.rejected, (state, action) => {
        state.searchDataStatus = Status.FAILED
        state.searchDataError = action.error.message || "Failed to fetch special plates data."
      })

    builder
      .addCase(dowloadPdfSpecialPlateThunk.pending, (state) => {
        state.searchDataStatus = Status.LOADING
      })
      .addCase(dowloadPdfSpecialPlateThunk.fulfilled, (state, action) => {
        state.searchDataStatus = Status.SUCCEEDED
        state.dowloadPath = action.payload
      })
      .addCase(dowloadPdfSpecialPlateThunk.rejected, (state, action) => {
        state.searchDataStatus = Status.FAILED
        state.searchDataError = action.error.message || "Failed to fetch special plates data."
      })
    
    // Special Suspect People
    builder
      .addCase(fetchSpecialSuspectPeopleSearchDataThunk.pending, (state) => {
        state.searchDataStatus = Status.LOADING
      })
      .addCase(fetchSpecialSuspectPeopleSearchDataThunk.fulfilled, (state, action) => {
        state.searchDataStatus = Status.SUCCEEDED
        state.specialSuspectPeopleSearchData = action.payload
      })
      .addCase(fetchSpecialSuspectPeopleSearchDataThunk.rejected, (state, action) => {
        state.searchDataStatus = Status.FAILED
        state.searchDataError = action.error.message || "Failed to fetch special suspect people data."
      })
  }
})

export const { clearSearchData } = searchDataSlice.actions;
export default searchDataSlice.reducer