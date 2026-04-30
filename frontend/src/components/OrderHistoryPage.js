import React from "react";
import Navigation from "./Navigation";

export default function OrderHistoryPage() {

  const orders = [
    {
      bookingId: 101,
      movieTitle: "Avengers: Endgame",
      showDate: "2026-04-20",
      startTime: "19:00",
      seats: ["A1", "A2"],
      email: "user@gmail.com",
      total: 24.00
    },
    {
      bookingId: 102,
      movieTitle: "Spider-Man: No Way Home",
      showDate: "2026-04-15",
      startTime: "16:30",
      seats: ["B5", "B6", "B7"],
      email: "user@gmail.com",
      total: 36.00
    }
  ];

  return (
    <div>
      <Navigation />

      <h1 style={{ marginTop: "40px" }}>Order History</h1>

      {orders.map((order) => (
        <div key={order.bookingId} style={{
          border: "1px solid #ccc",
          padding: "15px",
          margin: "15px auto",
          width: "60%",
          borderRadius: "10px"
        }}>
          <h3>{order.movieTitle}</h3>
          <p>Booking ID: {order.bookingId}</p>
          <p>Date: {order.showDate}</p>
          <p>Showtime: {order.startTime}</p>
          <p>Seats: {order.seats.join(", ")}</p>
          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
}