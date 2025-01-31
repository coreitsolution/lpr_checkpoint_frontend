export interface AuthData {
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  statusCode: number
  status: string
  sccess: boolean
  message: string
}

export interface RefreshTokenResponse {
  accessToken: string
}