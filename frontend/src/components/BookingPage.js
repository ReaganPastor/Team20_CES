import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import Navigation from "./Navigation";
import "./BookingPage.css";

function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const passedShowtime = location.state?.selectedShowtime;
  const showId = location.state?.showId;
  const passedDate = location.state?.showDate;

  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });

  const isCheckingOut = useRef(false);

  const prices = { adult: 12.99, child: 8.99, senior: 9.99 };

  // =========================================
  // RESTORE SELECTED SEATS (FIXED POSITION)
  // =========================================
  useEffect(() => {
    // ONLY restore if explicitly returning from checkout page
    const isReturningFromCheckout =
      location.state?.fromCheckout === true;

    if (isReturningFromCheckout && location.state?.seats) {
      setSelectedSeats(location.state.seats);
      return;
    }

    // otherwise ALWAYS start fresh
    setSelectedSeats([]);
  }, [location.state]);

  // =========================================
  // FORMATTERS (UNCHANGED)
  // =========================================
  const formatTime = (time) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const formatShowDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  };

  // =========================================
  // LOAD DATA
  // =========================================
  const loadSeats = useCallback(() => {
    if (!showId) return;

    fetch(`http://localhost:8080/show-seats/${showId}`)
      .then((res) => res.json())
      .then(setSeats)
      .catch(console.error);
  }, [showId]);

  useEffect(() => {
    fetch(`http://localhost:8080/movies/${id}`)
      .then((res) => res.json())
      .then(setMovie)
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  // =========================================
  // EARLY RETURN (NOW SAFE)
  // =========================================
  if (!movie || !showId) {
    return (
      <div>
        <Navigation />
        <div style={{ padding: "40px" }}>
          <p>No booking info. Go back and pick a showtime.</p>
          <button onClick={() => navigate("/")}>Back</button>
        </div>
      </div>
    );
  }

  // =========================================
  // GROUP SEATS (UNCHANGED)
  // =========================================
  const groupedSeats = {};
  seats.forEach((seat) => {
    if (!groupedSeats[seat.seatRow]) groupedSeats[seat.seatRow] = [];
    groupedSeats[seat.seatRow].push(seat);
  });

  const rows = Object.keys(groupedSeats).sort();

  rows.forEach((row) => {
    groupedSeats[row].sort((a, b) => a.seatNumber - b.seatNumber);
  });

  // =========================================
  // TICKETS
  // =========================================
  const totalTickets = Object.values(tickets).reduce((a, b) => a + b, 0);

  const totalPrice = Object.entries(tickets).reduce(
    (sum, [type, num]) => sum + num * prices[type],
    0
  );

  // =========================================
  // TICKET HANDLER (UNCHANGED LOGIC)
  // =========================================
  const handleTicketChange = (type, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    const newTickets = { ...tickets, [type]: val };
    const newTotal = Object.values(newTickets).reduce((a, b) => a + b, 0);

    if (selectedSeats.length > newTotal) {
      const seatsToRelease = selectedSeats.slice(newTotal);

      seatsToRelease.forEach(async (seat) => {
        try {
          await fetch("http://localhost:8080/show-seats/release", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              showId,
              seatIds: [seat.showSeatId],
            }),
          });
        } catch {}
      });

      setSelectedSeats(selectedSeats.slice(0, newTotal));
      loadSeats();
    }

    setTickets(newTickets);
  };

  // =========================================
  // SEAT TOGGLE (FIXED LOGIC ONLY)
  // =========================================
  const toggleSeat = async (seat) => {
    const status = seat.reservationStatus;

    const isSelected = selectedSeats.some(
      (s) => s.showSeatId === seat.showSeatId
    );

    if (status === "RESERVED") return;

    // UNSELECT FIRST
    if (isSelected) {
      const res = await fetch("http://localhost:8080/show-seats/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId,
          seatIds: [seat.showSeatId],
        }),
      });

      if (res.ok) {
        setSelectedSeats((prev) =>
          prev.filter((s) => s.showSeatId !== seat.showSeatId)
        );
        loadSeats();
      }
      return;
    }

    // SELECT
    if (totalTickets === 0) {
      alert("Please select tickets first.");
      return;
    }

    if (selectedSeats.length >= totalTickets) {
      alert(`You can only select ${totalTickets} seats.`);
      return;
    }

    const res = await fetch("http://localhost:8080/show-seats/hold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        showId,
        seatIds: [seat.showSeatId],
      }),
    });

    if (res.ok) {
      setSelectedSeats((prev) => [...prev, seat]);
      loadSeats();
    } else {
      alert("Seat already taken");
      loadSeats();
    }
  };

  // =========================================
  // CHECKOUT (UNCHANGED)
  // =========================================
  const confirm = () => {
    if (totalTickets === 0) return alert("Please choose tickets.");
    if (selectedSeats.length === 0) return alert("Please select seats.");
    if (selectedSeats.length !== totalTickets)
      return alert(`Select exactly ${totalTickets} seats.`);

    isCheckingOut.current = true;

    const checkoutState = {
      movieId: id,
      showId,
      movieTitle: movie.title,
      showtime: passedShowtime,
      showDate: passedDate,
      seats: selectedSeats,
      tickets,
      totalPrice,
    };

    sessionStorage.setItem("pendingCheckout", JSON.stringify(checkoutState));

    const isAuthenticated = Boolean(localStorage.getItem("token"));

    navigate(isAuthenticated ? "/checkout" : "/guest-checkout", {
      state: checkoutState,
    });
  };

  // =========================================
  // RENDER (UNCHANGED)
  // =========================================
  return (
    <div className="booking-page">
      <Navigation />

      <div className="booking-container">
        <div className="booking-info-box">

          <div className="movie-info">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                e.target.src = "/icons/NoPoster.png";
              }}
            />
            <div>
              <h3>{movie.title}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {formatShowDate(passedDate || movie.showDate)}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {formatTime(passedShowtime || movie.showtime)}
              </p>
            </div>
          </div>

          <div className="ticket-section">
            {["adult", "child", "senior"].map((type) => (
              <div key={type} className="ticket-row">
                <span>
                  {type.charAt(0).toUpperCase() + type.slice(1)} (${prices[type]})
                </span>
                <input
                  type="number"
                  min="0"
                  value={tickets[type]}
                  onChange={(e) => handleTicketChange(type, e.target.value)}
                  className="ticket-input"
                />
              </div>
            ))}

            <div className="total-section">
              Total Tickets: {totalTickets} | Total Price: $
              {totalPrice.toFixed(2)}
            </div>
          </div>

          <div className="selected-seats">
            <p><strong>Selected Seats:</strong></p>
            <div className="selected-seats-box">
              {selectedSeats.length === 0
                ? "None"
                : selectedSeats
                    .map((s) => `${s.seatRow}${s.seatNumber}`)
                    .sort()
                    .join(", ")}
            </div>
          </div>

          <div className="button-row">
            <button
              onClick={() => navigate(`/movies/${id}`)}
              className="back-button"
            >
              Back
            </button>

            <button
              onClick={confirm}
              disabled={selectedSeats.length === 0}
              className="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        <div className="seat-panel">
          <h2 className="seating-header">Pick Seats</h2>
          <div className="screen-label">SCREEN</div>

          <div
            className="seat-grid"
            style={{
              gridTemplateColumns: `40px repeat(${
                groupedSeats[rows[0]]?.length || 0
              }, 44px)`,
            }}
          >
            <div />

            {groupedSeats[rows[0]]?.map((seat) => (
              <div key={seat.seatNumber} className="seat-grid-header">
                {seat.seatNumber}
              </div>
            ))}

            {rows.map((row) => (
              <div key={row} style={{ display: "contents" }}>
                <div className="seat-grid-header">{row}</div>

                {groupedSeats[row].map((seat) => {
                  const status = seat.reservationStatus;

                  const isSelected = selectedSeats.some(
                    (s) => s.showSeatId === seat.showSeatId
                  );

                  const isReserved = status === "RESERVED";

                  let classes = "seat-btn";

                  if (isReserved && !isSelected) classes += " reserved";
                  if (isSelected) classes += " selected";

                  return (
                    <button
                      key={seat.showSeatId}
                      onClick={() => toggleSeat(seat)}
                      disabled={isReserved}
                      className={classes}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;