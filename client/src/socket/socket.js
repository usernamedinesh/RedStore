import { io } from "socket.io-client";
import { API_URL } from "../api/axiosInstance";

export const connectToServer = () => {};
const socket = io(API_URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  withCredentials: true,
});

export default socket;
