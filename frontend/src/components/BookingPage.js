import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";

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

  const [tickets, setTickets] = useState({ adult: 1, child: 1, senior: 1 }); // default 1
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

  const panelWidth = "1050px";
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
    let val = Math.max(1, parseInt(value) || 1); // minimum 1
    const newTickets = { ...tickets, [type]: val };
    const newTotal = Object.values(newTickets).reduce((a,b) => a+b, 0);

    // Trim selectedSeats if over new total
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
    <div>
      <Navigation />
      <div style={{ padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Seats Section */}
        <div style={{ width: panelWidth }}>
          <h2 style={{ color: "#93c5fd", textAlign: "center" }}>Pick Seats</h2>
          <div
            style={{
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "16px",
              background: "#0b1220",
              overflowX: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div style={{ width: "100%", textAlign: "center", marginBottom: "16px", color: "#60a5fa", fontWeight: "bold", letterSpacing: "2px" }}>SCREEN</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `40px repeat(${cols.length}, 44px)`,
                gap: "8px",
                justifyContent: "center"
              }}
            >
              <div />
              {cols.map(c => <div key={c} style={{ textAlign: "center", fontWeight: "bold", color: "#94a3b8" }}>{c}</div>)}

              {rows.map(r => (
                <div key={r} style={{ display: "contents" }}>
                  <div style={{ textAlign: "center", fontWeight: "bold", color: "#94a3b8", paddingTop: "10px" }}>{r}</div>
                  {cols.map(c => {
                    const seat = `${r}${c}`;
                    let bg = "#1f2937";
                    let border = "1px solid #475569";
                    if (seatIsWheelchair(seat)) { bg = "#0f766e"; border = "1px solid #0d9488"; }
                    if (selectedSeats.includes(seat)) { bg = "#2563eb"; border = "1px solid #60a5fa"; }

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

            {/* Legend */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "24px" }}>
              {[
                {label: "Standard", color: "#1f2937"},
                {label: "Wheelchair", color: "#0f766e"},
                {label: "Selected", color: "#2563eb"}
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: item.color, border: "1px solid #475569" }} />
                  <span style={{ color: "#cbd5e1", fontWeight: "bold" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking & Tickets Section */}
        <div style={{ width: panelWidth, marginTop: "30px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "520px", width: "100%" }}>
            <h2 style={{ color: "#93c5fd" }}>Booking</h2>

            <div style={{ display: "flex", gap: "12px" }}>
              <img
                src={movie.poster_path}
                alt={movie.title}
                style={{ width: "110px", borderRadius: "10px" }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{movie.title}</p>
                <p style={{ marginTop: "8px" }}><strong>Time:</strong> {movie.showtime}</p>
              </div>
            </div>

            {/* Tickets Input */}
            <div style={{ marginTop: "16px" }}>
              <p style={{ fontWeight: "bold" }}>Tickets</p>
              {["adult","child","senior"].map(type => (
                <div key={type} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ textTransform: "capitalize" }}>{type} (${prices[type]})</span>
                  <input
                    type="number"
                    min="1"
                    value={tickets[type]}
                    onChange={e => handleTicketChange(type, e.target.value)}
                    style={{
                      width: "60px",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      border: "1px solid #334155",
                      background: "#0b1220",
                      color: "#f1f5f9",
                      fontWeight: "bold"
                    }}
                  />
                </div>
              ))}
              <div style={{ marginTop: "8px", fontWeight: "bold", color: "#60a5fa" }}>
                Total Tickets: {totalTickets} | Total Price: ${totalPrice}
              </div>
            </div>

            {/* Selected Seats */}
            <div style={{ marginTop: "16px" }}>
              <p><strong>Selected Seats:</strong></p>
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

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "#f1f5f9",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Back to Movie Details
              </button>
              <button
                onClick={confirm}
                disabled={selectedSeats.length === 0}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: selectedSeats.length === 0 ? "#1d4ed8" : "#2563eb",
                  color: "white",
                  cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  opacity: selectedSeats.length === 0 ? 0.6 : 1
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;