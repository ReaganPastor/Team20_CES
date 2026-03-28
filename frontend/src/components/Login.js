import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Load remembered user if any
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
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
       
        credentials: "include",
        });

        let data;
        try {
        data = await res.json();
        } catch {
        setError("Invalid server response");
        return;
        }

        if (!res.ok) {
        setError(data.error || "Login failed");
        return;
        }
        
        // STORE AUTH DATA HERE
        
        if (data.role) {
          localStorage.setItem("role", data.role);
        }
        

        // Save credentials if Remember Me is checked
        if (rememberMe) {
        localStorage.setItem(
            "rememberedUser",
            JSON.stringify({ username, password })
        );
        } else {
        localStorage.removeItem("rememberedUser");
        }

        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
        navigate("/homepage");
        }, 1000);

    } catch (err) {
        console.error(err);
        setError("Server error. Please try again later.");
    }
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
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Login;