import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./BookingPage.css";

function BookingPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const { movie, showtime } = location.state || {};

  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0
  });

  if (!movie || !showtime) {
    return <div>Error: No booking data</div>;
  }

  function update(type, value) {
    setTickets({
      ...tickets,
      [type]: Math.max(0, parseInt(value) || 0)
    });
  }

  const total =
    tickets.adult +
    tickets.child +
    tickets.senior;

  return (
    <div className="booking-page">
      <div className="booking-card">

        <div className="booking-title">{movie.title}</div>

        <div className="booking-showtime">
          {showtime.date} • {showtime.time}
        </div>

        <div className="ticket-section">

          <div className="ticket-row">
            <div className="ticket-label">Adult</div>
            <input className="ticket-input" type="number" />
          </div>

        </div>

        <div className="total-section">
          <span>Total</span>
          <span>{total}</span>
        </div>

        <div className="button-row">
          <button className="back-button">Back</button>
          <button className="checkout-button">Checkout</button>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;