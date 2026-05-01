import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "./OrderConfirmationPage.css";

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  /* Safe Order Resolution */
  const order = useMemo(() => {
    const source =
      location.state && Object.keys(location.state).length > 0
        ? location.state
        : sessionStorage.getItem("lastOrder")
        ? JSON.parse(sessionStorage.getItem("lastOrder"))
        : null;

    if (!source) return null;

    return {
      confirmationNumber: source.confirmationNumber ?? "N/A",
      movieTitle: source.movieTitle ?? "Unknown Movie",
      showDate: source.showDate ?? source.showdate ?? "",
      showtime: source.showtime ?? "",
      showId: source.showId ?? "",
      selectedSeats: source.selectedSeats ?? [],
      email: source.email ?? "",
      orderTotal: source.orderTotal ?? 0,
    };
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

  /* Formatters */
  const formatShowDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  };

  const formatShowTime = (time) => {
    if (!time) return "";

    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  /* Safe Derived Values */
  const seats = order.selectedSeats || [];

  const total = (Number(order.orderTotal) || 0).toFixed(2);

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
            <p>
              <strong>Confirmation Number:</strong>{" "}
              {order.confirmationNumber}
            </p>

            <p>
              <strong>Movie:</strong> {order.movieTitle}
            </p>

            <p>
              <strong>Show Date:</strong>{" "}
              {order.showDate
                ? formatShowDate(order.showDate)
                : "Not selected"}
            </p>

            <p>
              <strong>Showtime:</strong>{" "}
              {order.showtime ? formatShowTime(order.showtime) : "Not selected"}
            </p>

            <p>
              <strong>Showroom:</strong> {order.showId}
            </p>

            <p>
              <strong>Seats:</strong>{" "}
              {seats.length ? seats.join(", ") : "None selected"}
            </p>

            <p>
              <strong>Email:</strong> {order.email || "Not provided"}
            </p>

            <p>
              <strong>Total:</strong> ${total}
            </p>
          </div>

          <div className="confirmation-buttons">
            <button onClick={() => navigate("/")}>
              Back to Movies
            </button>

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