import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import "./OrderHistoryPage.css";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="order-history-page">
      <Navigation />

      <div className="order-history-container">
        <h1>Order History</h1>

        {orders.length === 0 ? (
          <p>No previous orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="order-history-card" key={order.confirmationNumber}>
              <h2>{order.movieTitle}</h2>
              <p><strong>Confirmation Number:</strong> {order.confirmationNumber}</p>
              <p><strong>Showtime:</strong> {order.showtime}</p>
              <p><strong>Seats:</strong> {order.selectedSeats.join(", ")}</p>
              <p><strong>Email:</strong> {order.email || "Not provided"}</p>
              <p><strong>Total:</strong> ${Number(order.orderTotal).toFixed(2)}</p>
              <p><strong>Date:</strong> {order.orderDate}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;