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

  useEffect(() => {
    if ((!userId || !token) && location.pathname !== "/login") {
      navigate("/login", { replace: true }); // `replace: true` prevents going "back" to protected page
    }
  }, [userId, token, navigate, location.pathname]);

  if (!token || !userId) return null;

  const {
    data: productData,
    isLoading,
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCartProduct(),
    enabled: true,
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
        Error: {error?.response.data.message}
      </div>
    );
  }

  console.log("product: ", productData); //TODO: remove
  const cartProduct = productData?.data?.data?.products || [];

  return (
    <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white mb-3.5 ">
      <div>
        {isFetching ? (
          <div className="text-center dark:text-white text-black font-bold text-lg">
            Updating cart products...
          </div>
        ) : (
          <div className="text-center dark:text-white text-black font-bold text-lg mt-5">
            Cart has {cartProduct.length} products
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-7 max-w-[1400px] mx-auto px-4 lg:h-[500px] w-[360px] sm:w-full">
        {cartProduct.map((product) => (
          <div
            key={product.id}
            className="cursor-pointer border p-4 rounded-lg shadow-md hover:shadow-xl 
                     flex flex-col items-center text-center duration-300 ease-in-out 
                     hover:-translate-y-1 hover:scale-105 transition-all h-full"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-32 object-contain mb-2"
            />
            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600 mb-2">${product.price}</p>
            {/* Add buttons for remove and buy now */}
            <button className="bg-red-500 text-white px-4 py-2 rounded mr-2">
              Remove
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Buy Now
            </button>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        {cartProduct.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <p className="text-gray-700">
            Total items in cart: {cartProduct.length}
          </p>
        )}
      </div>
      {/*Show prodcut */}
      {/*add two button [remove] and [buynow]  */}
    </div>
  );
}

export default CartPage;
