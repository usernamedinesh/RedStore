import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

// fetch all product that are in the db
// of cart

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, token } = useSelector((state) => state.auth);
  const {
    data: productData,
    isLoading,
    isError,
    isFetching,
    error,
  } = useQuery({ queryKey: ["cart"], queryFn: [] });

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
