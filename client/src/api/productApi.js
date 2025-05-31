import axiosInstance from "./axiosInstance";

/*
 * GET ALL PRODUCT
 * {params} : page number and count
 * TODO: update the url remove admin
 *
 * GET /product?page=2&limit=15
 */
export const getAllProduct = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/api/product?page=${page}&limit=${limit}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching all product : ", error);
    throw error;
  }
};

/*
 * GET SINGLE PRODUCT BY ID
 */
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID: ", error);
    throw error;
  }
};

/*
 * GET CATEGORY OF PRODUCT
 */

/*
 * CART PRODUCT
 */

/* fetch product of carts */
export const getCartProduct = async () => {
  try {
    const response = axiosInstance.get("/api/user/cart");
    return response.data;
  } catch (error) {
    console.error("error fetching cart product", error);
  }
};

/*
 Add product to carts
 */
export const addToCart = async () => {
  try {
    const response = await axiosInstance.post("/api/user/cart");
    return response.data;
  } catch (error) {
    console.error("error while adding to cart", error);
  }
};

/*
 * Remove product from cart
 */
export const removeProductCart = async () => {
  try {
    const response = await axiosInstance.delete(`/api/user/{variantId}`);
    return response.data;
  } catch (error) {
    console.error("Error while removing prodcut from cart", error);
  }
};
