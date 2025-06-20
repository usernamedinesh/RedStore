import { useState } from "react";
import { login } from "../../api/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { auth } from "../../redux/slice/auth/authSlice";
import { NavLink, useNavigate } from "react-router";

/* DATA :
 
  "email":"myaovalor@gmail.com",
  "phoneNo":"+919365646114",
  "password":"dineshonly123"
 
 */
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, SetPassword] = useState("");
  const [checkEmailOrPhone, setCheckEmailOrPhone] = useState("email");
  const [error, SetError] = useState("");
  const [loading, SetLoading] = useState(false);

  const HandleLogin = async () => {
    SetError("");
    const payload = {
      password,
    };
    if (checkEmailOrPhone === "email") {
      payload.email = emailOrPhone;
    } else {
      payload.phoneNo = emailOrPhone;
    }

    //api call here
    try {
      const response = await login(payload);
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        if (response.data.data.isOwner) {
          // Check if it is OWNER
          // IF OWNER then redirect to admin page
          //stored in redux
          //lets not store in redux cuse i can't use it in admin page
          // If the user is an owner, redirect to the owner dashboard
          // navigate("/");
          const token = response.data.data.token;
          // window.location.href = `http://localhost:5174/admin/verify/?token=${token}`;
          window.location.href = `https://d2t617ub9q6m4z.cloudfront.net/admin/verify/?token=${token}`;
          return;
        }

        const resp = response.data;
        // store
        dispatch(
          auth({ userId: resp.data.user.id, token: resp.data.accessToken }),
        );
        /* navigate to the home page */
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "something went wrong!";
      console.error("Error from server:", errorMessage);
      SetError(errorMessage);
    } finally {
      SetLoading(false);
    }
  };

  const isPhoneOrMail = (type) => {
    setCheckEmailOrPhone(type);
    setEmailOrPhone("");
    SetError("");
  };

  return (
    <div className="bg-[var(--my-bg)] dark:bg-[var(--my-bg)] text-black dark:text-white mb-3.5 px-6 py-8 rounded-lg shadow-md max-w-md mx-auto mt-10 border border-gray-300 dark:border-gray-700 ">
      <h3 className="text-2xl font-semibold text-center"> Login Here</h3>

      {/* <div className="flex bg-sky-200 rounded w-1/2 max-w-sm   mt-5 "> */}
      {/* <div className="flex  rounded mt-5 mx-auto w-full sm:max-w-sm lg:max-w-xs ml-5 lg:justify-between gap-4 "> */}
      <div className="flex  rounded mt-5 w-full gap-x-2">
        <button
          type="button"
          onClick={() => isPhoneOrMail("email")}
          className={`flex-1 py-2 px-2 rounded shadow transition-colors duration-200 text-sm sm:text-base ${
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
          className={`flex-1 py-2 px-2 rounded shadow transition-colors duration-200 text-sm sm:text-base ${
            checkEmailOrPhone === "phone"
              ? "bg-green-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Phone
        </button>
      </div>
      <div className="w-full max-w-sm mt-5 ">
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
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {loading && (
        <div className="flex items-center justify-center ">
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

      <div className="w-full max-w-sm">
        <label htmlFor="password" className="block mb-2 mt-5 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter Your Password"
          required
          name="password"
          value={password}
          onChange={(e) => SetPassword(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className=" text-center">
        <button
          type="submit"
          onClick={HandleLogin}
          className=" mt-10 btn-border-reveal h-10 w-[50px] text-white  rounded  transition-colors duration-300 scale-100 hover:scale-105"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default Login;
