<<<<<<< HEAD
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigation from "./Navigation";

function BookingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const rows = ["A","B","C","D","E","F","G","H"];
  const cols = [1,2,3,4,5,6,7,8,9,10,11,12];

  const wheelchairSeats = ["A1","A2","A11","A12"];

  const [selectedSeats, setSelectedSeats] = useState([]);

  if (!state) {
    return (
      <div>
        <Navigation />
        <div style={{ padding: "40px" }}>
          <p>No booking info. Go back and pick a time.</p>
          <button onClick={() => navigate("/")}>Back</button>
        </div>
      </div>
    );
  }

  const { movieTitle, posterUrl, showtime } = state;

  const panelWidth = "1050px"; // change this if you want it more right / left 

  const seatIsWheelchair = (seat) => wheelchairSeats.includes(seat);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const confirm = () => {
    if (selectedSeats.length === 0) return;
    alert(
      `Movie: ${movieTitle}\nTime: ${showtime}\nSeats: ${selectedSeats.sort().join(", ")}`
=======
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import "./BookingPage.css";

function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const passedShowtime = location.state?.selectedShowtime || ""; // <-- get showtime from state

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));
  }, [id]);

  const rows = ["A","B","C","D","E","F","G","H"];
  const cols = [1,2,3,4,5,6,7,8,9,10,11,12];
  const wheelchairSeats = ["A1","A2","A11","A12"];
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({ adult: 0, child: 0, senior: 0 });
  const prices = { adult: 12, child: 8, senior: 10 };

  if (!movie) return (
    <div>
      <Navigation />
      <div style={{ padding: "40px" }}>
        <p>No booking info. Go back and pick a time.</p>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );

  const seatIsWheelchair = (seat) => wheelchairSeats.includes(seat);
  const totalTickets = Object.values(tickets).reduce((a,b) => a+b, 0);
  const totalPrice = Object.entries(tickets).reduce((sum,[type,num]) => sum + (num * prices[type]), 0);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length < totalTickets) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert(`You can only select ${totalTickets} seats.`);
      }
    }
  };

  const handleTicketChange = (type, value) => {
    let val = Math.max(0, parseInt(value) || 0);
    const newTickets = { ...tickets, [type]: val };
    const newTotal = Object.values(newTickets).reduce((a,b) => a+b, 0);

    if (selectedSeats.length > newTotal) {
      setSelectedSeats(selectedSeats.slice(0, newTotal));
    }

    setTickets(newTickets);
  };

  const confirm = () => {
    if (selectedSeats.length === 0) return;
    alert(
      `Movie: ${movie.title}\nTime: ${passedShowtime || movie.showtime}\nSeats: ${selectedSeats.sort().join(", ")}\nTickets: Adult-${tickets.adult}, Child-${tickets.child}, Senior-${tickets.senior}\nTotal: $${totalPrice}`
>>>>>>> main
    );
  };

  return (
<<<<<<< HEAD
    <div>
      <Navigation />

      <div style={{ padding: "40px" }}>
        {/* seats */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: panelWidth }}>
            <h2>Pick Seats</h2>

            <div
              style={{
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "16px",
                background: "#0b1220",
                overflowX: "auto"
              }}
            >
              <p style={{ textAlign: "center", color: "#93c5fd", marginTop: 0 }}>
                SCREEN
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `40px repeat(${cols.length}, 44px)`,
                  gap: "8px"
                }}
              >
                <div />

                {cols.map((c) => (
                  <div
                    key={c}
                    style={{ textAlign: "center", fontWeight: "bold", color: "#94a3b8" }}
                  >
                    {c}
                  </div>
                ))}

                {rows.map((r) => (
                  <div key={r} style={{ display: "contents" }}>
                    <div
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#94a3b8",
                        paddingTop: "10px"
                      }}
                    >
                      {r}
                    </div>

                    {cols.map((c) => {
                      const seat = `${r}${c}`;

                      let bg = "#1f2937";
                      let border = "1px solid #475569";

                      if (seatIsWheelchair(seat)) {
                        bg = "#0f766e";
                        border = "1px solid #0d9488";
                      }

                      if (selectedSeats.includes(seat)) {
                        bg = "#2563eb";
                        border = "1px solid #60a5fa";
                      }

                      return (
                        <button
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                          title={seat}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            background: bg,
                            border: border,
                            color: "#f1f5f9",
                            fontWeight: "bold",
                            cursor: "pointer"
                          }}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "16px" }}>
                <p style={{ marginBottom: "8px" }}><strong>Legend</strong></p>
                <p style={{ margin: 0 }}>Standard seat = gray</p>
                <p style={{ margin: 0 }}>Wheelchair seat = green</p>
                <p style={{ margin: 0 }}>Selected = blue</p>
              </div>
            </div>
          </div>
        </div>

        {/* booking changed to be under the seat selection */}
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: panelWidth }}>
            <div style={{ maxWidth: "520px" }}>
              <h2>Booking</h2>

              <div style={{ display: "flex", gap: "12px" }}>
                <img
                  src={posterUrl}
                  alt={movieTitle}
                  style={{ width: "110px", borderRadius: "10px" }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{movieTitle}</p>
                  <p style={{ marginTop: "8px" }}><strong>Time:</strong> {showtime}</p>
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <p><strong>Selected:</strong></p>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #334155",
                    background: "#0b1220",
                    minHeight: "40px"
                  }}
                >
                  {selectedSeats.length === 0 ? "None" : selectedSeats.sort().join(", ")}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button onClick={() => navigate(-1)}>Back</button>
                <button onClick={confirm} disabled={selectedSeats.length === 0}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
