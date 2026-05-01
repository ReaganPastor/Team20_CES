import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./Login.css";
import Navigation from "./Navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberedUser"));

    if (remembered) {
      setUsername(remembered.username);
      setPassword(remembered.password);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const userId = data.id ?? data.userId ?? "";

      localStorage.setItem("username", data.username || username.trim());
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("token", data.token || "");

      if (data.email) {
        localStorage.setItem("email", data.email);
      }

      if (userId !== "") {
        localStorage.setItem("userId", String(userId));
      } else {
        localStorage.removeItem("userId");
      }

      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            username,
            password,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }

      setSuccess("Login successful! Redirecting...");

      const checkoutState =
        location.state?.checkoutState ||
        JSON.parse(sessionStorage.getItem("pendingCheckout") || "null");

      const redirectPath = location.state?.from || "/homepage";

      setTimeout(() => {
        navigate(redirectPath, {
          state: checkoutState,
        });
      }, 1000);
    } catch (err) {
      setError("Cannot connect to server");
    }
  };

  return (
    <div>
      <Navigation />

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

            <span
              className="forgot-password"
              onClick={() => setShowModal(true)}
            >
              Forgot Password?
            </span>
          </div>

          <div className="button-row horizontal-buttons">
            <button onClick={handleLogin}>Login</button>

            <button
              onClick={() =>
                navigate("/signup", {
                  state: location.state,
                })
              }
            >
              Sign Up
            </button>
          </div>
        </div>

        <ForgotPasswordModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default Login;