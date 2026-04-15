import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import "./Login.css";

function AddShowtime() {
  const [form, setForm] = useState({
    movieId: "",
    showroomId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [movies, setMovies] = useState([]);
  const [showrooms, setShowrooms] = useState([]);

  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);

  // -------------------------
  // FETCH MOVIES
  // -------------------------
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:8080/movies");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Failed to load movies:", err);
      }
    };

    fetchMovies();
  }, []);

  // -------------------------
  // FETCH SHOWROOMS
  // -------------------------
  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/showrooms");
        const data = await res.json();
        setShowrooms(data);
      } catch (err) {
        console.error("Failed to load showrooms:", err);
      }
    };

    fetchShowrooms();
  }, []);

  // -------------------------
  // FETCH TIME OPTIONS
  // -------------------------
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch("http://localhost:8080/showtimes/time-options");
        const data = await res.json();

        setStartTimes(data.startTimes || []);
        setEndTimes(data.endTimes || []);
      } catch (err) {
        console.error("Failed to load time options:", err);
      }
    };

    fetchTimes();
  }, []);

  // -------------------------
  // FETCH END TIMES BASED ON START TIME
  // -------------------------
  useEffect(() => {
    const fetchEndTimes = async () => {
      if (!form.startTime) {
        setEndTimes([]);
        setForm((prev) => ({ ...prev, endTime: "" }));
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/showtimes/end-times?startTime=${form.startTime}`
        );

        const data = await res.json();
        setEndTimes(data || []);

        // reset invalid selection
        setForm((prev) => ({ ...prev, endTime: "" }));
      } catch (err) {
        console.error("Failed to load end times:", err);
      }
    };

    fetchEndTimes();
  }, [form.startTime]);

  // -------------------------
  // HANDLE INPUT CHANGE
  // -------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  // -------------------------
  // VALIDATION
  // -------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.movieId) newErrors.movieId = "Please select a movie";
    if (!form.showroomId) newErrors.showroomId = "Please select a showroom";
    if (!form.date) newErrors.date = "Please pick a date";
    if (!form.startTime) newErrors.startTime = "Please pick a start time";
    if (!form.endTime) newErrors.endTime = "Please pick an end time";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8080/showtimes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        date: "",
        startTime: "",
        endTime: "",
      });

      setErrors({});
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  // -------------------------
  // UI
  // -------------------------
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
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
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
              {showrooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.showroomNumber} ({room.screenType})
                </option>
              ))}
            </select>

            {/* DATE */}
            {errors.date && <p className="error">{errors.date}</p>}
            <input
              type="date"
              name="date"
              value={form.date}
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
            >
              <option value="">Select Start Time</option>
              {startTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* END TIME */}
            {errors.endTime && <p className="error">{errors.endTime}</p>}
            <select
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="centered-input"
              disabled={!form.startTime}
            >
              <option value="">Select End Time</option>
              {endTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
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