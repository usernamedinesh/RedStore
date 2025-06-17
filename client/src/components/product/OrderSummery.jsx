import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getOrderSummery } from "../../api/orderApi";

const OrderSummery = () => {
  const [address, setAddress] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState(null);

  useEffect(() => {
    const orderSummery = async () => {
      const response = await getOrderSummery();
      setCheckoutItem(response.data.checkoutItems);
      setAddress(response.data.address);
    };

    const incomingState = location.state;

    if (!incomingState) {
      navigate(-1);
    } else {
      setState(incomingState);
      orderSummery();
    }
  }, [location.state, navigate]);

  if (!state) return null;

  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId);
    const found = address.find((a) => a.id === selectedId);
    setSelectedAddress(found);
  };

  const getTotalPrice = () => {
    return checkoutItem
      .reduce((acc, item) => acc + item.variant.price * item.quantity, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Please select an address.");
      return;
    }
    //TODO:
    console.log("Order placed with address:", selectedAddressId);
    // go to the place order page
    // where to will need to make payment
    const totalPrice = getTotalPrice();
    navigate("/place/order", {
      state: { selectedAddressId, totalPrice },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)] dark:text-white flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Order Summary
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 justify-center">
          {/* Order Items Section */}
          <div className="lg:w-1/2 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Your Items
            </h2>
            <ul className="space-y-4">
              {checkoutItem.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border rounded-md shadow-sm"
                >
                  <img
                    src={item.variant.images[0].url}
                    alt={item.variant.product.name}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium">
                      ITEM: {item.variant.product.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Price: {item.variant.price} RS
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-lg flex-shrink-0">
                    {(item.variant.price * item.quantity).toFixed(2)} RS
                  </p>
                </li>
              ))}

              {/* 🧮 Total */}
              <div className="text-right mt-4 text-xl font-bold">
                Total Price:{" "}
                {checkoutItem
                  .reduce(
                    (acc, item) => acc + item.variant.price * item.quantity,
                    0,
                  )
                  .toFixed(2)}{" "}
                RS
              </div>
            </ul>
          </div>

          {/* Shipping Address & Order Action Section */}
          <div className="lg:w-1/2 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Shipping Information
            </h2>

            <label
              htmlFor="address-select"
              className="block text-lg font-medium mb-2"
            >
              Select Shipping Address
            </label>
            <select
              id="address-select"
              onChange={handleAddressChange}
              value={selectedAddressId || ""}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                -- Select Address --
              </option>
              {address.map((add) => (
                <option key={add.id} value={add.id}>
                  {add.fullName} ({add.city}, {add.state})
                </option>
              ))}
            </select>

            {selectedAddress && (
              <div className="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 shadow-sm">
                <p>
                  <strong className="font-medium">Name:</strong>{" "}
                  {selectedAddress.fullName}
                </p>
                <p>
                  <strong className="font-medium">Address:</strong>{" "}
                  {selectedAddress.addresLine1}, {selectedAddress.addresLine2}
                </p>
                <p>
                  <strong className="font-medium">City:</strong>{" "}
                  {selectedAddress.city}
                </p>
                <p>
                  <strong className="font-medium">State:</strong>{" "}
                  {selectedAddress.state}
                </p>
                <p>
                  <strong className="font-medium">Postal Code:</strong>{" "}
                  {selectedAddress.postalCode}
                </p>
                <p>
                  <strong className="font-medium">Phone:</strong>{" "}
                  {selectedAddress.phoneNumber}
                </p>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddressId}
              className={`mt-8 w-full py-3 px-6 rounded-md text-white font-semibold transition-colors duration-200 ${
                selectedAddressId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummery;
