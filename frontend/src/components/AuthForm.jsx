import { useState } from "react";
import api from "../api"; // axios instance
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/AuthForm.css";

function AuthForm({ method }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // for error messages
  const navigate = useNavigate();

  const isLogin = method === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await api.post("/accounts/token/", {
          username,
          password,
        });

        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        alert("Login Successful!");
        navigate("/");
      } else {
        await api.post("/accounts/user/register/", {
          username,
          fullname,
          email,
          password,
        });

        alert("Registration Successful! Now login.");
        navigate("/login");
      }
    } catch (err) {
  console.error("ERROR:", err);

  if (err.response) {
    // Backend returned 400/401/500
    setError(JSON.stringify(err.response.data));
  } else {
    // CORS / Network error
    setError("Network error: Backend is not allowing requests.");
  }
} finally {
  setLoading(false);
}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-100"
    >
      <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>

      {!isLogin && (
        <>
          {/* Profile Image Upload */}
          {/*<ProfileImageUpload onChange={setProfile} />*/}

          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            className="form-control mb-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control mb-2"
          />
        </>
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="form-control mb-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="form-control mb-2"
      />

      {error && <div className="text-danger text-center mb-3">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary w-100 py-2"
        disabled={loading}
      >
        {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default AuthForm;
