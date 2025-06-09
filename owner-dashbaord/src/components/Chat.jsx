import { useEffect } from "preact/hooks";

import { useSocket } from "../customComponents/socketContext.jsx";
export function Chat() {
  const socket = useSocket();
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from server");
    };
  });
  return (
    <>
      <div></div>
      <h1>chat page here</h1>
    </>
  );
}
