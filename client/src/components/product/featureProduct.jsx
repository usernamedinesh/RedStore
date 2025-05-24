import { useState } from "react";

// Import each image directly
import nikeDunkLow from "../../assets/product/three.png";
import shoe2 from "../../assets/product/four.png";
import shoe5 from "../../assets/product/siz.png";
import shoe6 from "../../assets/product/eight.png";
import shoe7 from "../../assets/product/nine.png";
import shoes8 from "../../assets/product/one.png";

const images = [nikeDunkLow, shoe2, shoe5, shoe6, shoe7, shoes8];

// Import your feature product images
export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="relative w-full mb-15 ">
      {/* Carousel Wrapper */}
      <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[600px]">
        <div>
          <h1 className="text-center"> Featured Products </h1>

          <div className=" dark:bg-green-400 h-0.5 mb-3.5 bg-black mx-[45%]" />
        </div>
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={src}
              className="absolute block w-[100%] h-[100%] object-contain -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt={`Slidesss ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2 ">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Slide  ${index + 1}`}
          />
        ))}
      </div>

      {/* Prev Button */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none lg:px-25 px-2 md:px-20 "
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-900 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 ">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none lg:px-25 px-2 md:px-20"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-900 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 ">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
