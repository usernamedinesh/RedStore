import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
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
      <div>
        <div>Account Details</div>
        <div>
          <p> UserId: {userId} </p>
          <p> Token: {token} </p>
        </div>
        {!userId && (
          <div>
            <button onClick={Handlelogout}>LOGOUT</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Account;
