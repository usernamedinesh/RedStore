import { io } from "socket.io-client";
import { API_URL } from "../api/axiosInstance";

// Lets make this page level
// The socket will connect to the server the chat page is loaded

export const connectToServer = () => {};
const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
