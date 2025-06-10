import { useEffect } from "preact/hooks";
import { useSocket } from "../customComponents/socketContext.jsx";
import axios from "axios";

export function Chat() {
  const socket = useSocket();
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    //or do i need to fetch here? user
    const fetchUsers = async (userId) => {
      try {
        const response = await axios.get(
          "http://localhost:3000/chat/admin/partners",
          { userId },
        );
        if (response.status === 200) {
          const users = response.data;
          console.log("Fetched users:", users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    return () => {
      socket.disconnect();
      console.log("Disconnected from server");
    };
  });

  // i need to fetch all users annd their messages
  //TODO:

  return (
    <>
      <div></div>
      <h1>chat page here</h1>
    </>
  );
}
