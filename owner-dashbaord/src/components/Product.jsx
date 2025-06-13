// fetch all my uploaded producut here
import { useEffect, useState } from "preact/hooks";
import axios from "axios";
import { useAppContext } from "../customComponents/context";
// we can share code with react ? or just out of the context
// import { getProductByOwner } from "../../../../client/src/api/authApi.js";

import { CreateProductBTN } from "../customComponents/createProductBtn";

export function Product() {
  const { data } = useAppContext();
  const [product, setProduct] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    try {
      const fetchProducts = async () => {
        const response = await axios.get(
          `http://localhost:3000/admin/my-product/${data.id}`,
        );
        if (response.data.success === true) {
          setProduct(response.data.data.simplifiedProducts);
          // console.log("Products: ", response.data.data.simplifiedProducts);
        } else {
          setError(response.data.message);
        }
      };
      fetchProducts();
    } catch (error) {
      console.error("");
    }
  }, [data.id]);

  return (
    <>
      <div>
        <div>Product page</div>
        {product.length > 0 ? (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4">Popular Products</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {product.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[200px] max-w-[200px] bg-white rounded shadow p-4 flex-shrink-0 h-[350px] flex flex-col justify-between"
                >
                  <img
                    src={item.thumnailImage}
                    alt={item.name}
                    className="h-40 object-cover rounded"
                  />
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {item.description}
                    </p>
                    <p className="text-green-600 font-bold mt-1">
                      ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
        {/* <CreateProductBTN /> */}
      </div>
    </>
  );
}
