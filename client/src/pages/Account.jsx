import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router";
// import { useDispatch } from "react-redux";
import { useDispatch } from "../redux/store";
import { logout } from "../redux/slice/auth/authSlice";
import ShowAddress from "../components/address/ShowAddr";
import Profile from "../components/auth/Profile";

function Account() {
  document.title = "profile";
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userId, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if ((!userId || !token) && location.pathname !== "/login") {
      navigate("/login", { replace: true }); // `replace: true` prevents going "back" to protected page
    }
  }, [userId, token, navigate]);

  // logout func
  const Handlelogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white mb-3.5 ">
        <div className="flex justify-between items-center p-4">
          <h3>Account Details</h3>
          <NavLink
            to={-1}
            // className="text-red-700 dark:text-red-400 font-bold hover:underline hover:shadow-2xl"

            className=" text-gray-900 dark:text-back 
             bg-gradient-to-r from-teal-300 to-lime-300 
             hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 
             focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-teal-700 
             font-medium rounded-lg text-sm px-10 py-2.5 text-center me-2 
             transform transition-transform duration-300 ease-in-out 
             hover:scale-105 hover:shadow-lg shadow-md dark:shadow-lg"
          >
            back
          </NavLink>
        </div>
        <div>
          {/* <p> UserId: {userId} </p> */}
          {/* <p> Token: {token} </p> */}
        </div>
        <div>{<Profile />}</div>
        <div>
          <ShowAddress />
        </div>
        {userId && (
          <div>
            <button
              onClick={Handlelogout}
              className=" font-bold   fixed bottom-6 right-6 z-50 dark:bg-gray-800 bg-gray-900  text-red-500 px-4 py-2 rounded-full shadow-lg hover:bg-gray-400 transition dark:hover:bg-gray-900"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Account;
