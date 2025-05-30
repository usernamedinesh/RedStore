import router from "./routes.jsx";
import { StrictMode } from "react";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./context/ThemeProvider";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.js";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import queryClient from "./context/ReactQury.jsx";
import { QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <RouterProvider router={router} />
            <ToastContainer />
          </QueryClientProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
