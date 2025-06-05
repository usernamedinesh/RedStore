import { createContext, useContext } from "react";
import socket from "../socket/socket";

const socketContext = createContext(null);

export const useSocket = () => useContext(socketContext);

export const SocketProvider = ({ children }) => {
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};
