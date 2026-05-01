import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import "./ViewDetails.css";

function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");

  
  // Format Time (am/pm)
  const formatTime = (time) => {
  if (!time) return "";

  const parts = time.split(":");
  let hour = parseInt(parts[0], 10);
  const minute = parts[1] || "00";

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
  };

  const formatShowDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthName = months[parseInt(month, 10) - 1];

    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };

  // Load movie details
  useEffect(() => {
    fetch(`http://localhost:8080/movies/${id}`)
      .then((res) => res.json())
      .then(setMovie)
      .catch((err) => console.error("Movie error:", err));
  }, [id]);

  // Load showtimes for this movie
  useEffect(() => {
    fetch(`http://localhost:8080/showtimes/movie/${id}`)
      .then((res) => res.json())
      .then(setShowtimes)
      .catch((err) => console.error("Showtimes error:", err));
  }, [id]);

  // Reset selection when movie changes
  useEffect(() => {
    setSelectedShowtime(null);
    setBookingMessage("");
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  const isNowPlaying = (movie.status || "") === "CURRENTLY_RUNNING";

  return (
    <div>
      <Navigation />

      <div className="view-details-page">
        {/* MOVIE CARD */}
        <div className="movie-card">
          <img
            src={movie.poster_path}
            alt={movie.title}
            onError={(e) => {
              if (e.target.src !== "/icons/NoPoster.png") {
                e.target.src = "/icons/NoPoster.png";
              }
            }}
          />

          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Rating:</strong> {movie.rating}</p>
            <p><strong>Description:</strong> {movie.description}</p>

            {/* BOOKING SECTION */}
            <div className="booking-section">
              {isNowPlaying ? (
                <div className="showtimes-wrapper">
                  <p>Select Showtime:</p>

                  <div className="showtimes-buttons">
                    {showtimes.length === 0 ? (
                      <p>No showtimes available.</p>
                    ) : (
                      showtimes.map((s) => {
                        const label = `${formatShowDate(s.showDate)} • ${formatTime(s.startTime)}`;

                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedShowtime(s);
                              setBookingMessage("");
                            }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "10px",
                              border:
                                selectedShowtime?.id === s.id
                                  ? "2px solid #2563eb"
                                  : "1px solid #334155",
                              background:
                                selectedShowtime?.id === s.id
                                  ? "#0b2a5b"
                                  : "#1e293b",
                              color: "#f1f5f9",
                              cursor: "pointer",
                              fontWeight: "bold"
                            }}
                          >
                            {label}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <p className="coming-soon">
                  Coming Soon: Booking is not available yet.
                </p>
              )}

              {/* BUTTONS */}
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
                      navigate(`/movies/${movie.id}/book`, {
                        state: {
                          showId: selectedShowtime.id,
                          selectedShowtime: selectedShowtime.startTime || selectedShowtime.start_time,
                          showDate: selectedShowtime.showDate || selectedShowtime.show_date
                        }
                      })
                    }
                    disabled={!selectedShowtime}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background: !selectedShowtime
                        ? "#1d4ed8"
                        : "#2563eb",
                      color: "white",
                      cursor: !selectedShowtime
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: "bold",
                      opacity: !selectedShowtime ? 0.6 : 1
                    }}
                  >
                    Book Tickets
                  </button>
                )}
              </div>

              {bookingMessage && (
                <p style={{ marginTop: "12px", color: "#93c5fd" }}>
                  {bookingMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TRAILER */}
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