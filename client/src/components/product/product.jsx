/*
 * Product page component
 * This component will be used to display all products
 * Store the product in redux
 * There will be an dropdown of categories
 * based on categoy fetch the product
 * categoy: [all, electronics, fashion]
 * listing : based on men and women
 * api fetching based on pages
 *
 */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "../../api/productApi";
import { NavLink } from "react-router";

function Product() {
  const [products, setProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    data: productData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["products", { page: 1, limit: 10 }],
    queryFn: () => getAllProduct(1, 10),
  });
  useEffect(() => {
    if (productData?.data?.data?.products) {
      setProducts(productData.data.data.products);
    }
  }, [productData]); // Dependency array: this effect runs only when productData changes

  if (isLoading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 p-4">
        Loading products...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error fetching products: {error.message || "Unknown error"}
      </div>
    );
  }

  console.log("prodcut: ", products);
  // Filter categories based on selected Gender
  const filterCategories = Array.from(
    new Set(
      products
        .filter((p) => !selectedGender || p.gender === selectedGender)
        .map((p) => p.category.name),
    ),
  );

  // Filter product based on selected Category
  const filterProduct = products.filter((p) => {
    const genderMatch = !selectedGender || p.gender === selectedGender;

    let categoryMatch = true; // Assume true if no category is selected or it's 'All Categories'

    if (selectedCategory) {
      // Only perform category comparison if a category is actually selected
      const productCategoryName =
        typeof p.category === "object" && p.category !== null
          ? p.category.name // If it's an object, get its name
          : p.category; // If it's already a string (fallback, but likely won't be hit)

      // Compare category names after converting to lowercase and trimming whitespace
      categoryMatch =
        productCategoryName?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim();
    }

    return genderMatch && categoryMatch;
  });

  return (
    <>
      <div className="dark:bg-[var(--my-bg)] text-black dark:text-white  p-4">
        {/* <h1 className="text-3xl font-bold text-center mb-4">Product Pages</h1> */}

        <div>
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-6">
            {" "}
            {/* Changed h1 to h2 */}
            grab you favourite products {isFetching ? "(Updating...)" : ""}
            <div className="dark:bg-green-400 h-0.5 mb-3.5 bg-black" />
          </h2>
        </div>

        <div className="flex flex-wrap gap-5 mb-8 justify-center  text-black ">
          {" "}
          {/* SELECTING Category & Gender Filters */}
          <div className="flex flex-col">
            <label
              htmlFor="gender-select"
              className="mb-1 text-sm font-medium  text-black dark:text-white"
            >
              Gender
            </label>
            <select
              id="gender-select"
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value);
                setSelectedCategory(""); // Reset category when gender changes
              }}
              className="border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="category-select"
              className="mb-1 text-sm font-medium text-black dark:text-white"
            >
              Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className=" border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {filterCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LISTING of products */}
        <div className="p-4">
          {filterProduct.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
              No matching products found!
            </p>
          ) : (
            // Assuming you want to render product cards similar to previous examples
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-screen-xl mx-auto justify-items-center items-center">
              {filterProduct.map((p) => (
                <div
                  key={p.id}
                  className="cursor-pointer border p-4 rounded-lg shadow-md hover:shadow-xl
                             flex flex-col items-center text-center
                             relative overflow-hidden
                             w-64 h-80 // Example fixed dimensions for consistency and to prevent shaking
                             transform transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                >
                  {/* Ensure NavLink is imported correctly if it's from 'react-router-dom' */}
                  <NavLink
                    to={`/product/${p.id}`}
                    className="flex flex-col items-center w-full h-full justify-between"
                  >
                    <img
                      src={p.variants[0].images[0].url}
                      alt={p.name}
                      className="w-full h-100 object-cover mb-2 block mx-auto"
                    />
                    <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      ${p.variants[0].price}
                    </p>
                  </NavLink>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Product;
