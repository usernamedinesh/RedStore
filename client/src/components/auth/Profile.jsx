import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/authApi";

const Profile = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5000 * 5,
  });

  if (isLoading) {
    return (
      <div className="text-center">
        <h1>Loading</h1>
      </div>
    );
  }
  if (isError) {
    // Add error handling here to display the error message
    return (
      <div className="text-center text-red-500">
        <h1>Error loading profile:</h1>
        <p>{error?.message || "An unknown error occurred."}</p>
        {/* You might want to display more specific error details from error.response.data.message */}
        <p>{error?.response?.data?.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        {data.user ? ( // Ensure data exists before trying to display it
          <div>
            <p>
              <strong>Name:</strong> {data.user.name}
            </p>{" "}
            {/* Replace with your actual profile fields */}
            <p>
              <strong>Email:</strong> {data.user.email}
            </p>
            {/* Add more profile details as needed */}
          </div>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </>
  );
};
export default Profile;
