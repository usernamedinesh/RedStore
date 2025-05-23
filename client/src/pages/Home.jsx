import Typewriter from "typewriter-effect";
import NavBar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white mb-3.5 ">
        <NavBar />
        <div>
          <h1 className="text-3xl font-bold text-red-500 text-center mt-10">
            <Typewriter
              options={{
                strings: [
                  "Welcome to RedStone!",
                  "Your one-stop shop for all things!",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>
          <p className="text-center mt-4">
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
