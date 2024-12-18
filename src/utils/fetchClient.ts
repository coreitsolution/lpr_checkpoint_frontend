export interface FetchOptions extends RequestInit {
  queryParams?: Record<string, string>;
  skipAuth?: boolean;
  isFormData?: boolean;
}

export const fetchClient = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && !options.skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    throw new Error(response.statusText);
  }

  return response.json();
};

export const combineURL = (url:string, endpoint:string) => {
  return `${url}${endpoint}`
}