import { useEffect, useState, useRef } from "preact/hooks";
import { useSocket } from "../customComponents/socketContext.jsx";
import { useAppContext } from "../customComponents/context";
import axios from "axios";

export function Chat() {
  const socket = useSocket();
  const [chatUser, setChatUser] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { data } = useAppContext();

  const messagesEndRef = useRef(null);

  // Connect socket and listen for messages
  useEffect(() => {
    socket.connect();
    console.log("Connecting to socket...");

    const handleMessage = (message) => {
      setChatMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleMessage);

    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/chat/admin/partners",
          {
            userId: data.id,
          },
        );
        if (res.status === 200) {
          setChatUser(res.data.data.partners);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  // Join room and fetch messages when selected user changes
  useEffect(() => {
    if (!selectedUser) return;

    socket.emit("joinRoom", { userId: selectedUser, ownerId: data.id });

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/chat/${selectedUser}/${data.id}`,
        );
        setChatMessages(res.data.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Send message through socket
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    const messagePayload = {
      content: messageText,
      type: "TEXT",
      userId: selectedUser,
      ownerId: data.id,
      senderType: "OWNER", // or "USER" based on current user's role
    };

    socket.emit("sendMessage", messagePayload);
    setMessageText("");
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      <header className="p-4 bg-white shadow text-2xl font-bold text-gray-800">
        Chat Page
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white p-4 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Chat Users
          </h2>
          <ul className="space-y-2">
            {chatUser.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`p-2 rounded cursor-pointer ${
                  selectedUser === user.id
                    ? "bg-blue-200"
                    : "bg-gray-100 hover:bg-blue-100"
                }`}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Messages */}
        <main className="flex-1 bg-white flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, idx) => {
                const isOwnerMessage = msg.senderOwnerId === data.id;

                return (
                  <div
                    key={idx}
                    className={`flex ${isOwnerMessage ? "justify-end ml-100" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs p-2 rounded-lg ${
                        isOwnerMessage
                          ? "bg-blue-500 text-white self-end"
                          : "bg-gray-200 text-black self-start"
                      }`}
                    >
                      {msg.text || msg.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Start chatting...</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 flex gap-2"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded text-black"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
