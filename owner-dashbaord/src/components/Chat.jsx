import { useEffect, useState, useRef } from "preact/hooks";
import { useSocket } from "../customComponents/socketContext.jsx";
import { useAppContext } from "../customComponents/context";
import axios from "axios";

export function Chat() {
  const socket = useSocket();
  const { data } = useAppContext();
  const [chatUser, setChatUser] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const getChatRoomId = (userId1, userId2) =>
    `chat_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;

  useEffect(() => {
    socket.connect();
    socket.emit("onlineUser", { userId: data.id });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", ({ senderId }) => {
      if (senderId === selectedUser) setIsTyping(true);
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser) setIsTyping(false);
    });

    const handleMessage = (message) => {
      setChatMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleMessage);

    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/chat/admin/partners",
          { userId: data.id },
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
      socket.off("onlineUsers");
      socket.off("typing");
      socket.off("stopTyping");
      socket.disconnect();
    };
  }, [selectedUser]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    const messagePayload = {
      content: messageText,
      type: "TEXT",
      userId: selectedUser,
      ownerId: data.id,
      senderType: "OWNER",
    };

    socket.emit("sendMessage", messagePayload);
    setMessageText("");
    socket.emit("stopTyping", {
      roomId: getChatRoomId(selectedUser, data.id),
      senderId: data.id,
    });
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessageText(value);

    socket.emit("typing", {
      roomId: getChatRoomId(selectedUser, data.id),
      senderId: data.id,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        roomId: getChatRoomId(selectedUser, data.id),
        senderId: data.id,
      });
    }, 1000);
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
                className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                  selectedUser === user.id
                    ? "bg-blue-200"
                    : "bg-gray-100 hover:bg-blue-100"
                }`}
              >
                <span>{user.name}</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    onlineUsers.includes(user.id) ? "bg-green-500" : ""
                  }`}
                />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Chat */}
        <main className="flex-1 bg-white flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, idx) => {
                const isOwnerMessage = msg.senderOwnerId === data.id;
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isOwnerMessage ? " ml-100" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-2 rounded-lg ${
                        isOwnerMessage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
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
            <div className="h-7 text-end">
              {isTyping && (
                <p className="text-sm italic text-gray-400 mt-2 h-7">
                  Typing...
                </p>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 flex gap-2"
          >
            <input
              type="text"
              value={messageText}
              onInput={handleTyping}
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
