import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function EmailVerified() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setStatus("success");
          setUsername(data.username);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="login-page">
      <div className="login-card" style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "250px",
      }}>
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