import React, { useEffect, useState } from "react";
import api from "../api";
import PasswordChange from "./PasswordChange";

function Settings({ theme, setTheme }) {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ load dashboard summary setting
  const [showSummary, setShowSummary] = useState(
    localStorage.getItem("showSummary") !== "false"
  );

  // 🔐 Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/expenses/user-info/");
        setUser(res.data);
        setBudget(res.data.budget || "");
      } catch (err) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  // 🌙 Apply theme to body + persist
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 📊 Persist dashboard summary setting
  useEffect(() => {
    localStorage.setItem("showSummary", showSummary);
  }, [showSummary]);

  // 💰 Save budget
  const handleSaveBudget = async () => {
    setSaving(true);
    try {
      const res = await api.patch("/expenses/user-info/", { budget });
      setUser(res.data);
      alert("Budget updated successfully!");
    } catch {
      alert("Error saving budget.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4">Settings</h2>


      {/* 🌙 Theme */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>Theme</h5>
        <div className="form-check form-switch mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="themeSwitch"
            checked={theme === "dark"}
            onChange={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          />
          <label className="form-check-label" htmlFor="themeSwitch">
            Dark Mode
          </label>
        </div>
      </div>

      {/* 💰 Budget */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>Monthly Budget</h5>
        <input
          type="number"
          className="form-control mt-2"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <button
          className="btn btn-primary mt-3"
          onClick={handleSaveBudget}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Budget"}
        </button>
      </div>

      {/* 📊 Dashboard Summary */}
      <div className="card p-4 shadow-sm">
        <h5>Dashboard Summary</h5>
        <div className="form-check form-switch mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="showSummarySwitch"
            checked={showSummary}
            onChange={() => setShowSummary((prev) => !prev)}
          />
          <label className="form-check-label" htmlFor="showSummarySwitch">
            Show Available / Spent / Total on Home
          </label>
        </div>
      </div>
    </div>
  );
}

export default Settings;
