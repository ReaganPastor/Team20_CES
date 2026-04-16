import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback} from "react";
import Navigation from "./Navigation";
import "./BookingPage.css";

function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const passedShowtime = location.state?.selectedShowtime;
  const showId = location.state?.showId;

  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });

  const prices = { adult: 12.99, child: 8.99, senior: 9.99 };

  const formatTime = (time) => {
    if (!time) return "";

    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const loadSeats = useCallback(() => {
  if (!showId) return;

  fetch(`http://localhost:8080/show-seats/${showId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("SEATS DATA:", data);
      setSeats(data);
    })
    .catch(console.error);
}, [showId]);

  useEffect(() => {
    fetch(`http://localhost:8080/movies/${id}`)
      .then((res) => res.json())
      .then(setMovie)
      .catch(console.error);
  }, [id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadSeats();
  }, [showId]);

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

  const groupedSeats = {};
  seats.forEach((seat) => {
    if (!groupedSeats[seat.seatRow]) groupedSeats[seat.seatRow] = [];
    groupedSeats[seat.seatRow].push(seat);
  });

  const rows = Object.keys(groupedSeats).sort();

  rows.forEach((row) => {
    groupedSeats[row].sort((a, b) => a.seatNumber - b.seatNumber);
  });

  const totalTickets = Object.values(tickets).reduce((a, b) => a + b, 0);

  const totalPrice = Object.entries(tickets).reduce(
    (sum, [type, num]) => sum + num * prices[type],
    0
  );

  const toggleSeat = async (seat) => {
    const backendReserved =
      seat.isReserved ?? seat.reserved ?? seat.taken ?? false;

    const isSelected = selectedSeats.some(
      (s) => s.showSeatId === seat.showSeatId
    );

    // Block only seats reserved by someone else
    if (backendReserved && !isSelected) return;

    // Unselect seat
    if (isSelected) {
      const res = await fetch(
        `http://localhost:8080/show-seats/release/${seat.showSeatId}`,
        { method: "POST" }
      );

      if (res.ok) {
        setSelectedSeats((prev) =>
          prev.filter((s) => s.showSeatId !== seat.showSeatId)
        );
        loadSeats();
      }
      return;
    }

    // Select seat
    if (totalTickets === 0) {
      alert("Please select at least one ticket before choosing seats.");
      return;
    }

    if (selectedSeats.length >= totalTickets) {
      alert(`You can only select ${totalTickets} seats.`);
      return;
    }

    const res = await fetch(
      `http://localhost:8080/show-seats/reserve/${seat.showSeatId}`,
      { method: "POST" }
    );

    if (res.ok) {
      // keep selected seats temporary on frontend
      setSelectedSeats((prev) => [...prev, seat]);
    } else {
      alert("Seat already taken");
      loadSeats();
    }
  };

  const handleTicketChange = (type, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    const newTickets = { ...tickets, [type]: val };
    const newTotal = Object.values(newTickets).reduce((a, b) => a + b, 0);

    if (selectedSeats.length > newTotal) {
      const seatsToRelease = selectedSeats.slice(newTotal);

      seatsToRelease.forEach(async (seat) => {
        try {
          await fetch(
            `http://localhost:8080/show-seats/release/${seat.showSeatId}`,
            { method: "POST" }
          );
        } catch (error) {
          console.error("Error releasing seat:", error);
        }
      });

      setSelectedSeats(selectedSeats.slice(0, newTotal));
      loadSeats();
    }

    setTickets(newTickets);
  };

  const confirm = () => {
    if (totalTickets === 0) {
      alert("Please choose at least one ticket.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select your seats.");
      return;
    }

    if (selectedSeats.length !== totalTickets) {
      alert(`Please select exactly ${totalTickets} seat(s).`);
      return;
    }

    const checkoutState = {
      movieId: id,
      showId,
      movieTitle: movie.title,
      showtime: passedShowtime,
      seats: selectedSeats,
      tickets,
      totalPrice,
    };

    sessionStorage.setItem("pendingCheckout", JSON.stringify(checkoutState));

    const isAuthenticated = Boolean(localStorage.getItem("token"));

    if (!isAuthenticated) {
      navigate("/guest-checkout", {
        state: checkoutState,
      });
      return;
    }

    navigate("/checkout", {
      state: checkoutState,
    });
  };

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
              Total Tickets: {totalTickets} | Total Price: ${totalPrice.toFixed(2)}
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
            <button onClick={() => navigate(-1)} className="back-button">
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
              gridTemplateColumns: `40px repeat(${groupedSeats[rows[0]]?.length || 0}, 44px)`,
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
                  let classes = "seat-btn";

                  const backendReserved =
                    seat.isReserved ?? seat.reserved ?? seat.taken ?? false;

                  const isSelected = selectedSeats.some(
                    (s) => s.showSeatId === seat.showSeatId
                  );

                  // Only gray out seats reserved by others
                  const reserved = backendReserved && !isSelected;

                  if (reserved) {
                    classes += " reserved";
                  }

                  if (isSelected) {
                    classes += " selected";
                  }

                  if (!reserved && !isSelected && seat.seatType === "ACCESSIBLE") {
                    classes += " wheelchair";
                  }

                  return (
                    <button
                      key={seat.showSeatId}
                      onClick={() => toggleSeat(seat)}
                      disabled={reserved}
                      className={classes}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="seat-legend-item">
              <div className="seat-legend-color available" />
              <span className="seat-legend-label">Available</span>
            </div>

            <div className="seat-legend-item">
              <div className="seat-legend-color wheelchair" />
              <span className="seat-legend-label">Accessible</span>
            </div>

            <div className="seat-legend-item">
              <div className="seat-legend-color selected" />
              <span className="seat-legend-label">Selected</span>
            </div>

            <div className="seat-legend-item">
              <div className="seat-legend-color reserved" />
              <span className="seat-legend-label">Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;