import { createSlice } from '@reduxjs/toolkit';

interface RefreshState {
  cameraRefreshKey: number;
}

const initialState: RefreshState = {
  cameraRefreshKey: 0,
};

const refreshSlice = createSlice({
  name: 'refresh',
  initialState,
  reducers: {
    triggerCameraRefresh(state) {
      state.cameraRefreshKey += 1;
    },
  },
});

export const { triggerCameraRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
