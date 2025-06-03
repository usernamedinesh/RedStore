import axiosInstance from "./axiosInstance";

export const getAddress = async () => {
  try {
    const response = await axiosInstance.get("/api/user/address");
    return response.data;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error; // it will be handle by error useQuery
  }
};

/*
  {
    "fullName": "John Doe4",
    "addresLine1": "123 Main St",
    "addresLine2": "Apt 4B",
    "city": "Tamulpur",
    "state": "Assam",
    "postalCode": "10001",
    "phoneNumber": "+1-555-555-5555"
  } 
*/

// Add adress
export const addAddess = async () => {
  try {
    const response = await axiosInstance.post();
    return response.data;
  } catch (err) {
    console.error("Error while adding address ", err);
  }
};

// Update address
