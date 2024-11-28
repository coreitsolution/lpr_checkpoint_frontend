import { BASE_URL } from "./endpoints";
import { mockService } from "../../mocks/mockService";

// const isDevelopment = process.env.NODE_ENV === "development";
const isDevelopment = "development";

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const handleErrors = async (response: Response): Promise<void> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }
};

const request = async (url: string, method: string, data?: any) => {
  if (isDevelopment) {
    return mockService[method.toLowerCase() as keyof typeof mockService](
      url,  
      data
    );
  }

  const token = getToken();

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // เพิ่ม token ใน header ถ้ามี
    },
  };

  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${BASE_URL}/${url}`, options);
  await handleErrors(response);
  return await response.json();
};

export const apiService = {
  get: (url: string, id?: string | number) => {
    return request(url, "get", id);
  },
  post: (url: string, data: any) => request(url, "post", data),
  postWithIds: (url: string, ids: string[] | number[]) => {
    // This method uses POST to send multiple IDs in the request body
    return request(url, "post", { ids });
  },
  patch: (url: string, data: any) => request(url, "patch", data),
  delete: (url: string) => request(url, "delete"),
};
