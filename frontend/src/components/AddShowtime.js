import React, { useState } from "react";
import Navigation from "./Navigation";
import "./Login.css";

function AddShowtime() {
  const [form, setForm] = useState({
    movie: "",
    date: "",
    time: "",
    showroom: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.movie.trim()) newErrors.movie = "Please select a movie";
    if (!form.date.trim()) newErrors.date = "Please pick a date";
    if (!form.time.trim()) newErrors.time = "Please pick a time";
    if (!form.showroom.trim()) newErrors.showroom = "Please select a showroom";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setMessage("Showtime scheduled successfully");
  };

  return (
    <div>
      <Navigation />
      <div className="login-page">
        <div className="login-card">
          <h2>Schedule Showtime</h2>

          {message && <p className="success">{message}</p>}

          <form onSubmit={handleSubmit}>
            {errors.movie && <p className="error">{errors.movie}</p>}
            <input
              type="text"
              name="movie"
              placeholder="Select Movie"
              value={form.movie}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.date && <p className="error">{errors.date}</p>}
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.time && <p className="error">{errors.time}</p>}
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.showroom && <p className="error">{errors.showroom}</p>}
            <input
              type="text"
              name="showroom"
              placeholder="Select Showroom"
              value={form.showroom}
              onChange={handleChange}
              className="centered-input"
            />

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