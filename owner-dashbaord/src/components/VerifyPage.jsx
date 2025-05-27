import axios from "axios";
import { useAppContext } from "../customComponents/context";
import { useLocation } from "preact-iso";
import { useEffect, useState } from "preact/hooks";

export function VerifyPage() {
  const { setData: setContextData, data } = useAppContext();

  useEffect(() => {
    const hasRun = sessionStorage.getItem("verifyPageHasRun");
    if (!hasRun) {
      console.log("Running verify logic...");
      sessionStorage.setItem("verifyPageHasRun", "true");
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
          window.location.href = "http://localhost:5174";
        } else {
          console.log("Token verification failed:", response.data.message);
          window.location.href = "http://localhost:5173/login";
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        window.location.href = "http://localhost:5173/login";
      });
  }, []); // Runs once on component mount

  // --- ADD THIS NEW useEffect to observe data changes ---
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // Check if data object is not empty
      console.log("App's 'data' state has been updated:", data);
    } else {
      console.log("App's 'data' state is currently empty:", data);
    }
  }, [data]); // This useEffect runs every time the 'data' state changes
  // ----------------------------------------------------

  return (
    <>
      <div>
        <div>
          {/* <h1>Welcome to the Verification Page</h1> */}
          {/* <p>User Details page </p> */}
          {/* {data.id && data.name && data.email ? ( */}
          {/*   // Render this block ONLY when user data (specifically name) is loaded */}
          {/*   <> */}
          {/*     <p>ID: {data.id}</p> */}
          {/*     <p>Name: {data.name}</p> */}
          {/*     <p>Email: {data.email}</p> */}
          {/*   </> */}
          {/* ) : ( */}
          {/*   // Render a loading message or nothing while data is being fetched/is empty */}
          {/*   <p>Loading user details...</p> */}
          {/* )} */}
        </div>
      </div>
    </>
  );
}

export default VerifyPage;
