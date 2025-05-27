import women from "../assets/gender/women.png";
import men from "../assets/gender/men.jpg";

export const ShowGender = () => {
  return (
    <>
      <div className="flex flex-wrap text-center justify-evenly ">
        <div>
          <img src={women} alt="women" className="h-auto w-auto" />
        </div>
        <div>
          <img src={men} alt="men" className="h-auto w-auto" />
        </div>
      </div>
    </>
  );
};
