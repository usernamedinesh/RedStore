// fetch all my uploaded producut here
import { useEffect, useState } from "preact/hooks";
import axios from "axios";
// we can share code with react ? or just out of the context
// import { getProductByOwner } from "../../../../client/src/api/authApi.js";

export function Product() {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState();

  // where can i get the token
  // useEffect(() => {
  //   try {
  //     const response = axios.post("http://localhost:3000/admin/products", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     console.log("Response : ", response);
  //   } catch (error) {
  //     console.error("");
  //   }
  // });

  return (
    <>
      <div>
        <div>Product page</div>
      </div>
    </>
  );
}
