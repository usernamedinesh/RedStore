import "./App.css";
import { createBrowserRouter } from "react-router";
import Login from "./components/auth/Login.jsx";

const App = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hello world</h1>,
  },

  {
    path: "/login",
    element: <Login />,
  },
]);

export default App;
