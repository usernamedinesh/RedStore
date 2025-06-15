import axiosInstance from "./axiosInstance";

// Initiate order api
export const InitiateOrder = async (variantId = null) => {
  try {
    const response = await axiosInstance.post("api/user/checkout/cart", {
      variantId,
    });
    console.log("response from api", response);
    return response.data;
  } catch (error) {
    console.error("Error while initiating order", error);
  }
};

export const InitiateOrderFromBuyNow = async (variantId) => {
  console.log("varintID", variantId);
  try {
    const response = await axiosInstance.post("api/user/checkout/buy-now", {
      variantId,
      quantity: 1,
    });
    return response.data;
  } catch (error) {
    console.error("Error while InitiateOrderFromBuyNow ", error);
  }
};
