import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import AllExpensesList from "./pages/AllExpensesList";
import AddExpense from "./components/AddExpense";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ExpenseReport from "./pages/ExpenseReport";
import DailyChart from "./pages/DailyChart";
import ReceiptUpload from "./components/ReceiptUpload";
import About from "./pages/About";
import LandMoney from "./pages/LandMoney";
import SavedMoney from "./pages/SavedMoney";


import ProfileActions from "./pages/ProfileActions";
import PasswordChange from "./pages/PasswordChange";
import MonthlyHistory from "./pages/MonthlyHistory";
import MonthlyCategoryChart from "./pages/MonthlyCategoryHistory";
import YearlyExpenses from "./pages/YearlyExpenses";


import { UserProvider } from "./components/UserContext";

/* ---------- LOGOUT ---------- */
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" replace />;
}

/* ---------- REGISTER ---------- */
function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  /* 🌙 GLOBAL THEME STATE */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  /* ✅ APPLY BOOTSTRAP THEME GLOBALLY */
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          {/* ✅ HEADER */}
          <Navbar />

          {/* 🔐 CONTENT */}
          <div className="flex-grow-1">
            <Routes>
              {/* 🌍 Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterAndLogout />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile-actions" element={<ProfileActions />} />


              {/* 🔒 Protected */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-expenses"
                element={
                  <ProtectedRoute>
                    <AddExpense />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/land-money"
                element={
                  <ProtectedRoute>
                    <LandMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-money"
                element={
                  <ProtectedRoute>
                    <SavedMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/yearly-expenses"
                element={
                  <ProtectedRoute>
                    <YearlyExpenses />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/all-expenses"
                element={
                  <ProtectedRoute>
                    <AllExpensesList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/expenses-reports"
                element={
                  <ProtectedRoute>
                    <ExpenseReport />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/monthly-expenses"
                element={
                  <ProtectedRoute>
                    <MonthlyHistory theme={theme} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/monthly-category"
                element={
                  <ProtectedRoute>
                    <MonthlyCategoryChart theme={theme} />
                  </ProtectedRoute>
                }
              />

              {/* ⚙️ SETTINGS — THE IMPORTANT FIX */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings theme={theme} setTheme={setTheme} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <PasswordChange theme={theme} setTheme={setTheme} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/daily-chart"
                element={
                  <ProtectedRoute>
                    <DailyChart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-expenses-via-file"
                element={
                  <ProtectedRoute>
                    <ReceiptUpload />
                  </ProtectedRoute>
                }
              />

              {/* ❌ 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* ✅ FOOTER */}
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
