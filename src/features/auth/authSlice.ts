import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthData } from './authTypes'
import { loginUser, logoutUser, refreshToken } from './authAPI'
import { Status } from "../../constants/statusEnum"

interface AuthState {
  authData: AuthData
  status: Status
  error: string | null
}

const initialState: AuthState = {
  authData: { 
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  status: Status.IDLE,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const response = await loginUser(credentials)
    return response
  }
)

export const refresh = createAsyncThunk(
  'auth/refresh',
  async () => {
    const response = await refreshToken()
    return response
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  return await logoutUser()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.authData.isAuthenticated = true
        state.authData.token = action.payload.accessToken
        localStorage.setItem('token', action.payload.accessToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || 'Login failed'
      })

      .addCase(refresh.pending, (state) => {
        state.status = Status.LOADING
        state.error = null
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.status = Status.SUCCEEDED
        state.authData.isAuthenticated = true
        state.authData.token = action.payload.accessToken
        localStorage.setItem('token', action.payload.accessToken)
      })
      .addCase(refresh.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || 'Login failed'
      })

      .addCase(logout.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.authData.token = null;
          state.authData.isAuthenticated = false;
          localStorage.removeItem("token");
        }
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer