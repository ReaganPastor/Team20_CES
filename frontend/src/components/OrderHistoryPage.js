import React from "react";
import Navigation from "./Navigation";
import "./OrderHistoryPage.css";

export default function OrderHistoryPage() {
  const orders = [
    {
      bookingId: 101,
      movieTitle: "Avengers: Endgame",
      showDate: "2026-04-20",
      startTime: "19:00",
      seats: ["A1", "A2"],
      email: "user@gmail.com",
      total: 24.0,
    },
    {
      bookingId: 102,
      movieTitle: "Spider-Man: No Way Home",
      showDate: "2026-04-15",
      startTime: "16:30",
      seats: ["B5", "B6", "B7"],
      email: "user@gmail.com",
      total: 36.0,
    },
  ];

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
      <div className="order-history-page">

        <div className="order-history-container">
          <h1>Order History</h1>

          {orders.length === 0 ? (
            <p style={{ textAlign: "center", color: "#cbd5e1" }}>
              No orders found.
            </p>
          ) : (
            orders.map((order) => (
              <div key={order.bookingId} className="order-history-card">
                <h3>{order.movieTitle}</h3>

                <p>
                  <strong>Booking ID:</strong> {order.bookingId}
                </p>

                <p>
                  <strong>Date:</strong> {formatShowDate(order.showDate)}
                </p>

                <p>
                  <strong>Showtime:</strong> {formatShowTime(order.startTime)}
                </p>

                <p>
                  <strong>Seats:</strong> {order.seats.join(", ")}
                </p>

                <p>
                  <strong>Email:</strong> {order.email}
                </p>

                <p>
                  <strong>Total:</strong> ${order.total.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}