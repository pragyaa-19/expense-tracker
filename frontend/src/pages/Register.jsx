import React from "react";
import AuthForm from "../components/AuthForm";

function Register() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4">
        <div className="card shadow border-0 bg-body text-body">
          <div className="card-body p-4">
            <h3 className="text-center fw-bold mb-2">Create Account 🚀</h3>
            <p className="text-center text-body-secondary mb-4">
              Start tracking your expenses easily
            </p>

            {/* Auth Form handles DP upload internally */}
            <AuthForm method="register" />

            <div className="text-center mt-3">
              <small className="text-body-secondary">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="fw-semibold text-decoration-none link-primary"
                >
                  Login
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
