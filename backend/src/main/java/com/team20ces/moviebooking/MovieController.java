package com.team20ces.moviebooking;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final List<Movie> mockMovies = Arrays.asList(
        new Movie(1L, "Inception", 2010, "Sci-Fi", "https://m.media-amazon.com/images/I/51s+Z3kz2bL._AC_.jpg"),
        new Movie(2L, "Titanic", 1997, "Romance", "https://m.media-amazon.com/images/I/41hK8S+RZBL._AC_.jpg"),
        new Movie(3L, "Avatar", 2009, "Sci-Fi", "https://m.media-amazon.com/images/I/41kTVLeW1CL._AC_.jpg"),
        new Movie(4L, "Interstellar", 2014, "Sci-Fi", "https://m.media-amazon.com/images/I/71nM+FVRQdL._AC_SL1181_.jpg"),
        new Movie(5L, "Jaws", 1975, "Thriller", "https://m.media-amazon.com/images/I/51t30H2PEyL._AC_.jpg"),
        new Movie(6L, "La La Land", 2016, "Romance", "https://m.media-amazon.com/images/I/51Plls7NTaL._AC_.jpg"),
        new Movie(7L, "The Matrix", 1999, "Sci-Fi", "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg"),
        new Movie(8L, "The Godfather", 1972, "Crime", "https://m.media-amazon.com/images/I/51rOnIjLqzL._AC_.jpg")
    );

    @GetMapping("/movies")
    public List<Movie> getMoviesByGenres(@RequestParam(required = false) List<String> genres){
        if (genres == null || genres.isEmpty()) {
            // No genre filter, return all movies
            // NOTE: change to movies when database is finished
            return mockMovies;
        }

        return mockMovies.stream().filter(movie -> genres.stream()
        .anyMatch(g -> g.equalsIgnoreCase(movie.getGenre())))
        .collect(Collectors.toList());

    }
}