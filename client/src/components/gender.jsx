import { Link } from "react-router";
import women from "../assets/gender/women.png";
import men from "../assets/gender/percetmen.jpg";

export const ShowGender = () => {
  return (
    <div className="flex flex-wrap justify-center  p-6   gap-4 sm:gap-8 md:gap-12 lg:gap-16">
      {/* Women's Section */}
      <Link
        to="/products?gender=WOMEN"
        className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105 w-full max-w-[600px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] "
      >
        <img
          src={women}
          alt="Shop Women's"
          // Changed to w-full h-full to make the image fill its new fixed-size parent
          className="object-cover w-full h-full"
        />

        {/* <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div> */}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="text-white text-xl font-semibold">Shop Women's</span>
        </div>
      </Link>

      {/* Men's Section */}
      <Link
        to="/products?gender=MEN"
        className=" relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105 w-full max-w-[600px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] "
      >
        <img
          src={men}
          alt="Shop Men's"
          // Changed to w-full h-full to make the image fill its new fixed-size parent
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="text-white text-xl font-semibold">Shop Men's</span>
        </div>
      </Link>
    </div>
  );
};
