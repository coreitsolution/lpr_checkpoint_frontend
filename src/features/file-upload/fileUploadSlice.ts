import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { postFilesData, deleteFilesData } from "./fileUploadAPI"
import { FileUpload, MultipartRequestData, DeleteRequestData } from "./fileUploadTypes"
import { Status } from "../../constants/statusEnum"

interface FileUploadState {
  files: FileUpload | null
  status: Status
  error: string | null
}

const initialState: FileUploadState = {
  files: null,
  status: Status.IDLE,
  error: null,
}

// Async thunk for posting files
export const postFilesDataThunk = createAsyncThunk(
  "fileUpload/postFilesData",
  async (newFile: FormData, { rejectWithValue }) => {
    try {
      const response = await postFilesData(newFile)
      return response
    } 
    catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload files")
    }
  }
)

// Async thunk for deleting files
export const deleteFilesDataThunk = createAsyncThunk(
  "fileUpload/deleteFilesData",
  async (url: DeleteRequestData, { rejectWithValue }) => {
    try {
      const response = await deleteFilesData(url)
      return response
    } 
    catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete file")
    }
  }
)

const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Post files
      .addCase(postFilesDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(postFilesDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.files = action.payload
      })
      .addCase(postFilesDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.payload as string
      })

      // Delete files
      .addCase(deleteFilesDataThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(deleteFilesDataThunk.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        if (state.files && Array.isArray(state.files.data)) {
          state.files.data = state.files.data.filter(
            (file: any) => file.url !== (action.payload as DeleteRequestData).url
          )
        }
      })
      .addCase(deleteFilesDataThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.payload as string
      })
  },
})

export default fileUploadSlice.reducer
