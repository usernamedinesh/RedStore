import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useColorMode = () => {
  /*
   --->params{color-them:  key}
   --->params{light:       initialValue}
   */
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;
    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [colorMode]);
  return [colorMode, setColorMode];
};
