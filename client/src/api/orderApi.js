import axiosInstance from "./axiosInstance";

// Initiate order api
export const InitiateOrder = async (variantId = null) => {
  try {
    const response = await axiosInstance.post("api/user/checkout/cart", {
      variantId,
    });
    if (response.data.success === true) {
      return response.data;
    }
  } catch (error) {
    console.error("Error while initiating order", error);
  }
};

export const InitiateOrderFromBuyNow = async (variantId) => {
  try {
    const response = await axiosInstance.post("api/user/checkout/buy-now", {
      variantId,
      quantity: 1,
    });

    if (response.data.success === true) {
      return response.data;
    }
  } catch (error) {
    console.error("Error while InitiateOrderFromBuyNow ", error);
  }
};

export const getOrderSummery = async () => {
  try {
    const response = await axiosInstance.get("api/user/summery");
    return response.data;
  } catch (error) {
    console.error("Error while fetching orderSummery", error);
  }
};
