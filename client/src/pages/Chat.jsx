import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useLocation } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getParterForChating } from "../api/customApi";
import ChatBox from "../components/chat/ChatBox";

/*
 * i want a feature here when i can toggle this to left or right
 * i dont know how to do this but i want here
 * i can toggle the users list  left or right
 */
const users = [
  { name: "dinesh", id: 1 },
  { name: "Ramesh", id: 2 },
  { name: "sures", id: 3 },
  { name: "Ansri", id: 4 },
  { name: "priya", id: 5 },
];

// DO i need to connect socket here
function ChatPage() {
  const socket = useSocket();
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUserId] = useState(users);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userID, setUserID] = useState("");
  const [ownerID, setOwnerID] = useState("");

  // access from state
  const location = useLocation();
  const { ownerId, userId, ownerName } = location.state || {};
  // setUserId(userId);
  // setSelectedUserId(userId);
  // setOwnerID(ownerId);

  // Use effect to handle socket connection status
  useEffect(() => {
    if (!socket) {
      console.warn("Socket is not available");
      return;
    }
    // Log the current status of the socket when the component renders/mounts
    console.log(
      `ChatPage: Initial socket status - Connected: ${socket.connected}, ID: ${socket.id || "N/A"}`,
    );
    if (!socket.connected) {
      console.log("ChatPage: Connecting socket...");
      socket.connect();
      setIsConnected(true);
    } else {
      console.log("ChatPage: Socket is already connected.");
      setIsConnected(true);
    }

    const onConnect = () => {
      // This code will run ONLY when the 'connect' event is emitted by the socket
      setIsConnected(true);
      console.log(`ChatPage: Socket connected successfully! ID: ${socket.id}`);
      // Any other logic you want to execute immediately upon connection
      // e.g., socket.emit('joinRoom', { userId: '...', ownerId: '...' });
    };
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      // Cleanup function to remove event listeners if needed
      socket.off("connect", onConnect);
      socket.off("connection", onDisconnect);
    };
  }, [socket]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partners", userId], // include userId in key for caching
    queryFn: () => getParterForChating(userId),
  });
  console.log("data: ", data); //TODO: remove this later

  const openChat = (id) => {
    setSelectedUserId(id);
    setChatOpen(true);
  };

  //NOTE:
  /*
   * In the state there is userId and ownerId
   * it means user is comming directly from the sing_product_page
   * here direclty need to open that ChatBox with that ownerId
   */

  useEffect(() => {
    if (userId && ownerId) {
      setUserID(userId);
      setOwnerID(ownerId);
      setSelectedUserId(ownerId); // Assuming userId is the ID of the user to chat with
      setChatOpen(true); // Automatically open chat if userId and ownerId are present
    }
  }, [userId, ownerId]);

  return (
    <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white flex  gap-10">
      <div className="w-1/6 mt-10 ml-10">
        {/*list of users to chat */}
        <ul className="text-xl">
          {data?.partners?.length > 0 ? (
            data.partners.map((u) => (
              <li
                key={u.id}
                onClick={() => openChat(u.id)}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
              >
                {u.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No chat partners found.</li>
          )}
        </ul>
      </div>
      {/* actual chat */}
      {/*  I should make it component */}
      {chatOpen ? (
        <div className="w-2/3 mt-10">
          {/* Here you can render the ChatBox component */}
          <ChatBox userId={userId} ownerId={ownerId} ownerName={ownerName} />
          {/* For now, just a placeholder */}
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Feel Free To Caht Here </h1>
          <p className="text-gray-500">Click on a user to start chatting.</p>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
