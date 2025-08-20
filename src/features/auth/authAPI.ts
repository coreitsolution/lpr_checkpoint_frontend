import { fetchClient, combineURL } from "../../utils/fetchClient"
import { getUrls } from '../../config/runtimeConfig';
import { LoginCredentials, LoginResponse, RefreshTokenResponse } from "./authTypes";

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { API_URL } = getUrls();
  return await fetchClient<LoginResponse>(combineURL(API_URL, "/users/login"), {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const { API_URL } = getUrls();

  return await fetchClient<RefreshTokenResponse>(combineURL(API_URL, "/users/refresh"), {
    method: 'POST',
  });
}

export const logoutUser = async (): Promise<{ success: boolean }> => {
  const { API_URL } = getUrls();
  await fetchClient<void>(combineURL(API_URL, "/users/logout"), {
    method: "POST",
  });
  return { success: true }
};