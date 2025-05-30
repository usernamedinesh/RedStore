import Typewriter from "typewriter-effect";

const TypeWriter = () => {
  return (
    <h1 className="text-3xl font-bold text-red-500 text-center mt-5">
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
  );
};

export default TypeWriter;
