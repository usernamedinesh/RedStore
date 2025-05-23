import { useTheme } from "../context/ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";
import { useState } from "react";

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme();
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    toggleTheme();
    setTimeout(() => setClicked(false), 200); // reset after animation
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-transform duration-150 ${
        clicked ? "scale-90" : "scale-100"
      } bg-gray-200 dark:bg-gray-700 text-yellow-500 dark:text-white`}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
}
