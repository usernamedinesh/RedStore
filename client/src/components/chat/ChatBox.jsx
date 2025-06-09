import axios from "axios";
import socket from "../../socket/socket";
import { API_URL } from "../../api/axiosInstance";
import { useEffect, useState, useRef } from "react";

const ChatBox = ({ userId, ownerId, ownerName }) => {
  const [messages, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true); // 👈 loading state
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessage((prev) => [...prev, data]);
    };

    socket.emit("joinRoom", { userId, ownerId });
    socket.on("receiveMessage", handleMessage);

    // Fetch message history
    axios
      .get(`${API_URL}/chat/${userId}/${ownerId}`)
      .then((res) => {
        setMessage(res.data?.messages || []); // 👈 fallback to []
      })
      .catch(console.error)
      .finally(() => setLoading(false)); // 👈 done loading

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
    };

    socket.emit("sendMessage", newMessage);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h3 className="text-xl font-semibold mb-4 text-white">
        Chat with Product Owner: {ownerName}
      </h3>

      <div className="border border-gray-300 h-96 overflow-y-scroll p-3 rounded-md bg-white shadow-sm">
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
                <div className="inline-block bg-gray-100 text-sm px-4 py-2 rounded-md max-w-xs break-words">
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
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
