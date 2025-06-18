import { CLIENT } from "../api";
import { useAppContext } from "../customComponents/context";

export function Me() {
  const { data, logout } = useAppContext();
  console.log("User from me page  data:", data);
  if (!data || Object.keys(data).length === 0) {
    console.log("No user data found, redirecting to login page.");
    // window.location.href = "http://localhost:5173/login";
  }
  function handleLogout() {
    logout();
    window.location.href = CLIENT;
  }
  return (
    <div>
      <h1>Welcome to the Me Page</h1>
      <p>This is where user-specific information would be displayed.</p>

      <div>
        <h1>Welcome to the Verification Page</h1>
        <p>User Details page </p>
        {data.id && data.name && data.email ? (
          // Render this block ONLY when user data (specifically name) is loaded
          <>
            <p>ID: {data.id}</p>
            <p>Name: {data.name}</p>
            <p>Email: {data.email}</p>
          </>
        ) : (
          // Render a loading message or nothing while data is being fetched/is empty
          <p>Loading user details...</p>
        )}
      </div>
      <button type="submit" onClick={handleLogout}>
        LOGOUT{" "}
      </button>
      {/* Additional content can be added here */}
    </div>
  );
}
