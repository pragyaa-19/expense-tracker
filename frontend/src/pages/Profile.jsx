import React, { useState, useEffect } from "react";
import api from "../api";

function ProfileImageUpload({ profileFile, setProfileFile, preview, setPreview }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setProfileFile(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="text-center mb-4 position-relative">
      <label htmlFor="profileUpload" style={{ cursor: "pointer" }}>
        <img
          src={preview || "/default-avatar.png"}
          alt="Profile"
          className="rounded-circle border shadow-sm"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            transition: "0.3s",
          }}
        />
        <div
          className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "30px",
            height: "30px",
            border: "2px solid white",
            fontSize: "16px",
          }}
        >
          <i className="bi bi-pencil text-white"></i>
        </div>
      </label>
      <input
        type="file"
        id="profileUpload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default function Profile() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [theme] = useState(localStorage.getItem("theme") || "light");

  const BACKEND_URL = "http://127.0.0.1:8000"; // replace with your backend URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/expenses/user-info/");
        const user = res.data;
        setUsername(user.username || "");
        setFullname(user.fullname || "");
        setEmail(user.email || "");

        if (user.profile) {
          const profileUrl = user.profile.startsWith("http")
            ? user.profile
            : `${BACKEND_URL}${user.profile}`;
          setPreview(profileUrl);
        } else {
          setPreview("/default-avatar.png");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile info");
        setPreview("/default-avatar.png");
      }
    };
    fetchUser();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("fullname", fullname);
      formData.append("email", email);
      if (profileFile) formData.append("profile", profileFile);

      const res = await api.patch("/accounts/user/update-profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile updated successfully!");

      if (res.data.profile) {
        const profileUrl = res.data.profile.startsWith("http")
          ? res.data.profile
          : `${BACKEND_URL}${res.data.profile}`;
        setPreview(profileUrl);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="col-12 col-md-6 col-lg-4">
        <div
          className={`card shadow p-4 ${
            theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
          }`}
          style={{ marginTop: "50px" }}
        >
          <h3 className="text-center mb-4">Update Profile</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleProfileUpdate}>
            <ProfileImageUpload
              profileFile={profileFile}
              setProfileFile={setProfileFile}
              preview={preview}
              setPreview={setPreview}
            />

            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="form-control mb-3"
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control mb-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-3"
            />

            <button
              type="submit"
              className={`btn w-100 ${
                theme === "dark" ? "btn-primary" : "btn-dark"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
