import { useNavigate } from "react-router-dom";

export default function ProfileActions() {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center flex-column min-vh-100 bg-light">
      <h1>Profile Actions</h1>
      <button
        className="mt-5 w-100 px-4 py-2 mb-2 border rounded"
        onClick={() => navigate("/profile")} // ✅ Navigate to Profile page
      >
        Update Profile
      </button>

      <button
        className="w-100 px-4 py-2 mb-2 border rounded"
        onClick={() => navigate("/change-password")
    
        } 
      >
        Reset Password
      </button>

      <button
        className="w-100 px-4 py-2 mb-2 border rounded"
        onClick={() => navigate("/land-money")} // temporary
      >
        View Land Money
      </button>
      <button
        className="w-100 px-4 py-2 border rounded"
        onClick={() => navigate("/saved-money")} // temporary
      >
        View Saved Money
      </button>
    </div>
  );
}
