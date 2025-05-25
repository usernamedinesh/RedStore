import { NavLink } from "react-router";

function FloatingSignupButton() {
  return (
    <div className=" font-bold   fixed bottom-18 right-6 z-50 dark:bg-gray-400 bg-gray-900  text-white hover:text-black  px-4 py-2 rounded-full shadow-lg hover:bg-gray-400 transition dark:hover:bg-gray-900 dark:hover:text-white dark:text-black">
      <NavLink to="/signup" end>
        SIGNUP
      </NavLink>
    </div>
  );
}

export default FloatingSignupButton;
