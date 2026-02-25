import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";

function ViewDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div>
      <Navigation />
      <h2>{movie.title}</h2>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Year:</strong> {movie.year}</p>

      {/* ADDED rating */}
      <p><strong>Rating:</strong> {movie.rating}</p>

      {/* ADDED description */}
      <p><strong>Description:</strong> {movie.description}</p>
    </div>
  );
}

export default ViewDetails;