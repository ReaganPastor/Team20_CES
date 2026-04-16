import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./CheckoutPage.css";

export default function GuestCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutState = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }

    const saved = sessionStorage.getItem("pendingCheckout");
    return saved ? JSON.parse(saved) : null;
  }, [location.state]);

  const [email, setEmail] = useState(
    localStorage.getItem("guestEmail") || ""
  );
  const [error, setError] = useState("");

  if (!checkoutState) {
    return (
      <div className="checkout-page">
        <Navigation />
        <div className="checkout-container">
          <div className="checkout-left">
            <h1>Guest Checkout</h1>
            <p>No booking information found.</p>
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

  const selectedSeatLabels = seats.map(
    (seat) => `${seat.seatRow}${seat.seatNumber}`
  );

  const totalTickets =
    (tickets.adult || 0) + (tickets.child || 0) + (tickets.senior || 0);

  const handleGuestContinue = () => {
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

    const updatedCheckoutState = {
      ...checkoutState,
      email: email.trim(),
    };

    sessionStorage.setItem(
      "pendingCheckout",
      JSON.stringify(updatedCheckoutState)
    );
    localStorage.setItem("guestEmail", email.trim());

    navigate("/checkout", {
      state: updatedCheckoutState,
    });
  };

  const handleLogin = () => {
    sessionStorage.setItem("pendingCheckout", JSON.stringify(checkoutState));

    navigate("/login", {
      state: {
        from: "/checkout",
        checkoutState,
      },
    });
  };

  const handleSignup = () => {
    sessionStorage.setItem("pendingCheckout", JSON.stringify(checkoutState));

    navigate("/signup", {
      state: {
        from: "/checkout",
        checkoutState,
      },
    });
  };

  return (
    <div className="checkout-page">
      <Navigation />

      <div className="checkout-container">
        <div className="checkout-left">
          <p className="checkout-step">Checkout • Guest Information</p>
          <h1>Continue to Checkout</h1>
          <p className="checkout-subtext">
            Enter your email to continue as a guest, or log in / create an
            account to continue with your saved information.
          </p>

          {error && <div className="error">{error}</div>}

          <div className="mock-card">
            <h2>Guest Email</h2>

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

            <button className="secondary-btn" onClick={handleLogin}>
              Login
            </button>

            <button className="secondary-btn" onClick={handleSignup}>
              Sign Up
            </button>

          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-block">
              <p><strong>Movie:</strong> {movieTitle}</p>
              <p><strong>Showtime:</strong> {showtime}</p>
              <p>
                <strong>Seats:</strong>{" "}
                {selectedSeatLabels.length
                  ? selectedSeatLabels.join(", ")
                  : "None selected"}
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