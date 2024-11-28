export interface FetchOptions extends RequestInit {
  queryParams?: Record<string, string>;
}

export const fetchClient = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { queryParams, ...fetchOptions } = options;

  // สร้าง Query String
  const queryString = queryParams
    ? "?" + new URLSearchParams(queryParams).toString()
    : "";

  const response = await fetch(`${url}${queryString}`, {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Something went wrong");
  }

  return response.json();
};
