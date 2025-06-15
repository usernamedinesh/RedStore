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
  const [reFreshFlag, setReFreshFlag] = useState(false);

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
  }, [data.id, reFreshFlag]);
  const HandleRemoveProduct = async (id) => {
    try {
      console.log("productID: ", id);
      const response = await axios.delete(
        `http://localhost:3000/admin/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );
      if (response.data.success) {
        console.log("product deleted successfully");
        setReFreshFlag((prev) => !prev);
      }
    } catch (error) {
      console.error("error while deleting product", error);
    }
  };

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
                      ${item.variants[0].price}
                    </p>
                  </div>
                  <div className="text-green-600 font-bold mt-1">
                    <button onClick={() => HandleRemoveProduct(item.id)}>
                      remove
                    </button>
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
