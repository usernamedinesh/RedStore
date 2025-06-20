import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartProduct, removeProductCart } from "../../api/productApi";
import { toast } from "react-toastify";
import { InitiateOrder } from "../../api/orderApi";

// fetch all product that are in the db
// of cart

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { mutateAsync: removeFromCart } = useMutation({
    mutationFn: removeProductCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

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
    queryFn: getCartProduct,
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

  let cartProduct = productData?.data || [];

  let variantt;
  cartProduct.map((p) => {
    p.variants_in_cart.forEach((variant) => {
      variantt = variant;
    });
  });

  // console.log("variantt", variantt);
  // console.log("cartProduct", cartProduct);

  // lets user react-query so it manages the state of the cart products
  const handleRemove = async (p, v) => {
    // const response = await removeProductCart(v); // no need this
    const response = await removeFromCart(v); // use the mutation to remove from cart
    toast.success("Product removed from cart successfully!", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  /*
   ** **** BUY LOGIC ****
   * when user click to buy in both cases (single product or all cart prodcut  )
   * it create an order it will saved to db
   * and redirect to anther page summery
   * from summery to check each an every details
   * and make payment here
   * done
   */

  // buy single prodcut from cart
  // both call the same api
  const handleBuy = async (variantId) => {
    const response = await InitiateOrder(variantId);
    sessionStorage.setItem("orderId", "true");
    navigate("/order/summery", {
      state: response.data[0].id,
    });
  };

  // buy all product from the cart
  // i dont need to send here anything
  // it will take all project from the cart (from db)
  const checkoutAllProduct = async (product) => {
    const response = await InitiateOrder();
    console.log("response from function: ", response);

    sessionStorage.setItem("orderId", "true");
    navigate("/order/summery", {
      state: response.data[0].id,
    });
  };

  return (
    <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white mb-3.5 ">
      <div>
        {isFetching ? (
          <div className="text-center dark:text-white text-black font-bold text-lg">
            Updating cart products...
          </div>
        ) : (
          <div className="">
            <div className="text-center dark:text-white text-black font-bold text-lg mt-5">
              Cart has {cartProduct.length} products
            </div>
            <div className=" text-end">
              <span
                className="  text-gray-900 dark:text-back bg-gradient-to-r
                    from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-400
                    hover:to-lime-400 focus:ring-4 focus:outline-none
                    focus:ring-lime-300 dark:focus:ring-teal-700 font-medium rounded-lg
                    text-sm px-10 py-2.5 text-center me-2 transform transition-transform
                    duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-md
                    dark:shadow-lg"
                onClick={() => navigate(-1)}
              >
                back
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-7 max-w-[1400px] mx-auto px-4 lg:h-[500px] w-[360px] sm:w-full">
        {cartProduct.map((product) =>
          product.variants_in_cart.map((variantItem) => (
            <div
              key={`${product.product.id}-${variantItem.variant.id}`}
              className="cursor-pointer border p-4 rounded-lg shadow-md hover:shadow-xl 
                 flex flex-col items-center text-center duration-300 ease-in-out 
                 hover:-translate-y-1 hover:scale-105 transition-all h-full"
            >
              <img
                src={variantItem.variant.images[0].url}
                alt={product.product.name}
                className="w-full h-32 object-contain mb-2"
              />
              <h3 className="font-bold text-lg mb-1">{product.product.name}</h3>
              <p className="font-bold text-lg mb-1">
                price: {variantItem.variant.price}
              </p>
              <p className="font-bold text-lg mb-1">
                color: {variantItem.variant.color}
              </p>
              <p className="font-bold text-lg mb-1">
                size: {variantItem.variant.size}
              </p>
              <p className="font-bold text-lg mb-1">
                quantity: {variantItem.quantity}
              </p>
              <div className="justify-between gap-4 mt-3">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                  onClick={() =>
                    handleRemove(product.product.id, variantItem.variant.id)
                  }
                >
                  Remove
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                  onClick={() => handleBuy(variantItem.variant.id)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )),
        )}
      </div>
      <div className="text-center mt-4">
        {cartProduct.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div>
            <p className="text-gray-700">
              Total items in cart: {cartProduct.length}
            </p>
            <div>
              <button
                className="bg-green-600 border rounded-xl  px-2 py-2 mt-2 hover:bg-green-700 text-white font-bold"
                onClick={() => checkoutAllProduct(productData.data)}
              >
                checkout now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
