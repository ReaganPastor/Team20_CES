import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";

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


  const isNowPlaying = (movie.status || "").toUpperCase() === "NOW_PLAYING";

  
  const showtimes = isNowPlaying ? ["12:30 PM", "2:45 PM", "5:10 PM", "7:30 PM", "9:50 PM"] : [];

  /*
  const handleBookTickets = () => {
    if (!selectedShowtime) return;
    setBookingMessage(`Booked "${movie.title}" at ${selectedShowtime} (placeholder, remove later).`);
  };
`*/

  function handleBookTickets(showtime) {
    navigate("/book", {
      state: {
        movie: movie,
        showtime: showtime
      }
    });
  }

  return (
    <div>
      <Navigation />

      
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "40px",
          alignItems: "flex-start"
        }}
      >
        
        <div>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              width: "300px",
              borderRadius: "12px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.5)"
            }}
          />
        </div>

       
        <div style={{ maxWidth: "700px" }}>
          
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
            {movie.title}
          </h1>

          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Year:</strong> {movie.year}</p>

          {/* ADDED rating */}
          <p><strong>Rating:</strong> {movie.rating}</p>

          {/* ADDED description */}
          <p><strong>Description:</strong> {movie.description}</p>

         
          <p><strong>Duration:</strong> {movie.durationMinutes} min</p>

          {/* we will implement these later */}
          {/* <p><strong>Country:</strong> {movie.country || "Unknown"}</p> */}
          {/* <p><strong>Production:</strong> {movie.production || "Unknown"}</p> */}
          {/* <p><strong>Cast:</strong> {movie.cast || "Unknown"}</p> */} 
         
          {isNowPlaying ? (
            <div style={{ marginTop: "18px" }}>
             
              <p style={{ marginBottom: "8px" }}><strong>Select Showtime:</strong></p>

             
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {showtimes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedShowtime(t);
                      setBookingMessage("");
                    }}
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
           
            <p style={{ marginTop: "18px", color: "#94a3b8" }}>
              <strong>Coming Soon:</strong> Booking is not available yet.
            </p>
          )}

          
          <div style={{ display: "flex", gap: "12px", marginTop: "20px", alignItems: "center" }}>
            
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

           {/* Handles if showtime is selected then shows the booking button*/}
            {isNowPlaying && (
              <button
                onClick={() => handleBookTickets(selectedShowtime)}
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
            <p style={{ marginTop: "12px", color: "#93c5fd" }}>
              {bookingMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewDetails;