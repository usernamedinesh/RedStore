// router.js
import { createBrowserRouter } from "react-router";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Register.jsx";
import { FormRegister } from "./components/auth/FinalRegister.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hello world</h1>,
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
]);

export default router;
