import axios from "axios";
import { store } from "../redux/store";

export const API_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // enabling cookkies
});

// ✅ Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config) => {
    //Access Token From Redux Store
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Global API Error:", error);
      } else if (error.request) {
        console.error("Global Network Error:", error.message);
      } else {
        console.error("Global Request Setup Error:", error.message);
      }
    } else {
      console.error("Global Unexpected Error:", error);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
