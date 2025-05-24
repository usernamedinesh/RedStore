import router from "./routes.jsx";
import { StrictMode } from "react";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./context/ThemeProvider";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {store, persistor}  from "./redux/store.js";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}> 
      <ThemeProvider>
        <App />
        <RouterProvider router={router} />
        <ToastContainer />
      </ThemeProvider>

    </PersistGate>
    </Provider>
  </StrictMode>,
);
