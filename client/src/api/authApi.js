// here all api calls for auth
// NOTE:
// axios.post('/refresh', {}, { withCredentials: true }) true mean include cookie  in request
import axios from "axios";
import axiosInstance, { API_URL } from "./axiosInstance";

/*
 * VERIFY EMAIL OR PHONE
 * This api will run first
 * It will take either email or phone
 * and send the otp to the email and phone(which is provied)
 * and return the response
 */
export const verifyEmailOrPhone = async (emailOrPhone) => {
  try {
    const response = await axios.post(`${API_URL}/api/verify`, {
      phoneOremail: emailOrPhone,
    });
    return response;
  } catch (error) {
    console.error("Error verifying email or phone:", error);
    throw error;
  }
};

/*
 * REGISTER
 * After the successfully return  response of verification email or phone
 * This route will run
 * It will take the otp and other details
 */
export const register = async (userdata) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/api/register`, {
      ...userdata,
    });
    return response;
    // console.log("response: ", response);
    // if (response.status === 201) {
    //   return response.date;
    // }
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/*
 * LOGIN
 * take the email and password
 */

export const login = async (userdata) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/api/login`, {
      ...userdata,
    });
    return response;
  } catch (error) {
    console.error("Error logging user:", error);
    throw error;
  }
};

/*
 * FOR OWNER REQUEST FOR OTP
 * EMAIL ONLY
 *
 *
 */

export const requestForOTP = async (email) => {
  try {
    const response = await axiosInstance.post("/owner/request", { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting OTP:", error);
    return (
      error.response?.data || {
        message: "An error occurred while requesting OTP.",
      }
    );
  }
};

export const registerForOwnrAccount = async (name, password, token) => {
  try {
    const response = await axiosInstance.post(
      `/owner/create-account/${token}`,
      { name, password },
    );
    return response.data;
  } catch (error) {
    console.error("Error While Creating Owner Account:", error);
    return error.response?.data;
  }
};

export const loginToOwnrAccount = async (email, password) => {
  try {
    const response = await axiosInstance.post("/owner/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error requesting OTP:", error);
    throw error;
  }
};

export const getProductByOwner = async () => {
  try {
    const response = await axiosInstance.get("/admin/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products by owner:", error);
    return error;
  }
};
