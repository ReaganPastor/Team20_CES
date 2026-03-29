import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import "./ViewDetails.css";

function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    setSelectedShowtime("");
    setBookingMessage("");
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  const isNowPlaying = (movie.status || "") === "CURRENTLY_RUNNING";
  const showtimes = isNowPlaying ? ["12:30 PM", "2:45 PM", "5:10 PM", "7:30 PM", "9:50 PM"] : [];

  return (
    <div>
      <Navigation />
    
      <div className="view-details-page">
        {/* Movie info + poster */}
        <div className="movie-card">
          <img
            src={movie.poster_path}
            alt={movie.title}
            onError={(e) => { if (e.target.src !== "/icons/NoPoster.png") e.target.src = "/icons/NoPoster.png"; }}
          />

          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p><strong>Genre:</strong> {movie.genre}</p>
            {/* <p><strong>Year:</strong> {movie.year}</p> */}
            <p><strong>Rating:</strong> {movie.rating}</p>
            <p><strong>Description:</strong> {movie.description}</p>
            {/* <p><strong>Duration:</strong> {movie.durationMinutes} min</p> */}

            {/* Showtime + booking buttons in sub-box */}
            <div className="booking-section">
              {isNowPlaying ? (
                <div className="showtimes-wrapper">
                  <p>Select Showtime:</p>
                  <div className="showtimes-buttons">
                    {showtimes.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setSelectedShowtime(t); setBookingMessage(""); }}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: selectedShowtime === t ? "2px solid #2563eb" : "1px solid #334155",
                          background: selectedShowtime === t ? "#0b2a5b" : "#1e293b",
                          color: "#f1f5f9",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="coming-soon">Coming Soon: Booking is not available yet.</p>
              )}

              <div className="button-row">
                <button
                  onClick={() => navigate("/")}
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
                  Back to Homepage
                </button>

                {isNowPlaying && (
                  <button
                    onClick={() =>
                      navigate(`/movies/${movie.id}/book`, { state: { selectedShowtime } })
                    }
                    disabled={!selectedShowtime}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background: !selectedShowtime ? "#1d4ed8" : "#2563eb",
                      color: "white",
                      cursor: !selectedShowtime ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      opacity: !selectedShowtime ? 0.6 : 1
                    }}
                  >
                    Book Tickets
                  </button>
                )}
              </div>

              {bookingMessage && (
                <p style={{ marginTop: "12px", color: "#93c5fd" }}>{bookingMessage}</p>
              )}
            </div>
          </div>
        </div>

        {/* Trailer section */}
        <div className="trailer-section">
          <h2>Trailer</h2>
          <video controls>
            <source src={movie.trailer_path} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}

export default ViewDetails;