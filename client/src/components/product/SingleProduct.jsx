import { useLocation, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addToCart } from "../../api/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChatBox from "../../components/chat/ChatBox";
import { useSelector } from "../../redux/store";

export const SingleProduct = () => {
  document.title = "single_product";
  const queryClient = useQueryClient();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { userId } = useSelector((state) => state.auth);
  const [showChat, setShowChat] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation();
  const product = state?.product || {};

  const { mutateAsync: addTOcart } = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  // console.log("Product:", product.variants);
  // Auto-select first variant
  useEffect(() => {
    if (product.variants?.length && !selectedVariant) {
      const defaultVariant = product.variants[0];
      setSelectedColor(defaultVariant.color);
      setSelectedSize(defaultVariant.size);
      setSelectedVariant(defaultVariant);
      if (defaultVariant?.images?.length) {
        setSelectedImage(defaultVariant.images[0].url);
      }
    }
  }, [product]);

  // Update selected variant when color & size change
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const match = product.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      );
      setSelectedVariant(match);
      if (match?.images?.length) {
        setSelectedImage(match.images[0].url);
      }
    }
  }, [selectedColor, selectedSize]);

  // Handle  add to cart
  const handleAddToCart = async (productId, variantId, quantity) => {
    const productData = {
      productId,
      variantId,
      quantity,
    };

    try {
      const response = await addTOcart(productData);
      toast.success(
        response.message || "Product added to cart successfully!!",
        {
          position: "top-center",
          autoClose: 1500,
        },
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  //Handle buy now
  //TODO: here todo

  // chat with seller
  // userId, sellerId
  // redirect to chat page
  // i gonne render this in return then my components ChatBox will render
  const handleChat = (ownerId, ownerName) => {
    // userId from token
    // return <ChatBox userId={userId} ownerId={ownerId} />;
    // setShowChat(true); // instead of  doing this i can navigate to chat page
    //navigate to chat
    navigate("/chat", {
      state: { ownerId, userId, ownerName },
    });
  };

  return (
    <div className="dark:bg-[var(--my-bg)] text-black dark:text-white">
      <h2 className="text-center text-2xl font-bold mt-4">Product Details</h2>

      {/* Main product layout */}
      <div className=" flex flex-col md:flex-row w-full max-w-[1500px] mx-auto px-4 py-8 h-[600px] mt-7 gap-6">
        {/* Left: Image section */}
        <div className="rounded-md shadow-lg bg-gray-100 md:w-1/2 h-full flex flex-col justify-center items-center p-4">
          {selectedVariant ? (
            <>
              <img
                src={selectedImage}
                className="w-full h-64 object-contain mt-4"
                alt="Selected product"
              />

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {selectedVariant.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-16 object-cover rounded border cursor-pointer ${
                      selectedImage === img.url ? "ring-2 ring-blue-500" : ""
                    }`}
                    alt={`Thumbnail ${i}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Select size and color to view details.
            </p>
          )}
        </div>

        {/* Right: Product details */}
        <div className="rounded-md shadow-lg md:w-1/2 h-full flex flex-col justify-between p-6 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
              {product.name}
            </h2>

            <div className="mb-2">
              <span className="line-through text-gray-500 mr-2">
                ${product.basePrice}
              </span>
              <span className="text-green-600 font-semibold">
                ${selectedVariant?.price || product.variants[0]?.price}
              </span>
            </div>

            <p className="mb-2 text-sm text-gray-600">
              Brand: <span className="font-medium">{product.brand?.name}</span>
            </p>
            {selectedVariant && (
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-medium">Stock:</span>{" "}
                {selectedVariant.stock}
              </p>
            )}

            <p className="mb-4 text-sm text-gray-600">
              Created by:{" "}
              <span className="font-medium">{product.owner?.name}</span>
            </p>

            {/* Color Selection */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-1">Select Color:</h3>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full border-2 transition ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-800"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-1">Select Size:</h3>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md border-2 transition ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-800"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*add to cart or buy now  */}
      <div className="text-center font-bold text-2xl ">
        <div className="">
          <button
            // className="mr-10 px-4 py-2 dark:bg-orange-600 rounded-md bg-orange-600 text-white
            //        transform transition-transform duration-300 ease-in-out
            //        hover:scale-105 hover:shadow-lg"
            className="mr-10 text-gray-900 dark:text-white 
             bg-gradient-to-r from-teal-300 to-lime-300 
             hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 
             focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-teal-700 
             font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 
             transform transition-transform duration-300 ease-in-out 
             hover:scale-105 hover:shadow-lg shadow-md dark:shadow-lg"
            onClick={() => handleAddToCart(product.id, selectedVariant?.id, 1)}
          >
            add to cart
          </button>
          <button
            className="mr-10 text-gray-900 dark:text-white 
             bg-gradient-to-r from-teal-300 to-lime-300 
             hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 
             focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-teal-700 
             font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 
             transform transition-transform duration-300 ease-in-out 
             hover:scale-105 hover:shadow-lg shadow-md dark:shadow-lg"
            onClick={() => handleBuyNow(product.id, selectedVariant?.id)}
          >
            {" "}
            buy now
          </button>
          <button
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            onClick={() => handleChat(product.owner.id, product.owner.name)}
          >
            Chat with seller
          </button>
          <button
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            onClick={() => navigate(-1)}
          >
            back
          </button>
          {/* {showChat && <ChatBox userId={userId} ownerId={product.owner.id} />} */}
        </div>
      </div>

      {/* Additional products or suggestions can go here */}
      <div></div>
    </div>
  );
};
