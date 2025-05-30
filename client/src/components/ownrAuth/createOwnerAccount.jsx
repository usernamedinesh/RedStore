import { useState } from "react";
import { registerForOwnrAccount } from "../../api/authApi";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

/*
 * access token
 * get passport and name
 *
 */
function CreateOwnerAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    const response = await registerForOwnrAccount(name, password, token);

    if (response.success) {
      setError(null);
      toast.success(response.message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/");
    } else {
      // Handle error
      setError(
        response?.message || "Failed to create account. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="bg-[var(--my-bg)] dark:bg-[var(--my-bg)] text-black dark:text-white mb-3.5 px-6 py-8 rounded-lg shadow-md max-w-md mx-auto mt-10 border border-gray-300 dark:border-gray-700 ">
        <div className="text-center mt-10">
          <h1>Create Owner Account</h1>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
          <div className="w-full max-w-sm  ">
            <label htmlFor="input" className="block mb-2 font-medium">
              Name
            </label>
            <input
              id="input"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="w-full max-w-sm  ">
            <label htmlFor="input" className="block mb-2 font-medium">
              Name
            </label>
            <input
              id="input"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleCreateAccount}
            className="px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors duration-200"
          >
            Create Account
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateOwnerAccount;
