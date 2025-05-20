import { useEffect, useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      //get value from  local storage using key
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // set the value in localStorage using key
  useEffect(() => {
    try {
      const valueTOstore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueTOstore));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
};
