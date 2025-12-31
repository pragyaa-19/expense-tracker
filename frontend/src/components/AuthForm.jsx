import { useState } from "react";
import api from "../api"; // axios instance
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/AuthForm.css";

import ProfileImageUpload from "./ProfileImageUpload";

function AuthForm({ method }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null); // profile picture
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
        // Login API
        const res = await api.post("/accounts/token/", { username, password });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        alert("Login Successful!");
      } else {
        // Register API with profile picture
        const formData = new FormData();
        formData.append("username", username);
        formData.append("fullname", fullname);
        formData.append("email", email);
        formData.append("password", password);
        if (profile) formData.append("profile", profile);

        await api.post("/accounts/user/register/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Registration Successful! Now login.");
      }

      navigate("/"); // Redirect after success
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) setError(err.response.data.detail);
      else setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-container bg-body text-body shadow p-4 rounded"
    >
      <h2 className="text-center mb-3">{isLogin ? "Login" : "Register"}</h2>

      {!isLogin && (
        <>
          {/* Profile Image Upload */}
          <ProfileImageUpload onChange={setProfile} />

          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            className="form-input mb-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input mb-2"
          />
        </>
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="form-input mb-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="form-input mb-2"
      />

      {error && <div className="text-danger text-center mb-2">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default AuthForm;
