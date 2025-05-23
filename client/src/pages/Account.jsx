import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

function Account() {
  document.title = "profile";
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token } = useSelector((state) => state.auth);
  useEffect(() => {
    if ((!userId || !token) && location.pathname !== "/login") {
      navigate("/login", { replace: true }); // `replace: true` prevents going "back" to protected page
    }
  }, [userId, token, navigate]);

  return (
    <>
      <div>
        <div>Account Details</div>
        <div>
          <p> UserId: {userId} </p>
          <p> Token: {token} </p>
        </div>
      </div>
    </>
  );
}

export default Account;
