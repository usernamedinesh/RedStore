import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useLocation } from "react-router";

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
  const { ownerId, userId } = location.state || {};
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

  return (
    <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white flex  gap-10">
      <div className="w-1/6 mt-10 ml-10">
        {/*list of users to chat */}
        <ul className="text-xl">
          {user.map((u) => {
            return (
              <li
                key={u.id}
                onClick={() => {
                  openChat(u.id);
                }}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
              >
                {u.name}
              </li>
            );
          })}
        </ul>
      </div>
      {/* actual chat */}
      {chatOpen ? (
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to Chat!</h1>
          {/* This is where your chat messages, input field, etc., will go */}
          <div className="border border-gray-300 dark:border-gray-600 p-4 h-64 overflow-y-auto mb-4 rounded">
            {/* Example chat messages */}

            <div>
              {selectedUserId ? (
                <div>
                  <p className="text-gray-500">
                    User {user.find((u) => u.id === selectedUserId).name}:
                    Hello!
                  </p>
                  <p> Hey there!</p>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          {/* Chat input field */}
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
