import { Link } from "react-router";
import women from "../assets/gender/women.png";
import men from "../assets/gender/percetmen.jpg";

export const ShowGender = () => {
  return (
    <div className="flex flex-wrap justify-center gap-16 p-6">
      {/* Women's Section */}
      <Link
        to="/product?gender=women"
        className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105
                   w-[600px] h-[650px]" // <--- ADDED: Set a fixed width and height for the Link container
      >
        <img
          src={women}
          alt="Shop Women's"
          // Changed to w-full h-full to make the image fill its new fixed-size parent
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="text-white text-xl font-semibold">Shop Women's</span>
        </div>
      </Link>

      {/* Men's Section */}
      <Link
        to="/product?gender=men"
        className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105
                   w-[600px] h-[650px]" // <--- ADDED: Set a fixed width and height for the Link container
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
