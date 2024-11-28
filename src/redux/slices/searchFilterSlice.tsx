import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  AgenciesData,
  DataStatusData,
  ProvincesData,
  RegistrationTypesData,
} from '../../types'

interface SearchFilterState {
  agencies: AgenciesData[]
  dataStatus: DataStatusData[]
  provinces: ProvincesData[]
  registrationTypes: RegistrationTypesData[]
  loading: boolean
  error: string | null
}

const initialState: SearchFilterState = {
  agencies: [],
  dataStatus: [],
  provinces: [],
  registrationTypes: [],
  loading: false,
  error: null,
}

const API_URL = process.env.REACT_APP_API_URL

// Async Thunks
export const fetchAgencies = createAsyncThunk('searchFilter/fetchAgencies', async () => {
  const response = await axios.get<AgenciesData[]>(`${API_URL}/agencies`)
  return response.data
})

export const fetchDataStatus = createAsyncThunk('searchFilter/fetchDataStatus', async () => {
  const response = await axios.get<DataStatusData[]>(`${API_URL}/dataStatus`)
  return response.data
})

export const fetchProvinces = createAsyncThunk('searchFilter/fetchProvinces', async () => {
  const response = await axios.get<ProvincesData[]>(`${API_URL}/provinces`)
  return response.data
})

export const fetchRegistrationTypes = createAsyncThunk('searchFilter/fetchRegistrationTypes', async () => {
  const response = await axios.get<RegistrationTypesData[]>(`${API_URL}/registrationTypes`)
  return response.data
})

const searchFilterSlice = createSlice({
  name: 'searchFilter',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    // Handle fetchAgencies
    builder.addCase(fetchAgencies.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchAgencies.fulfilled, (state, action: PayloadAction<AgenciesData[]>) => {
      state.loading = false
      state.agencies = action.payload
    })
    builder.addCase(fetchAgencies.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch agencies'
    })

    // Handle fetchDataStatus
    builder.addCase(fetchDataStatus.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchDataStatus.fulfilled, (state, action: PayloadAction<DataStatusData[]>) => {
      state.loading = false
      state.dataStatus = action.payload
    })
    builder.addCase(fetchDataStatus.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch data status'
    })

    // Handle fetchProvinces
    builder.addCase(fetchProvinces.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProvinces.fulfilled, (state, action: PayloadAction<ProvincesData[]>) => {
      state.loading = false
      state.provinces = action.payload
    })
    builder.addCase(fetchProvinces.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch provinces'
    })

    // Handle fetchRegistrationTypes
    builder.addCase(fetchRegistrationTypes.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchRegistrationTypes.fulfilled, (state, action: PayloadAction<RegistrationTypesData[]>) => {
      state.loading = false
      state.registrationTypes = action.payload
    })
    builder.addCase(fetchRegistrationTypes.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch registration types'
    })
  },
})

export default searchFilterSlice.reducer
