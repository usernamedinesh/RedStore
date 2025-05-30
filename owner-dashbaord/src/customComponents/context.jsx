import { createContext } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";

const Context = createContext({});

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("appData");
    if (!saved) return {};
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing appData from localStorage:", error);
      localStorage.removeItem("appData");
      return {};
    }
  });

  // Correctly define the logout function
  const logout = () => {
    setData({});
    localStorage.removeItem("appData");
    sessionStorage.removeItem("verifyPageHasRun");
  };

  useEffect(() => {
    // Save to localStorage whenever `data` changes
    localStorage.setItem("appData", JSON.stringify(data));
  }, [data]);

  return (
    <Context.Provider value={{ data, setData, logout }}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  return useContext(Context);
};
