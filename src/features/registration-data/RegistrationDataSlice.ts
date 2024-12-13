import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { 
  fetchSpecialRegistrationData, 
  deleteSpecialRegistrationData, 
  fetchFilesData,
  putSpecialRegistrationData,
  postFilesData,
  postSpecialRegistrationData,
  deleteFilesData,
} from "./RegistrationDataAPI"
import { SpecialRegistrationData, NewSpecialRegistrationData } from "./RegistrationDataTypes"
import { Status } from "../../constants/statusEnum"
import { FilesData, NewFilesData } from "../../features/api/types"

interface RegistrationDataState {
  specialRegistrationData: SpecialRegistrationData[]
  filesData: FilesData[]
  status: Status
  error: string | null
}

const initialState: RegistrationDataState = {
  specialRegistrationData: [],
  filesData: [],
  status: Status.IDLE,
  error: null,
}

export const fetchSpecialRegistrationDataThunk = createAsyncThunk(
  "registrationData/fetchSpecialRegistrationData",
  async () => {
    const response = await fetchSpecialRegistrationData()
    return response
  }
)

export const postSpecialRegistrationDataThunk = createAsyncThunk(
  "registrationData/postSpecialRegistrationData",
  async (newSetting: NewSpecialRegistrationData) => {
    const response = await postSpecialRegistrationData(newSetting)
    return response
  }
)


export const deleteSpecialRegistrationDataThunk = createAsyncThunk(
  "registrationData/deleteSpecialRegistrationData",
  async (id:number) => {
    await deleteSpecialRegistrationData(id)
    return id
  }
)

export const putSpecialRegistrationDataThunk = createAsyncThunk(
  "registrationData/putSpecialRegistrationData",
  async (updated: SpecialRegistrationData) => {
    const response = await putSpecialRegistrationData(updated)
    return response
  }
)

export const postFilesDataThunk = createAsyncThunk(
  "registrationData/postFilesData",
  async (newFiles: NewFilesData[]) => {
    const response = await postFilesData(newFiles)
    return response
  }
)


export const fetchFilesDataThunk = createAsyncThunk(
  "registrationData/fetchFilesData",
  async (id: number) => {
    const response = await fetchFilesData(id)
    return response
  }
)

export const deleteFilesDataThunk = createAsyncThunk(
  "registrationData/deleteFilesData",
  async (id:number) => {
    await deleteFilesData(id)
    return id
  }
)


const registrationDataSlice = createSlice({
  name: "registrationData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialRegistrationDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(fetchSpecialRegistrationDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.specialRegistrationData = action.payload
      })
      .addCase(fetchSpecialRegistrationDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch specialRegistrationData"
      })

      .addCase(postSpecialRegistrationDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(postSpecialRegistrationDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.specialRegistrationData.push(action.payload)
      })
      .addCase(postSpecialRegistrationDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to post specialRegistrationData"
      })

      .addCase(deleteSpecialRegistrationDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(deleteSpecialRegistrationDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.specialRegistrationData = state.specialRegistrationData.filter(
          (data) => data.id !== action.payload
        )
      })
      .addCase(deleteSpecialRegistrationDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to delete specialRegistrationData"
      })

      .addCase(putSpecialRegistrationDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(putSpecialRegistrationDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        if (state.specialRegistrationData) {
          const index = state.specialRegistrationData.findIndex(
            (setting) => setting.id === action.payload.id
          )
          if (index !== -1) {
            state.specialRegistrationData[index] = action.payload
          }
        }
      })
      .addCase(putSpecialRegistrationDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to put specialRegistrationData"
      })
      // Files
      .addCase(postFilesDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(postFilesDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.filesData.push(...action.payload)
      })
      .addCase(postFilesDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to post filesData"
      })

      .addCase(fetchFilesDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(fetchFilesDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.filesData = action.payload
      })
      .addCase(fetchFilesDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to fetch filesData"
      })

      .addCase(deleteFilesDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(deleteFilesDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.filesData = state.filesData.filter(
          (data) => data.id !== action.payload
        )
      })
      .addCase(deleteFilesDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to delete filesData"
      })
  },
})

export default registrationDataSlice.reducer
