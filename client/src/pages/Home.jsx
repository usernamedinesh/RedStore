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
          <p className="text-center mt-10">
            This is a simple example of a home page using React Router and
            Tailwind CSS.
          </p>
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
