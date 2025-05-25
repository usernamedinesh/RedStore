import axios from "axios";
import { useSelector } from "../redux/store";
export const API_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Set a timeout of 10 seconds

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials in requests for cookies or sessions
});

/* Request intercepter to add the token */
axiosInstance.interceptors.response.use(
  (config) => {
    /* get token from redux */
    const { token } = useSelector((state) => state.auth);
    if (token) {
      // let test = config.headers.setAuthorization(`Bearer ${token}`);
      config.headers.Authorization = `Bearer ${token}`;
      // console.log("testURL:  ", test); //TODO: Remove
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* Response interceptor for global error handling*/
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      // Server responded with an error status (e.g., 401, 404, 500)
      if (error.response) {
        // You can add more specific logic here, e.g., redirect to login for 401
        // if (error.response.status === 401) {
        // Handle unauthorized: clear token, redirect to login
        // }
        console.error("global api error: ", error);
      } else if (error.request) {
        // Request made but no response received
        console.error("Glbal Network Error:", error.message);
      } else {
        // Something else happened in setting up the request
        console.error("Global Request Setup Error: ", error.message);
      }
    } else {
      console.error("Global Unexpected Error: ", error);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
