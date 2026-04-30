import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./OrderConfirmationPage.css";

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }

    const saved = sessionStorage.getItem("lastOrder");
    return saved ? JSON.parse(saved) : null;
  }, [location.state]);

  if (!order) {
    return (
      <div className="confirmation-page">
        <Navigation />
        <div className="confirmation-card">
          <h1>No Order Found</h1>
          <p>There is no order confirmation to display.</p>
          <button onClick={() => navigate("/")}>Back Home</button>
        </div>
      </div>
    );
  }

    // Helper functions for formatting show date and time
  const formatShowDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthName = months[parseInt(month, 10) - 1];

    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };
  const formatShowTime = (time) => {
    if (!time) return "";

    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <div>
      <Navigation />
      <div className="confirmation-page">
        <div className="confirmation-card">
          <h1>Order Confirmed</h1>
          <p className="confirmation-message">
            Thank you for your purchase. Your booking has been completed.
          </p>

          <div className="confirmation-details">
            <p><strong>Confirmation Number:</strong> {order.confirmationNumber}</p>
            <p><strong>Movie:</strong> {order.movieTitle}</p>
            <p><strong>Show Date:</strong> {formatShowDate(order.showDate)}</p>
            <p><strong>Showtime:</strong> {formatShowTime(order.showtime)}</p>
            <p><strong>Seats:</strong> {order.selectedSeats.join(", ")}</p>
            <p><strong>Email:</strong> {order.email || "Not provided"}</p>
            <p><strong>Total:</strong> ${Number(order.orderTotal).toFixed(2)}</p>
          </div>

          <div className="confirmation-buttons">
            <button onClick={() => navigate("/")}>Back to Movies</button>
            <button onClick={() => navigate("/order-history")}>
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;