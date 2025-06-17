import { useLocation } from "react-router";
import { useState } from "react";
import { placeOrder } from "../../api/orderApi";

// Map UI option to API-friendly payment method
const paymentOptions = {
  COD: "COD",
  GPay: "UPI",
  PhonePe: "UPI",
  Paytm: "UPI",
  "Credit/Debit Card": "CREDIT_CARD", // You can split later into CREDIT_CARD and DEBIT_CARD if needed
  PayPal: "PAYPAL",
  Stripe: "STRIPE",
};

const PlaceOrder = () => {
  const location = useLocation();
  const { totalPrice, selectedAddressId } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handlePlaceOrder = async () => {
    const mappedPaymentMethod = paymentOptions[paymentMethod];
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    const orderPayload = {
      paymentMethod: mappedPaymentMethod,
      shippingAddressId: selectedAddressId,
    };
    // TODO: Add order placement logic here (API call, navigation, etc.)
    const response = await placeOrder(
      orderPayload.paymentMethod,
      orderPayload.shippingAddressId,
    );
    console.log("response from api : ", response);
    console.log("response from response.data : ", response.data);
    console.log("paymentMethod", paymentMethod);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 text-black dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Place Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}

            {/* Payment Method Selection */}
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">
                Select Payment Method
              </h2>
              <div className="space-y-2">
                {[
                  "COD",
                  "GPay",
                  "PhonePe",
                  "Paytm",
                  "Credit/Debit Card",
                  "PayPal",
                  "Stripe",
                ].map((method) => (
                  <label
                    key={method}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-blue-600"
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Order Summary */}
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <p>Items Total: ₹{totalPrice || 0}</p>
              <p>Shipping: Free</p>
              <hr className="my-2" />
              <p className="font-bold">Total: ₹{totalPrice || 0}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Payment Method:{" "}
                <span className="font-medium">{paymentMethod}</span>
              </p>
            </section>
          </div>

          {/* Right Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Price Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Price</span>
                <span>₹{totalPrice || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{totalPrice || 0}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
