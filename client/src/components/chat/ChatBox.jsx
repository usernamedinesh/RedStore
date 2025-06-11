import axios from "axios";
import socket from "../../socket/socket";
import { API_URL } from "../../api/axiosInstance";
import { useEffect, useState, useRef } from "react";
import { getChatMessages } from "../../api/customApi";

const ChatBox = ({ userId, ownerId, ownerName }) => {
  const [messages, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true); // 👈 loading state
  const [messageText, setMessageText] = useState("");

  const typingTimeoutRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getChatRoomId = (userId1, userId2) =>
    `chat_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;

  useEffect(() => {
    const handleMessage = (data) => {
      setMessage((prev) => [...prev, data]);
    };

    // if (!userId || !ownerId) return null;

    socket.emit("onlineUser", { userId: userId });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", ({ senderId }) => {
      if (senderId === ownerId) setIsTyping(true);
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === ownerId) setIsTyping(false);
    });
    socket.emit("joinRoom", { userId, ownerId });
    socket.on("receiveMessage", handleMessage);

    // Fetch message history
    const fetchMessages = async () => {
      try {
        const response = await getChatMessages(userId, ownerId);
        const data = await response;
        setMessage(data.data.messages);
        setLoading(false); // Set loading to false after fetching messages
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };
    fetchMessages();

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [userId, ownerId]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      content: input,
      type: "TEXT",
      userId,
      ownerId,
      senderType: "USER",
    };
    socket.emit("sendMessage", newMessage);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessageText(value);

    socket.emit("typing", {
      roomId: getChatRoomId(userId, ownerId),
      senderId: userId,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        roomId: getChatRoomId(userId, ownerId),
        senderId: userId,
      });
    }, 1000);
  };
  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-white">{ownerName}</h3>
        <span
          className={`h-2 w-2 rounded-full ${
            onlineUsers.includes(ownerId) ? "bg-green-500" : ""
          }`}
        />
      </div>

      <div className="border border-gray-300 h-96 overflow-y-scroll p-3 rounded-md  bg-amber-200 ">
        {loading ? (
          <div className="text-center text-gray-400 mt-4">Loading chat...</div>
        ) : Array.isArray(messages) && messages.length === 0 ? (
          <div className="text-center mt-4 text-black">
            This is the start of your conversation.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`my-2 flex ${
                msg.senderUserId === userId ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "TEXT" ? (
                <div className="inline-block bg-gray-100 text-sm px-4 py-2 rounded-md max-w-xs break-words text-black">
                  {msg.text}
                </div>
              ) : (
                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  [Media Message]
                </a>
              )}
            </div>
          ))
        )}
        <div className="border-t border-gray-300 pt-2 h-6">
          {isTyping && (
            <p className="text-sm italic text-gray-400 ">Typing...</p>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-10 flex gap-2">
        <input
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping(e);
          }}
          className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
