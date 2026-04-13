import React, { useState } from "react";
import Navigation from "./Navigation";
import "./Login.css";

function AddMovie() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    rating: "",
    genre: "",
    posterPath: "",
    trailerPath: "",
    status: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setMessage("Movie added successfully");
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

            {errors.rating && <p className="error">{errors.rating}</p>}
            <input
              type="text"
              name="rating"
              placeholder="Rating"
              value={form.rating}
              onChange={handleChange}
              className="centered-input"
            />

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
              name="posterPath"
              placeholder="Poster Path"
              value={form.posterPath}
              onChange={handleChange}
              className="centered-input"
            />

            <input
              type="text"
              name="trailerPath"
              placeholder="Trailer Path"
              value={form.trailerPath}
              onChange={handleChange}
              className="centered-input"
            />

            {errors.status && <p className="error">{errors.status}</p>}
            <input
              type="text"
              name="status"
              placeholder="Status"
              value={form.status}
              onChange={handleChange}
              className="centered-input"
            />

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