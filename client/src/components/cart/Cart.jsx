import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if ((!userId || !token) && location.pathname !== "/login") {
      navigate("/login", { replace: true }); // `replace: true` prevents going "back" to protected page
    }
  }, [userId, token, navigate]);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>Your cart is empty.</p>
    </div>
  );
}

export default CartPage;
