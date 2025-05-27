// context.js
import { createContext } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";

const Context = createContext({});

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("appData");
    return saved ? JSON.parse(saved) : {};
  });
  const [logout, setLogout] = useState(() => {
    setData("null");
  });
  useEffect(() => {
    // Save to localStorage whenever `data` changes
    localStorage.setItem("appData", JSON.stringify(data));
  }, [data]);

  return (
    <Context.Provider value={{ data, setData, setLogout }}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  return useContext(Context);
};
