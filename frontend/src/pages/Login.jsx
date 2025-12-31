import React from "react";
import AuthForm from "../components/AuthForm";

export default function Login() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4">
        <div className="card shadow border-0 bg-body text-body">
          <div className="card-body p-4">
            <h3 className="text-center fw-bold mb-2">
              Welcome Back 👋
            </h3>

            <p className="text-center text-body-secondary mb-4">
              Login to manage your expenses
            </p>

            <AuthForm method="login" />

            <div className="text-center mt-3">
              <small className="text-body-secondary">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="fw-semibold text-decoration-none link-primary"
                >
                  Register
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
