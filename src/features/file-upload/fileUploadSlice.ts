import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { postFilesData, deleteFilesData } from "./fileUploadAPI"
import { FileUpload, DeleteRequestData, FileDelete } from "./fileUploadTypes"
import { Status } from "../../constants/statusEnum"

interface FileUploadState {
  files: FileUpload | null
  fileUploadStatus: Status
  fileUploadError: string | null
}

const initialState: FileUploadState = {
  files: null,
  fileUploadStatus: Status.IDLE,
  fileUploadError: null,
}

// Async thunk for posting files
export const postFilesDataThunk = createAsyncThunk<FileUpload, FormData, { rejectValue: string }>(
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
export const deleteFilesDataThunk = createAsyncThunk<FileDelete, DeleteRequestData, { rejectValue: string }>(
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
        state.fileUploadStatus = Status.LOADING
        state.fileUploadError = null
      })
      .addCase(postFilesDataThunk.fulfilled, (state, action) => {
        state.fileUploadStatus = Status.SUCCEEDED
        state.files = action.payload
      })
      .addCase(postFilesDataThunk.rejected, (state, action) => {
        state.fileUploadStatus = Status.FAILED
        state.fileUploadError = action.payload || "Failed to post file data."
      })

      // Delete files
      .addCase(deleteFilesDataThunk.pending, (state) => {
        state.fileUploadStatus = Status.LOADING
        state.fileUploadError = null
      })
      .addCase(deleteFilesDataThunk.fulfilled, (state, action) => {
        state.fileUploadStatus = Status.SUCCEEDED
        if (state.files && Array.isArray(state.files.data)) {
          state.files.data = state.files.data.filter(
            (file: any) => file.url !== (action.payload as DeleteRequestData).url
          )
        }
      })
      .addCase(deleteFilesDataThunk.rejected, (state, action) => {
        state.fileUploadStatus = Status.FAILED
        state.fileUploadError = action.payload || "Failed to delete file data."
      })
  },
})

export default fileUploadSlice.reducer
