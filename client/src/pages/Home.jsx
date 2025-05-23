import NavBar from "./Navbar";
import Footer from "./Footer";
import TypeWriter from "../customComponents/Typewriter";
import HeroPage from "./Hero";
import FeatureProduct from "../components/product/featureProduct";

const Home = () => {
  return (
    <>
      <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white mb-3.5 ">
        <NavBar />
        <div>
          <TypeWriter />
          <HeroPage />
          <FeatureProduct />
          <p className="text-center ">
            This is a simple example of a home page using React Router and
            Tailwind CSS.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
