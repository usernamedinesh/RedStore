import NavBar from "./Navbar";
import Footer from "./Footer";
import TypeWriter from "../customComponents/Typewriter";
import HeroPage from "./Hero";
import FeatureProduct from "../components/product/featureProduct";
import FloatingSignupButton from "../customComponents/FloatingSingupBtn";
import { useSelector } from "react-redux";
import Latestproduct from "../components/product/latestProduct";
import FloaintOwnerRegButton from "../customComponents/FloatingOwnrRegBtn";
import { ShowGender } from "../components/gender";

const Home = () => {
  const { userId } = useSelector((state) => state.auth);

  return (
    <>
      <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white mb-3.5 ">
        <NavBar />
        <div>
          <TypeWriter />
          <HeroPage />
          <FeatureProduct />
          <Latestproduct />
          <div className="overflow-hidden whitespace-nowrap max-w-xl mx-auto text-center mt-5 ">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2 dark:text-gray-200 mt-25">
              Choose Your Style
            </h2>
            <p className="inline-block animate-marquee text-base sm:text-lg text-gray-500 dark:text-gray-300 ">
              Discover fashion tailored just for you. Select your gender to
              explore collections curated with care.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <ShowGender />
        </div>
        {!userId && (
          <div>
            <FloatingSignupButton /> <FloaintOwnerRegButton />
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default Home;
