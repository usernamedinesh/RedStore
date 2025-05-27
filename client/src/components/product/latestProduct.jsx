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
  const latestProduct = productData?.data?.data?.products || [];

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6">
        Latest Products {isFetching ? "(Updating...)" : ""}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-screen-xl w-full px-2">
        {latestProduct.map((product) => (
          <div
            key={product.id}
            className="cursor-pointer border p-4 rounded-lg shadow-md hover:shadow-xl  
                       flex flex-col items-center text-center  duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
          >
            <div className="">
              <NavLink to={`/product/${product.id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-2 block mx-auto"
                />
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-700">${product.variants[0].price}</p>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Latestproduct;
