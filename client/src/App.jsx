import "./App.css";
import { createBrowserRouter } from "react-router";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Register.jsx";

const App = createBrowserRouter([
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
]);

export default App;
