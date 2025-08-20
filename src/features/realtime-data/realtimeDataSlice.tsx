import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Constants
import { Status } from "../../constants/statusEnum";

// Types
import { 
  RealTimeLprData, 
} from "../../features/live-view-real-time/liveViewRealTimeTypes"

interface RealtimeDataState {
  realtimeData: RealTimeLprData[];
  toastNotification: RealTimeLprData[];
  realtimeDataStatus: Status;
  realtimeDataError: string | null;
}

const initialState: RealtimeDataState = {
  realtimeData: [],
  toastNotification: [],
  realtimeDataStatus: Status.IDLE,
  realtimeDataError: null,
}

const realtimeDataSlice = createSlice({
  name: "realtimeData",
  initialState,
  reducers: {
    upsertRealtimeData: (state, action: PayloadAction<RealTimeLprData>) => {
      const exists = state.realtimeData.some(
        (d) => d.id === action.payload.id
      );
      if (!exists) {
        state.realtimeData.unshift(action.payload);
        if (state.realtimeData.length > 20) state.realtimeData.length = 20;
      }
    },
  },
  extraReducers: () => {

  }
})

export const { upsertRealtimeData } = realtimeDataSlice.actions;

export default realtimeDataSlice.reducer