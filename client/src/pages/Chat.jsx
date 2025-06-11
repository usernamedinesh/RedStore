import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getParterForChating } from "../api/customApi";
import ChatBox from "../components/chat/ChatBox";
import { useSelector } from "../redux/store";

function ChatPage() {
  const socket = useSocket();
  const [chatOpen, setChatOpen] = useState(false);
  const [ownerID, setOwnerID] = useState(null);
  const [ownerName, setOwnerName] = useState(null);
  const { userId } = useSelector((state) => state.auth);

  const location = useLocation();
  const locationOwnerId = location.state?.ownerId;
  const locationOwnerName = location.state?.ownerName;

  // When coming from product page
  useEffect(() => {
    if (userId && locationOwnerId) {
      setOwnerID(locationOwnerId);
      setOwnerName(locationOwnerName);
      setChatOpen(true);
    }
  }, [userId, locationOwnerId]);

  // When user clicks from list
  const openChat = (id, name) => {
    setOwnerID(id);
    setOwnerName(name);
    setChatOpen(true);
  };

  const { data } = useQuery({
    queryKey: ["partners", userId],
    queryFn: () => getParterForChating(userId),
    enabled: !!userId, // Avoid fetching with null userId
  });

  // Socket connection (optional improvement)
  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) socket.connect();

    const handleConnect = () => console.log("Socket connected:", socket.id);
    const handleDisconnect = () => console.log("Socket disconnected");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  return (
    <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)] dark:text-white flex gap-10">
      <div className="w-1/6 mt-10 ml-10">
        <ul className="text-xl">
          {data?.data?.partners?.length > 0 ? (
            data.data.partners.map((u) => (
              <li
                key={u.id}
                onClick={() => openChat(u.id, u.name)}
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

      {chatOpen && ownerID ? (
        <div className="w-2/3 mt-10">
          <ChatBox userId={userId} ownerId={ownerID} ownerName={ownerName} />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Feel Free To Chat Here</h1>
          <p className="text-gray-500">Click on a user to start chatting.</p>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
