// Signup.js
import React, { useState } from "react";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.username) newErrors.username = "Username is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup failed:", data.error);
        alert(data.error || "Signup failed");
      } else {
        console.log("Signup successful! User info saved:", form);
        setSuccess(true);
      }
    } catch (err) {
      console.error("Cannot connect to server", err);
      alert("Cannot connect to server");
    }
  };

  const getPasswordStrength = () => {
    if (form.password.length >= 12) return "Strong";
    if (form.password.length >= 8) return "Medium";
    if (form.password.length > 0) return "Weak";
    return "";
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Check Your Email</h2>
          <p className="success">
            A confirmation link has been sent. Please verify your account.
          </p>
          <a href="/login" className="forgot-password">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="centered-input"
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="centered-input"
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="centered-input"
            />
            <span
              className="forgot-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {form.password && (
            <p className="success">Strength: {getPasswordStrength()}</p>
          )}

          {errors.password && <p className="error">{errors.password}</p>}

          <div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="centered-input"
            />
            <span
              className="forgot-password"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>

          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <div className="button-row horizontal-buttons">
            <button type="submit">Sign Up</button>
            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          </div>
        </form>

        <p className="success">
          Email confirmation required to activate account.
        </p>
      </div>
    </div>
  );
}