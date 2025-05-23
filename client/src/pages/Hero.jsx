import heroImage from "../assets/hero-banner.png";

function HeroPage() {
  return (
    <>
      <div className="flex items-center justify-center mt-5  ">
        <div className="w-full max-w-6xl bg-gray-300 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 dark:bg-gray-900 ">
          {/* Text content */}
          <div className="flex-1">
            <h1 className="mb-6 text-4xl md:text-5xl font-extrabold leading-snug text-black dark:text-white">
              Give your Workout <br /> A New Style!
            </h1>
            <p className="mb-6 text-base  text-black dark:text-white">
              Success isn&apos;t always about greatness. It&apos;s about
              consistency. Consistent hard work gains success. Greatness will
              come.
            </p>
            <button className="px-10 py-3 bg-white text-red-500 font-bold rounded-full shadow hover:bg-gray-100 transition mx-25">
              Explore Now
            </button>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex justify-center">
            <img
              src={heroImage}
              alt="hero"
              className="h-[66vh] max-w-full object-contain"
            />
          </div>
        </div>
      </div>
      {/* <div className="mt-7 text-center mb-5"> */}
      {/* </div> */}

      <div className="flex justify-center mt-6 animate-bounce mb-4 ">
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
