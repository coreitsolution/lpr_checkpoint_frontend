import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { Status } from "../../constants/statusEnum"

// Types
import { SpecialPlateSearchResult, PdfDowload, SpecialSuspectPeopleSearchResult } from "./SearchDataTypes"
import { DetactSpecialPlate } from "../../features/api/types";

// API
import {
  dowloadPdfSpecialPlate,
  fetchSpecialPlateSearchData,
  fetchSpecialSuspectPeopleSearchData
} from "./SearchDataAPI"

interface SearchDataState {
  specialPlateSearchData: SpecialPlateSearchResult | null
  specialSuspectPeopleSearchData: SpecialSuspectPeopleSearchResult | null
  dowloadPath: PdfDowload | null
  status: Status
  error: string | null
}

const initialState: SearchDataState = {
  specialPlateSearchData: null,
  specialSuspectPeopleSearchData: null,
  dowloadPath: null,
  status: Status.IDLE,
  error: null,
}

export const fetchSpecialPlateSearchDataThunk = createAsyncThunk(
  "searchData/fetchSpecialPlateSearchData",
  async (param?: Record<string, string>) => {
    const response = await fetchSpecialPlateSearchData(param)
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
  async (body: DetactSpecialPlate) => {
    const response = await dowloadPdfSpecialPlate(body)
    return response
  }
)

const searchDataSlice = createSlice({
  name: "searchData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Special Plates
    builder
      .addCase(fetchSpecialPlateSearchDataThunk.pending, (state) => {
        state.status = Status.LOADING
      })
      .addCase(fetchSpecialPlateSearchDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.specialPlateSearchData = action.payload
      })
      .addCase(fetchSpecialPlateSearchDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch special plates data."
      })

    builder
      .addCase(dowloadPdfSpecialPlateThunk.pending, (state) => {
        state.status = Status.LOADING
      })
      .addCase(dowloadPdfSpecialPlateThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.dowloadPath = action.payload
      })
      .addCase(dowloadPdfSpecialPlateThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch special plates data."
      })
    
    // Special Suspect People
    builder
      .addCase(fetchSpecialSuspectPeopleSearchDataThunk.pending, (state) => {
        state.status = Status.LOADING
      })
      .addCase(fetchSpecialSuspectPeopleSearchDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.specialSuspectPeopleSearchData = action.payload
      })
      .addCase(fetchSpecialSuspectPeopleSearchDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch special suspect people data."
      })
  }
})

export default searchDataSlice.reducer