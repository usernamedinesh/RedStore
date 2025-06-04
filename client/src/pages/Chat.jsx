import { useState } from "react";

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
function ChatPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUserId] = useState(users);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const openChat = (id) => {
    setSelectedUserId(id);
    setChatOpen(true);
  };

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
