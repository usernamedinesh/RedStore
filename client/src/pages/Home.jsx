import NavBar from "./Navbar";

const Home = () => {
  return (
    <>
      <div className="bg-[var(--my-bg)] text-black dark:bg-[var(--my-bg)]  dark:text-white ">
        <NavBar />
        <div>
          <h1 className="text-3xl font-bold text-center mt-10">
            Welcome to the Home Page
          </h1>
          <p className="text-center mt-4">
            This is a simple example of a home page using React Router and
            Tailwind CSS.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
