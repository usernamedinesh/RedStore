import { useState } from "react";
import { login } from "../../api/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { auth } from "../../redux/slice/auth/authSlice";
import {useNavigate} from "react-router";


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
        toast.success("Login Successfull!", {
          position: top,
        });
        const resp = response.data;
        console.log("resp: ", resp)
        console.log("token  : ",resp.data.accessToken)
        console.log("user  : ",resp.data.user.id)
            
        //stored in redux
        dispatch(auth({ userId: resp.data.user.id, token: resp.data.accessToken }));
        console.log("login successfull");
        // navigate to the /  
          navigate("/");
      }
    } catch (err) {
        //  if (err.response.status === 400) {
        // means otp is expired or wrong otp
        //  toast.error(err?.response?.data?.message);
      //}
      const errorMessage =  err?.response?.data?.message || "something went wrong!";
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
    <div className="dark:bg-[var(--my-bg)]  dark:text-white h-screen w-full bg-sky-200 flex flex-col items-center justify-center space-y-6 p-4">
      <h3 className="text-2xl font-semibold"> Login Here</h3>

      <div className="flex bg-sky-200 rounded w-1/2 max-w-sm justify-evenly">
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
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
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
          onChange={(e) => SetPassword(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <button
          type="submit"
          onClick={HandleLogin}
          className="  btn-border-reveal h-10 w-[50px] text-white px-6 py-2 rounded  transition-colors duration-300 scale-100 hover:scale-105"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default Login;
