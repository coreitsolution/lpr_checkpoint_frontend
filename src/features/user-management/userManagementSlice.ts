import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Status } from "../../constants/statusEnum";
import { User } from "./userManagementTypes";
import { fetchUserAPI } from "./userManageAPI";

interface UserMgntState {
  users: User[];
  status: Status;
  error: string | null;
}

const initialState: UserMgntState = {
  users: [],
  status: Status.IDLE,
  error: null,
};

export const fetchUsers = createAsyncThunk("userMgmt/fetchUsers", async () => {
  const response = await fetchUserAPI();
  return response;
});

const userMgmtSlice = createSlice({
  name: "userMgmt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default userMgmtSlice.reducer;
