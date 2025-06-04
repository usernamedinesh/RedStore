import axios from "axios";
import socket from "../../socket/socket";
import { API_URL } from "../../api/axiosInstance";
import { useEffect } from "react";

const ChatBox = ({ userId, ownerId }) => {
  const [messages, setMessage] = React.useState([]);
  const [input, setInput] = React.useState("");
  const messagesEndRef = useRef(null);

  const roomId = `chat_${userId}_${ownerId}`;

  React.useEffect(() => {
    //Join the chat room
    socket.emit("joinRoom", userId, ownerId);

    // fetch the previous messages
    axios
      .get(`${API_URL}/chat/${roomId}/${ownerId}`)
      .then((response) => setMessage(response.data.messages))
      .catch((error) => console.error("Error fetching messages:", error));

    // Listen for new messages
    socket.on("receiveMessage", (data) => {
      setMessage((prevMessages) => [...prevMessages, data.messages]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, ownerId, roomId]);

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
      <h3 className="text-xl font-semibold mb-4">Chat with Product Owner</h3>

      <div className="border border-gray-300 h-96 overflow-y-scroll p-3 rounded-md bg-white shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`my-2 flex ${msg.senderUserId === userId ? "justify-end" : "justify-start"}`}
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
        ))}
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
