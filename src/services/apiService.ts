import axios from "axios";

const API_BASE_URL = "http://localhost:8371/api/v0.0.1/";

const apiService = axios.create({
  baseURL: API_BASE_URL,
});

apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiService;
