import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
// import { useDispatch } from "react-redux";
import { useDispatch } from "../redux/store";
import { logout } from "../redux/slice/auth/authSlice";

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
        <div>Account Details</div>
        <div>
          <p> UserId: {userId} </p>
          <p> Token: {token} </p>
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
