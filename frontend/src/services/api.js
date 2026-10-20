import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getCsrfToken = async () => {
  const response = await api.get("/auth/csrf");
  return response.data?.csrfToken || null;
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();

  if (!["get", "head", "options"].includes(method)) {
    // Get a fresh token so it matches the current csrf_token cookie.
    const csrf = await getCsrfToken();

    if (csrf) {
      config.headers["x-csrf-token"] = csrf;
    }
  }

  return config;
});

export default api;