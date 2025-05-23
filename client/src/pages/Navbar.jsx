import { useState } from "react";
import { NavLink } from "react-router";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import ToggleThemeButton from "../customComponents/ToggleThemeButton";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/account", label: "Account" },
  { to: "/cart", label: "Cart" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const renderLinks = (extraClasses = "") =>
    links.map(({ to, label, end }) => (
      <li key={to}>
        <NavLink
          to={to}
          end={end}
          className={`block px-4  hover-underline ${extraClasses}`}
          onClick={() => setOpen(false)}
        >
          {label}
        </NavLink>
      </li>
    ));

  return (
    <nav className="bg-[var(--my-bg)] text-[var(--text-color)] dark:bg-[var(--my-bg)] dark:text-[var(--text-color)] shadow-md dark:shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold">
          LOGO
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {renderLinks()}
          <li>
            <ToggleThemeButton />
          </li>
        </ul>

        {/* Hamburger (mobile only) */}
        <button
          aria-label="Toggle menu"
          className="md:hidden text-2xl"
          onClick={() => setOpen((p) => !p)}
        >
          {open ? <HiX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[var(--my-bg)] dark:bg-[var(--my-bg)] border-t border-gray-200 dark:border-gray-700">
          <ul className="flex flex-col">{renderLinks("text-lg")}</ul>
          <div className="p-4">
            <ToggleThemeButton />
          </div>
        </div>
      )}
    </nav>
  );
}
