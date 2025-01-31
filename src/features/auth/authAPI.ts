import { fetchClient, combineURL } from "../../utils/fetchClient"
import { API_URL } from '../../config/apiConfig';
import { LoginCredentials, LoginResponse, RefreshTokenResponse } from "./authTypes";

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  
  return await fetchClient<LoginResponse>(combineURL(API_URL, "/users/login"), {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  return await fetchClient<RefreshTokenResponse>(combineURL(API_URL, "/users/refresh"), {
    method: 'POST',
  });
}

export const logoutUser = async (): Promise<{ success: boolean }> => {
  await fetchClient<void>(combineURL(API_URL, "/users/logout"), {
    method: "POST",
  });
  return { success: true }
};