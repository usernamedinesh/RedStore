// router.js
import { createBrowserRouter, Outlet } from "react-router";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Register.jsx";
import { FormRegister } from "./components/auth/FinalRegister.jsx";
import Home from "./pages/Home.jsx";
import Product from "./components/product/product.jsx";
import Account from "./pages/Account.jsx";
import CartPage from "./components/cart/Cart.jsx";
import OwnerReqForOTP from "./components/ownrAuth/RequestForOTP.jsx";
import CreateOwnerAccount from "./components/ownrAuth/createOwnerAccount.jsx";
import { SingleProduct } from "./components/product/SingleProduct.jsx";
import ChatPage from "./pages/Chat.jsx";
import OrderSummery from "./components/product/OrderSummery.jsx";
import PlaceOrder from "./components/product/PlaceOrder.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/success/:id",
    element: <FormRegister />,
  },
  {
    path: "/products",
    element: <Product />,
  },
  {
    path: "/product/:id",
    element: <SingleProduct />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/register/owner",
    element: <OwnerReqForOTP />,
  },
  {
    path: "/create-account",
    element: <CreateOwnerAccount />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/order/summery",
    element: <OrderSummery />,
  },
  {
    path: "/place/order",
    element: <PlaceOrder />,
  },

  {
    //not found page
    path: "*",
    element: (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
        <h1 className="text-4xl font-bold text-red-500">
          404 - Page Not Found
        </h1>
      </div>
    ),
  },
]);

export default router;
