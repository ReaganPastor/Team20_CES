import React, { useState } from "react";
import Navigation from "./Navigation";
import "./Login.css";

function AddMovie() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    rating: "",
    genre: "",
    poster_path: "",
    trailer_path: "",
    status: "",
    durationMinutes: "",
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

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.rating.trim()) newErrors.rating = "Rating is required";
    if (!form.genre.trim()) newErrors.genre = "Genre is required";
    if (!form.status.trim()) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // run your existing validation first
    if (!validate()) return;

    // convert to number
    const duration = Number(form.durationMinutes);

    // validate duration
    if (!form.durationMinutes || isNaN(duration) || duration <= 0) {
      newErrors.durationMinutes = "Duration must be a number greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    const movieToSend = {
      ...form,
      durationMinutes: duration, // now a real int
    };

    try {
      const response = await fetch("http://localhost:8080/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      setMessage("Movie added successfully!");
      console.log("Saved movie:", data);

      // reset form
      setForm({
        title: "",
        description: "",
        rating: "",
        genre: "",
        poster_path: "",
        trailer_path: "",
        status: "",
        durationMinutes: "",
      });

      setErrors({});
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  

  return (
    <div>
      <Navigation />
      <div className="login-page">
        <div className="login-card">
          <h2>Add Movie</h2>

          {message && <p className="success">{message}</p>}

          <form onSubmit={handleSubmit}>
            {errors.title && <p className="error">{errors.title}</p>}
            <input
              type="text"
              name="title"
              placeholder="Movie Title"
              value={form.title}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.description && <p className="error">{errors.description}</p>}
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="centered-input"
            />

            <input
              type="number"
              name="durationMinutes"
              placeholder="Duration (minutes)"
              value={form.durationMinutes}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.rating && <p className="error">{errors.rating}</p>}
            <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="centered-input"
              >
                <option value="">Select Rating</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
            </select>

            {errors.genre && <p className="error">{errors.genre}</p>}
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={form.genre}
              onChange={handleChange}
              className="centered-input"
            />

            <input
              type="text"
              name="poster_path"
              placeholder="Poster Path"
              value={form.poster_path}
              onChange={handleChange}
              className="centered-input"
            />

            <input
              type="text"
              name="trailer_path"
              placeholder="Trailer Path"
              value={form.trailer_path}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.status && <p className="error">{errors.status}</p>}

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="centered-input"
            >
              <option value="">Select Status</option>
              <option value="COMING_SOON">Coming Soon</option>
              <option value="NOW_SHOWING">Now Showing</option>
            </select>

            <div className="button-row horizontal-buttons">
              <button type="submit">Add Movie</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMovie;