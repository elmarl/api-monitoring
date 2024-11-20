import axiosInstance from "./axiosInstance";

// Authentication APIs
export const register = (email: string, password: string, name?: string) => {
  return axiosInstance.post("/users/register", { email, password, name });
};

export const login = (email: string, password: string) => {
  return axiosInstance.post("/auth/login", { email, password });
};

// API Keys APIs
export const fetchAPIKeys = () => {
  return axiosInstance.get("/api-keys");
};

export const generateAPIKey = () => {
  return axiosInstance.post("/api-keys");
};

export const revokeAPIKey = (id: string) => {
  return axiosInstance.delete(`/api-keys/${id}`);
};

// Usage Data APIs
export const logUsage = (usageData: any) => {
  return axiosInstance.post("/usage", usageData);
};
