import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import "./OrderHistoryPage.css";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // must be set at login

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/bookings/customer/${userId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error loading order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

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

          {loading ? (
            <p style={{ textAlign: "center", color: "#cbd5e1" }}>
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
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
                  <strong>Date:</strong>{" "}
                  {formatShowDate(order.showDate)}
                </p>

                <p>
                  <strong>Showtime:</strong>{" "}
                  {formatShowTime(order.startTime)}
                </p>

                <p>
                  <strong>Seats:</strong>{" "}
                  {order.seats?.join(", ")}
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