=======
    <div className="booking-page">
      <Navigation />

      <div className="booking-container">
        {/* Booking Section */}
        <div className="booking-info-box">
          <div className="movie-info">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="movie-poster"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/icons/NoPoster.png";
              }}
            />
            <div>
              <h3>{movie.title}</h3>
              <p><strong>Time:</strong> {passedShowtime || movie.showtime}</p>
            </div>
          </div>

          <div className="ticket-section">
            {["adult","child","senior"].map(type => (
              <div key={type} className="ticket-row">
                <span>{type.charAt(0).toUpperCase() + type.slice(1)} (${prices[type]})</span>
                <input
                  type="number"
                  min="0"
                  value={tickets[type]}
                  onChange={e => handleTicketChange(type, e.target.value)}
                  className="ticket-input"
                />
              </div>
            ))}
            <div className="total-section">
              Total Tickets: {totalTickets} | Total Price: ${totalPrice}
            </div>
          </div>

          <div className="selected-seats">
            <p><strong>Selected Seats:</strong></p>
            <div className="selected-seats-box">{selectedSeats.length === 0 ? "None" : selectedSeats.sort().join(", ")}</div>
          </div>

          <div className="button-row">
            <button onClick={() => navigate(-1)} className="back-button">Back to Movie Details</button>
            <button onClick={confirm} disabled={selectedSeats.length === 0} className="checkout-button">Confirm</button>
          </div>
        </div>

        {/* Seats Section */}
        <h2 className="seating-header">Pick Seats</h2>
        <div className="seat-panel">
          <div className="screen-label">SCREEN</div>

          <div className="seat-grid" style={{ gridTemplateColumns: `40px repeat(${cols.length}, 44px)` }}>
            <div />
            {cols.map(c => <div key={c} className="seat-grid-header">{c}</div>)}
>>>>>>> main

            {rows.map(r => (
              <div key={r} style={{ display: "contents" }}>
                <div className="seat-grid-header">{r}</div>
                {cols.map(c => {
                  const seat = `${r}${c}`;
                  let classes = "seat-btn";
                  if (seatIsWheelchair(seat)) classes += " wheelchair";
                  if (selectedSeats.includes(seat)) classes += " selected";

                  return (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      title={seat}
                      className={classes}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="seat-legend">
            {[
              {label: "Standard", color: "#1f2937"},
              {label: "Wheelchair", color: "#0f766e"},
              {label: "Selected", color: "#2563eb"}
            ].map(item => (
              <div key={item.label} className="seat-legend-item">
                <div className="seat-legend-color" style={{ background: item.color }} />
                <span className="seat-legend-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;