import "./style.css";
import axios from "axios";
import { Product } from "../../components/Product";
import { CreateProductBTN } from "../../customComponents/createProductBtn";
// import VerifyPage from "../../components/VerifyPage";
import { useAppContext } from "../../customComponents/context";
import { useEffect } from "preact/hooks";
import { CLIENT, API_URL } from "../../api";

// lets remove the verify page for now
export function Home() {
  const { setData: setContextData, data } = useAppContext();

  useEffect(() => {
    const hasRun = sessionStorage.getItem("verifyPageHasRun");
    if (hasRun === "true") {
      console.log("Verify page has already run, skipping verification logic.");
      return;
    }
    if (!hasRun) {
      console.log("Running verify logic...");
      sessionStorage.setItem("verifyPageHasRun", "true");
    }
    const path = new URLSearchParams(window.location.search);
    const token = path.get("token");

    if (!token) {
      window.location.href = CLIENT;
      return;
    }

    axios
      .post(`${API_URL}/owner/verify-token/${token}`)
      .then((response) => {
        if (response.data.success === true) {
          console.log(response.data.message);
          setContextData(response.data.data);
        } else {
          console.log("Token verification failed:", response.data.message);
          window.location.href = CLIENT;
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        window.location.href = CLIENT;
      });
  }, []);

  return (
    <>
      {data ? (
        <div class="home ">
          <div>
            <Product />
            <CreateProductBTN />
          </div>
        </div>
      ) : (
        <div class="home">
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
}
