import React, { useState } from "react";
import "./EditProfile.css";

export default function EditProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "user@example.com",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("Profile updated successfully");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Edit Profile</h2>

        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSave}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="centered-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            readOnly
            disabled
            className="centered-input"
          />

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
            className="centered-input"
          />

          <div className="button-row horizontal-buttons">
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}