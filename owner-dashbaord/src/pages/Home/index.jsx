import "./style.css";
import axios from "axios";
import { Product } from "../../components/Product";
import { CreateProductBTN } from "../../customComponents/createProductBtn";
// import VerifyPage from "../../components/VerifyPage";
import { useAppContext } from "../../customComponents/context";
import { useEffect } from "preact/hooks";

// lets remove the verify page for now
export function Home() {
  const { setData: setContextData, data } = useAppContext();

  useEffect(() => {
    const hasRun = sessionStorage.getItem("verifyPageHasRun");
    if (hasRun) {
      console.log("Running verify logic...");
      sessionStorage.setItem("verifyPageHasRun", "true");
      return;
    }
    const path = new URLSearchParams(window.location.search);
    const token = path.get("token");
    console.log("token: ", token);

    if (!token) {
      window.location.href = "http://localhost:5173/login";
      return;
    }

    axios
      .post(`http://localhost:3000/owner/verify-token`, { token })
      .then((response) => {
        if (response.data.success === true) {
          console.log(response.data.message);
          setContextData(response.data.data);
        } else {
          console.log("Token verification failed:", response.data.message);
          window.location.href = "http://localhost:5173/login";
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        window.location.href = "http://localhost:5173/login";
      });
  }, []);

  return (
    <>
      {data ? (
        <div class="home ">
          <div>
            <Product />
          </div>
          <div>
            <h1>WELCOMPE TO DASHBOARD</h1>
          </div>

          {/* <VerifyPage /> */}
          <CreateProductBTN />
        </div>
      ) : (
        <div class="home">
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
}
