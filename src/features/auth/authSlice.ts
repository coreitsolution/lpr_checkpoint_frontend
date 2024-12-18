import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthData } from './authTypes'
import { loginUser, logoutUser } from './authAPI'
import { Status } from "../../constants/statusEnum"

interface AuthState {
  authData: AuthData
  status: Status
  error: string | null
}

const initialState: AuthState = {
  authData: { 
    token: null,
    isAuthenticated: false,
    user: null
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

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutUser()
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
        state.authData.token = action.payload.token
        state.authData.user = action.payload.user
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = Status.FAILED
        state.error = action.error.message || 'Login failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.authData.token = null
        state.authData.isAuthenticated = false
        state.authData.user = null
        localStorage.removeItem('token')
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer