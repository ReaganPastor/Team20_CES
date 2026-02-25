package com.team20ces.moviebooking.controller;

import com.team20ces.moviebooking.model.Movie;
import com.team20ces.moviebooking.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/*
 * This controller exposes REST API endpoints for movies.
 * These endpoints are used by the React frontend.
 */

@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    // MovieService to call on business logic methods
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /*
     * GET /movies
     * Returns all movies.
     */
    @GetMapping
    public List<Movie> getAllMovies(
            @RequestParam Optional<String> status) {

        return movieService.getAll(status);
    }

    /*
     * GET /movies/{id}
     * Returns one movie by ID.
     * If not found, returns 404.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {

        Optional<Movie> movie = movieService.getById(id);

        // If movie exists, return 200 OK
        if (movie.isPresent()) {
            return ResponseEntity.ok(movie.get());
        }

        // Otherwise return 404 Not Found
        return ResponseEntity.notFound().build();
    }

    /*
     * GET /movies/search?title=...
     * Searches movies by title.
     * If title is missing or blank, return 400.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(
            @RequestParam Optional<String> title,
            @RequestParam Optional<String> status) {

        // Validate title
        if (title.isEmpty() || title.get().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<Movie> results =
                movieService.searchByTitle(title.get(), status);

        return ResponseEntity.ok(results);
    }
}