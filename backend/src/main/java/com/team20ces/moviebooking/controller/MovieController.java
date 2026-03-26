package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.model.Movie;
import com.team20ces.moviebooking.service.MovieService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // POST /movies
    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        Movie savedMovie = movieService.addMovie(movie);
        return ResponseEntity.ok(savedMovie);
    }

    // DELETE /movies/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        boolean deleted = movieService.deleteMovie(id);

        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // GET /movies
    @GetMapping
    public List<Movie> getAllMovies(
            @RequestParam Optional<String> status,
            @RequestParam(name="genre", required=false) List<String> genres) {

        if (genres == null)
            genres = new ArrayList<>();

        return movieService.getAll(status, genres);
    }

    // GET /movies/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {

        Optional<Movie> movie = movieService.getById(id);

        return movie.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET /movies/search?title=...
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(
            @RequestParam Optional<String> title,
            @RequestParam Optional<String> status) {

        if (title.isEmpty() || title.get().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<Movie> results =
                movieService.searchByTitle(title.get(), status);

        return ResponseEntity.ok(results);
    }

    // GET /movies/genres
    @GetMapping("/genres")
    public ResponseEntity<List<String>> getGenres() {
        List<String> genres = movieService.getAllGenres();
        return ResponseEntity.ok(genres);
    }
}