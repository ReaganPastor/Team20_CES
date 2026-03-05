import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import "./BookingPage.css";

function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [tickets, setTickets] = useState({ adult: 0, child: 0, senior: 0 }); // start at 0
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
    let val = Math.max(0, parseInt(value) || 0); // min 0
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
      `Movie: ${movie.title}\nTime: ${movie.showtime}\nSeats: ${selectedSeats.sort().join(", ")}\nTickets: Adult-${tickets.adult}, Child-${tickets.child}, Senior-${tickets.senior}\nTotal: $${totalPrice}`
    );
  };

  return (
    <div className="booking-page">
      <Navigation />

      <div className="booking-container">

        {/* Booking Section */}
        <div className="booking-info-box">
          <div className="movie-info">
            <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
            <div>
              <h3>{movie.title}</h3>
              <p><strong>Time:</strong> {movie.showtime}</p>
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