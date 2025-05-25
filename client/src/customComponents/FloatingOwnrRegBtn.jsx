import { NavLink } from "react-router";

function FloaintOwnerRegButton() {
  return (
    <div className=" font-bold   fixed bottom-7 right-6 z-50 dark:bg-gray-400 text-white hover:text-black  dark:text-black  bg-gray-900   px-4 py-2 rounded-full shadow-lg hover:bg-gray-400 transition dark:hover:bg-gray-900 dark:hover:text-white ">
      <NavLink to="/register/owner" end>
        <span className="">Register as Owner</span>
      </NavLink>
    </div>
  );
}

export default FloaintOwnerRegButton;
