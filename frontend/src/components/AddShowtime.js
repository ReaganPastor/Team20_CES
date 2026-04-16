import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import "./Login.css";

function AddShowtime() {
  const [form, setForm] = useState({
    movieId: "",
    showroomId: "",
    showDate: "",
    startTime: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [movies, setMovies] = useState([]);
  const [showrooms, setShowrooms] = useState([]);

  const [startTimes, setStartTimes] = useState([]);

  // Load movies for dropdown
  useEffect(() => {
    fetch("http://localhost:8080/movies")
      .then((res) => res.json())
      .then(setMovies)
      .catch((err) => console.error("Movies error:", err));
  }, []);

  // Load showrooms for dropdown
  useEffect(() => {
    fetch("http://localhost:8080/showrooms")
      .then((res) => res.json())
      .then(setShowrooms)
      .catch((err) => console.error("Showrooms error:", err));
  }, []);

  // Start times depend on movie, showroom, and date - reload when any of those change
  useEffect(() => {
    const fetchTimes = async () => {
      if (!form.movieId || !form.showroomId || !form.showDate) {
        setStartTimes([]);
        setForm((p) => ({ ...p, startTime: ""}));
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/showtimes/available-start-times?showroomId=${form.showroomId}&showDate=${form.showDate}&movieId=${form.movieId}`
        );

        const data = await res.json();

        setStartTimes(data || []);
        setForm((p) => ({ ...p, startTime: ""}));
      } catch (err) {
        console.error("Start times error:", err);
      }
    };

    fetchTimes();
  }, [form.movieId, form.showroomId, form.showDate]);


  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  // Validate form before submit
  const validate = () => {
    const newErrors = {};

    if (!form.movieId) newErrors.movieId = "Select a movie";
    if (!form.showroomId) newErrors.showroomId = "Select a showroom";
    if (!form.showDate) newErrors.showDate = "Pick a date";
    if (!form.startTime) newErrors.startTime = "Pick a start time";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8080/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create showtime");
      }

      setMessage("Showtime scheduled successfully!");

      setForm({
        movieId: "",
        showroomId: "",
        showDate: "",
        startTime: "",
      });

      setStartTimes([]);
      setErrors({});
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  // Format 24h time to 12h with AM/PM
  const formatTime = (time) => {
  if (!time) return "";

  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
};

  // Format screen type for display
  const formatScreenType = (type) => {
    if (type === "THREE_D") return "3D";
    return type;
  };


  return (
    <div>
      <Navigation />

      <div className="login-page">
        <div className="login-card">
          <h2>Schedule Showtime</h2>

          {message && <p className="success">{message}</p>}

          <form onSubmit={handleSubmit}>
            {/* MOVIE */}
            {errors.movieId && <p className="error">{errors.movieId}</p>}
            <select
              name="movieId"
              value={form.movieId}
              onChange={handleChange}
              className="centered-input"
            >
              <option value="">Select Movie</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>

            {/* SHOWROOM */}
            {errors.showroomId && <p className="error">{errors.showroomId}</p>}
            <select
              name="showroomId"
              value={form.showroomId}
              onChange={handleChange}
              className="centered-input"
            >
              <option value="">Select Showroom</option>
              {showrooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.showroomNumber} ({formatScreenType(r.screenType)})
                </option>
              ))}
            </select>

            {/* DATE */}
            {errors.showDate && <p className="error">{errors.showDate}</p>}
            <input
              type="date"
              name="showDate"
              value={form.showDate}
              onChange={handleChange}
              className="centered-input"
            />

            {/* START TIME */}
            {errors.startTime && <p className="error">{errors.startTime}</p>}
            <select
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="centered-input"
              disabled={!startTimes.length}
            >
              <option value="">Select Start Time</option>
              {startTimes.map((t) => (
                <option key={t} value={t}>
                  {formatTime(t)}
                </option>
              ))}
            </select>

            {/* BUTTON */}
            <div className="button-row horizontal-buttons">
              <button type="submit">Add Showtime</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddShowtime;