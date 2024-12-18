import { fetchClient } from '../../utils/fetchClient'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  user: any
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  
  return await fetchClient<LoginResponse>("/login", {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export const logoutUser = async (): Promise<void> => {
  
  return Promise.resolve()
}