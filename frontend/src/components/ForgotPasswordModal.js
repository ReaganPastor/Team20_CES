import React, { useState } from "react";
import "./Login.css";

const ForgotPasswordModal = ({ isOpen, onClose, users }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    const user = users.find((u) => u.username.toLowerCase() === email.toLowerCase());
    if (!user) {
      setMessage("No account associated with this email");
      return;
    }

    setMessage("Password reset instructions sent to your email");
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