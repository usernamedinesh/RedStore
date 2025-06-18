import { io } from "socket.io-client";
import { API_URL } from "../api";

export const connectToServer = () => {};
const socket = io(`${API_URL}`, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
