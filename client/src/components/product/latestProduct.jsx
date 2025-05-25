/*
 * This component will be renderd in Homem Page
 * The 3 Latest Products will be shown in this component
 * page = 1, products = 3
 */

import { useState } from "react";

function Latestproduct() {
  const [latestProducts, setLatestProducts] = useState([]);
  return (
    <>
      {!latestProducts.length ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="latest-products">
          <h2>Latest Products</h2>
          <div className="product-list">
            {latestProducts.map((product) => (
              <div key={product.id} className="product-item">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span>${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Latestproduct;
