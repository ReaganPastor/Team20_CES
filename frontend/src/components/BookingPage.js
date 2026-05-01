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
  const [tickets, setTickets] = useState(() => {
    return location.state?.tickets || {
      adult: 0,
      child: 0,
      senior: 0,
    };
  });

  const isCheckingOut = useRef(false);

  const prices = { adult: 12.99, child: 8.99, senior: 9.99 };

  // Restore selected seats if coming back from checkout
  useEffect(() => {
    const fromCheckout = location.state?.fromCheckout === true;
    const restoredSeats = location.state?.seats;

    if (fromCheckout && Array.isArray(restoredSeats)) {
      setSelectedSeats(restoredSeats);
    } else {
      setSelectedSeats([]);
    }
  }, [location.state]);

  // Format time from "HH:mm" to "h:mm AM/PM"
  const formatTime = (time) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // Format date from "YYYY-MM-DD" to "Mon DD, YYYY"
  const formatShowDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  };

  // Load seats for the selected showtime
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

  // Group seats by row for easier rendering
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

  // Ticket quantity change handler
  const handleTicketChange = (type, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    const newTickets = { ...tickets, [type]: val };
    const newTotal = Object.values(newTickets).reduce((a, b) => a + b, 0);

    if (selectedSeats.length > newTotal) {
      const toRelease = selectedSeats.slice(newTotal);

      toRelease.forEach(async (seat) => {
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

  // Toggle seat selection
  const toggleSeat = async (seat) => {
    const isSelected = selectedSeats.some(
      (s) => s.showSeatId === seat.showSeatId
    );

    const status = seat.reservationStatus;

    // block reserved seats
    if (status === "RESERVED" && !isSelected) return;

    let newSelected;

    /* Remove */
    if (isSelected) {
      newSelected = selectedSeats.filter(
        (s) => s.showSeatId !== seat.showSeatId
      );
    }
    /* Add */
    else {
      if (totalTickets === 0) {
        alert("Please select tickets first.");
        return;
      }

      if (selectedSeats.length >= totalTickets) {
        alert(`You can only select ${totalTickets} seats.`);
        return;
      }

      newSelected = [...selectedSeats, seat];
    }

    // update UI immediately
    setSelectedSeats(newSelected);

    try {
      // Step 1: release old selection
      await fetch("http://localhost:8080/show-seats/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId,
          seatIds: selectedSeats.map((s) => s.showSeatId),
        }),
      });

      // Step 2: hold new selection (if any)
      if (newSelected.length > 0) {
        const res = await fetch("http://localhost:8080/show-seats/hold", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            showId,
            seatIds: newSelected.map((s) => s.showSeatId),
          }),
        });

        if (!res.ok) {
          alert("One or more seats were taken.");
          setSelectedSeats([]);
          loadSeats();
          return;
        }
      }

      loadSeats();
    } catch (err) {
      console.error(err);
    }
  };

  // Cleanup function to release held seats if user navigates away or refreshes
  const releaseHeldSeats = useCallback(async () => {
    if (!selectedSeats.length || isCheckingOut.current) return;

    try {
      await fetch("http://localhost:8080/show-seats/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId,
          seatIds: selectedSeats.map((s) => s.showSeatId),
        }),
      });
    } catch {}
  }, [selectedSeats, showId]);

  useEffect(() => {
    return () => {
      releaseHeldSeats();
    };
  }, [releaseHeldSeats]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!selectedSeats.length) return;

      const payload = {
        showId,
        seatIds: selectedSeats.map((s) => s.showSeatId),
      };

      navigator.sendBeacon(
        "http://localhost:8080/show-seats/release",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedSeats, showId]);

  /* Checkout Confirmation Handler */
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
      fromCheckout: false,
    };

    sessionStorage.setItem("pendingCheckout", JSON.stringify(checkoutState));

    navigate("/checkout", {
      state: checkoutState,
    });
  };

  /* Render */
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
              <p><strong>Date:</strong> {formatShowDate(passedDate || movie.showDate)}</p>
              <p><strong>Time:</strong> {formatTime(passedShowtime || movie.showtime)}</p>
            </div>
          </div>

          <div className="ticket-section">
            {["adult", "child", "senior"].map((type) => (
              <div key={type} className="ticket-row">
                <span>{type.charAt(0).toUpperCase() + type.slice(1)} (${prices[type]})</span>
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
                : selectedSeats.map((s) => `${s.seatRow}${s.seatNumber}`).join(", ")}
            </div>
          </div>

          <div className="button-row">
            <button onClick={() => navigate(`/movies/${id}`)} className="back-button">
              Back
            </button>

            <button onClick={confirm} disabled={selectedSeats.length === 0} className="checkout-button">
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
              display: "grid",
              gridTemplateColumns: `40px repeat(${
                Math.max(...rows.map((r) => groupedSeats[r].length))
              }, 44px)`,
            }}
          >
            {/* top-left empty corner */}
            <div />

            {/* column headers */}
            {groupedSeats[rows[0]]?.map((seat) => (
              <div key={seat.seatNumber} className="seat-grid-header">
                {seat.seatNumber}
              </div>
            ))}

            {/* rows */}
            {rows.map((row) => (
              <div key={row} style={{ display: "contents" }}>
                {/* row label */}
                <div className="seat-grid-header">{row}</div>

                {/* seats */}
                {groupedSeats[row].map((seat) => {
                  const isSelected = selectedSeats.some(
                    (s) => s.showSeatId === seat.showSeatId
                  );

                  const isReserved = seat.reservationStatus === "RESERVED";

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