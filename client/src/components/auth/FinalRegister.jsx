// lets generate this page dynamically
import { useEffect, useState } from "react";
import { useLocation, useParams, Navigate, useNavigate } from "react-router";
import { register } from "../../api/authApi";
import { toast } from "react-toastify";

export const FormRegister = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  /*
   * IF the user reload or page return to /login route
   */

  /* not workign */
  // useEffect(() => {
  //   const fromRegister = sessionStorage.getItem("fromRegister");
  //   if (!fromRegister) {
  //     navigate("/login", { replace: true });
  //   } else sessionStorage.removeItem("fromRegister");
  // }, [navigate]);

  const [emailOrPhone, setEmailOrPhone] = useState(state?.emailOrPhone || "");
  const [checkEmailOrPhone, setCheckEmailOrPhone] = useState(
    state?.type === "email" ? "email" : "phone",
  );
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // protectt the route
  if (!state || !state.fromRegister) {
    return <Navigate to="/" replace />;
  }
  /* 
   --- HERE  ---
  date: 
  "name":"diensh boro", 
  "email":"myaovalor@gmail.com",
  // "phoneNo":"+919365646114",
  "password":"dineshonly123",
  "otp":"4334"

    */
  const handleFinalSubmit = async () => {
    setLoading(true);
    const payload = {
      name,
      password,
      otp,
    };
    if (checkEmailOrPhone === "email") {
      payload.email = emailOrPhone;
    } else {
      payload.phoneNo = emailOrPhone;
    }

    try {
      const response = await register(payload);
      if (response.status === 201) {
        setLoading(false);
        toast.success(response.data.message);
        const resp = response.data;
        /*
         * Registration successful
         TODO:
        * ---@parmas{id: response.data.accessToken}
        *  ---@params{user: response.data.user}
        *  store in redux store
         * I need thing here  {id} and {accessToken}
         */
        console.log("accessToken: ", resp.accessToken);
        console.log("id: ", resp.user.id);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      console.error("Error from server:", errorMessage);
      toast.error(errorMessage);
      setError(errorMessage); // show meaningful error message to user
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Complete the From and submit</h1>
      <div className="w-full max-w-sm">
        {/* EMAIL EDITONLY */}
        <label htmlFor="input" className="block mb-2 font-medium">
          {checkEmailOrPhone === "email" ? "Email" : "Phone Number"}
        </label>
        <input
          id="input"
          type={checkEmailOrPhone === "email" ? "email" : "tel"}
          value={emailOrPhone}
          readOnly
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* NAME  */}
      <div className="w-full max-w-sm">
        <label htmlFor="password" className="block mb-2 font-medium">
          Name
        </label>
        <input
          id="text"
          type="text"
          placeholder="Enter Your Name"
          required
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* {PASSWORD} */}
      <div className="w-full max-w-sm">
        <label htmlFor="password" className="block mb-2 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter Your Password"
          required
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* {CONFIRM PASSWORD} */}
      <div className="w-full max-w-sm">
        <label htmlFor="password" className="block mb-2 font-medium">
          Confirm Your Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Confirm Your Password"
          required
          name="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* {OTP} */}
      <div className="w-full max-w-sm">
        <label htmlFor="password" className="block mb-2 font-medium">
          Enter Your OTP
        </label>
        <input
          id="number"
          type="number"
          placeholder="Enter  Your OTP"
          required
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
      <div className="mt-7">
        <button
          type="button"
          onClick={handleFinalSubmit}
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
