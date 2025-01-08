export interface FetchOptions extends RequestInit {
  queryParams?: Record<string, string>;
  skipAuth?: boolean;
  isFormData?: boolean;
}

export const fetchClient = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { queryParams } = options;
  // const { queryParams, ...fetchOptions } = options;
  // const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
    // ...(token && !options.skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...({ Authorization: `Bearer eb1b94cfd6971df4a73991580e1664cfbd8d830c5bd784e92ead3d7de9a9c874` }),
    ...options.headers,
  };

  const queryString = queryParams
    ? "?" + new URLSearchParams(queryParams).toString()
    : "";

  const response = await fetch(`${endpoint}${queryString}`, {
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