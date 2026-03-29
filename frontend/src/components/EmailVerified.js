import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function EmailVerified() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [username, setUsername] = useState("");
  const [hasVerified, setHasVerified] = useState(false); // prevents double call

  useEffect(() => {
    if (hasVerified) return; // only run once
    setHasVerified(true);

    const queryParams = new URLSearchParams(window.location.search);
    const statusParam = queryParams.get("status");
    const usernameParam = queryParams.get("username");

    if (statusParam) {
      // This happens if backend redirected
      if (statusParam === "success") {
        setStatus("success");
        setUsername(usernameParam || "");
      } else {
        setStatus("error");
      }
    } else {
      // Optional: fallback, call backend manually
      const token = queryParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }

      fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
        .then(res => {
          if (res.redirected) {
            const redirectUrl = new URL(res.url);
            const s = redirectUrl.searchParams.get("status");
            const u = redirectUrl.searchParams.get("username");
            if (s === "success") {
              setStatus("success");
              setUsername(u || "");
            } else {
              setStatus("error");
            }
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    }
  }, [hasVerified]);

  return (
    <div className="login-page">
      <div
        className="login-card"
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "250px" }}
      >
        <div>
          {status === "loading" && (
            <>
              <h1>Verifying...</h1>
              <p>Please wait.</p>
            </>
          )}
          {status === "success" && (
            <>
              <h1>Welcome, {username}!</h1>
              <p>Your email has been verified successfully.</p>
            </>
          )}
          {status === "error" && (
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
          {status === "error" && (
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