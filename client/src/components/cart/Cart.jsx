import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCartProduct } from "../../api/productApi";

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
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCartProduct(),
    enabled: !!userId && !!token, // only run query if userId and token are available
  });

  if (isLoading) {
    return (
      <div className="text-center dark:text-white text-black font-bold text-lg">
        loading ...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center dark:text-white text-black font-bold text-lg">
        Error while fetching cart product: {error?.response.data.message}
      </div>
    );
  }

  console.log("product: ", productData);

  useEffect(() => {
    if ((!userId || !token) && location.pathname !== "/login") {
      navigate("/login", { replace: true }); // `replace: true` prevents going "back" to protected page
    }
  }, [userId, token, navigate]);

  return (
    <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white mb-3.5 ">
      <h1>Shopping Cart</h1>
      {/*Show prodcut */}
      {/*add two button [remove] and [buynow]  */}
    </div>
  );
}

export default CartPage;
