import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./CheckoutPage.css";

const STORAGE_KEY = "pendingCheckout";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // -------------------------
  // AUTH EMAIL STATE
  // -------------------------
  const [userEmail, setUserEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loadingEmailAction, setLoadingEmailAction] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserEmail(data.email))
      .catch((err) => console.error("Email fetch failed:", err));
  }, []);

  // -------------------------
  // CHECKOUT STATE
  // -------------------------
  const checkoutState = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }

    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }, [location.state]);

  if (!checkoutState) {
    return (
      <div className="checkout-page">
        <Navigation />
        <div className="checkout-container">
          <div className="checkout-left">
            <h1>Checkout</h1>
            <p>No checkout information found.</p>

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
    email = "",
  } = checkoutState;

  const selectedSeats = seats.map(
    (seat) => `${seat.seatRow}${seat.seatNumber}`
  );

  const serviceFee = selectedSeats.length * 1.5;
  const tax = (totalPrice + serviceFee) * 0.07;
  const orderTotal = totalPrice + serviceFee + tax;

  const totalTickets =
    (tickets.adult || 0) +
    (tickets.child || 0) +
    (tickets.senior || 0);

  // -------------------------
  // CONFIRM EMAIL ACTION
  // -------------------------
  const handleConfirmEmail = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoadingEmailAction(true);

      const res = await fetch("http://localhost:8080/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed request");

      setEmailSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send verification email.");
    } finally {
      setLoadingEmailAction(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navigation />

      <div className="checkout-container">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          <p className="checkout-step">Checkout • Payment Mockup</p>
          <h1>Payment Information</h1>

          <div className="mock-card">
            <h2>Card Details</h2>

            <label>Cardholder Name</label>
            <input type="text" placeholder="Sara Ghadrdan" disabled />

            <label>Card Number</label>
            <input type="text" placeholder="4242 4242 4242 4242" disabled />

            <div className="mock-row">
              <div>
                <label>Expiration Date</label>
                <input type="text" placeholder="08/28" disabled />
              </div>

              <div>
                <label>CVV</label>
                <input type="text" placeholder="123" disabled />
              </div>
            </div>

            <label>Billing ZIP Code</label>
            <input type="text" placeholder="30602" disabled />

            <div className="mock-badges">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Mock Only</span>
            </div>
          </div>

          <div className="checkout-actions">
            <button
              className="secondary-btn"
              onClick={() => navigate("/booking")}
            >
              Back
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                alert("Payment processing is not part of this deliverable yet.")
              }
            >
              Continue to Payment
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-block">
              <p><strong>Movie:</strong> {movieTitle}</p>
              <p><strong>Showtime:</strong> {showtime}</p>

              <p>
                <strong>Seats:</strong>{" "}
                {selectedSeats.length
                  ? selectedSeats.join(", ")
                  : "None selected"}
              </p>

              <p><strong>Total Tickets:</strong> {totalTickets}</p>

              {/* EMAIL + ACTIONS */}
              <p>
                <strong>Email:</strong>{" "}
                {userEmail || email || "Loading..."}
              </p>

              {!emailSent ? (
                <div style={{ marginTop: "10px" }}>
                  <button
                    className="primary-btn"
                    disabled={loadingEmailAction}
                    onClick={handleConfirmEmail}
                  >
                    {loadingEmailAction ? "Sending..." : "Confirm"}
                  </button>

                  <button
                    className="secondary-btn"
                    style={{ marginLeft: "10px" }}
                    onClick={() =>
                      alert("Edit functionality will be added next.")
                    }
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <p style={{ color: "green", marginTop: "10px" }}>
                  Verification Email has been sent
                </p>
              )}
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

              <div>
                <span>Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>

              <div>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="total-line">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <p className="mock-note">
              No real payment is processed on this screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}