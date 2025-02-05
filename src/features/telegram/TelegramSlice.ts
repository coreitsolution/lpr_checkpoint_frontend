import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Status } from "../../constants/statusEnum"
import { sendMessage } from "./TelegramAPI"
import { SendMessage } from "./TelegramTypes"

interface TelegramState {
  telegramStatus: Status
  telegramError: string | null
}

const initialState: TelegramState = {
  telegramStatus: Status.IDLE,
  telegramError: null,
}

export const sendMessageThunk = createAsyncThunk<unknown, SendMessage, { rejectValue: string }>(
  "telegram/sendMessage",
  async (body : SendMessage, { rejectWithValue }) => {
    try {
      return await sendMessage(body)
    } 
    catch (error) {
      return rejectWithValue((error as { message: string }).message || "Failed to send message")  
    }
  }
)

const telegramSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.telegramStatus = Status.LOADING
        state.telegramError = null
      })
      .addCase(sendMessageThunk.fulfilled, (state) => {
        state.telegramStatus = Status.SUCCEEDED
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.telegramStatus = Status.FAILED
        state.telegramError = action.payload || "Failed to send message"
      })
  },
})

export default telegramSlice.reducer