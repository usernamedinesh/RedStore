import { useState } from "react";
import { verifyEmailOrPhone } from "../../api/authApi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [checkEmailOrPhone, setCheckEmailOrPhone] = useState("email");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!inputValue.trim()) {
      setError("Please fill in the field.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await verifyEmailOrPhone(inputValue);
      console.log("Response from API:", response.status); //NOTE: remove

      if (response.error) {
        setError(response.error);
      } else if (response.status === 201) {
        toast.success("otp sent successfully!");
        console.log("Verification successful!", response.data); //NOTE: remove
        /*
         * NOTE:
         *  lest store  the {fromRegister: true}
         *  IN sessionStorage
         */
        sessionStorage.setItem("fromRegister", true);
        navigate(`/success/${checkEmailOrPhone}`, {
          state: {
            emailOrPhone: inputValue, // i dont need to send this  btw
            type: checkEmailOrPhone,
            fromRegister: true,
          },
        });
      }
    } catch (err) {
      toast.error("Error while sending otp");
      const errorMessage =
        err?.response.data.message || "something went wrong!";
      console.error("Error from server:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isPhoneOrMail = (type) => {
    setCheckEmailOrPhone(type);
    setInputValue("");
    setError("");
  };

  return (
    <div className="h-screen w-full  flex flex-col items-center justify-center space-y-6 p-4 bg-[var(--my-bg)] dark:bg-[var(--my-bg)] text-black dark:text-white">
      <h3 className="text-2xl font-semibold">Register Here</h3>

      <div className="flex  rounded w-1/2 max-w-sm justify-evenly">
        <button
          type="button"
          onClick={() => isPhoneOrMail("email")}
          className={`px-8 py-2 rounded shadow transition-colors duration-200 ${
            checkEmailOrPhone === "email"
              ? "bg-green-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => isPhoneOrMail("phone")}
          className={`px-8 py-2 rounded shadow transition-colors duration-200 ${
            checkEmailOrPhone === "phone"
              ? "bg-green-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Phone
        </button>
      </div>

      <div className="w-full max-w-sm">
        <label htmlFor="input" className="block mb-2 font-medium">
          {checkEmailOrPhone === "email" ? "Email" : "Phone Number"}
        </label>
        <input
          id="input"
          type={checkEmailOrPhone === "email" ? "email" : "tel"}
          placeholder={
            checkEmailOrPhone === "email"
              ? "Enter Your Email"
              : "Enter Your Phone Number"
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {loading && (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className={`btn-border-reveal h-10 w-[100px] text-white px-6 py-2 rounded transition-colors duration-300 scale-100 hover:scale-105 ${
            loading ? "cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default Register;
