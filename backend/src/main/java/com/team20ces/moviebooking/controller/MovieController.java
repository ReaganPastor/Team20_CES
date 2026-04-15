package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.model.Movie;
import com.team20ces.moviebooking.service.MovieService;

import org.springframework.http.HttpStatus;
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

    /**
     * POST /movies
     * Adds a new movie after validating required fields.
     */
    @PostMapping
    public ResponseEntity<?> addMovie(@RequestBody Movie movie) {
        System.out.println("==== MOVIE RECEIVED ====");
        System.out.println("Title: " + movie.getTitle());
        System.out.println("Description: " + movie.getDescription());
        System.out.println("Rating: " + movie.getRating());
        System.out.println("Genre: " + movie.getGenre());
        System.out.println("Poster: " + movie.getPosterPath());
        System.out.println("Trailer: " + movie.getTrailerPath());
        System.out.println("Status: " + movie.getStatus());
        System.out.println("Duration: " + movie.getDurationMinutes());
        // Check required text fields
        if (movie.getTitle() == null || movie.getTitle().isBlank() ||
            movie.getDescription() == null || movie.getDescription().isBlank() ||
            movie.getRating() == null || movie.getRating().isBlank() ||
            movie.getGenre() == null || movie.getGenre().isBlank() ||
            movie.getPosterPath() == null || movie.getPosterPath().isBlank() ||
            movie.getTrailerPath() == null || movie.getTrailerPath().isBlank() ||
            movie.getStatus() == null || movie.getStatus().isBlank()) {

            return ResponseEntity.badRequest().body("Missing required fields");
        }

        // Validate movie duration
        if (movie.getDurationMinutes() <= 0) {
            return ResponseEntity.badRequest().body("duration_mins must be greater than 0");
        }

        // Prevent duplicate movie titles
        if (movieService.existsByTitle(movie.getTitle().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("A movie with this title already exists");
        }

        // Save movie
        Movie savedMovie = movieService.addMovie(movie);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    /**
     * DELETE /movies/{id}
     * Deletes a movie by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        boolean deleted = movieService.deleteMovie(id);

        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    /**
     * GET /movies
     * Returns all movies, with optional status and genre filters.
     */
    @GetMapping
    public List<Movie> getAllMovies(
            @RequestParam Optional<String> status,
            @RequestParam(name = "genre", required = false) List<String> genres) {

        if (genres == null) {
            genres = new ArrayList<>();
        }

        return movieService.getAll(status, genres);
    }

    /**
     * GET /movies/{id}
     * Returns one movie by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {

        Optional<Movie> movie = movieService.getById(id);

        return movie.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * GET /movies/search?title=...
     * Searches movies by title, with optional status filter.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(
            @RequestParam Optional<String> title,
            @RequestParam Optional<String> status) {

        if (title.isEmpty() || title.get().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<Movie> results = movieService.searchByTitle(title.get(), status);

        return ResponseEntity.ok(results);
    }

    /**
     * GET /movies/genres
     * Returns all distinct genres.
     */
    @GetMapping("/genres")
    public ResponseEntity<List<String>> getGenres() {
        List<String> genres = movieService.getAllGenres();
        return ResponseEntity.ok(genres);
    }
}