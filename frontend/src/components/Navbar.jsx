import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../api";


const bootstrap = window.bootstrap;

function Navbar() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();
  const location = useLocation();

  // ⏰ Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour12: false,
  });

  // 👤 Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await api.get("/expenses/user-info/");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Refetch on route change (login/logout navigation)
  useEffect(() => {
    fetchUser();
  }, [location.pathname]);

  // 📦 Close offcanvas & navigate
  const handleNavClick = (path) => {
    const offcanvasEl = document.getElementById("offcanvasNavbar");
    const instance = bootstrap?.Offcanvas?.getInstance(offcanvasEl);
    if (instance) instance.hide();
    navigate(path);
  };

  const menuItems = [
    { label: "Home", path: "/", icon: "bi-house" },
    { label: "Add Expense", path: "/add-expenses", icon: "bi-plus-circle" },
    { label: "All Expenses", path: "/all-expenses", icon: "bi-list-ul" },
    { label: "Daily Expenses", path: "/daily-chart", icon: "bi-calendar2-week" },
    { label: "Monthly Expenses", path: "/monthly-expenses", icon: "bi-calendar-month" },
    { label: "Yearly Expenses", path: "/yearly-expenses", icon: "bi-calendar" },
    { label: "Upload Receipts", path: "/add-expenses-via-file", icon: "bi-upload" },
    { label: "Category Chart", path: "/monthly-category", icon: "bi-circle" },
    { label: "Settings", path: "/settings", icon: "bi-gear" },
    { label: "About", path: "/about", icon: "bi-info-circle" },
    { label: "Reports", path: "/expenses-reports", icon: "bi-bar-chart" },
    { label: "Profile", path: "/profile-actions", icon: "bi-person-circle" },
    { label: "Logout", path: "/logout", icon: "bi-box-arrow-right" },
  ];

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top shadow-sm px-3">
      <div className="container-fluid d-flex align-items-center">

        {/* ☰ Toggle */}
        {user && (
          <button
            className="navbar-toggler me-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {/* 🏷 App Name */}
        <span
          className="navbar-brand m-0 text-white"
          style={{
            fontSize: "1.1rem",
            maxWidth: "160px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          Expense Tracker
        </span>

        {/* 🕒 Date & Time */}
        <span className="ms-auto me-3 fw-semibold d-flex align-items-center text-white">
          <span className="me-2">{formattedDate}</span>
          <span>{formattedTime}</span>
        </span>

        {/* 📋 Offcanvas Menu */}
        {user && (
          <div
            className="offcanvas offcanvas-start bg-dark text-white"
            id="offcanvasNavbar"
            style={{ width: "260px" }}
          >
            <div className="offcanvas-header border-bottom border-secondary position-relative">
              <button
                className="btn-close btn-close-white position-absolute top-0 end-0 m-2"
                data-bs-dismiss="offcanvas"
              ></button>

              <div className="d-flex flex-column align-items-center w-100 mt-4">
                {user.profile ? (
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="rounded-circle border border-light mb-2"
                    style={{ width: 80, height: 80, objectFit: "cover", cursor: "pointer" }}
                    onClick={() => handleNavClick("/profile")}
                  />
                ) : (
                  <div
                    className="rounded-circle border border-light d-flex align-items-center justify-content-center mb-2"
                    style={{
                      width: 80,
                      height: 80,
                      background:
                        "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleNavClick("/profile")}
                  >
                    <i className="bi bi-person text-white fs-4"></i>
                  </div>
                )}

                <h6 className="mt-2">{user.username}</h6>
              </div>
            </div>

            <div className="offcanvas-body p-3">
              <ul className="navbar-nav w-100">
                {menuItems.map((item) => (
                  <li key={item.path} className="nav-item mb-2">
                    <button
                      className="btn btn-link nav-link text-white w-100 text-start d-flex align-items-center gap-2"
                      onClick={() => handleNavClick(item.path)}
                      style={{ textDecoration: "none" }}
                    >
                      <i className={`bi ${item.icon}`}></i>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
