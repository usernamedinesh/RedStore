import { useState } from "react";
import { requestForOTP } from "../../api/authApi";

function OwnerReqForOTP() {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await requestForOTP(email);
      console.log("OTP request response:", response);
      if (!response.ok) {
        throw new Error("Failed to request OTP");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[var(--my-bg)] dark:bg-[var(--my-bg)] text-black dark:text-white mb-3.5 px-6 py-8 rounded-lg shadow-md max-w-md mx-auto mt-10 border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Request OTP for Owner Account
        </h2>

        {error && (
          <div className="text-red-500 text-sm mb-3 text-center">{error}</div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Enter Your Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            onClick={handleRequestOTP}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default OwnerReqForOTP;
