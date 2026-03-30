import React, { useState } from "react";
import "./Signup.css";
import Navigation from "./Navigation";

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
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    let newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

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

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return "";

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 1) return "Weak";
    if (strength === 2 || strength === 3) return "Medium";
    if (strength === 4) return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setServerError(data.error || "Signup failed");
      }
    } catch (err) {
      setServerError("Cannot connect to server");
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Check Your Email</h2>
          <p className="success">
            Registration successful. Please verify your account.
          </p>
          <a href="/login" className="forgot-password">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="login-page">
        <div className="login-card">
          <h2>Create Account</h2>

          {serverError && <p className="error">{serverError}</p>}

          <form onSubmit={handleSubmit}>
            {errors.username && <p className="error">{errors.username}</p>}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.email && <p className="error">{errors.email}</p>}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.password && <p className="error">{errors.password}</p>}
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
              <p className={`success ${getPasswordStrength().toLowerCase()}`}>
                Strength: {getPasswordStrength()}
              </p>
            )}

            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
            </div>

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
    </div>
  );
}