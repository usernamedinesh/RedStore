// router.js
import { createBrowserRouter } from "react-router";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Register.jsx";
import { FormRegister } from "./components/auth/FinalRegister.jsx";
import Home from "./pages/Home.jsx";

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
]);

export default router;
