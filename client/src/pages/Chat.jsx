/*
 * i want a feature here when i can toggle this to left or right
 * i dont know how to do this but i want here
 * i can toggle the users list  left or right
 */
function ChatPage() {
  return (
    <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white flex  gap-10">
      <div className="w-1/6 mt-10 ml-10">
        {/*list of users to chat */}
        <ul className="text-xl">
          <li>user 1</li>
          <li>user 2</li>
          <li>user 3</li>
        </ul>
      </div>
      {/* actual chat */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Chat!</h1>
        {/* This is where your chat messages, input field, etc., will go */}
        <div className="border border-gray-300 dark:border-gray-600 p-4 h-64 overflow-y-auto mb-4 rounded">
          {/* Example chat messages */}
          <p>User 1: Hey there!</p>
          <p className="text-right">Me: Hi User 1!</p>
          <p>User 1: How are you doing?</p>
        </div>
        {/* Chat input field */}
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

export default ChatPage;
