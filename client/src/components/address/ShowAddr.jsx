import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAddress, getAddress } from "../../api/addressApi";
import { useState } from "react";

function ShowAddress() {
  const [AddresOpen, setAddressOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["address"],
    queryFn: getAddress,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="text-center">
        <h1>show address</h1>
        {isError && (
          <div className="text-red-600 font-semibold">
            {error?.response?.data?.message || "unkown error occurs "}
          </div>
        )}
        {data?.data && data.data.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
            {data.data.map((address) => (
              <div
                key={address.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {address.fullName}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  address1: {address.addresLine1}
                </p>
                {address.addressLine2 && ( // Only render if addressLine2 exists
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    {address.addresLine2}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  city: {address.city},state: {address.state} - pin:
                  {address.postalCode}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Phone: {address.phoneNumber}
                </p>

                {/* Optional: Add action buttons here */}
                <div className="mt-4 flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No addresses found. Add a new one!
          </div>
        )}
        <button
          onClick={() => setAddressOpen(true)}
          className="mt-5 text-lg py-1 px-5 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-center me-2 mb-2 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          add address
        </button>
        {AddresOpen && (
          <div>
            <button
              onClick={() => setAddressOpen(false)}
              // className="font-bold text-lg ml-5 text-red-600 shadow-2xl px-10"

              className=" px-10 py-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm  text-center me-2 mb-2 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              Close
            </button>

            <AddAddress />
          </div>
        )}
      </div>
    </>
  );
}

export default ShowAddress;

// {
//   "fullName": "John Doe4",
//   "addresLine1": "123 Main St",
//   "addresLine2": "Apt 4B",
//   "city": "Tamulpur",
//   "state": "Assam",
//   "postalCode": "10001",
//   "phoneNumber": "+1-555-555-5555"
// }

// compoenet for adding  address
const AddAddress = () => {
  const [form, setForm] = useState({
    fullName: "",
    addresLine1: "",
    addresLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
  });

  const queryClient = useQueryClient(); // Initialize query client for invalidation

  // Setup the mutation
  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: addAddress, // This is the function that performs the API call
    onSuccess: (data) => {
      console.log("Address added successfully:", data);
      // Invalidate the 'address' query to refetch the list of addresses
      // in fetching address i fetched api after the 5 minute so i if add new addresss it wont
      // fetched the latest address
      // but it i add the bottom line it will invalidate this key of addres then it will fetch the new address
      queryClient.invalidateQueries(["address"]);
      // Optionally reset the form
      setForm({
        fullName: "",
        addresLine1: "",
        addresLine2: "",
        city: "",
        state: "",
        postalCode: "",
        phoneNumber: "",
      });
    },
    onError: (error) => {
      console.error("Error adding address:", error);
      // Display error to the user
      // Access error details safely: error?.response?.data?.message
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form: ", form);
    //api call
    // mutate(form);
    mutate({ ...form });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl mx-auto p-6  shadow-lg rounded-lg bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white"
    >
      {/* Removed the redundant inner div, applied styles directly to form */}
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Add Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          name="fullName" // <-- ADDED: name attribute
          placeholder="Full Name" // Changed placeholder for clarity
          value={form.fullName}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="addresLine1" // <-- ADDED
          placeholder="Address Line 1"
          value={form.addresLine1}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="addresLine2" // <-- ADDED
          placeholder="Address Line 2 (Optional)"
          value={form.addresLine2}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="city" // <-- ADDED
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="state" // <-- ADDED
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="postalCode" // <-- ADDED
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="phoneNumber" // <-- ADDED
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Saving..." : "Save Address"}
        </button>
      </div>

      {isSuccess && (
        <div className="text-green-500 text-center mt-2">Address saved!</div>
      )}
      {isError && (
        <div className="text-red-500 text-center mt-2">
          Error saving address:{" "}
          {error?.response?.data?.message || error?.message || "Unknown error"}
        </div>
      )}
    </form>
  );
};
