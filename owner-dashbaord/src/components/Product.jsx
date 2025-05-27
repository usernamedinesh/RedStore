// fetch all my uploaded producut here
import { useEffect, useState } from "preact/hooks";
import axios from "axios";
import { useAppContext } from "../customComponents/context";
// we can share code with react ? or just out of the context
// import { getProductByOwner } from "../../../../client/src/api/authApi.js";

export function Product() {
  const { data } = useAppContext();
  const [product, setProduct] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    try {
      const fetchProducts = async () => {
        const response = await axios.get(
          `http://localhost:3000/admin/my-product/${1}`,
        );
        console.log("Response : ", response);
        if (response.data.success === true) {
          setProduct(response.data.data.simplifiedProducts);
          console.log("Products: ", response.data.data.simplifiedProducts);
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
          <div className="product-list flex flex-wrap">
            {product.map((item) => (
              <div
                key={item.id}
                className="product-item  rounded-2xl bg-white shadow-lg hover:shadow-xl m-4 p-4"
              >
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
                <img src={item.imageUrl} alt={item.name} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </>
  );
}
