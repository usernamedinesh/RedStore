import axiosInstance from "./axiosInstance";

// get all parter for chating
export const getParterForChating = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chat/partners`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat partners:", error);
    throw error;
  }
};

export const getChatMessages = async (userId, ownerId) => {};
