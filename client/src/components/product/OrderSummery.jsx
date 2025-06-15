import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getOrderSummery } from "../../api/orderApi";

const OrderSummery = () => {
  const [address, setAddress] = useState({});
  const [checkoutItem, setCheckoutItem] = useState({});
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
    }
    orderSummery();
  }, [location.state, navigate, window.location.reload]);

  if (!state) return null;
  return (
    <div>
      <h1>Order summary page</h1>
      {/* You can now use `state` safely */}
      <div>
        {address.map((add) => (
          <li key={add.id}>
            <p>{add.fullName}</p>
            <p>{add.state}</p>
            <p>{add.city}</p>
            <p>{add.addresLine1}</p>
            <p>{add.addresLine2}</p>
            <p>{add.postalCode}</p>
            <p>{add.phoneNumber}</p>
          </li>
        ))}
      </div>
    </div>
  );
};

export default OrderSummery;
