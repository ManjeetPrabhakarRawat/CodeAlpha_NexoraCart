import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let csrfToken = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  const response = await api.get("/auth/csrf");
  csrfToken = response.data?.csrfToken || null;

  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();

  if (!["get", "head", "options"].includes(method)) {
    const csrf = await getCsrfToken();

    if (csrf) {
      config.headers["x-csrf-token"] = csrf;
    }
  }

  return config;
});

export const clearCsrfToken = () => {
  csrfToken = null;
};

export default api;