import { NavLink } from "react-router"; // Corrected import from 'react-router' to 'react-router-dom'
import heroImage from "../assets/hero-banner.png";

function HeroPage() {
  return (
    <>
      <div className="flex items-center justify-center mt-5">
        {/* hero card */}
        <div className="w-full max-w-6xl bg-gray-300 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 dark:bg-gray-900">
          {/* Text content block */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-6 text-4xl md:text-5xl font-extrabold leading-snug text-black dark:text-white">
              Give your Workout <br /> A New Style!
            </h1>
            <p className="mb-6 text-base text-black dark:text-white">
              Success isn&apos;t always about greatness. It&apos;s about
              consistency. Consistent hard work gains success. Greatness will
              come.
            </p>
            {/* Button container: Use flex and justify-center to center the button on small screens.
                On medium screens and up, md:justify-start aligns it to the left. */}
            <div className="flex justify-center md:justify-start">
              <NavLink
                to="/products"
                className="inline-block cursor-pointer dark:bg-[var(--my-bg)] px-10 py-3 bg-white text-red-500 font-bold rounded-full hover:bg-gray-300 dark:hover:bg-gray-900 transition-transform duration-300 transform hover:scale-105 shadow-2xl"
                end
              >
                Explore Now
              </NavLink>
            </div>
          </div>

          {/* Hero image block */}
          <div className="flex-1 flex justify-center">
            <img
              src={heroImage}
              alt="hero"
              // className="h-auto max-h-64 sm:max-h-80 md:h-[100vh] max-w-full object-contain"
              className="md:h-[67vh] max-w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Animated SVG (down arrow) */}
      <div className="flex justify-center mt-6 animate-bounce mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-black dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </>
  );
}

export default HeroPage;
