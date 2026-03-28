import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css"; // reuse your login page styles

function EmailVerified() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status"); // "success" or "error"
  const username = queryParams.get("username"); // optional

  return (
    <div className="login-page">
      <div className="login-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "250px" }}>
        <div>
          {status === "success" ? (
            <>
              <h1>Welcome, {username}!</h1>
              <p>Your email has been verified successfully.</p>
            </>
          ) : (
            <>
              <h1>Oops!</h1>
              <p>Invalid or expired verification link.</p>
            </>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {status === "success" && (
            <button onClick={() => navigate("/login")} className="small-button">
              Go to Login
            </button>
          )}
          {status !== "success" && (
            <button onClick={() => navigate("/signup")} className="small-button">
              Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerified;