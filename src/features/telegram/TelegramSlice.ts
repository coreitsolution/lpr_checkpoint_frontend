import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Status } from "../../constants/statusEnum"
import { sendMessage } from "./TelegramAPI"
import { SendMessage } from "./TelegramTypes"

interface TelegramState {
  status: Status
  error: string | null
}

const initialState: TelegramState = {
  status: Status.IDLE,
  error: null,
}

export const sendMessageThunk = createAsyncThunk(
  "telegram/sendMessage",
  async (body : SendMessage) => {
    return await sendMessage(body)
  }
)

const telegramSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(sendMessageThunk.fulfilled, (state) => {
        state.status = Status.SUCCEEDED
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || "Failed to send message"
      })
  },
})

export default telegramSlice.reducer