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
  success: boolean
  message: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface UserInfoResponse {
  status: string
  success: boolean
  limit: number
  filteredCount: number
  page: number
  count: number
  countAll: number
  data: UserInfo[]
}

export interface UserInfo {
  id: string
  username: string
  password: string
  email: string
  phone: string
  role: string
  visible: number
  active: number
  deleted: number
  deleted_by_id: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}