import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./Login.css";
import Navigation from "./Navigation";

const Login = () => {
  // Stores what user types in
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Error/success messages shown on screen
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Remember me checkbox + forgot password modal
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // When page loads, check if a remembered user exists in localStorage
  useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
    if (remembered) {
      setUsername(remembered.username);
      setPassword(remembered.password);
      setRememberMe(true);
    }
  }, []);

  // Handles login when user clicks Login button
  const handleLogin = async () => {
    // Clear old messages first
    setError("");
    setSuccess("");

    // Make sure both fields are filled in
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Send login request to backend
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      // Convert response into JSON
      const data = await res.json();

      // Helpful debug line so you can see what backend returned
      console.log("Login response:", data);

      // If backend says login failed, show backend error
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Try both possible names for the user ID
      // Backend currently uses "id", but this also supports "userId"
      const userId = data.id ?? data.userId ?? "";

      // Store login/session info in localStorage
      localStorage.setItem("username", data.username || username.trim());
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("token", data.token || "");

      // Only store userId if it exists
      // This prevents login from crashing if it comes back missing
      if (userId !== "") {
        localStorage.setItem("userId", String(userId));
      } else {
        console.warn("Login response did not include user ID");
        localStorage.removeItem("userId");
      }

      // Remember login info if box is checked
      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({ username, password })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // Show success message and redirect
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/homepage"), 1000);
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div>
      <Navigation />
      <div className="login-page">
        <div className="login-card">
          <h1>Login</h1>

          {/* Show messages if there is an error or success */}
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          {/* Username input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="centered-input"
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="centered-input"
          />

          {/* Remember me + forgot password row */}
          <div className="options-row">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>

            <span
              className="forgot-password"
              onClick={() => setShowModal(true)}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login / Sign Up buttons */}
          <div className="button-row horizontal-buttons">
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>

        {/* Forgot password popup */}
        <ForgotPasswordModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default Login;