import { useQuery } from "@tanstack/react-query";
import { getAddress } from "../../api/addressApi";
import { useState } from "react";

function ShowAddress() {
  const [AddresOpen, setAddressOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["address"],
    queryFn: getAddress,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // if i render here then  it will be render the current return of the compoenent
  // if (isError) {
  //   return <div>Error: {error?.response?.data?.message}</div>;
  // }

  const handleAddAddress = () => {
    return <AddAddress />;
  };

  return (
    <>
      <div className="text-center">
        <h1>show address</h1>
        {isError && (
          <div className="text-red-600 font-semibold">
            {error?.response?.data?.message || "unkown error occurs "}
          </div>
        )}
        <button
          onClick={() => setAddressOpen(true)}
          className="font-bold text-lg text-red-500 shadow-2xl px-10"
        >
          add address
        </button>
        <button
          onClick={() => setAddressOpen(false)}
          className="font-bold text-lg ml-5 text-red-600 shadow-2xl px-10"
        >
          {" "}
          Close{" "}
        </button>
        {AddresOpen && <AddAddress />}
      </div>
    </>
  );
}

export default ShowAddress;

const AddAddress = () => {
  return (
    <>
      <div className="mt-3">
        <div className="text-center  text-xl">add address here </div>
        <div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter the address "
              className="px-10 "
            />
            <input
              type="text"
              placeholder="Enter the address "
              className="px-10"
            />
            <input
              type="text"
              placeholder="Enter the address "
              className="px-10"
            />
          </div>
          <div className="mt-5">
            <input
              type="text"
              placeholder="Enter the address "
              className="px-10"
            />
            <input
              type="text"
              placeholder="Enter the address "
              className="px-10"
            />
            <input
              type="text"
              placeholder="Enter the address "
              className="px-10"
            />
          </div>
        </div>
      </div>
    </>
  );
};
