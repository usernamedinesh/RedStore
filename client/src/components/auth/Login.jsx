import { useState } from "react";

const Login = () => {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [error, SetError] = useState("");

  const HandleLogin = () => {
    if (!email || !password) {
      SetError("Please fill in all fields");
    }
    if (error) {
      console.log("ERROR: ", error);
    }

    console.log("EMAILI: ", email);
    console.log("PASSWORD: ", password);
  };

  return (
    <div className="h-screen w-full bg-sky-200 flex flex-col items-center justify-center space-y-6 p-4">
      <h3 className="text-2xl font-semibold"> Login Here</h3>

      <div className="w-full max-w-sm">
        <label htmlFor="email" className="block mb-2 font-medium">
          Email
        </label>
        <input
          id="email"
          type="text"
          placeholder="Enter Your Email"
          required
          name="email"
          value={email}
          onChange={(e) => SetEmail(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

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
