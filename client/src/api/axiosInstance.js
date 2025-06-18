import axios from "axios";
import { store } from "../redux/store";
import { auth } from "../redux/slice/auth/authSlice";

// export const API_URL = "http://localhost:3000";
// export const API_URL = "http://localhost:3000";
export const API_URL = "http://51.21.161.237/3000"; //backend ip
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // for accessing cookies or withCredentials
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
// if the newaccessToken is send by the server, then update the token in redux store

axiosInstance.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["x-access-token"];
    if (newAccessToken) {
      const currentUserId = store.getState().auth.userId;
      store.dispatch(auth({ userId: currentUserId, token: newAccessToken }));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const newAccessToken = error.response?.headers?.["x-access-token"];

    if (newAccessToken && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Optionally update Redux token here too:
      const currentUserId = store.getState().auth.userId;
      store.dispatch(auth({ userId: currentUserId, token: newAccessToken }));
      return axiosInstance(originalRequest);
    }

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
