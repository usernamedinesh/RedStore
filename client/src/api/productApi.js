import axios from "axios";
import { API_URL } from "./api.js";

/*
 * GET ALL PRODUCT
 * {params} : page number and count
 * TODO: update the url remove admin
 * GET /product?page=2&limit=15
 */
export const getAllProduct = async (page, limit = 10, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/product?page=${page}&limit=${limit}`,
      //Pass Bearer Token in header
    );
    return response;
  } catch (error) {
    console.error("Error verifying email or phone:", error);
    throw error;
  }
};
