/*
 * This component will be renderd in Homem Page
 * The 3 Latest Products will be shown in this component
 * page = 1, products = 3
 */

import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "../../api/productApi";
import { NavLink } from "react-router";

function Latestproduct() {
  const {
    data: productData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    // queryKey: takes an array as unique key
    queryKey: ["latestProduct", { page: 1, limit: 3 }],
    // function that fetch the data
    queryFn: () => getAllProduct(1, 3),
    // Optional: Keep data fresh for only 1 minute (less than default)
  });

  // Handle loading and error state
  if (isLoading) {
    return <div className="text-center">Loading latest product ..</div>;
  }
  if (isError) {
    return (
      <div className="text-center">
        Error loading latest product: {error?.response?.data?.message}
      </div>
    );
  }
  // Access product array from the data.produces
  const yesh = productData?.data?.data?.products || [];
  const latestProduct = yesh.slice(0, 3);

  return (
    <div className="flex flex-col justify-center items-center px-4">
      <div>
        <h1 className="text-center">
          Latest Products {isFetching ? "(Updating...)" : ""}
          <div className=" dark:bg-green-400 h-0.5 mb-3.5 bg-black" />
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-7  max-w-[1400px] mx-auto px-4 lg:h-[500px] w-[360px] sm:w-full">
        {latestProduct.map((product) => (
          <div
            key={product.id}
            className="cursor-pointer border p-4 rounded-lg shadow-md hover:shadow-xl
               flex flex-col items-center text-center duration-300 ease-in-out
               hover:-translate-y-1 hover:scale-105 transition-all h-full relative" // Added 'relative' for potential overlays
          >
            {/* Image at the very top, outside the NavLink but still clickable */}
            <NavLink
              to={`/product/${product.id}`}
              state={{ product }}
              className="w-full"
            >
              <img
                src={product.thumnailImage}
                alt={product.name}
                className="w-full h-100 object-contain  rounded-t-lg" // Increased height (h-48), added margin-bottom (mb-4), rounded top corners
              />
            </NavLink>

            {/* Content wrapped in NavLink */}
            <NavLink
              to={`/product/${product.id}`}
              state={{ product }}
              className="flex flex-col flex-grow w-full px-2"
            >
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-700 mt-auto">
                ${product.variants[0].price}
              </p>{" "}
              {/* mt-auto pushes price to bottom if content varies */}
            </NavLink>

            {/* Optional: Add a button or other interactive elements here if you want them outside the main NavLink */}
            {/* <button className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm">View</button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Latestproduct;
