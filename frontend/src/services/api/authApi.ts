import apiClient from "./client";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const registerApi = async (data: RegisterPayload): Promise<UserResponse> => {
  const payload = { ...data, password: data.password.slice(0, 72) };
  const response = await apiClient.post<UserResponse>("/api/v1/auth/register", payload);
  return response.data;
};

export const loginApi = async (data: LoginPayload): Promise<TokenResponse> => {
  const payload = { ...data, password: data.password.slice(0, 72) };
  const response = await apiClient.post<TokenResponse>("/api/v1/auth/login", payload);
  return response.data;
};
