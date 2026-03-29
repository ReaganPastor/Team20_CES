import React, { useState, useEffect } from "react";
import "./Login.css";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // ===== CHRIS FRONTEND CHANGE =====
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setMessage("");
    }
  }, [isOpen]);
  // ===== CHRIS FRONTEND CHANGE END =====

  const handleSend = async () => {
    setMessage("");

    // ===== CHRIS FRONTEND CHANGE =====
    if (!email.trim()) {
      setMessage("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setMessage("Please enter a valid email");
      return;
    }
    // ===== CHRIS FRONTEND CHANGE END =====

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ===== CHRIS FRONTEND CHANGE =====
        body: JSON.stringify({ email: email.trim() }),
        // ===== CHRIS FRONTEND CHANGE END =====
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to send reset email");
      } else {
        setMessage("Password reset instructions sent to your email");

        setEmail("");

        setTimeout(() => {
          setMessage("");
          onClose();
        }, 2000);
      }
    } catch (err) {
      setMessage("Server error. Try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="forgot-modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSend}>Send Reset Email</button>
        {message && (
          <div className={message.includes("sent") ? "success" : "error"}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;