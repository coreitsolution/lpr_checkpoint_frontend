import { apiService } from "../apiService";

interface LoginResponse {
  token: string;
}

interface LoginData {
  username: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<void> => {
    const response = await apiService.post("auth/login", data);
    const { token } = response as LoginResponse;
    if (token) {
      localStorage.setItem("token", token); // เก็บ token ใน localStorage
    }
  },
};
