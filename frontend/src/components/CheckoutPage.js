import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    movieTitle = "Movie Title",
    showtime = "7:00 PM",
    selectedSeats = [],
  } = location.state || {};

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const ticketPrice = 12;
  const subtotal = selectedSeats.length * ticketPrice;
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setSuccess("Payment successful! Redirecting...");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div>
      <Navigation />

      <div className="checkout-page">
        <div className="checkout-card">
          <h1>Checkout</h1>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="checkout-section">
            <h2>Order Summary</h2>
            <p><strong>Movie:</strong> {movieTitle}</p>
            <p><strong>Showtime:</strong> {showtime}</p>
            <p><strong>Seats:</strong> {selectedSeats.join(", ") || "None Selected"}</p>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Tax:</strong> ${tax.toFixed(2)}</p>
            <p><strong>Total:</strong> ${total.toFixed(2)}</p>
          </div>

          <div className="checkout-section">
            <h2>Email</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="checkout-input"
            />
          </div>

          <div className="checkout-section">
            <h2>Payment</h2>
            <div className="mock-payment-box">
              <p>Card ending in 4242</p>
              <p>Visa</p>
              <p>Mock Payment Only</p>
            </div>
          </div>

          <div className="button-row horizontal-buttons">
            <button onClick={() => navigate(-1)}>Back</button>
            <button onClick={handleCheckout}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}