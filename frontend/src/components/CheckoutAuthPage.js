import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./CheckoutPage.css";

const STORAGE_KEY = "pendingCheckout";

export default function CheckoutAuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutState = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }

    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }, [location.state]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (!checkoutState) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutState));
  }, [checkoutState]);

  useEffect(() => {
    if (!checkoutState) return;

    const savedEmail = localStorage.getItem("email") || "";
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [checkoutState]);

  if (!checkoutState) {
    return (
      <div className="checkout-page">
        <Navigation />
        <div className="checkout-container">
          <div className="checkout-left">
            <h1>Checkout</h1>
            <p>No booking info found. Please go back and select seats again.</p>
            <button className="secondary-btn" onClick={() => navigate("/")}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    movieTitle = "Movie Title",
    showtime = "Showtime not selected",
    seats = [],
    tickets = { adult: 0, child: 0, senior: 0 },
    totalPrice = 0,
  } = checkoutState;

  const selectedSeats = seats.map((seat) => `${seat.seatRow}${seat.seatNumber}`);
  const totalTickets =
    (tickets.adult || 0) + (tickets.child || 0) + (tickets.senior || 0);

  const handleContinue = () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }

    localStorage.setItem("email", email.trim());

    const updatedState = {
      ...checkoutState,
      email: email.trim(),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));

    navigate("/checkout", {
      state: updatedState,
    });
  };

  const handleLogin = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutState));

    navigate("/login", {
      state: {
        from: "/checkout/contact",
        checkoutState,
      },
    });
  };

  return (
    <div className="checkout-page">
      <Navigation />

      <div className="checkout-container">
        <div className="checkout-left">
          <p className="checkout-step">Checkout • Contact Information</p>
          <h1>{isAuthenticated ? "Confirm Your Email" : "Enter Your Email"}</h1>
          <p className="checkout-subtext">
            {isAuthenticated
              ? "You are logged in. Confirm your existing email or enter a new one before continuing to payment."
              : "You can continue as a guest by entering your email, or log in first. Your selected seats will stay reserved."}
          </p>

          {error && <div className="error">{error}</div>}

          <div className="mock-card">
            <h2>Contact Info</h2>

            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="checkout-actions">
            <button className="secondary-btn" onClick={() => navigate(-1)}>
              Back to Seats
            </button>

            {!isAuthenticated && (
              <button className="secondary-btn" onClick={handleLogin}>
                Login
              </button>
            )}

            <button className="primary-btn" onClick={handleContinue}>
              Continue to Payment
            </button>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-block">
              <p><strong>Movie:</strong> {movieTitle}</p>
              <p><strong>Showtime:</strong> {formatTime(showtime)}</p>
              <p>
                <strong>Seats:</strong>{" "}
                {selectedSeats.length ? selectedSeats.join(", ") : "None selected"}
              </p>
              <p><strong>Total Tickets:</strong> {totalTickets}</p>
            </div>

            <div className="summary-block">
              <p><strong>Adult:</strong> {tickets.adult || 0}</p>
              <p><strong>Child:</strong> {tickets.child || 0}</p>
              <p><strong>Senior:</strong> {tickets.senior || 0}</p>
            </div>

            <div className="price-breakdown">
              <div>
                <span>Tickets</span>
                <span>${Number(totalPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}