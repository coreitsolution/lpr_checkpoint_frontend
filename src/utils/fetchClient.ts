import { API_URL, TELEGRAM_TOKEN } from '../config/apiConfig';

export interface FetchOptions extends RequestInit {
  queryParams?: Record<string, string>;
  skipAuth?: boolean;
  isFormData?: boolean;
  isTelegram?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } 
    else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Separate refresh token API call
const refreshTokenRequest = async (): Promise<{ accessToken: string }> => {
  const response = await fetch(`${API_URL}/users/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorDetails = await response.text()
    throw new Error(`Failed to refresh token: ${errorDetails}`)
  }

  return response.json();
};

export const fetchClient = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { queryParams, ...fetchOptions } = options;

  const executeRequest = async (token?: string) => {
    const headers: HeadersInit = {
      ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.isTelegram ? 
        { Authorization: `Bearer ${TELEGRAM_TOKEN}` } : 
        token && !options.skipAuth ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const queryString = queryParams
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";

    const response = await fetch(`${endpoint}${queryString}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const result = await refreshTokenRequest();
            const newToken = result.accessToken;
            localStorage.setItem('token', newToken);
            
            isRefreshing = false;
            processQueue(null, newToken);
            
            // Retry the original request with new token
            return executeRequest(newToken);
          } 
          catch (error) {
            processQueue(error);
            isRefreshing = false;
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw error;
          }
        } 
        else {
          // If refresh is already in progress, add request to queue
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => resolve(executeRequest(token)),
              reject: (error) => reject(error),
            });
          });
        }
      }
      else if (response.status === 400) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error(response.statusText);
    }

    return response.json();
  };

  const initialToken = localStorage.getItem('token') || undefined;
  return executeRequest(initialToken);
};

export const combineURL = (url: string, endpoint: string) => {
  return `${url}${endpoint}`;
};