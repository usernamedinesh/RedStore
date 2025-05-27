import { useParams } from "react-router";

/*
 * parmas
 */
export const SingleProduct = () => {
  const { id } = useParams();
  console.log("id ", id);
  return (
    <>
      <div className=" dark:bg-[var(--my-bg)] text-black   dark:text-white shadow-md">
        <div>single product page </div>
      </div>
    </>
  );
};
