import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!form.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (form.confirmPassword !== form.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const pwd = form.newPassword;
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
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ apiError: data.error || "Failed to change password" });
        return;
      }

      setSuccess("Password updated successfully! Redirecting...");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setErrors({ apiError: "Server error. Please try again later." });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Change Password</h1>

        {errors.apiError && <p className="error">{errors.apiError}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>

          {/* OLD PASSWORD */}
          <div>
            <input
              type={showOld ? "text" : "password"}
              name="oldPassword"
              placeholder="Current Password"
              value={form.oldPassword}
              onChange={handleChange}
              className="centered-input"
            />
            <span
              className="forgot-password"
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? "Hide" : "Show"}
            </span>
          </div>
          {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}

          {/* NEW PASSWORD */}
          <div>
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="centered-input"
            />
            <span
              className="forgot-password"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? "Hide" : "Show"}
            </span>
          </div>

          {form.newPassword && (
            <p className={`success ${getPasswordStrength().toLowerCase()}`}>
              Strength: {getPasswordStrength()}
            </p>
          )}
          {errors.newPassword && <p className="error">{errors.newPassword}</p>}

          {/* CONFIRM PASSWORD */}
          <div>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="centered-input"
            />
            <span
              className="forgot-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "Hide" : "Show"}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <div
            className="button-row horizontal-buttons"
            style={{ justifyContent: "center" }}
          >
            <button type="submit">Update Password</button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ResetPassword;