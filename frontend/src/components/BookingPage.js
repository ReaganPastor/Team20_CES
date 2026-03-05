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

  if (!movie) {
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

  //const { movieTitle, posterUrl, showtime } = state;

  const panelWidth = "1050px";

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
      `Movie: ${movie.title}\nTime: ${movie.showtime}\nSeats: ${selectedSeats.sort().join(", ")}`
    );
  };

  return (
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
                  src={movie.poster_path}
                  alt={movie.title}
                  style={{ width: "110px", borderRadius: "10px" }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{movie.title}</p>
                  <p style={{ marginTop: "8px" }}><strong>Time:</strong> {movie.showtime}</p>
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
                <button onClick={confirm} 
                disabled={selectedSeats.length === 0}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: selectedSeats.length == 0 ? "#1d4ed8" : "#2563eb",
                  color: "white",
                  cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  opacity: selectedSeats.length == 0 ? 0.6 : 1
                }}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;