import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ChangePassword.css"; // reuse same styling

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get token and email from URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
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
      const res = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ apiError: data.error || "Failed to reset password" });
        return;
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setForm({ newPassword: "", confirmPassword: "" });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setErrors({ apiError: "Server error. Please try again later." });
    }
  };

  // If no token or email in URL, redirect to login
  useEffect(() => {
    if (!token || !email) {
      navigate("/login");
    }
  }, [token, email, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Reset Password</h1>

        {errors.apiError && <p className="error">{errors.apiError}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* New password */}
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

          {/* Confirm password */}
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

          <div className="button-row horizontal-buttons" style={{ justifyContent: "center" }}>
            <button type="submit">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;