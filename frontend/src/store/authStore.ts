import { create } from "zustand";
import { loginApi, registerApi, type LoginPayload, type RegisterPayload } from "../services/api/authApi";

export interface User {
  id?: number;
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (credentials: LoginPayload) => Promise<boolean>;
  register: (data: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await loginApi(credentials);
      const token = res.access_token;
      const userInfo: User =
        res.user || {
          email: credentials.email,
        };
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));
      
      set({
        token,
        user: userInfo,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ")
          : err?.message || "Login failed. Please check your credentials.";
      set({ loading: false, error: message });
      return false;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const createdUser = await registerApi(data);
      
      const res = await loginApi({ email: data.email, password: data.password });
      const token = res.access_token;

      const userInfo: User = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      set({
        token,
        user: userInfo,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ")
          : err?.message || "Registration failed. Please try again.";
      set({ loading: false, error: message });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
