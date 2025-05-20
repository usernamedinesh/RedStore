import { useEffect } from "react";
import { RouterProvider } from "react-router";
import router from "./routes.jsx";

function App() {
  useEffect(() => {
    const colorMode = JSON.parse(window.localStorage.getItem("color-theme"));
    const className = "dark";
    const bodyClass = document.body.classList;

    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
