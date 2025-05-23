import router from "./routes.jsx";
import { StrictMode } from "react";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./context/ThemeProvider";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeProvider>
  </StrictMode>,
);
