import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    movieTitle = "Movie Title",
    showtime = "Showtime not selected",
    selectedSeats = [],
    tickets = { adult: 0, child: 0, senior: 0 },
    totalPrice = 0,
  } = location.state || {};

  const serviceFee = selectedSeats.length * 1.5;
  const tax = (totalPrice + serviceFee) * 0.07;
  const orderTotal = totalPrice + serviceFee + tax;

  const totalTickets =
    (tickets.adult || 0) + (tickets.child || 0) + (tickets.senior || 0);

  return (
    <div className="checkout-page">
      <Navigation />

      <div className="checkout-container">
        <div className="checkout-left">
          <p className="checkout-step">Checkout • Payment Mockup</p>
          <h1>Payment Information</h1>
          <p className="checkout-subtext">
            This is a mock payment page for the current deliverable. Final
            payment processing and order confirmation will be added later.
          </p>

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
              onClick={() => navigate(-1)}
            >
              Back to Seats
            </button>

            <button
              className="primary-btn"
              onClick={() => alert("Payment processing is not part of this deliverable yet.")}
            >
              Continue to Payment
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