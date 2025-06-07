export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/user/auth",
    REGISTER: "/user/register",
    LOGOUT: "/user/logout",
    PROFILE: "/user/profile",
  },
  VEHICLES: {
    BASE: "/car/user",
    DETAIL: (id: string) => `/vehicles/${id}`,
    CREATE: "/car/create",
    UPDATE: (id: string) => `/vehicles/${id}`,
    DELETE: (id: string) => `/car/delete/${id}`,
  },
  MAINTENANCE: {
    BASE: "/maintenance/user",
    DETAIL: (id: string) => `/maintenance/${id}`,
    CREATE: "/maintenance/create",
    UPDATE: (id: string) => `/maintenance/${id}`,
    DELETE: (id: string) => `/maintenance/${id}`,
  },
};

export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export type { ApiResponse } from "@/domain/common/types";
