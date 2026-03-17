import React, { useState, useEffect } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./Login.css";

const users = [
  { username: "johnDoe", password: "Pass@1234", role: "user", status: "active" },
  { username: "adminJane", password: "Admin@1234", role: "admin", status: "active" },
  { username: "suspendedUser", password: "Test@1234", role: "user", status: "suspended" },
  { username: "unverifiedUser", password: "Test@1234", role: "user", status: "unverified" },
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
    if (remembered) {
      setUsername(remembered.username);
      setPassword(remembered.password);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, number, and symbol"
      );
      return;
    }

    const user = users.find((u) => u.username === username);
    if (!user || user.password !== password) {
      setError("Invalid credentials");
      return;
    }

    if (user.status === "suspended") {
      setError("Your account is suspended");
      return;
    }

    if (user.status === "unverified") {
      setError("Please verify your account");
      return;
    }

    if (rememberMe) {
      localStorage.setItem(
        "rememberedUser",
        JSON.stringify({ username, password })
      );
    } else {
      localStorage.removeItem("rememberedUser");
    }

    setSuccess(
      user.role === "admin"
        ? "Login successful! Redirecting to admin dashboard..."
        : "Login successful! Redirecting to user dashboard..."
    );
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="centered-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="centered-input"
        />

        <div className="options-row">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>
          <span className="forgot-password" onClick={() => setShowModal(true)}>
            Forgot Password?
          </span>
        </div>

        <div className="button-row horizontal-buttons">
          <button onClick={handleLogin}>Login</button>
          <button>Sign Up</button>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        users={users}
      />
    </div>
  );
};

export default Login;