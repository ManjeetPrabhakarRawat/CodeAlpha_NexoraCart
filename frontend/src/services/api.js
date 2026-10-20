import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const readCsrf = () =>
  document.cookie
    .split("; ")
    .find((x) => x.startsWith("csrf_token="))
    ?.split("=")[1];

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();
  if (!["get", "head", "options"].includes(method)) {
    let csrf = readCsrf();
    if (!csrf) {
      try {
        await api.get("/auth/csrf");
        csrf = readCsrf();
      } catch (_) {
        // Let the original request return the normal authentication/CSRF error.
      }
    }
    if (csrf) config.headers["x-csrf-token"] = csrf;
  }
  return config;
});

export default api;
